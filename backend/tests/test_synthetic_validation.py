import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import unittest
import httpx
from app import app
from routes.auth import create_access_token, hash_password
from models.auth_models import User
from database import SessionLocal

from services.synthetic_validation_service import synthetic_validation_service

class TestSyntheticValidation(unittest.IsolatedAsyncioTestCase):

    async def asyncSetUp(self):
        transport = httpx.ASGITransport(app=app)
        self.client = httpx.AsyncClient(transport=transport, base_url="http://testserver")

        db = SessionLocal()
        user = db.query(User).filter(User.email == "synthetic_test@example.com").first()
        if not user:
            user = User(name="Synthetic Tester", email="synthetic_test@example.com", hashed_password=hash_password("PassSynth123!"))
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

    async def test_1_get_synthetic_report(self):
        """TEST 1: Synthetic report returns 30/30 passed scenarios and 0 hallucination cases."""
        res = await self.client.get("/synthetic/report", headers=self.headers)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["total_synthetic_scenarios"], 30)
        self.assertEqual(data["scenarios_passed"], 30)
        self.assertEqual(data["hallucination_cases"], 0)

    async def test_2_run_adversarial_tests(self):
        """TEST 2: Anti-hallucination suite passes all adversarial cases."""
        res = await self.client.post("/synthetic/run-adversarial", headers=self.headers)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["adversarial_passed"], data["total_adversarial"])
        self.assertEqual(data["anti_hallucination_status"], "VERIFIED_SECURE")

    async def test_3_get_synthetic_personas(self):
        """TEST 3: Personas endpoint returns 30 startup personas and 6 simulated founder personas."""
        res = await self.client.get("/synthetic/personas", headers=self.headers)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(len(data["synthetic_startup_personas"]), 30)
        self.assertEqual(len(data["simulated_founder_personas"]), 6)


if __name__ == "__main__":
    unittest.main()
