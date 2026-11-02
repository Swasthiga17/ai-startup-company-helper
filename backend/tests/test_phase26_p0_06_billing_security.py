import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import unittest
from unittest.mock import patch
import httpx
from database import SessionLocal, init_db
from app import app
from routes.auth import create_access_token, hash_password
from models.auth_models import User
from models.subscription_model import Subscription, BillingEvent
from config import BILLING_WEBHOOK_SECRET


class TestPhase26BillingSecurity(unittest.IsolatedAsyncioTestCase):
    """
    Phase 26 - P0-06 Regression Test Suite:
    Comprehensive verification of payment processing, checkout generation,
    webhook signature verification, idempotency, subscription management,
    and multi-tenant isolation.
    """

    async def asyncSetUp(self):
        init_db()
        transport = httpx.ASGITransport(app=app)
        self.client = httpx.AsyncClient(transport=transport, base_url="http://testserver")

        db = SessionLocal()

        # Create or fetch User A
        user_a = db.query(User).filter(User.email == "billing_p06_user_a@example.com").first()
        if not user_a:
            user_a = User(
                name="Billing User A",
                email="billing_p06_user_a@example.com",
                hashed_password=hash_password("PassUserA123!")
            )
            db.add(user_a)
            db.commit()
            db.refresh(user_a)
        self.user_a_id = user_a.id

        # Create or fetch User B
        user_b = db.query(User).filter(User.email == "billing_p06_user_b@example.com").first()
        if not user_b:
            user_b = User(
                name="Billing User B",
                email="billing_p06_user_b@example.com",
                hashed_password=hash_password("PassUserB123!")
            )
            db.add(user_b)
            db.commit()
            db.refresh(user_b)
        self.user_b_id = user_b.id

        # Clean subscription and billing event state for test isolation
        db.query(Subscription).filter(Subscription.user_id.in_([self.user_a_id, self.user_b_id])).delete(synchronize_session=False)
        db.query(BillingEvent).filter(BillingEvent.user_id.in_([self.user_a_id, self.user_b_id])).delete(synchronize_session=False)
        db.commit()
        db.close()

        self.token_a = create_access_token(subject=str(self.user_a_id))
        self.headers_a = {"Authorization": f"Bearer {self.token_a}"}

        self.token_b = create_access_token(subject=str(self.user_b_id))
        self.headers_b = {"Authorization": f"Bearer {self.token_b}"}

    async def asyncTearDown(self):
        await self.client.aclose()

    async def test_01_unauthenticated_checkout_rejected(self):
        """1. Unauthenticated checkout requests are rejected with HTTP 401."""
        res = await self.client.post("/billing/checkout", json={"plan_id": "PRO"})
        self.assertEqual(res.status_code, 401)

    async def test_02_authenticated_user_can_initiate_checkout(self):
        """2. Authenticated user can initiate a checkout session."""
        res = await self.client.post(
            "/billing/checkout",
            json={"plan_id": "PRO"},
            headers=self.headers_a
        )
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data.get("success"))
        self.assertEqual(data.get("plan_id"), "PRO")
        self.assertIn("checkout_url", data)
        self.assertIn("price", data)

    async def test_03_client_cannot_manipulate_checkout_price(self):
        """3. Client-provided price or currency parameters are ignored; server authoritative pricing applies."""
        # Client attempts to pass a manipulated custom price ($0.01)
        res = await self.client.post(
            "/billing/checkout",
            json={"plan_id": "PRO", "price": "₹1.00", "amount": 1, "currency": "usd"},
            headers=self.headers_a
        )
        self.assertEqual(res.status_code, 200)
        data = res.json()
        # Price is strictly derived from server config
        self.assertEqual(data.get("price"), "₹999/mo")

    async def test_04_client_cannot_select_unauthorized_plan_ids(self):
        """4. Unauthorized, free, or malicious plan IDs return HTTP 400."""
        for invalid_plan in ["FREE", "ENTERPRISE", "ADMIN_TIER", "HACKER", ""]:
            res = await self.client.post(
                "/billing/checkout",
                json={"plan_id": invalid_plan},
                headers=self.headers_a
            )
            self.assertEqual(res.status_code, 400)

    async def test_05_invalid_webhook_signature_rejected(self):
        """5. Webhooks with invalid secret or signature are rejected."""
        # Mode A: Invalid X-Billing-Webhook-Secret
        res_secret = await self.client.post(
            "/billing/webhooks",
            json={
                "event_type": "checkout_completed",
                "user_id": self.user_a_id,
                "plan_id": "PRO"
            },
            headers={"X-Billing-Webhook-Secret": "invalid_tampered_secret"}
        )
        self.assertEqual(res_secret.status_code, 401)

        # Mode B: Invalid Stripe-Signature
        res_stripe = await self.client.post(
            "/billing/webhooks",
            content=b'{"type": "checkout.session.completed"}',
            headers={"Stripe-Signature": "t=123,v1=tampered_sig"}
        )
        self.assertEqual(res_stripe.status_code, 400)

    async def test_06_missing_webhook_signature_rejected_when_required(self):
        """6. Webhooks with missing signature/secret are rejected when signature is required."""
        with patch.dict(os.environ, {"BILLING_REQUIRE_SIGNATURE": "true"}):
            res = await self.client.post(
                "/billing/webhooks",
                json={
                    "event_type": "checkout_completed",
                    "user_id": self.user_a_id,
                    "plan_id": "PRO"
                }
            )
            self.assertEqual(res.status_code, 401)

    async def test_07_valid_webhook_signature_accepted(self):
        """7. Webhook with valid signature is verified and processed."""
        # Using configured webhook secret
        res = await self.client.post(
            "/billing/webhooks",
            json={
                "event_id": "evt_test_valid_signature_101",
                "event_type": "checkout_completed",
                "user_id": self.user_a_id,
                "plan_id": "PRO",
                "provider_customer_id": "cus_valid_123",
                "provider_subscription_id": "sub_valid_456"
            },
            headers={"X-Billing-Webhook-Secret": BILLING_WEBHOOK_SECRET}
        )
        self.assertEqual(res.status_code, 200)
        self.assertTrue(res.json().get("processed"))

        # Verify DB state updated
        db = SessionLocal()
        sub = db.query(Subscription).filter(Subscription.user_id == self.user_a_id).first()
        self.assertIsNotNone(sub)
        self.assertEqual(sub.plan_id, "PRO")
        self.assertEqual(sub.status, "ACTIVE")
        db.close()

    async def test_08_duplicate_webhook_events_processed_only_once(self):
        """8. Duplicate webhook events are handled idempotently without re-processing."""
        event_payload = {
            "event_id": "evt_idempotency_unique_test_888",
            "event_type": "payment_succeeded",
            "user_id": self.user_a_id,
            "plan_id": "FOUNDER",
            "provider_customer_id": "cus_idemp_1",
            "provider_subscription_id": "sub_idemp_1"
        }

        # First delivery
        res1 = await self.client.post(
            "/billing/webhooks",
            json=event_payload,
            headers={"X-Billing-Webhook-Secret": BILLING_WEBHOOK_SECRET}
        )
        self.assertEqual(res1.status_code, 200)
        self.assertFalse(res1.json().get("idempotent", False))

        # Second delivery (replay / retry)
        res2 = await self.client.post(
            "/billing/webhooks",
            json=event_payload,
            headers={"X-Billing-Webhook-Secret": BILLING_WEBHOOK_SECRET}
        )
        self.assertEqual(res2.status_code, 200)
        self.assertTrue(res2.json().get("idempotent"))

        # Verify only one BillingEvent record exists in DB
        db = SessionLocal()
        count = db.query(BillingEvent).filter(BillingEvent.event_id == "evt_idempotency_unique_test_888").count()
        self.assertEqual(count, 1)
        db.close()

    async def test_09_payment_success_updates_correct_user_subscription(self):
        """9. Payment success activates the specific user's subscription and does not alter others."""
        res = await self.client.post(
            "/billing/webhooks",
            json={
                "event_id": "evt_user_target_999",
                "event_type": "checkout_completed",
                "user_id": self.user_a_id,
                "plan_id": "FOUNDER",
                "provider_customer_id": "cus_user_a",
                "provider_subscription_id": "sub_user_a"
            },
            headers={"X-Billing-Webhook-Secret": BILLING_WEBHOOK_SECRET}
        )
        self.assertEqual(res.status_code, 200)

        # Check User A subscription
        res_a = await self.client.get("/billing/subscription", headers=self.headers_a)
        self.assertEqual(res_a.json()["plan_id"], "FOUNDER")
        self.assertEqual(res_a.json()["status"], "ACTIVE")

        # Check User B subscription remains FREE
        res_b = await self.client.get("/billing/subscription", headers=self.headers_b)
        self.assertEqual(res_b.json()["plan_id"], "FREE")

    async def test_10_user_a_cannot_access_user_b_subscription(self):
        """10. Multi-tenant isolation: User A cannot view or manipulate User B's subscription."""
        # Query User A's subscription using User A's token
        res_a = await self.client.get("/billing/subscription", headers=self.headers_a)
        self.assertEqual(res_a.json()["user_id"], self.user_a_id)

        # Query User B's subscription using User B's token
        res_b = await self.client.get("/billing/subscription", headers=self.headers_b)
        self.assertEqual(res_b.json()["user_id"], self.user_b_id)

        # Confirm tokens return separate isolated states
        self.assertNotEqual(res_a.json()["user_id"], res_b.json()["user_id"])

    async def test_11_frontend_redirect_alone_cannot_activate_subscription(self):
        """11. Simulating frontend redirect query params (?status=success) does not grant paid access."""
        # Query parameters alone cannot change DB state
        res_before = await self.client.get("/billing/subscription", headers=self.headers_a)
        initial_plan = res_before.json()["plan_id"]

        # Even if frontend receives ?session_id=fake_cs&status=success, backend subscription check remains unchanged
        res_after = await self.client.get("/billing/subscription?status=success&session_id=cs_fake", headers=self.headers_a)
        self.assertEqual(res_after.json()["plan_id"], initial_plan)

    async def test_12_payment_failure_does_not_grant_paid_access(self):
        """12. Payment failure webhook marks subscription as PAST_DUE and does not grant paid access."""
        res = await self.client.post(
            "/billing/webhooks",
            json={
                "event_id": "evt_fail_test_777",
                "event_type": "payment_failed",
                "user_id": self.user_a_id,
                "plan_id": "PRO",
                "provider_customer_id": "cus_failed",
                "provider_subscription_id": "sub_failed"
            },
            headers={"X-Billing-Webhook-Secret": BILLING_WEBHOOK_SECRET}
        )
        self.assertEqual(res.status_code, 200)

        # Subscription status must be PAST_DUE
        res_sub = await self.client.get("/billing/subscription", headers=self.headers_a)
        self.assertEqual(res_sub.json()["status"], "PAST_DUE")

    async def test_13_subscription_cancellation_updates_access_correctly(self):
        """13. Cancelling subscription updates status to CANCELLED and records audit event."""
        # First activate subscription
        await self.client.post(
            "/billing/webhooks",
            json={
                "event_id": "evt_cancel_setup_555",
                "event_type": "checkout_completed",
                "user_id": self.user_a_id,
                "plan_id": "PRO",
                "provider_customer_id": "cus_cancel",
                "provider_subscription_id": "sub_cancel"
            },
            headers={"X-Billing-Webhook-Secret": BILLING_WEBHOOK_SECRET}
        )

        # User cancels subscription
        res_cancel = await self.client.post("/billing/cancel-subscription", headers=self.headers_a)
        self.assertEqual(res_cancel.status_code, 200)
        self.assertEqual(res_cancel.json()["subscription_status"], "CANCELLED")

        # Verify status in GET /billing/subscription
        res_sub = await self.client.get("/billing/subscription", headers=self.headers_a)
        self.assertEqual(res_sub.json()["status"], "CANCELLED")

        # Verify history includes cancellation event
        res_hist = await self.client.get("/billing/history", headers=self.headers_a)
        self.assertEqual(res_hist.status_code, 200)
        events = [e["event_type"] for e in res_hist.json()["events"]]
        self.assertIn("subscription_cancelled", events)

    async def test_14_existing_authentication_and_billing_behavior_compatible(self):
        """14. Existing SaaS metrics, unit economics, and billing APIs remain compatible."""
        # SaaS business intelligence dashboard
        res_dash = await self.client.get("/billing/dashboard", headers=self.headers_a)
        self.assertEqual(res_dash.status_code, 200)
        data = res_dash.json()
        self.assertIn("saas_metrics", data)
        self.assertIn("unit_economics", data)
        self.assertEqual(data["saas_metrics"]["paid_users"], 120)
        self.assertTrue(data["unit_economics"]["is_profitable"])


if __name__ == "__main__":
    unittest.main()
