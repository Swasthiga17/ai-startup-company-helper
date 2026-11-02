import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Optional, List, Dict
from utils.logger import logger


class EmailService:
    """Production-ready configurable email delivery service with development/test outbox fallback."""

    def __init__(self):
        self.outbox: List[Dict[str, str]] = []
        self._simulate_failure: bool = False

    def set_simulate_failure(self, simulate: bool):
        """Allows testing email provider failure handling."""
        self._simulate_failure = simulate

    def clear_outbox(self):
        """Clears in-memory development outbox."""
        self.outbox.clear()

    def get_latest_reset_token(self, email: str) -> Optional[str]:
        """Helper for test environments to inspect dispatched token from safe outbox."""
        target = email.lower().strip()
        for msg in reversed(self.outbox):
            if msg.get("to") == target:
                return msg.get("reset_token")
        return None

    def send_password_reset_email(self, recipient_email: str, reset_token: str) -> bool:
        """
        Dispatches password reset instructions via SMTP in production,
        or captures into secure outbox in development/test.
        Never logs raw tokens or links.
        """
        if self._simulate_failure:
            logger.error(f"Simulated email delivery failure for recipient")
            return False

        frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173").rstrip("/")
        reset_link = f"{frontend_url}/#/reset-password?token={reset_token}"

        # Record in development/test outbox
        self.outbox.append({
            "to": recipient_email.lower().strip(),
            "reset_token": reset_token,
            "reset_link": reset_link,
        })

        smtp_host = os.getenv("SMTP_HOST")
        smtp_port = int(os.getenv("SMTP_PORT", "587"))
        smtp_user = os.getenv("SMTP_USER")
        smtp_pass = os.getenv("SMTP_PASSWORD")
        smtp_tls = os.getenv("SMTP_TLS", "true").lower() in ("true", "1", "yes")
        email_from = os.getenv("EMAIL_FROM", "IdeaExecutor Security <noreply@ideaexecutor.ai>")

        # If SMTP is configured, attempt delivery
        if smtp_host and smtp_user and smtp_pass:
            try:
                msg = MIMEMultipart("alternative")
                msg["Subject"] = "IdeaExecutor: Reset Your Password"
                msg["From"] = email_from
                msg["To"] = recipient_email

                text_content = (
                    "Hello,\n\n"
                    "We received a request to reset your IdeaExecutor password. "
                    "Click the link below to set a new password:\n\n"
                    f"{reset_link}\n\n"
                    "This link is valid for 15 minutes and can only be used once.\n"
                    "If you did not request this, you can safely ignore this email.\n\n"
                    "— The IdeaExecutor Security Team"
                )

                html_content = f"""
                <div style="font-family: Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; border: 1px solid #fce7f3; border-radius: 16px; background-color: #ffffff;">
                    <div style="text-align: center; margin-bottom: 24px;">
                        <h2 style="color: #0f172a; margin: 0;">IdeaExecutor</h2>
                        <p style="color: #ff4fa3; font-weight: bold; font-size: 13px; margin: 4px 0 0 0;">Password Recovery Request</p>
                    </div>
                    <p style="color: #334155; font-size: 14px; line-height: 1.6;">Hello,</p>
                    <p style="color: #334155; font-size: 14px; line-height: 1.6;">
                        We received a request to reset your password. Click the button below to choose a new password:
                    </p>
                    <div style="text-align: center; margin: 32px 0;">
                        <a href="{reset_link}" style="background: linear-gradient(135deg, #ff4fa3, #e6006f); color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 9999px; font-weight: bold; font-size: 14px; display: inline-block;">
                            Reset My Password
                        </a>
                    </div>
                    <p style="color: #64748b; font-size: 12px; line-height: 1.5;">
                        This password reset link expires in 15 minutes and can only be used once.<br/>
                        If you did not initiate this request, no action is needed and your account remains secure.
                    </p>
                    <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 24px 0;" />
                    <p style="color: #94a3b8; font-size: 11px; text-align: center;">
                        © IdeaExecutor AI. All rights reserved.
                    </p>
                </div>
                """

                msg.attach(MIMEText(text_content, "plain"))
                msg.attach(MIMEText(html_content, "html"))

                if smtp_port == 465:
                    with smtplib.SMTP_SSL(smtp_host, smtp_port, timeout=10) as server:
                        server.login(smtp_user, smtp_pass)
                        server.sendmail(email_from, [recipient_email], msg.as_string())
                else:
                    with smtplib.SMTP(smtp_host, smtp_port, timeout=10) as server:
                        if smtp_tls:
                            server.starttls()
                        server.login(smtp_user, smtp_pass)
                        server.sendmail(email_from, [recipient_email], msg.as_string())

                logger.info(f"Password reset email sent to recipient")
                return True
            except Exception as e:
                logger.error(f"Failed to dispatch password reset email: {e}")
                return False

        # In development/test mode without SMTP configured, safe outbox capture is used
        logger.info(f"Password reset email queued in development outbox for recipient")
        return True


email_service = EmailService()
