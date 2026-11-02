import os
import sys
import unittest
import httpx
from sqlalchemy.orm import Session

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import app
from database import SessionLocal, init_db
from models.auth_models import User
from routes.auth import create_access_token, hash_password
from config import (
    validate_configuration,
    ConfigurationError,
    is_insecure_secret,
    SECRET_KEY,
    BILLING_WEBHOOK_SECRET,
)


class TestPhase26ProductionSecrets(unittest.IsolatedAsyncioTestCase):

    @classmethod
    def setUpClass(cls):
        init_db()
        db: Session = SessionLocal()
        cls.test_email = "p0_04_secrets@audit.com"
        u = db.query(User).filter(User.email == cls.test_email).first()
        if not u:
            u = User(name="Secrets Test User", email=cls.test_email, hashed_password=hash_password("PassSecrets123!"))
            db.add(u)
            db.commit()
            db.refresh(u)
        cls.user_id = u.id
        db.close()

        cls.token = create_access_token(subject=str(cls.user_id))
        cls.headers = {"Authorization": f"Bearer {cls.token}"}

    async def asyncSetUp(self):
        transport = httpx.ASGITransport(app=app)
        self.client = httpx.AsyncClient(transport=transport, base_url="http://testserver")

    async def asyncTearDown(self):
        await self.client.aclose()

    def test_01_production_startup_fails_without_jwt_secret(self):
        """1. Production validation fails fast when JWT secret is missing or empty."""
        env_empty_1 = {"ENVIRONMENT": "production", "SECRET_KEY": ""}
        with self.assertRaises(ConfigurationError) as ctx1:
            validate_configuration(env_empty_1)
        self.assertIn("Missing required JWT secret", str(ctx1.exception))

        env_empty_2 = {"ENVIRONMENT": "production"}
        with self.assertRaises(ConfigurationError) as ctx2:
            validate_configuration(env_empty_2)
        self.assertIn("Missing required JWT secret", str(ctx2.exception))

    def test_02_production_rejects_known_default_jwt_secrets(self):
        """2. Production rejects known insecure and default JWT secrets."""
        blacklisted_examples = [
            "your-secret-key-change-in-production",
            "secret",
            "secret123",
            "changeme",
            "change-me",
            "admin",
            "password",
            "default_secret",
        ]
        for bad_secret in blacklisted_examples:
            env = {"ENVIRONMENT": "production", "SECRET_KEY": bad_secret}
            with self.assertRaises(ConfigurationError) as ctx:
                validate_configuration(env)
            self.assertIn("Insecure default JWT secret detected", str(ctx.exception))

    def test_03_production_rejects_weak_jwt_secrets(self):
        """3. Production rejects weak JWT secrets (< 32 characters)."""
        weak_secrets = [
            "short-secret",
            "only-20-chars-here!!",
            "thirty-one-characters-exactly-1",  # 31 chars
        ]
        for weak in weak_secrets:
            env = {"ENVIRONMENT": "production", "SECRET_KEY": weak}
            with self.assertRaises(ConfigurationError) as ctx:
                validate_configuration(env)
            self.assertIn("minimum length of 32 characters", str(ctx.exception))

    def test_04_production_accepts_strong_jwt_secret(self):
        """4. Production accepts a sufficiently strong, high-entropy JWT secret."""
        strong_secret = "a8f7c9e2b1d4f6a8c0e2b4d6f8a0c2e4v9X#mK2$pL8@zQ5!wE1*yT7&uI4^oP0+"
        env = {
            "ENVIRONMENT": "production",
            "SECRET_KEY": strong_secret,
            "BILLING_ENABLED": "false",
        }
        res = validate_configuration(env)
        self.assertEqual(res["environment"], "production")
        self.assertTrue(res["is_production"])
        self.assertTrue(res["jwt_secret_configured"])
        self.assertFalse(res["billing_enabled"])

    def test_05_billing_enabled_production_rejects_missing_webhook_secret(self):
        """5. Billing-enabled production rejects missing, default, or weak webhook secrets."""
        strong_jwt = "a8f7c9e2b1d4f6a8c0e2b4d6f8a0c2e4v9X#mK2$pL8@zQ5!wE1*yT7&uI4^oP0+"

        # Missing webhook secret
        env_missing = {
            "ENVIRONMENT": "production",
            "SECRET_KEY": strong_jwt,
            "BILLING_ENABLED": "true",
        }
        with self.assertRaises(ConfigurationError) as ctx_missing:
            validate_configuration(env_missing)
        self.assertIn("BILLING_WEBHOOK_SECRET is required", str(ctx_missing.exception))

        # Known default webhook secret
        env_default = {
            "ENVIRONMENT": "production",
            "SECRET_KEY": strong_jwt,
            "BILLING_ENABLED": "true",
            "BILLING_WEBHOOK_SECRET": "billing-webhook-secret-production",
        }
        with self.assertRaises(ConfigurationError) as ctx_def:
            validate_configuration(env_default)
        self.assertIn("Insecure default BILLING_WEBHOOK_SECRET", str(ctx_def.exception))

        # Too short webhook secret (< 16 chars)
        env_short = {
            "ENVIRONMENT": "production",
            "SECRET_KEY": strong_jwt,
            "BILLING_ENABLED": "true",
            "BILLING_WEBHOOK_SECRET": "short-secret",
        }
        with self.assertRaises(ConfigurationError) as ctx_short:
            validate_configuration(env_short)
        self.assertIn("Minimum length of 16 characters required", str(ctx_short.exception))

        # Valid strong webhook secret succeeds
        env_valid = {
            "ENVIRONMENT": "production",
            "SECRET_KEY": strong_jwt,
            "BILLING_ENABLED": "true",
            "BILLING_WEBHOOK_SECRET": "whsec_prod_live_verification_secret_32char",
        }
        res = validate_configuration(env_valid)
        self.assertTrue(res["billing_secret_configured"])

    def test_06_billing_disabled_does_not_require_webhook_secret(self):
        """6. Billing-disabled configuration does not require an unused webhook secret."""
        strong_jwt = "a8f7c9e2b1d4f6a8c0e2b4d6f8a0c2e4v9X#mK2$pL8@zQ5!wE1*yT7&uI4^oP0+"
        env = {
            "ENVIRONMENT": "production",
            "SECRET_KEY": strong_jwt,
            "BILLING_ENABLED": "false",
        }
        res = validate_configuration(env)
        self.assertEqual(res["environment"], "production")
        self.assertFalse(res["billing_enabled"])
        self.assertFalse(res["billing_secret_configured"])

    def test_07_development_configuration_works_with_explicit_settings(self):
        """7. Development configuration works cleanly with explicit development settings."""
        env_dev = {
            "ENVIRONMENT": "development",
            "SECRET_KEY": "dev-jwt-secret-key-32-characters-long-not-for-prod",
        }
        res = validate_configuration(env_dev)
        self.assertEqual(res["environment"], "development")
        self.assertFalse(res["is_production"])

    def test_08_test_environment_remains_functional(self):
        """8. Test environment remains functional and accepts test defaults."""
        env_test = {
            "ENVIRONMENT": "test",
        }
        res = validate_configuration(env_test)
        self.assertEqual(res["environment"], "test")
        self.assertFalse(res["is_production"])

    async def test_09_secret_values_never_exposed_in_errors_or_logs(self):
        """9. Secret values are never exposed in error messages, exception strings, or HTTP responses."""
        sensitive_secret = "candidate_short_secret_xyz_123"  # 31 chars (< 32)
        env_bad = {
            "ENVIRONMENT": "production",
            "SECRET_KEY": sensitive_secret,
        }
        try:
            validate_configuration(env_bad)
            self.fail("Should have raised ConfigurationError")
        except ConfigurationError as exc:
            self.assertNotIn(sensitive_secret, str(exc))

        # Verify billing webhook failure does not leak secret
        res_webhook = await self.client.post(
            "/billing/webhooks",
            json={
                "event_type": "checkout_completed",
                "provider_customer_id": "cust_1",
                "provider_subscription_id": "sub_1",
                "user_id": self.user_id,
                "plan_id": "PRO",
            },
            headers={"X-Billing-Webhook-Secret": "attacker_supplied_guess_secret_999"},
        )
        self.assertEqual(res_webhook.status_code, 401)
        resp_text = res_webhook.text
        self.assertNotIn("attacker_supplied_guess_secret_999", resp_text)
        if BILLING_WEBHOOK_SECRET:
            self.assertNotIn(BILLING_WEBHOOK_SECRET, resp_text)
        if SECRET_KEY:
            self.assertNotIn(SECRET_KEY, resp_text)

    async def test_10_existing_jwt_authentication_continues_to_pass(self):
        """10. Existing JWT authentication and validation workflow functions seamlessly."""
        res = await self.client.get("/auth/me", headers=self.headers)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["email"], self.test_email)
        self.assertEqual(data["id"], self.user_id)


if __name__ == "__main__":
    unittest.main()
