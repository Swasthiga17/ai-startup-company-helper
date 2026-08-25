import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import unittest
import httpx
from app import app
from routes.auth import create_access_token, hash_password
from models.auth_models import User
from database import SessionLocal

class TestPhase17Intelligence(unittest.IsolatedAsyncioTestCase):

    async def asyncSetUp(self):
        transport = httpx.ASGITransport(app=app)
        self.client = httpx.AsyncClient(transport=transport, base_url="http://testserver")

        db = SessionLocal()
        user = db.query(User).filter(User.email == "phase17_test@example.com").first()
        if not user:
            user = User(name="Phase17 User", email="phase17_test@example.com", hashed_password=hash_password("PassPhase17!"))
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

    async def test_1_morning_brief_endpoint(self):
        """TEST 1: Morning Brief endpoint returns structured AI co-founder daily briefing."""
        res = await self.client.get("/intelligence/morning-brief", headers=self.headers)
        self.assertEqual(res.status_code, 200)
        data = res.json()["data"]
        self.assertIn("greeting", data)
        self.assertIn("priority", data)
        self.assertIn("recommendation", data)

    async def test_2_scorecard_endpoint(self):
        """TEST 2: Founder Scorecard endpoint returns 5-metric viability breakdown."""
        res = await self.client.get("/intelligence/scorecard", headers=self.headers)
        self.assertEqual(res.status_code, 200)
        data = res.json()["data"]
        self.assertIn("startup_health", data)
        self.assertIn("execution_score", data)
        self.assertIn("validation_score", data)

    async def test_3_decision_crud_lifecycle(self):
        """TEST 3: Founder Decision Log CRUD lifecycle."""
        # Create decision
        res_create = await self.client.post("/decisions", json={
            "title": "Selected ₹499 pricing",
            "reason": "Customer willingness-to-pay interviews",
            "category": "PRICING",
            "impact": "MEDIUM"
        }, headers=self.headers)
        self.assertEqual(res_create.status_code, 200)
        dec_id = res_create.json()["decision"]["id"]

        # List decisions
        res_list = await self.client.get("/decisions", headers=self.headers)
        self.assertEqual(res_list.status_code, 200)
        titles = [d["title"] for d in res_list.json()["decisions"]]
        self.assertIn("Selected ₹499 pricing", titles)

        # Delete decision
        res_del = await self.client.delete(f"/decisions/{dec_id}", headers=self.headers)
        self.assertEqual(res_del.status_code, 200)

    async def test_4_experiment_crud_lifecycle(self):
        """TEST 4: Startup Experiments CRUD lifecycle."""
        # Create experiment
        res_create = await self.client.post("/experiments", json={
            "hypothesis": "Students will pay for AI career guidance",
            "task": "Interview 20 college students",
            "success_criteria": "30% willing to pay"
        }, headers=self.headers)
        self.assertEqual(res_create.status_code, 200)
        exp_id = res_create.json()["experiment"]["id"]

        # Patch status
        res_patch = await self.client.patch(f"/experiments/{exp_id}", json={
            "status": "VALIDATED",
            "results": "4/20 willingness to pay",
            "ai_conclusion": "Validated with moderate adoption."
        }, headers=self.headers)
        self.assertEqual(res_patch.status_code, 200)
        self.assertEqual(res_patch.json()["experiment"]["status"], "VALIDATED")

        # Delete experiment
        res_del = await self.client.delete(f"/experiments/{exp_id}", headers=self.headers)
        self.assertEqual(res_del.status_code, 200)


if __name__ == "__main__":
    unittest.main()
