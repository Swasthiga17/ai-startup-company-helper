import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import unittest
import httpx
from app import app
from database import SessionLocal, init_db
from models.auth_models import User
from routes.auth import create_access_token


def create_test_user(email: str, name: str):
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        if not user:
            user = User(name=name, email=email, hashed_password="dummy_hash_123")
            db.add(user)
            db.commit()
            db.refresh(user)
        token = create_access_token(subject=str(user.id))
        return user, token
    finally:
        db.close()


class TestPhaseBIntelligence(unittest.IsolatedAsyncioTestCase):

    async def asyncSetUp(self):
        init_db()
        transport = httpx.ASGITransport(app=app)
        self.client = httpx.AsyncClient(transport=transport, base_url="http://testserver")

    async def asyncTearDown(self):
        await self.client.aclose()

    async def test_1_briefing_and_signals_endpoints(self):
        """TEST 1: Verify /startup/intelligence/briefing and /startup/intelligence/signals."""
        user, token = create_test_user("intel_user@example.com", "Intel User")
        headers = {"Authorization": f"Bearer {token}"}

        # Test Daily Briefing
        brief_resp = await self.client.get("/startup/intelligence/briefing", headers=headers)
        self.assertEqual(brief_resp.status_code, 200)
        b_data = brief_resp.json()
        self.assertEqual(b_data["status"], "success")
        self.assertIn("briefing", b_data)

        # Test Signals Engine Trigger
        sig_resp = await self.client.get("/startup/intelligence/signals", headers=headers)
        self.assertEqual(sig_resp.status_code, 200)
        s_data = sig_resp.json()
        self.assertEqual(s_data["status"], "success")

    async def test_2_recommendation_human_approval_loop(self):
        """TEST 2: Fetch AI recommendations, approve one, and verify it converts to an execution Task."""
        user, token = create_test_user("human_loop@example.com", "Human Loop")
        headers = {"Authorization": f"Bearer {token}"}

        # List Recommendations
        recs_resp = await self.client.get("/startup/intelligence/recommendations", headers=headers)
        self.assertEqual(recs_resp.status_code, 200)
        recs = recs_resp.json()["recommendations"]
        self.assertTrue(len(recs) > 0)
        target_rec = recs[0]

        # Approve Recommendation -> Converts to Task
        appr_resp = await self.client.post(f"/startup/intelligence/recommendations/{target_rec['id']}/approve", headers=headers)
        self.assertEqual(appr_resp.status_code, 200)
        task_id = appr_resp.json()["task_id"]

        # Verify Task appeared on Task Board
        tasks_resp = await self.client.get("/startup/tasks", headers=headers)
        self.assertEqual(tasks_resp.status_code, 200)
        task_titles = [t["title"] for t in tasks_resp.json()["tasks"]]
        self.assertIn(target_rec["title"], task_titles)


if __name__ == "__main__":
    unittest.main()
