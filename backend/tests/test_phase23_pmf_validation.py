import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import unittest
import httpx
from app import app
from routes.auth import create_access_token, hash_password
from models.auth_models import User
from database import SessionLocal

from services.pmf_service import pmf_service

class TestPhase23PMFValidation(unittest.IsolatedAsyncioTestCase):

    async def asyncSetUp(self):
        transport = httpx.ASGITransport(app=app)
        self.client = httpx.AsyncClient(transport=transport, base_url="http://testserver")

        db = SessionLocal()
        user = db.query(User).filter(User.email == "phase23_pmf@example.com").first()
        if not user:
            user = User(name="Phase23 Founder", email="phase23_pmf@example.com", hashed_password=hash_password("PassPhase23!"))
            db.add(user)
            db.commit()
            db.refresh(user)

        user_id = user.id
        db.close()

        self.user_id = user_id
        self.token = create_access_token(subject=str(user_id))
        self.headers = {"Authorization": f"Bearer {self.token}"}

    async def asyncTearDown(self):
        await self.client.aclose()

    async def test_1_pmf_metrics_endpoint(self):
        """TEST 1: PMF Metrics endpoint returns active metrics & STRONG_PMF_SIGNAL status."""
        res = await self.client.get("/pmf/metrics", headers=self.headers)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["beta_users"], 37)
        self.assertEqual(data["pmf_signal"], "STRONG_PMF_SIGNAL")
        self.assertIn("retention_cohorts", data)
        self.assertIn("icp_segments", data)

    async def test_2_pricing_tiers_endpoint(self):
        """TEST 2: Pricing endpoint returns Free, Pro, and Founder Premium tiers."""
        res = await self.client.get("/pmf/pricing", headers=self.headers)
        self.assertEqual(res.status_code, 200)
        tiers = res.json()["tiers"]
        self.assertEqual(len(tiers), 3)
        self.assertEqual(tiers[1]["tier"], "PRO")
        self.assertEqual(tiers[1]["price"], "₹999 / mo")

    async def test_3_submit_and_get_interviews(self):
        """TEST 3: Log founder interview and retrieve logged list."""
        # Submit
        res_post = await self.client.post("/pmf/interviews", json={
            "problem_solved": "Validate student career startup",
            "best_feature": "AI Decision Center",
            "alternative_used": "Spreadsheets & ChatGPT",
            "reuse_intent": True,
            "willingness_to_pay": True,
            "indispensable_feature": "Evidence-Backed Research & Live Market Watch"
        }, headers=self.headers)
        self.assertEqual(res_post.status_code, 200)
        self.assertTrue(res_post.json()["success"])

        # List
        res_get = await self.client.get("/pmf/interviews", headers=self.headers)
        self.assertEqual(res_get.status_code, 200)
        self.assertGreater(res_get.json()["total_interviews"], 0)


if __name__ == "__main__":
    unittest.main()
