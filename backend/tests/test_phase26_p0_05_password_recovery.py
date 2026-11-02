import os
import sys
import unittest
import hashlib
from datetime import datetime, timedelta
import httpx
from sqlalchemy.orm import Session

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import app
from database import SessionLocal, init_db
from models.auth_models import User, PasswordResetToken
from routes.auth import (
    create_access_token,
    hash_password,
    verify_password,
    hash_token,
    recovery_limiter,
)
from services.email_service import email_service


class TestPhase26PasswordRecovery(unittest.IsolatedAsyncioTestCase):

    @classmethod
    def setUpClass(cls):
        init_db()
        db: Session = SessionLocal()
        cls.registered_email = "p0_05_user@audit.com"
        cls.original_password = "InitialPassword123!"

        user = db.query(User).filter(User.email == cls.registered_email).first()
        if not user:
            user = User(
                name="Recovery User",
                email=cls.registered_email,
                hashed_password=hash_password(cls.original_password),
            )
            db.add(user)
            db.commit()
            db.refresh(user)
        else:
            user.hashed_password = hash_password(cls.original_password)
            db.commit()

        cls.user_id = user.id
        db.close()

    async def asyncSetUp(self):
        transport = httpx.ASGITransport(app=app)
        self.client = httpx.AsyncClient(transport=transport, base_url="http://testserver")
        recovery_limiter.clear()
        email_service.clear_outbox()
        email_service.set_simulate_failure(False)

    async def asyncTearDown(self):
        await self.client.aclose()
        recovery_limiter.clear()
        email_service.clear_outbox()
        email_service.set_simulate_failure(False)

    async def test_01_forgot_password_for_registered_email(self):
        """1. Forgot-password for registered email returns generic response and dispatches email."""
        res = await self.client.post("/auth/forgot-password", json={"email": self.registered_email})
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["status"], "success")
        self.assertIn("If this email is registered", data["message"])
        self.assertNotIn("reset_token", data, "Raw reset token must never be in the response")

        # Dispatched in safe email service outbox
        token = email_service.get_latest_reset_token(self.registered_email)
        self.assertIsNotNone(token, "Reset token must be dispatched via email service")

    async def test_02_generic_response_for_unregistered_email(self):
        """2. Unregistered email returns identical generic response without leaking existence."""
        unregistered = "nonexistent_founder_99999@audit.com"
        res = await self.client.post("/auth/forgot-password", json={"email": unregistered})
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["status"], "success")
        self.assertIn("If this email is registered", data["message"])

        # No email dispatched
        token = email_service.get_latest_reset_token(unregistered)
        self.assertIsNone(token)

    async def test_03_raw_token_never_stored_in_database(self):
        """3. Database stores only the SHA-256 hash of the token, never the raw token."""
        await self.client.post("/auth/forgot-password", json={"email": self.registered_email})
        raw_token = email_service.get_latest_reset_token(self.registered_email)
        self.assertIsNotNone(raw_token)

        expected_hash = hash_token(raw_token)

        db: Session = SessionLocal()
        try:
            # Query for active token record
            token_rec = db.query(PasswordResetToken).filter(
                PasswordResetToken.user_id == self.user_id,
                PasswordResetToken.used == False,
            ).first()
            self.assertIsNotNone(token_rec)
            self.assertEqual(token_rec.token, expected_hash)
            self.assertNotEqual(token_rec.token, raw_token)
        finally:
            db.close()

    async def test_04_reset_token_expiration(self):
        """4. Expired reset tokens are rejected with HTTP 400 and marked as used."""
        import secrets
        db: Session = SessionLocal()
        raw_expired = f"expired_{secrets.token_urlsafe(20)}"
        expired_hash = hash_token(raw_expired)

        # Inject expired token
        exp_rec = PasswordResetToken(
            user_id=self.user_id,
            token=expired_hash,
            used=False,
            expires_at=datetime.utcnow() - timedelta(minutes=10),
        )
        db.add(exp_rec)
        db.commit()
        db.close()

        res = await self.client.post("/auth/reset-password", json={
            "token": raw_expired,
            "new_password": "ValidNewPassword123!",
        })
        self.assertEqual(res.status_code, 400)
        self.assertIn("expired", res.json().get("error") or res.json().get("detail", ""))

        # Check marked used
        db2: Session = SessionLocal()
        check_rec = db2.query(PasswordResetToken).filter(PasswordResetToken.token == expired_hash).first()
        self.assertTrue(check_rec.used)
        db2.close()

    async def test_05_invalid_token_rejection(self):
        """5. Non-existent or forged reset tokens are rejected with HTTP 400."""
        res = await self.client.post("/auth/reset-password", json={
            "token": "fake_forged_reset_token_xyz_12345",
            "new_password": "ValidNewPassword123!",
        })
        self.assertEqual(res.status_code, 400)
        err = res.json().get("error") or res.json().get("detail", "")
        self.assertIn("Invalid or already used", err)

    async def test_06_successful_password_reset(self):
        """6. Valid token successfully resets password, hashes new password, and marks token used."""
        await self.client.post("/auth/forgot-password", json={"email": self.registered_email})
        raw_token = email_service.get_latest_reset_token(self.registered_email)
        token_hash = hash_token(raw_token)

        new_pass = "CompletelyNewPassword123!"
        res = await self.client.post("/auth/reset-password", json={
            "token": raw_token,
            "new_password": new_pass,
        })
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()["status"], "success")

        # Verify DB updated
        db: Session = SessionLocal()
        u = db.query(User).filter(User.id == self.user_id).first()
        self.assertTrue(verify_password(new_pass, u.hashed_password))

        # Verify token marked used
        t = db.query(PasswordResetToken).filter(PasswordResetToken.token == token_hash).first()
        self.assertTrue(t.used)
        db.close()

    async def test_07_token_cannot_be_reused(self):
        """7. A used token cannot be reused for a subsequent password reset."""
        await self.client.post("/auth/forgot-password", json={"email": self.registered_email})
        raw_token = email_service.get_latest_reset_token(self.registered_email)

        # First use succeeds
        res1 = await self.client.post("/auth/reset-password", json={
            "token": raw_token,
            "new_password": "BrandNewPassword1!",
        })
        self.assertEqual(res1.status_code, 200)

        # Second use fails
        res2 = await self.client.post("/auth/reset-password", json={
            "token": raw_token,
            "new_password": "AnotherBrandNewPassword2!",
        })
        self.assertEqual(res2.status_code, 400)
        err = res2.json().get("error") or res2.json().get("detail", "")
        self.assertIn("Invalid or already used", err)

    async def test_08_previous_token_invalidated_after_new_request(self):
        """8. Requesting a new reset token immediately invalidates any previously active token."""
        # First request
        await self.client.post("/auth/forgot-password", json={"email": self.registered_email})
        token_1 = email_service.get_latest_reset_token(self.registered_email)

        # Second request
        await self.client.post("/auth/forgot-password", json={"email": self.registered_email})
        token_2 = email_service.get_latest_reset_token(self.registered_email)
        self.assertNotEqual(token_1, token_2)

        # Token 1 must now be invalidated
        res_old = await self.client.post("/auth/reset-password", json={
            "token": token_1,
            "new_password": "AttemptOldTokenPassword123!",
        })
        self.assertEqual(res_old.status_code, 400)

        # Token 2 must succeed
        res_new = await self.client.post("/auth/reset-password", json={
            "token": token_2,
            "new_password": "SuccessWithNewToken123!",
        })
        self.assertEqual(res_new.status_code, 200)

    async def test_09_password_policy_enforcement(self):
        """9. Passwords violating length, case, number, or special character rules are rejected."""
        await self.client.post("/auth/forgot-password", json={"email": self.registered_email})
        token = email_service.get_latest_reset_token(self.registered_email)

        invalid_passwords = [
            ("Short1!", "at least 8 characters"),
            ("alllowercase123!", "uppercase letter"),
            ("ALLUPPERCASE123!", "lowercase letter"),
            ("NoDigitsSpecial!", "at least one number"),
            ("NoSpecialChars123", "special character"),
        ]

        for bad_pass, expected_substr in invalid_passwords:
            res = await self.client.post("/auth/reset-password", json={
                "token": token,
                "new_password": bad_pass,
            })
            self.assertEqual(res.status_code, 400, f"Expected 400 for password: {bad_pass}")
            err = res.json().get("error") or res.json().get("detail", "")
            self.assertIn(expected_substr, err)

    async def test_10_rate_limiting(self):
        """10. Rapid successive requests for the same email or IP trigger HTTP 429."""
        recovery_limiter.clear()
        # Max per email is 3
        res1 = await self.client.post("/auth/forgot-password", json={"email": self.registered_email})
        self.assertEqual(res1.status_code, 200)

        res2 = await self.client.post("/auth/forgot-password", json={"email": self.registered_email})
        self.assertEqual(res2.status_code, 200)

        res3 = await self.client.post("/auth/forgot-password", json={"email": self.registered_email})
        self.assertEqual(res3.status_code, 200)

        # 4th request must be rate limited
        res4 = await self.client.post("/auth/forgot-password", json={"email": self.registered_email})
        self.assertEqual(res4.status_code, 429)
        err = res4.json().get("error") or res4.json().get("detail", "")
        self.assertIn("Too many password reset requests", err)

    async def test_11_email_delivery_failure_handling(self):
        """11. Email delivery provider failures are handled gracefully without exposing internal errors."""
        recovery_limiter.clear()
        email_service.set_simulate_failure(True)

        res = await self.client.post("/auth/forgot-password", json={"email": self.registered_email})
        # Server returns standard generic 200 without exposing internal failure
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()["status"], "success")

    async def test_12_existing_login_works_with_new_password(self):
        """12. After a reset, user can log in with their newly configured password."""
        recovery_limiter.clear()
        await self.client.post("/auth/forgot-password", json={"email": self.registered_email})
        raw_token = email_service.get_latest_reset_token(self.registered_email)

        final_new_password = "DefinitiveNewPassword2026!"
        res_reset = await self.client.post("/auth/reset-password", json={
            "token": raw_token,
            "new_password": final_new_password,
        })
        self.assertEqual(res_reset.status_code, 200)

        # Login with new password
        res_login = await self.client.post("/auth/login", json={
            "email": self.registered_email,
            "password": final_new_password,
        })
        self.assertEqual(res_login.status_code, 200)
        self.assertIn("access_token", res_login.json())

    async def test_13_old_password_no_longer_works(self):
        """13. Old password is confirmed inactive after successful reset."""
        res_old_login = await self.client.post("/auth/login", json={
            "email": self.registered_email,
            "password": self.original_password,
        })
        self.assertEqual(res_old_login.status_code, 401)

    async def test_14_unauthenticated_reset_attempts_handled_safely(self):
        """14. Reset endpoints do not require authorization headers and reject missing payloads safely."""
        res_empty = await self.client.post("/auth/reset-password", json={})
        self.assertEqual(res_empty.status_code, 422)

        res_blank_token = await self.client.post("/auth/reset-password", json={
            "token": "   ",
            "new_password": "SomeValidPassword123!",
        })
        self.assertEqual(res_blank_token.status_code, 400)


if __name__ == "__main__":
    unittest.main()
