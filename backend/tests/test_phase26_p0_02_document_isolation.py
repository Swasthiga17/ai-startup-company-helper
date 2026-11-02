import os
import sys
import unittest
from unittest.mock import patch
import httpx
from sqlalchemy.orm import Session

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import app
from database import SessionLocal, init_db
from models.auth_models import User, Document
from routes.auth import create_access_token, hash_password
from services.rag_service import retrieve_context, delete_document_chunks


class TestPhase26DocumentIsolation(unittest.IsolatedAsyncioTestCase):

    @classmethod
    def setUpClass(cls):
        init_db()
        db = SessionLocal()

        # User A
        cls.user_a_email = "p0_02_user_a@audit.com"
        u_a = db.query(User).filter(User.email == cls.user_a_email).first()
        if not u_a:
            u_a = User(name="User A", email=cls.user_a_email, hashed_password=hash_password("PassUserA123!"))
            db.add(u_a)
            db.commit()
            db.refresh(u_a)
        cls.user_a_id = u_a.id

        # User B
        cls.user_b_email = "p0_02_user_b@audit.com"
        u_b = db.query(User).filter(User.email == cls.user_b_email).first()
        if not u_b:
            u_b = User(name="User B", email=cls.user_b_email, hashed_password=hash_password("PassUserB123!"))
            db.add(u_b)
            db.commit()
            db.refresh(u_b)
        cls.user_b_id = u_b.id
        db.close()

        cls.token_a = create_access_token(subject=str(cls.user_a_id))
        cls.headers_a = {"Authorization": f"Bearer {cls.token_a}"}

        cls.token_b = create_access_token(subject=str(cls.user_b_id))
        cls.headers_b = {"Authorization": f"Bearer {cls.token_b}"}

    async def asyncSetUp(self):
        transport = httpx.ASGITransport(app=app)
        self.client = httpx.AsyncClient(transport=transport, base_url="http://testserver")

    async def asyncTearDown(self):
        await self.client.aclose()

    async def test_01_normal_document_upload(self):
        """1. Normal document upload succeeds and returns original filename and indexed status."""
        content = b"TechCo normal pitch deck: Building AI tools for cloud logistics."
        files = {"file": ("techco_pitch.txt", content, "text/plain")}
        res = await self.client.post("/upload-document", files=files, headers=self.headers_a)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["status"], "success")
        self.assertEqual(data["document"]["filename"], "techco_pitch.txt")
        self.assertIn(data["document"]["status"], ["indexed", "uploaded"])
        doc_id = data["document"]["id"]

        # Verify on disk
        db = SessionLocal()
        d = db.query(Document).filter(Document.id == doc_id).first()
        self.assertIsNotNone(d)
        self.assertTrue(os.path.exists(d.storage_path))
        db.close()

        # Clean up
        await self.client.delete(f"/documents/{doc_id}", headers=self.headers_a)

    async def test_02_two_users_uploading_identical_filenames(self):
        """2. Two users can upload files with identical filenames without collisions."""
        content_a = b"User A Confidential Strategy: Target ARR is $2,000,000."
        content_b = b"User B Confidential Strategy: Target ARR is $9,500,000."

        res_a = await self.client.post(
            "/upload-document",
            files={"file": ("shared_strategy.txt", content_a, "text/plain")},
            headers=self.headers_a
        )
        self.assertEqual(res_a.status_code, 200)
        self.__class__.doc_a_id = res_a.json()["document"]["id"]

        res_b = await self.client.post(
            "/upload-document",
            files={"file": ("shared_strategy.txt", content_b, "text/plain")},
            headers=self.headers_b
        )
        self.assertEqual(res_b.status_code, 200)
        self.__class__.doc_b_id = res_b.json()["document"]["id"]

        self.assertNotEqual(self.doc_a_id, self.doc_b_id)
        self.assertEqual(res_a.json()["document"]["filename"], "shared_strategy.txt")
        self.assertEqual(res_b.json()["document"]["filename"], "shared_strategy.txt")

    async def test_03_unique_storage_paths(self):
        """3. Uploaded files with identical names have distinct unique physical storage paths."""
        db = SessionLocal()
        doc_a = db.query(Document).filter(Document.id == self.doc_a_id).first()
        doc_b = db.query(Document).filter(Document.id == self.doc_b_id).first()
        self.assertIsNotNone(doc_a)
        self.assertIsNotNone(doc_b)

        # Paths must be completely distinct
        self.assertNotEqual(doc_a.storage_path, doc_b.storage_path)
        self.assertTrue(os.path.exists(doc_a.storage_path))
        self.assertTrue(os.path.exists(doc_b.storage_path))

        # Check content integrity
        with open(doc_a.storage_path, "rb") as f:
            self.assertIn(b"$2,000,000", f.read())
        with open(doc_b.storage_path, "rb") as f:
            self.assertIn(b"$9,500,000", f.read())
        db.close()

    async def test_04_user_a_cannot_download_user_b_document(self):
        """4. User A cannot download or view User B's document (returns 403 or 404)."""
        # User A tries to view User B's document metadata
        view_res = await self.client.get(f"/documents/{self.doc_b_id}", headers=self.headers_a)
        self.assertIn(view_res.status_code, [403, 404])

        # User A tries to download User B's document file
        dl_res = await self.client.get(f"/documents/{self.doc_b_id}/download", headers=self.headers_a)
        self.assertIn(dl_res.status_code, [403, 404])

    async def test_05_user_a_cannot_delete_user_b_document(self):
        """5. User A cannot delete User B's document (returns 403 or 404)."""
        del_res = await self.client.delete(f"/documents/{self.doc_b_id}", headers=self.headers_a)
        self.assertIn(del_res.status_code, [403, 404])

        # Verify User B's document still exists in DB
        db = SessionLocal()
        doc_b = db.query(Document).filter(Document.id == self.doc_b_id).first()
        self.assertIsNotNone(doc_b)
        db.close()

    async def test_06_deleting_user_a_document_preserves_user_b_file(self):
        """6. Deleting User A's document removes only User A's file and preserves User B's file."""
        db = SessionLocal()
        path_a = db.query(Document).filter(Document.id == self.doc_a_id).first().storage_path
        path_b = db.query(Document).filter(Document.id == self.doc_b_id).first().storage_path
        db.close()

        # User A deletes their document
        del_res = await self.client.delete(f"/documents/{self.doc_a_id}", headers=self.headers_a)
        self.assertEqual(del_res.status_code, 200)

        # User A's file should no longer exist
        self.assertFalse(os.path.exists(path_a))

        # User B's file MUST STILL EXIST and have intact content
        self.assertTrue(os.path.exists(path_b))
        with open(path_b, "rb") as f:
            self.assertIn(b"$9,500,000", f.read())

    async def test_07_deleting_user_a_document_preserves_user_b_rag_chunks(self):
        """7. Deleting User A's document preserves User B's RAG vector chunks."""
        # Query User B chunks
        chunks_b = retrieve_context("Target ARR is $9,500,000", user_id=self.user_b_id)
        self.assertTrue(len(chunks_b) > 0)
        self.assertIn("$9,500,000", chunks_b[0]["content"])

        # User A chunks should be 0
        chunks_a = retrieve_context("Target ARR is $2,000,000", user_id=self.user_a_id)
        self.assertEqual(len(chunks_a), 0)

    async def test_08_rag_retrieval_returns_only_current_user_documents(self):
        """8. RAG retrieval strictly returns only current user documents."""
        # User B can retrieve their own confidential document
        res_b = retrieve_context("Target ARR is $9,500,000", user_id=self.user_b_id)
        self.assertTrue(len(res_b) > 0)

        # User A querying the same exact phrase gets 0 chunks from User B
        res_a = retrieve_context("Target ARR is $9,500,000", user_id=self.user_a_id)
        self.assertEqual(len(res_a), 0)

        # Cleanup User B document
        await self.client.delete(f"/documents/{self.doc_b_id}", headers=self.headers_b)

    async def test_09_invalid_file_type_rejection(self):
        """9. Invalid file extensions (.exe, .sh, .py, .bat) are rejected with 400."""
        disallowed = [
            ("malware.exe", b"MZ executable content", "application/x-msdownload"),
            ("script.sh", b"#!/bin/bash\necho dangerous", "application/x-sh"),
            ("payload.py", b"import os; os.system('ls')", "text/x-python"),
            ("script.bat", b"@echo off\ndel /f", "application/bat")
        ]

        for fname, content, mtype in disallowed:
            res = await self.client.post(
                "/upload-document",
                files={"file": (fname, content, mtype)},
                headers=self.headers_a
            )
            self.assertEqual(res.status_code, 400, f"Expected 400 for {fname}, got {res.status_code}")
            err = res.json().get("error") or res.json().get("detail", "")
            self.assertIn("Invalid file type", err)

    async def test_10_file_size_validation(self):
        """10. File size validation rejects empty (0 bytes) and oversized (>15MB) files."""
        # 1. Empty file
        res_empty = await self.client.post(
            "/upload-document",
            files={"file": ("empty.txt", b"", "text/plain")},
            headers=self.headers_a
        )
        self.assertEqual(res_empty.status_code, 400)
        err_empty = res_empty.json().get("error") or res_empty.json().get("detail", "")
        self.assertIn("empty", err_empty.lower())

        # 2. Oversized file (16 MB)
        oversized = b"A" * (16 * 1024 * 1024)
        res_oversized = await self.client.post(
            "/upload-document",
            files={"file": ("huge.txt", oversized, "text/plain")},
            headers=self.headers_a
        )
        self.assertEqual(res_oversized.status_code, 400)
        err_huge = res_oversized.json().get("error") or res_oversized.json().get("detail", "")
        self.assertIn("exceeds", err_huge.lower())

    async def test_11_path_traversal_protection(self):
        """11. Path traversal characters in filenames are blocked or sanitized."""
        traversal_attempts = [
            "../../etc/passwd.txt",
            "..\\..\\windows\\win.ini.txt",
            "dir/../../../secret.txt",
            "safe\x00malicious.txt"
        ]

        for bad_name in traversal_attempts:
            res = await self.client.post(
                "/upload-document",
                files={"file": (bad_name, b"Safe content", "text/plain")},
                headers=self.headers_a
            )
            # Must either return 400 or securely sanitize into user upload directory
            if res.status_code == 200:
                doc_id = res.json()["document"]["id"]
                db = SessionLocal()
                doc = db.query(Document).filter(Document.id == doc_id).first()
                # Verify storage path is strictly inside the user's upload directory
                self.assertIn(f"user_{self.user_a_id}", doc.storage_path)
                self.assertNotIn("..", doc.storage_path)
                db.close()
                await self.client.delete(f"/documents/{doc_id}", headers=self.headers_a)
            else:
                self.assertEqual(res.status_code, 400)

    async def test_12_database_and_filesystem_consistency_on_deletion_errors(self):
        """12. If a database error occurs during deletion, physical file is preserved (not removed)."""
        # Upload a document
        res = await self.client.post(
            "/upload-document",
            files={"file": ("rollback_test.txt", b"Rollback test data", "text/plain")},
            headers=self.headers_a
        )
        self.assertEqual(res.status_code, 200)
        doc_id = res.json()["document"]["id"]

        db = SessionLocal()
        storage_path = db.query(Document).filter(Document.id == doc_id).first().storage_path
        db.close()
        self.assertTrue(os.path.exists(storage_path))

        # Simulate database failure during commit in DELETE
        with patch.object(Session, "commit", side_effect=RuntimeError("Simulated DB lock failure")):
            del_res = await self.client.delete(f"/documents/{doc_id}", headers=self.headers_a)
            self.assertEqual(del_res.status_code, 500)

        # Consistency check: File MUST STILL EXIST on disk because DB deletion rolled back
        self.assertTrue(os.path.exists(storage_path), "File was deleted even though database transaction failed!")

        # Now clean up properly without mock
        cleanup_res = await self.client.delete(f"/documents/{doc_id}", headers=self.headers_a)
        self.assertEqual(cleanup_res.status_code, 200)
        self.assertFalse(os.path.exists(storage_path))


if __name__ == "__main__":
    unittest.main()
