import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import unittest
import httpx
from app import app
from routes.auth import create_access_token, hash_password
from models.auth_models import User
from database import SessionLocal

class TestPhase21BetaOnboarding(unittest.IsolatedAsyncioTestCase):

    async def asyncSetUp(self):
        transport = httpx.ASGITransport(app=app)
        self.client = httpx.AsyncClient(transport=transport, base_url="http://testserver")

        db = SessionLocal()
        user = db.query(User).filter(User.email == "phase21_onboard@example.com").first()
        if not user:
            user = User(name="Phase21 Founder", email="phase21_onboard@example.com", hashed_password=hash_password("PassPhase21!"))
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

    async def test_1_submit_feedback(self):
        """TEST 1: Founder submits recommendation feedback."""
        res = await self.client.post("/feedback", json={
            "recommendation_title": "Validate pricing with 20 customers",
            "rating": "VERY_USEFUL",
            "acted_status": "YES",
            "feedback_text": "Great recommendation. Pre-order validation succeeded."
        }, headers=self.headers)
        self.assertEqual(res.status_code, 200)
        self.assertTrue(res.json()["success"])

    async def test_2_get_beta_metrics(self):
        """TEST 2: Beta analytics dashboard returns aggregated usage metrics."""
        res = await self.client.get("/feedback/metrics", headers=self.headers)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["beta_founders"], 30)
        self.assertIn("founder_acceptance_rate_pct", data)
        self.assertIn("action_completion_rate_pct", data)


if __name__ == "__main__":
    unittest.main()
