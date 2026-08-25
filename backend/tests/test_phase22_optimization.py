import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import unittest
import httpx
from app import app
from routes.auth import create_access_token, hash_password
from models.auth_models import User
from database import SessionLocal

from services.agent_optimization_service import agent_optimization_service
from services.adaptive_recommendation_service import adaptive_recommendation_service
from services.regression_eval_service import regression_eval_service

class TestPhase22Optimization(unittest.IsolatedAsyncioTestCase):

    async def asyncSetUp(self):
        transport = httpx.ASGITransport(app=app)
        self.client = httpx.AsyncClient(transport=transport, base_url="http://testserver")

        db = SessionLocal()
        user = db.query(User).filter(User.email == "phase22_opt@example.com").first()
        if not user:
            user = User(name="Phase22 User", email="phase22_opt@example.com", hashed_password=hash_password("PassPhase22!"))
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

    async def test_1_agent_scorecard_endpoint(self):
        """TEST 1: Agent scorecard returns quality ratings for 9 domain agents."""
        res = await self.client.get("/optimization/agent-scorecard", headers=self.headers)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(len(data["agents"]), 9)
        self.assertEqual(data["quality_gate_status"], "PASS")

    def test_2_adaptive_recommendation_engine(self):
        """TEST 2: Adaptive Recommendation Engine prioritizes low-cost strategies when high-cost options are rejected."""
        adapted = adaptive_recommendation_service.generate_adaptive_recommendation(
            idea_text="AI Career Platform",
            past_rejected_types=["EXPENSIVE_MVP"]
        )
        self.assertTrue(adapted["is_adapted"])
        self.assertEqual(adapted["adapted_recommendation"]["strategy_type"], "LOW_COST_VALIDATION")

    async def test_3_regression_suite_endpoint(self):
        """TEST 3: AI Regression Evaluation Suite passes all 10 startup scenarios."""
        res = await self.client.get("/optimization/regression-test", headers=self.headers)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["total_scenarios"], 10)
        self.assertEqual(data["scenarios_passed"], 10)
        self.assertEqual(data["quality_gates"]["regression_suite"], "PASS")

    async def test_4_founder_value_score_endpoint(self):
        """TEST 4: Founder Value Score endpoint computes higher-level value metric."""
        res = await self.client.get("/optimization/founder-value", headers=self.headers)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("founder_value_score", data)
        self.assertEqual(data["rating"], "HIGH_FOUNDER_VALUE")


if __name__ == "__main__":
    unittest.main()
