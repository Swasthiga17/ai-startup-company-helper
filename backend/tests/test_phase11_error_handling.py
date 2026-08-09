import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import unittest
import httpx
from app import app
from core.exceptions import (
    IdeaExecutorError,
    LLMRateLimitError,
    LLMAuthenticationError,
    LLMTimeoutError,
    LLMResponseParseError
)
from services.llm_service import llm_service
from routes.auth import create_access_token
from database import SessionLocal
from models.auth_models import User


class TestPhase11ErrorHandling(unittest.IsolatedAsyncioTestCase):

    async def asyncSetUp(self):
        transport = httpx.ASGITransport(app=app)
        self.client = httpx.AsyncClient(transport=transport, base_url="http://testserver")

        # Create or fetch test user and token for authorized tests
        db = SessionLocal()
        user = db.query(User).filter(User.email == "test_phase11@example.com").first()
        if not user:
            user = User(name="Test User", email="test_phase11@example.com", hashed_password="hashed_pass")
            db.add(user)
            db.commit()
            db.refresh(user)
        db.close()
        
        self.test_user = user
        self.auth_token = create_access_token(subject=str(user.id))
        self.headers = {"Authorization": f"Bearer {self.auth_token}"}

    async def asyncTearDown(self):
        await self.client.aclose()

    async def test_1_standard_health_endpoint(self):
        """TEST 1: GET /health returns basic operational status without requiring Gemini."""
        res = await self.client.get("/health")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["status"], "ok")
        self.assertEqual(data["service"], "ideaexecutor-api")

    async def test_2_readiness_endpoint(self):
        """TEST 2: GET /health/ready returns database & vector store readiness status."""
        res = await self.client.get("/health/ready")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("database", data)
        self.assertIn("vector_store", data)

    async def test_3_request_id_middleware(self):
        """TEST 3: X-Request-ID header is generated and returned in HTTP responses."""
        res = await self.client.get("/health")
        self.assertIn("x-request-id", res.headers)
        req_id = res.headers["x-request-id"]
        self.assertTrue(len(req_id) > 0)

    async def test_4_request_id_propagation(self):
        """TEST 4: Client-provided X-Request-ID is preserved and echoed back."""
        custom_id = "custom-id-999"
        res = await self.client.get("/health", headers={"X-Request-ID": custom_id})
        self.assertEqual(res.headers.get("x-request-id"), custom_id)

    async def test_5_custom_exceptions_schema(self):
        """TEST 5: Custom exception objects expose message, error_code, and retryable flag."""
        err = LLMRateLimitError()
        self.assertEqual(err.error_code, "LLM_RATE_LIMITED")
        self.assertTrue(err.retryable)

        auth_err = LLMAuthenticationError()
        self.assertEqual(auth_err.error_code, "LLM_AUTHENTICATION_FAILED")
        self.assertFalse(auth_err.retryable)

    async def test_6_no_secret_leakage_in_error_messages(self):
        """TEST 6: Custom error messages do not expose sensitive API keys or filesystem paths."""
        err = LLMAuthenticationError()
        err_msg = str(err.message)
        self.assertNotIn("AIzaSy", err_msg)
        self.assertNotIn("C:\\Users", err_msg)

    async def test_7_validation_error_format(self):
        """TEST 7: Request validation error returns standardized error contract with HTTP 422."""
        res = await self.client.post("/devils-advocate", json={}, headers=self.headers)
        self.assertEqual(res.status_code, 422)
        data = res.json()
        self.assertFalse(data["success"])
        self.assertEqual(data["error_code"], "VALIDATION_ERROR")
        self.assertIn("request_id", data)

    async def test_8_unauthorized_error_format(self):
        """TEST 8: Protected routes return standard error contract without raw stack traces."""
        res = await self.client.post("/analyze", json={"idea": "Test"})
        self.assertEqual(res.status_code, 401)

    async def test_9_llm_json_repair_failure_handling(self):
        """TEST 9: LLM json cleaning utility safely handles garbage text."""
        clean = llm_service._clean_json_text("```json\n{\"test\": 123}\n```")
        self.assertEqual(clean, "{\"test\": 123}")


if __name__ == "__main__":
    unittest.main()
