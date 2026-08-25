import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import unittest
import httpx
from app import app
from routes.auth import create_access_token, hash_password
from models.auth_models import User
from database import SessionLocal

from services.research_service import research_service
from services.calculation_engine import calculation_engine
from services.calculation_service import calculation_service
from services.verification_service import verification_service
from services.analysis_engine import analysis_engine

class TestPhase18AnalysisEngine(unittest.IsolatedAsyncioTestCase):

    async def asyncSetUp(self):
        transport = httpx.ASGITransport(app=app)
        self.client = httpx.AsyncClient(transport=transport, base_url="http://testserver")

        db = SessionLocal()
        user = db.query(User).filter(User.email == "phase18_test@example.com").first()
        if not user:
            user = User(name="Phase18 User", email="phase18_test@example.com", hashed_password=hash_password("PassPhase18!"))
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

    async def test_scenario_1_competitor_analysis(self):
        """SCENARIO 1: 'Who are my competitors?' -> Competitors identified, sources available, confidence shown."""
        res = await self.client.post("/chat", json={"message": "Who are my competitors?", "idea": "AI Career Platform"}, headers=self.headers)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("intent", data)
        self.assertEqual(data["intent"], "COMPETITOR_RESEARCH")
        self.assertIn("Competitor Intelligence Analysis", data["reply"])

    async def test_scenario_2_market_size_calculation(self):
        """SCENARIO 2: 'What's my market size?' -> Calculation reproducible, methodology shown."""
        calc = calculation_service.calculate_revenue_projections(
            price_per_month=499.0,
            expected_customers=1000,
            monthly_growth_rate=0.08
        )
        self.assertEqual(calc["current_mrr"], "₹4.99 Lakh")
        self.assertEqual(calc["current_arr"], "₹59.88 Lakh")
        self.assertIn("projected_arr_12m", calc)
        self.assertTrue(calc["is_calculated"])

    async def test_scenario_3_should_i_build_startup(self):
        """SCENARIO 3: 'Should I build this startup?' -> Evidence, risks, opportunities, recommendation."""
        analysis = analysis_engine.execute_analysis("AI Career Platform")
        self.assertIn("opportunity_score", analysis)
        self.assertIn("confidence_metrics", analysis)
        self.assertIn("evidence", analysis)
        self.assertIn("recommendation", analysis)
        self.assertEqual(analysis["recommendation"]["action_cta"], "Create Experiment")

    async def test_scenario_4_what_should_i_do_next(self):
        """SCENARIO 4: 'What should I do next?' -> Reads memory, health, open experiments, produces prioritized action."""
        res = await self.client.post("/chat", json={"message": "What should I do next?", "idea": "AI Career Platform"}, headers=self.headers)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["intent"], "PRIORITY_ACTION")
        self.assertIn("AI Co-Founder Priority Recommendation", data["reply"])


if __name__ == "__main__":
    unittest.main()
