import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import unittest
import httpx
from app import app
from routes.auth import create_access_token, hash_password
from models.auth_models import User
from database import SessionLocal

from services.billing_service import billing_service

class TestPhase24Billing(unittest.IsolatedAsyncioTestCase):

    async def asyncSetUp(self):
        transport = httpx.ASGITransport(app=app)
        self.client = httpx.AsyncClient(transport=transport, base_url="http://testserver")

        db = SessionLocal()
        user = db.query(User).filter(User.email == "phase24_billing@example.com").first()
        if not user:
            user = User(name="Phase24 User", email="phase24_billing@example.com", hashed_password=hash_password("PassPhase24!"))
            db.add(user)
            db.commit()
            db.refresh(user)

        user_id = user.id

        # Ensure subscription state is clean for test run
        from models.subscription_model import Subscription
        sub = db.query(Subscription).filter(Subscription.user_id == user_id).first()
        if sub:
            sub.plan_id = "FREE"
            sub.status = "ACTIVE"
            db.commit()

        db.close()

        self.user_id = user_id
        self.token = create_access_token(subject=str(user_id))
        self.headers = {"Authorization": f"Bearer {self.token}"}

    async def asyncTearDown(self):
        await self.client.aclose()

    async def test_1_get_subscription(self):
        """TEST 1: Get user subscription and initial free entitlement."""
        res = await self.client.get("/billing/subscription", headers=self.headers)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["plan_id"], "FREE")
        self.assertTrue(data["entitlement"]["allowed"])

    def test_2_entitlement_quota_enforcement(self):
        """TEST 2: Entitlement middleware blocks requests exceeding quota limit."""
        denied = billing_service.check_entitlement("FREE", current_usage=3)
        self.assertFalse(denied["allowed"])
        self.assertIn("Upgrade to Pro", denied["action_cta"])

    async def test_3_billing_webhook_processing(self):
        """TEST 3: Webhook handler updates subscription plan idempotently."""
        res = await self.client.post("/billing/webhooks", json={
            "event_type": "checkout_completed",
            "provider_customer_id": "cust_12345",
            "provider_subscription_id": "sub_67890",
            "user_id": self.user_id,
            "plan_id": "PRO"
        })
        self.assertEqual(res.status_code, 200)
        self.assertTrue(res.json()["processed"])

        # Check updated subscription
        res_sub = await self.client.get("/billing/subscription", headers=self.headers)
        self.assertEqual(res_sub.json()["plan_id"], "PRO")

    async def test_4_create_checkout(self):
        """TEST 4: Checkout route generates upgrade payload."""
        res = await self.client.post("/billing/checkout", json={"plan_id": "PRO"}, headers=self.headers)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data["success"])
        self.assertEqual(data["plan_id"], "PRO")

    async def test_5_business_intelligence_dashboard(self):
        """TEST 5: Business intelligence endpoint returns SaaS MRR & unit economics."""
        res = await self.client.get("/billing/dashboard", headers=self.headers)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("saas_metrics", data)
        self.assertEqual(data["saas_metrics"]["paid_users"], 120)
        self.assertTrue(data["unit_economics"]["is_profitable"])


if __name__ == "__main__":
    unittest.main()
