import os
import sys
import logging
from typing import Optional, Dict, Any
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger("startup_cofounder.config")

# Known insecure and default secrets that must NEVER be used in production
INSECURE_SECRETS_BLACKLIST = {
    "your-secret-key-change-in-production",
    "billing-webhook-secret-production",
    "secret",
    "secret123",
    "secretkey",
    "secret_key",
    "jwt_secret",
    "jwt_secret_key",
    "changeme",
    "change-me",
    "change_in_production",
    "admin",
    "password",
    "12345678",
    "1234567890",
    "default_secret",
    "development_secret",
    "test_secret",
    "test",
    "dev",
}


class ConfigurationError(ValueError):
    """Raised when application security configuration fails validation."""
    pass


def is_insecure_secret(val: Optional[str]) -> bool:
    if not val:
        return True
    cleaned = val.strip().lower()
    if cleaned in INSECURE_SECRETS_BLACKLIST:
        return True
    if (
        "your-secret-key" in cleaned
        or "change-in-production" in cleaned
        or "billing-webhook-secret-production" in cleaned
    ):
        return True
    return False


def validate_configuration(
    environ: Optional[Dict[str, str]] = None,
    strict: Optional[bool] = None
) -> Dict[str, Any]:
    """
    Centralized configuration validation.
    Enforces strict security checks in production and safe handling in development/testing.
    Never exposes raw secrets in error messages or logs.
    """
    env = environ if environ is not None else os.environ
    raw_env_name = env.get("ENVIRONMENT", env.get("ENV", "development")).lower().strip()

    valid_environments = {"development", "dev", "test", "testing", "staging", "production", "prod"}
    if raw_env_name not in valid_environments:
        raise ConfigurationError(
            f"Invalid ENVIRONMENT '{raw_env_name}'. Must be one of: development, test, staging, production."
        )

    is_prod = raw_env_name in ("production", "prod") or (strict is True)
    jwt_secret = env.get("SECRET_KEY") or env.get("JWT_SECRET_KEY")
    billing_enabled = env.get("BILLING_ENABLED", "false").lower() in ("true", "1", "yes", "enabled")
    billing_secret = env.get("BILLING_WEBHOOK_SECRET")

    # 1. JWT Secret Validation
    if is_prod:
        if not jwt_secret or not jwt_secret.strip():
            raise ConfigurationError(
                "Missing required JWT secret in production. Set SECRET_KEY or JWT_SECRET_KEY."
            )
        if is_insecure_secret(jwt_secret):
            raise ConfigurationError(
                "Insecure default JWT secret detected. Production requires a unique, high-entropy secret."
            )
        if len(jwt_secret.strip()) < 32:
            raise ConfigurationError(
                "JWT secret is too weak. Production requires a minimum length of 32 characters."
            )

    # 2. Billing Webhook Secret Validation
    if is_prod and billing_enabled:
        if not billing_secret or not billing_secret.strip():
            raise ConfigurationError(
                "BILLING_WEBHOOK_SECRET is required when billing is enabled in production."
            )
        if is_insecure_secret(billing_secret):
            raise ConfigurationError(
                "Insecure default BILLING_WEBHOOK_SECRET detected. Production requires a unique secret."
            )
        if len(billing_secret.strip()) < 16:
            raise ConfigurationError(
                "BILLING_WEBHOOK_SECRET is too short. Minimum length of 16 characters required."
            )

    # 3. Algorithm Validation
    algorithm = env.get("ALGORITHM", "HS256").strip()
    if algorithm.lower() == "none" or algorithm.upper() not in ["HS256", "HS384", "HS512", "RS256"]:
        raise ConfigurationError(
            f"Insecure or unsupported JWT algorithm '{algorithm}'. HS256, HS384, HS512, or RS256 required."
        )

    return {
        "environment": raw_env_name,
        "is_production": is_prod,
        "jwt_secret_configured": bool(jwt_secret),
        "billing_enabled": billing_enabled,
        "billing_secret_configured": bool(billing_secret),
        "algorithm": algorithm
    }


GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Prefer persistent disk mount (Render mounts disk at /app/chroma_db or CHROMA_PATH)
chroma_path = os.getenv("CHROMA_PATH", "")
if os.path.exists("/app/chroma_db"):
    default_db_path = "/app/chroma_db/startup.db"
elif chroma_path and os.path.isdir(chroma_path):
    default_db_path = os.path.join(chroma_path, "startup.db")
else:
    default_db_path = os.path.join(BASE_DIR, "startup.db")

default_sqlite_url = f"sqlite:///{default_db_path.replace(os.sep, '/')}"

raw_db_url = os.getenv("DATABASE_URL")
if not raw_db_url or raw_db_url in ("sqlite:///./startup.db", "sqlite:///startup.db"):
    DATABASE_URL = default_sqlite_url
else:
    DATABASE_URL = raw_db_url

ENVIRONMENT = os.getenv("ENVIRONMENT", os.getenv("ENV", "development")).lower().strip()
IS_PRODUCTION = ENVIRONMENT in ("production", "prod")
IS_TESTING = ENVIRONMENT in ("test", "testing") or "pytest" in sys.modules or "unittest" in sys.modules

# JWT Secret Resolution
raw_jwt_secret = os.getenv("SECRET_KEY") or os.getenv("JWT_SECRET_KEY")
if raw_jwt_secret and raw_jwt_secret.strip():
    SECRET_KEY = raw_jwt_secret.strip()
elif IS_TESTING:
    SECRET_KEY = "test-jwt-secret-key-32-characters-long-safe-for-unit-tests"
elif not IS_PRODUCTION:
    SECRET_KEY = "dev-jwt-secret-key-32-characters-long-not-for-prod"
    logger.warning("Running with development JWT secret. Set SECRET_KEY in .env before deploying to production.")
else:
    SECRET_KEY = ""

# Billing Webhook Secret Resolution
BILLING_ENABLED = os.getenv("BILLING_ENABLED", "false").lower() in ("true", "1", "yes", "enabled")
raw_billing_secret = os.getenv("BILLING_WEBHOOK_SECRET")
if raw_billing_secret and raw_billing_secret.strip():
    BILLING_WEBHOOK_SECRET = raw_billing_secret.strip()
elif IS_TESTING:
    BILLING_WEBHOOK_SECRET = "test-billing-webhook-secret-key-32ch"
elif not IS_PRODUCTION:
    BILLING_WEBHOOK_SECRET = "dev-billing-webhook-secret-key-32ch"
else:
    BILLING_WEBHOOK_SECRET = ""

ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "10080"))
PASSWORD_RESET_TOKEN_EXPIRE_MINUTES = int(os.getenv("PASSWORD_RESET_TOKEN_EXPIRE_MINUTES", "15"))

# Stripe Provider Configuration
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET") or BILLING_WEBHOOK_SECRET

# In production, validate immediately on module load
if IS_PRODUCTION:
    validate_configuration()
