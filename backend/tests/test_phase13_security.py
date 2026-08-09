import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import unittest
import httpx
from app import app
from routes.auth import create_access_token, verify_password, hash_password
from models.auth_models import User
from database import SessionLocal
from config import SECRET_KEY, ALGORITHM


class TestPhase13Security(unittest.IsolatedAsyncioTestCase):

    async def asyncSetUp(self):
        transport = httpx.ASGITransport(app=app)
        self.client = httpx.AsyncClient(transport=transport, base_url="http://testserver")

        # Create or fetch test user
        db = SessionLocal()
        user = db.query(User).filter(User.email == "security_test@example.com").first()
        if not user:
            user = User(
                name="Security Test User",
                email="security_test@example.com",
                hashed_password=hash_password("SuperSecurePass123!")
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        db.close()

        self.test_user = user
        self.valid_token = create_access_token(subject=str(user.id))
        self.auth_headers = {"Authorization": f"Bearer {self.valid_token}"}

    async def asyncTearDown(self):
        await self.client.aclose()

    async def test_1_jwt_token_validation(self):
        """TEST 1: Valid JWT token successfully authenticates protected routes."""
        res = await self.client.get("/action-items", headers=self.auth_headers)
        self.assertEqual(res.status_code, 200)

    async def test_2_invalid_token_rejection(self):
        """TEST 2: Invalid/forged JWT token is rejected with HTTP 401."""
        bad_headers = {"Authorization": "Bearer invalid.forged.jwt.token"}
        res = await self.client.get("/action-items", headers=bad_headers)
        self.assertEqual(res.status_code, 401)

    async def test_3_password_hashing_verification(self):
        """TEST 3: Passwords are correctly hashed with bcrypt and verified."""
        raw_pass = "SecureFounderPass2026!"
        hashed = hash_password(raw_pass)
        self.assertTrue(verify_password(raw_pass, hashed))
        self.assertFalse(verify_password("WrongPassword!", hashed))

    async def test_4_path_traversal_prevention(self):
        """TEST 4: Filenames with path traversal characters (../../etc/passwd) are sanitized."""
        file_content = b"sample text document content"
        files = {"file": ("../../etc/passwd", file_content, "text/plain")}
        res = await self.client.post("/upload-document", files=files, headers=self.auth_headers)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["document"]["filename"], "passwd")  # Sanitized to basename

    async def test_5_sql_injection_resistance(self):
        """TEST 5: SQL injection strings in queries are safely parameterized by SQLAlchemy."""
        db = SessionLocal()
        sql_inj_input = "' OR '1'='1"
        res_user = db.query(User).filter(User.email == sql_inj_input).first()
        self.assertIsNone(res_user)  # Safely evaluated as literal string
        db.close()

    async def test_6_security_http_headers(self):
        """TEST 6: HTTP responses contain production security headers."""
        res = await self.client.get("/health")
        self.assertEqual(res.headers.get("x-content-type-options"), "nosniff")
        self.assertEqual(res.headers.get("x-frame-options"), "DENY")
        self.assertEqual(res.headers.get("x-xss-protection"), "1; mode=block")
        self.assertIn("max-age=", res.headers.get("strict-transport-security", ""))

    async def test_7_empty_idea_input_validation(self):
        """TEST 7: Empty or whitespace startup idea strings are rejected with HTTP 400."""
        res = await self.client.post("/analyze", json={"idea": "   "}, headers=self.auth_headers)
        self.assertEqual(res.status_code, 400)

    async def test_8_zero_secret_leakage(self):
        """TEST 8: Protected routes do not leak raw JWT secret or Gemini API keys in responses."""
        res = await self.client.get("/health/metrics")
        content_str = res.text
        self.assertNotIn(SECRET_KEY, content_str)
        self.assertNotIn("AIzaSy", content_str)

    async def test_9_x_request_id_correlation(self):
        """TEST 9: Security requests return X-Request-ID response header."""
        res = await self.client.get("/health", headers={"X-Request-ID": "sec-test-777"})
        self.assertEqual(res.headers.get("x-request-id"), "sec-test-777")


if __name__ == "__main__":
    unittest.main()
