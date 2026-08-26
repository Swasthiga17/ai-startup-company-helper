import os
import sys
import unittest
import json
import httpx

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import app
from routes.auth import create_access_token, hash_password
from models.auth_models import User, Analysis
from database import SessionLocal
from evaluation.synthetic_evaluator import synthetic_evaluator

class TestSyntheticFoundersSuite(unittest.IsolatedAsyncioTestCase):

    async def asyncSetUp(self):
        transport = httpx.ASGITransport(app=app)
        self.client = httpx.AsyncClient(transport=transport, base_url="http://testserver")

        db = SessionLocal()
        
        # User A setup
        user_a = db.query(User).filter(User.email == "user_a_synth@example.com").first()
        if not user_a:
            user_a = User(name="User A", email="user_a_synth@example.com", hashed_password=hash_password("PassUserA123!"))
            db.add(user_a)
            db.commit()
            db.refresh(user_a)

        # User B setup
        user_b = db.query(User).filter(User.email == "user_b_synth@example.com").first()
        if not user_b:
            user_b = User(name="User B", email="user_b_synth@example.com", hashed_password=hash_password("PassUserB123!"))
            db.add(user_b)
            db.commit()
            db.refresh(user_b)

        self.user_a_id = user_a.id
        self.user_b_id = user_b.id
        db.close()

        self.token_a = create_access_token(subject=str(self.user_a_id))
        self.headers_a = {"Authorization": f"Bearer {self.token_a}"}

        self.token_b = create_access_token(subject=str(self.user_b_id))
        self.headers_b = {"Authorization": f"Bearer {self.token_b}"}

    async def asyncTearDown(self):
        await self.client.aclose()

    def test_1_synthetic_founders_json_schema(self):
        """Verify 30 scenarios loaded and required fields present."""
        founders = synthetic_evaluator.load_founders()
        self.assertEqual(len(founders), 30, "Must contain exactly 30 synthetic founder scenarios")

        required_fields = [
            "id", "persona", "startup_name", "industry", "stage",
            "budget", "target_customer", "problem", "solution",
            "business_model", "primary_goal", "main_uncertainty"
        ]

        for f in founders:
            for field in required_fields:
                self.assertIn(field, f, f"Scenario {f.get('id')} missing required field: {field}")

    def test_2_synthetic_evaluator_execution(self):
        """Verify evaluation runs and regression gate passes."""
        report = synthetic_evaluator.run_full_validation()
        self.assertEqual(report["summary"]["scenarios_total"], 30)
        self.assertEqual(report["summary"]["scenarios_completed"], 30)
        self.assertEqual(report["summary"]["critical_failures"], 0)
        self.assertEqual(report["summary"]["high_severity_failures"], 0)
        self.assertEqual(report["summary"]["regression_gate"], "PASS")

    def test_3_agent_scorecard_metrics(self):
        """Verify agent scorecard contains all key agents."""
        report = synthetic_evaluator.run_full_validation()
        scorecard = report["agent_scorecard"]
        self.assertIn("Revenue Forecast", scorecard)
        self.assertIn("Market Research", scorecard)
        self.assertIn("Decision Agent", scorecard)
        self.assertGreaterEqual(scorecard["Decision Agent"], 80.0)

    async def test_4_multitenant_security_isolation(self):
        """Verify User A -> Startup A allowed, User B -> Startup A denied."""
        db = SessionLocal()
        try:
            analysis_a = db.query(Analysis).filter(Analysis.user_id == self.user_a_id).first()
            if not analysis_a:
                analysis_a = Analysis(user_id=self.user_a_id, idea="User A Private Startup", payload='{"status": "COMPLETE"}')
                db.add(analysis_a)
                db.commit()
                db.refresh(analysis_a)
            analysis_id = analysis_a.id
        finally:
            db.close()

        # User B attempts to access User A's startup report -> 403 Forbidden
        res_pdf = await self.client.get(f"/download/pdf?analysisId={analysis_id}", headers=self.headers_b)
        self.assertEqual(res_pdf.status_code, 403)

    async def test_5_unauthenticated_requests_rejected(self):
        """Verify unauthorized synthetic requests rejected without valid JWT token."""
        res_no_auth = await self.client.get("/synthetic/report")
        self.assertEqual(res_no_auth.status_code, 401)

if __name__ == "__main__":
    unittest.main()
