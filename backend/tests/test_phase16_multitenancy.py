import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import unittest
import httpx
from app import app
from routes.auth import create_access_token, hash_password
from models.auth_models import User, Analysis, Document, ActionItem
from database import SessionLocal


class TestPhase16MultiTenancy(unittest.IsolatedAsyncioTestCase):

    async def asyncSetUp(self):
        transport = httpx.ASGITransport(app=app)
        self.client = httpx.AsyncClient(transport=transport, base_url="http://testserver")

        db = SessionLocal()
        # User A
        user_a = db.query(User).filter(User.email == "usera@example.com").first()
        if not user_a:
            user_a = User(name="User A", email="usera@example.com", hashed_password=hash_password("PassUserA123!"))
            db.add(user_a)
            db.commit()
            db.refresh(user_a)

        # User B
        user_b = db.query(User).filter(User.email == "userb@example.com").first()
        if not user_b:
            user_b = User(name="User B", email="userb@example.com", hashed_password=hash_password("PassUserB123!"))
            db.add(user_b)
            db.commit()
            db.refresh(user_b)

        # User A Analysis & Action Item
        analysis_a = db.query(Analysis).filter(Analysis.user_id == user_a.id).first()
        if not analysis_a:
            analysis_a = Analysis(user_id=user_a.id, idea="User A Startup", payload='{"status": "COMPLETE"}')
            db.add(analysis_a)
            db.commit()
            db.refresh(analysis_a)

        action_a = db.query(ActionItem).filter(ActionItem.user_id == user_a.id).first()
        if not action_a:
            action_a = ActionItem(user_id=user_a.id, title="User A Secret Task", priority="HIGH")
            db.add(action_a)
            db.commit()
            db.refresh(action_a)

        user_a_id = user_a.id
        user_b_id = user_b.id
        analysis_a_id = analysis_a.id
        action_a_id = action_a.id

        db.close()

        self.user_a_id = user_a_id
        self.user_b_id = user_b_id
        self.token_a = create_access_token(subject=str(user_a_id))
        self.token_b = create_access_token(subject=str(user_b_id))
        self.headers_a = {"Authorization": f"Bearer {self.token_a}"}
        self.headers_b = {"Authorization": f"Bearer {self.token_b}"}
        self.analysis_a_id = analysis_a_id
        self.action_a_id = action_a_id

    async def asyncTearDown(self):
        await self.client.aclose()

    async def test_1_history_isolation(self):
        """User B cannot see User A's analyses in /history."""
        res_a = await self.client.get("/history", headers=self.headers_a)
        self.assertEqual(res_a.status_code, 200)
        ideas_a = [item["idea"] for item in res_a.json()["data"]]
        self.assertIn("User A Startup", ideas_a)

        res_b = await self.client.get("/history", headers=self.headers_b)
        self.assertEqual(res_b.status_code, 200)
        ideas_b = [item["idea"] for item in res_b.json()["data"]]
        self.assertNotIn("User A Startup", ideas_b)

    async def test_2_action_items_isolation(self):
        """User B cannot see or manipulate User A's action items."""
        res_b = await self.client.get("/action-items", headers=self.headers_b)
        self.assertEqual(res_b.status_code, 200)
        titles_b = [item["title"] for item in res_b.json().get("items", [])]
        self.assertNotIn("User A Secret Task", titles_b)

        # Attempt to delete User A's action item using User B's token
        res_del = await self.client.delete(f"/action-items/{self.action_a_id}", headers=self.headers_b)
        self.assertEqual(res_del.status_code, 404)

    async def test_3_report_download_scoping(self):
        """User B cannot download PDF/PPTX reports of User A's analysis."""
        res_pdf = await self.client.get(f"/download/pdf?analysisId={self.analysis_a_id}", headers=self.headers_b)
        self.assertEqual(res_pdf.status_code, 403)

        res_pptx = await self.client.get(f"/download/pptx?analysisId={self.analysis_a_id}", headers=self.headers_b)
        self.assertEqual(res_pptx.status_code, 403)

    async def test_4_unauthenticated_requests_rejected(self):
        """Protected routes reject requests without a valid Bearer token."""
        for path in ["/history", "/action-items", "/documents"]:
            res = await self.client.get(path)
            self.assertEqual(res.status_code, 401)


if __name__ == "__main__":
    unittest.main()
