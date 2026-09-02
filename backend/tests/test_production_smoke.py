import os
import sys
import unittest
import uuid
import httpx

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import app
from database import SessionLocal, init_db
from models.auth_models import User
from routes.auth import create_access_token, hash_password


class TestProductionSmoke(unittest.IsolatedAsyncioTestCase):
    """End-to-End Production Smoke Test Suite."""

    async def asyncSetUp(self):
        init_db()
        transport = httpx.ASGITransport(app=app)
        self.client = httpx.AsyncClient(transport=transport, base_url="http://testserver")

        self.unique_id = uuid.uuid4().hex[:8]
        self.email = f"smoke_{self.unique_id}@example.com"
        self.password = "SmokeTestPass123!"

    async def asyncTearDown(self):
        await self.client.aclose()

    async def test_01_health_and_readiness_endpoints(self):
        """Smoke Test 1: Service health and readiness probes."""
        res_health = await self.client.get("/health")
        self.assertEqual(res_health.status_code, 200)
        self.assertEqual(res_health.json()["status"], "ok")

        res_ready = await self.client.get("/readiness")
        self.assertEqual(res_ready.status_code, 200)
        self.assertIn("database", res_ready.json())
        self.assertIn("llm_service", res_ready.json())

    async def test_02_auth_register_login_flow(self):
        """Smoke Test 2: User registration, login and JWT issuance."""
        # 1. Register
        res_reg = await self.client.post("/auth/register", json={
            "name": f"Founder {self.unique_id}",
            "email": self.email,
            "password": self.password
        })
        self.assertEqual(res_reg.status_code, 200)
        data_reg = res_reg.json()
        self.assertIn("access_token", data_reg)
        self.assertEqual(data_reg["token_type"], "bearer")

        token = data_reg["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # 2. Verify /auth/me
        res_me = await self.client.get("/auth/me", headers=headers)
        self.assertEqual(res_me.status_code, 200)
        self.assertEqual(res_me.json()["email"], self.email)

        # 3. Login
        res_login = await self.client.post("/auth/login", json={
            "email": self.email,
            "password": self.password
        })
        self.assertEqual(res_login.status_code, 200)
        self.assertIn("access_token", res_login.json())

    async def test_03_feedback_and_pmf_logging(self):
        """Smoke Test 3: Beta founder feedback and interview logging."""
        # Create user token
        db = SessionLocal()
        user = User(
            name=f"Beta Founder {self.unique_id}",
            email=f"beta_{self.unique_id}@example.com",
            hashed_password=hash_password("BetaSecret123!")
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        user_id = user.id
        db.close()

        token = create_access_token(subject=str(user_id))
        headers = {"Authorization": f"Bearer {token}"}

        # 1. Submit feedback
        res_fb = await self.client.post("/feedback", json={
            "recommendation_title": "Validate B2B SaaS Workflow",
            "rating": "VERY_USEFUL",
            "acted_status": "YES",
            "feedback_text": "Helped narrow down ICP and validate go-to-market plan."
        }, headers=headers)
        self.assertEqual(res_fb.status_code, 200)
        self.assertTrue(res_fb.json()["success"])

        # 2. Submit PMF Interview
        res_iv = await self.client.post("/pmf/interviews", json={
            "problem_solved": "Fast-track market validation",
            "best_feature": "Action Items Kanban & SWOT Analysis",
            "alternative_used": "Manual Google Search & Notion",
            "reuse_intent": True,
            "willingness_to_pay": True,
            "indispensable_feature": "Live Market Signals"
        }, headers=headers)
        self.assertEqual(res_iv.status_code, 200)
        self.assertTrue(res_iv.json()["success"])

        # 3. Query PMF Metrics
        res_metrics = await self.client.get("/pmf/metrics", headers=headers)
        self.assertEqual(res_metrics.status_code, 200)
        self.assertIn("pmf_signal", res_metrics.json())


if __name__ == "__main__":
    unittest.main()
