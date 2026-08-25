import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import unittest
import httpx
from app import app
from routes.auth import create_access_token, hash_password
from models.auth_models import User
from database import SessionLocal

from services.market_watch_service import market_watch_service
from services.change_detection_service import change_detection_service
from services.startup_memory_service import startup_memory_service
from services.impact_analysis_service import impact_analysis_service

class TestPhase19LiveIntelligence(unittest.IsolatedAsyncioTestCase):

    async def asyncSetUp(self):
        transport = httpx.ASGITransport(app=app)
        self.client = httpx.AsyncClient(transport=transport, base_url="http://testserver")

        db = SessionLocal()
        user = db.query(User).filter(User.email == "phase19_test@example.com").first()
        if not user:
            user = User(name="Phase19 User", email="phase19_test@example.com", hashed_password=hash_password("PassPhase19!"))
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

    def test_1_market_watch_signals(self):
        """TEST 1: Live Market Watch returns structured market signals."""
        signals = market_watch_service.fetch_live_signals("AI Startup")
        self.assertGreater(len(signals), 0)
        self.assertIn("title", signals[0])
        self.assertIn("impact", signals[0])

    def test_2_change_detection_recalculation(self):
        """TEST 2: Autonomous Change Detection recalculates health score on threat detection."""
        res = change_detection_service.process_market_event(
            event_type="COMPETITOR_LAUNCH",
            title="Competitor X launched AI feature",
            threat_level="HIGH",
            current_health=78
        )
        self.assertEqual(res["previous_health"], 78)
        self.assertEqual(res["new_health"], 74)
        self.assertEqual(res["health_delta"], -4)

    def test_3_layered_memory_compilation(self):
        """TEST 3: 5-Layered Startup Memory compiles multi-layer context."""
        db = SessionLocal()
        try:
            mem = startup_memory_service.compile_layered_memory(db, self.user_id, "AI Career Platform")
            self.assertIn("short_term_memory", mem["layered_memory"])
            self.assertIn("working_memory", mem["layered_memory"])
            self.assertIn("long_term_memory", mem["layered_memory"])
        finally:
            db.close()

    def test_4_scenario_intelligence_comparison(self):
        """TEST 4: Impact Analysis Service compares strategic pivot scenarios."""
        comp = impact_analysis_service.compare_pivots("College Students (B2C)", "Enterprise Companies (B2B)")
        self.assertEqual(len(comp["matrix"]), 5)
        self.assertIn("recommendation", comp)

    async def test_5_timeline_endpoint_crud(self):
        """TEST 5: Startup Timeline router GET and POST endpoints."""
        # Create event
        res_post = await self.client.post("/timeline/events", json={
            "event_type": "EXPERIMENT_APPROVED",
            "title": "Approved ₹499 pricing experiment",
            "description": "20 customer interviews",
            "impact_level": "POSITIVE",
            "health_delta": 2
        }, headers=self.headers)
        self.assertEqual(res_post.status_code, 200)

        # Get events
        res_get = await self.client.get("/timeline", headers=self.headers)
        self.assertEqual(res_get.status_code, 200)
        events = res_get.json()["events"]
        self.assertGreater(len(events), 0)


if __name__ == "__main__":
    unittest.main()
