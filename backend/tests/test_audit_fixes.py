import os
import sys
import unittest
import httpx

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import app
from routes.auth import create_access_token, hash_password
from models.auth_models import User, PasswordResetToken
from database import SessionLocal
from services.synthetic_validation_service import synthetic_validation_service


class TestAuditFixesSuite(unittest.IsolatedAsyncioTestCase):

    async def asyncSetUp(self):
        transport = httpx.ASGITransport(app=app)
        self.client = httpx.AsyncClient(transport=transport, base_url="http://testserver")

        db = SessionLocal()
        # Admin user (ID 1 if possible, or designated admin)
        admin = db.query(User).filter(User.id == 1).first()
        if not admin:
            admin = User(name="Admin User", email="admin_audit@example.com", hashed_password=hash_password("AdminPass123!"))
            db.add(admin)
            db.commit()
            db.refresh(admin)

        # Standard non-admin user
        normal_user = db.query(User).filter(User.email == "regular_founder@example.com").first()
        if not normal_user:
            normal_user = User(name="Regular Founder", email="regular_founder@example.com", hashed_password=hash_password("FounderPass123!"))
            db.add(normal_user)
            db.commit()
            db.refresh(normal_user)

        self.admin_id = admin.id
        self.normal_user_id = normal_user.id
        db.close()

        self.admin_token = create_access_token(subject=str(self.admin_id))
        self.admin_headers = {"Authorization": f"Bearer {self.admin_token}"}

        self.normal_token = create_access_token(subject=str(self.normal_user_id))
        self.normal_headers = {"Authorization": f"Bearer {self.normal_token}"}

    async def asyncTearDown(self):
        await self.client.aclose()

    async def test_1_admin_endpoint_authorization_guard(self):
        """Verify non-admin user is rejected with 403 from /admin/stats."""
        # Non-admin user attempts access
        res_non_admin = await self.client.get("/admin/stats", headers=self.normal_headers)
        self.assertEqual(res_non_admin.status_code, 403, "Non-admin user must receive 403 Forbidden")

        # Admin user attempts access
        res_admin = await self.client.get("/admin/stats", headers=self.admin_headers)
        self.assertEqual(res_admin.status_code, 200, "Admin user must receive 200 OK")
        self.assertIn("stats", res_admin.json())

    async def test_2_billing_webhook_secret_protection(self):
        """Verify billing webhook rejects unauthorized requests with invalid secret."""
        # Providing an invalid webhook secret should be rejected with 401
        res_invalid = await self.client.post(
            "/billing/webhooks",
            json={
                "event_type": "checkout_completed",
                "provider_customer_id": "cust_fake",
                "provider_subscription_id": "sub_fake",
                "user_id": self.normal_user_id,
                "plan_id": "FOUNDER"
            },
            headers={"X-Billing-Webhook-Secret": "wrong-secret-signature"}
        )
        self.assertEqual(res_invalid.status_code, 401)

    async def test_3_real_password_reset_flow(self):
        """Verify real PasswordResetToken generation, expiry, and password update."""
        # Request forgot password
        res_forgot = await self.client.post("/auth/forgot-password", json={"email": "regular_founder@example.com"})
        self.assertEqual(res_forgot.status_code, 200)
        data = res_forgot.json()
        token = data.get("reset_token")
        self.assertIsNotNone(token, "Reset token must be generated")

        # Verify token exists in database
        db = SessionLocal()
        try:
            token_rec = db.query(PasswordResetToken).filter(PasswordResetToken.token == token).first()
            self.assertIsNotNone(token_rec)
            self.assertFalse(token_rec.used)
        finally:
            db.close()

        # Update password with the token
        res_reset = await self.client.post("/auth/reset-password", json={
            "token": token,
            "new_password": "BrandNewSecurePassword123!"
        })
        self.assertEqual(res_reset.status_code, 200)

        # Confirm login with new password works
        res_login = await self.client.post("/auth/login", json={
            "email": "regular_founder@example.com",
            "password": "BrandNewSecurePassword123!"
        })
        self.assertEqual(res_login.status_code, 200)
        self.assertIn("access_token", res_login.json())

        # Reusing the token must fail with 400
        res_reuse = await self.client.post("/auth/reset-password", json={
            "token": token,
            "new_password": "AnotherNewPassword123!"
        })
        self.assertEqual(res_reuse.status_code, 400)

    def test_4_adversarial_suite_reconciliation(self):
        """Verify synthetic validation service runs all 5 canonical adversarial cases."""
        adv_report = synthetic_validation_service.run_adversarial_tests()
        self.assertEqual(adv_report["total_adversarial"], 5, "Must test all 5 canonical adversarial scenarios")
        self.assertEqual(adv_report["adversarial_passed"], 5)
        self.assertEqual(adv_report["anti_hallucination_status"], "VERIFIED_SECURE")


if __name__ == "__main__":
    unittest.main()
