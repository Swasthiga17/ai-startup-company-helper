import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.6-flash")
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
default_db_path = os.path.join(BASE_DIR, "startup.db")
default_sqlite_url = f"sqlite:///{default_db_path.replace(os.sep, '/')}"

raw_db_url = os.getenv("DATABASE_URL")
if not raw_db_url or raw_db_url in ("sqlite:///./startup.db", "sqlite:///startup.db"):
    DATABASE_URL = default_sqlite_url
else:
    DATABASE_URL = raw_db_url
SECRET_KEY = os.getenv("SECRET_KEY") or os.getenv("JWT_SECRET_KEY") or "your-secret-key-change-in-production"
BILLING_WEBHOOK_SECRET = os.getenv("BILLING_WEBHOOK_SECRET", "billing-webhook-secret-production")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "10080"))

