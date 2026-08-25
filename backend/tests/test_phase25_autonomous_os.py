import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import unittest
import httpx
from app import app
from routes.auth import create_access_token, hash_password
from models.auth_models import User
from database import SessionLocal

from services.founder_os_orchestrator import founder_os_orchestrator

class TestPhase25AutonomousOS(unittest.IsolatedAsyncioTestCase):

    async def asyncSetUp(self):
        transport = httpx.ASGITransport(app=app)
        self.client = httpx.AsyncClient(transport=transport, base_url="http://testserver")

        db = SessionLocal()
        user = db.query(User).filter(User.email == "phase25_os@example.com").first()
        if not user:
            user = User(name="Phase25 Founder", email="phase25_os@example.com", hashed_password=hash_password("PassPhase25!"))
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

    async def test_1_get_weekly_brief(self):
        """TEST 1: AI Chief of Staff generates Weekly Founder Brief."""
        res = await self.client.get("/founder-os/weekly-brief", headers=self.headers)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("signals", data)
        self.assertGreater(len(data["recommended_actions"]), 0)

    def test_2_action_risk_classification(self):
        """TEST 2: Risk Classifier enforces safety rules across low/medium/high risk actions."""
        low = founder_os_orchestrator.classify_action_risk("GENERATE_REPORT")
        self.assertEqual(low["risk_level"], "🟢 LOW_RISK")
        self.assertFalse(low["requires_approval"])

        high = founder_os_orchestrator.classify_action_risk("FINANCIAL_TRANSACTION")
        self.assertEqual(high["risk_level"], "🔴 HIGH_RISK")
        self.assertTrue(high["requires_approval"])

    async def test_3_get_knowledge_graph(self):
        """TEST 3: Knowledge Graph endpoint builds node and edge relationships."""
        res = await self.client.get("/founder-os/knowledge-graph", headers=self.headers)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["graph_health"], "CONNECTED")
        self.assertGreater(data["total_nodes"], 0)

    async def test_4_get_autonomous_alerts(self):
        """TEST 4: Continuous monitor returns health score & proactive alerts."""
        res = await self.client.get("/founder-os/alerts", headers=self.headers)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["status"], "HEALTHY")
        self.assertIn("proactive_alerts", data)

    async def test_5_approval_based_action_execution(self):
        """TEST 5: Action execution requires explicit founder sign-off for medium/high risk actions."""
        # Unapproved attempt
        res_unapproved = await self.client.post("/founder-os/execute-action", json={
            "action_type": "PRICING_EXPERIMENT",
            "action_title": "Run Pricing Test",
            "approved_by_founder": False
        }, headers=self.headers)
        self.assertEqual(res_unapproved.status_code, 200)
        self.assertEqual(res_unapproved.json()["status"], "APPROVAL_REQUIRED")

        # Approved attempt
        res_approved = await self.client.post("/founder-os/execute-action", json={
            "action_type": "PRICING_EXPERIMENT",
            "action_title": "Run Pricing Test",
            "approved_by_founder": True
        }, headers=self.headers)
        self.assertEqual(res_approved.status_code, 200)
        self.assertEqual(res_approved.json()["status"], "EXECUTED")


if __name__ == "__main__":
    unittest.main()
