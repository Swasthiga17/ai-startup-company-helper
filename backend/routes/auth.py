from __future__ import annotations

from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
import bcrypt
from jose import jwt, JWTError

import os
import secrets
from database import SessionLocal
from config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
from models.auth_models import User, PasswordResetToken
from utils.logger import logger

router = APIRouter(prefix="/auth", tags=["auth"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserPublic(BaseModel):
    id: int
    name: str
    email: EmailStr


def hash_password(password: str) -> str:
    passwd_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(passwd_bytes, salt)
    return hashed.decode('utf-8')


def verify_password(password: str, hashed_password: str) -> bool:
    try:
        passwd_bytes = password.encode('utf-8')
        hashed_bytes = hashed_password.encode('utf-8')
        return bcrypt.checkpw(passwd_bytes, hashed_bytes)
    except Exception:
        return False


from typing import Optional

def create_access_token(subject: str, expires_delta: Optional[timedelta] = None) -> str:
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode = {"sub": str(subject), "exp": expire}
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)



def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.id == int(user_id)).first()
    if user is None:
        raise credentials_exception
    return user


@router.post("/register", response_model=TokenResponse)
async def register(req: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == req.email.lower()).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(name=req.name, email=req.email.lower(), hashed_password=hash_password(req.password))
    db.add(user)
    db.commit()
    db.refresh(user)

    access_token = create_access_token(subject=str(user.id))
    return TokenResponse(access_token=access_token)


@router.post("/login", response_model=TokenResponse)
async def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email.lower()).first()
    if not user or not verify_password(req.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = create_access_token(subject=str(user.id))
    return TokenResponse(access_token=access_token)


@router.get("/me", response_model=UserPublic)
async def me(current_user: User = Depends(get_current_user)):
    return UserPublic(id=current_user.id, name=current_user.name, email=current_user.email)


from fastapi import Request
import hashlib
import time
from collections import defaultdict
from config import PASSWORD_RESET_TOKEN_EXPIRE_MINUTES
from services.email_service import email_service


class PasswordRecoveryRateLimiter:
    """Sliding-window rate limiter for forgot-password requests by IP and email."""

    def __init__(self, max_per_ip: int = 5, max_per_email: int = 3, window_seconds: int = 900):
        self.max_per_ip = max_per_ip
        self.max_per_email = max_per_email
        self.window_seconds = window_seconds
        self.ip_timestamps: dict[str, list[float]] = defaultdict(list)
        self.email_timestamps: dict[str, list[float]] = defaultdict(list)

    def check_and_record(self, ip: str, email: str) -> bool:
        now = time.time()
        cutoff = now - self.window_seconds

        self.ip_timestamps[ip] = [t for t in self.ip_timestamps[ip] if t > cutoff]
        self.email_timestamps[email] = [t for t in self.email_timestamps[email] if t > cutoff]

        if len(self.ip_timestamps[ip]) >= self.max_per_ip:
            return False
        if len(self.email_timestamps[email]) >= self.max_per_email:
            return False

        self.ip_timestamps[ip].append(now)
        self.email_timestamps[email].append(now)
        return True

    def clear(self):
        self.ip_timestamps.clear()
        self.email_timestamps.clear()


recovery_limiter = PasswordRecoveryRateLimiter()


def hash_token(raw_token: str) -> str:
    """Cryptographic SHA-256 hash of token to prevent plaintext storage in DB."""
    return hashlib.sha256(raw_token.strip().encode("utf-8")).hexdigest()


def validate_password_policy(password: str) -> None:
    """Enforces strong password policy (min 8 chars, upper, lower, digit, special)."""
    if len(password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters long.")
    if not any(c.isupper() for c in password):
        raise HTTPException(status_code=400, detail="Password must contain at least one uppercase letter.")
    if not any(c.islower() for c in password):
        raise HTTPException(status_code=400, detail="Password must contain at least one lowercase letter.")
    if not any(c.isdigit() for c in password):
        raise HTTPException(status_code=400, detail="Password must contain at least one number.")
    special_chars = "!@#$%^&*()-_=+[]{}|;:,.<>?/~`"
    if not any(c in special_chars for c in password):
        raise HTTPException(status_code=400, detail="Password must contain at least one special character.")


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


@router.post("/forgot-password")
async def forgot_password(req: ForgotPasswordRequest, request: Request, db: Session = Depends(get_db)):
    """
    Initiates password recovery.
    Always returns identical generic response to prevent account enumeration.
    Never exposes raw tokens in the response or logs.
    """
    client_ip = request.headers.get("X-Forwarded-For") or (request.client.host if request.client else "127.0.0.1")
    if "," in client_ip:
        client_ip = client_ip.split(",")[0].strip()

    normalized_email = req.email.lower().strip()

    # Rate limiting protection against flooding / brute force
    if not recovery_limiter.check_and_record(client_ip, normalized_email):
        logger.warning(f"Password reset rate limit exceeded for client")
        raise HTTPException(
            status_code=429,
            detail="Too many password reset requests. Please wait a few minutes before trying again."
        )

    user = db.query(User).filter(User.email == normalized_email).first()
    if user:
        # Invalidate any previous active tokens for this user
        db.query(PasswordResetToken).filter(
            PasswordResetToken.user_id == user.id,
            PasswordResetToken.used == False
        ).update({"used": True})

        # Generate cryptographically secure random token
        raw_token = secrets.token_urlsafe(32)
        token_hash = hash_token(raw_token)
        expires_at = datetime.utcnow() + timedelta(minutes=PASSWORD_RESET_TOKEN_EXPIRE_MINUTES)

        reset_token_rec = PasswordResetToken(
            user_id=user.id,
            token=token_hash,  # Store only the SHA-256 hash in database
            used=False,
            expires_at=expires_at
        )
        db.add(reset_token_rec)
        db.commit()

        # Dispatch reset email
        email_sent = email_service.send_password_reset_email(user.email, raw_token)
        if not email_sent:
            logger.error(f"Failed to dispatch password reset email for user {user.id}")

        logger.info(f"Password reset initiated for user {user.id}")
    else:
        logger.info(f"Password reset requested for unregistered email")

    # Generic response: Always return identical response whether email exists or not
    return {
        "status": "success",
        "message": "If this email is registered, you will receive a reset link shortly."
    }


@router.post("/reset-password")
async def reset_password(req: ResetPasswordRequest, db: Session = Depends(get_db)):
    """
    Validates token hash, checks expiration, enforces password policy,
    updates hashed password, and invalidates token.
    """
    if not req.token or not req.token.strip():
        raise HTTPException(status_code=400, detail="Password reset token is required.")

    # Enforce password policy
    validate_password_policy(req.new_password)

    token_hash = hash_token(req.token)

    token_record = db.query(PasswordResetToken).filter(
        PasswordResetToken.token == token_hash,
        PasswordResetToken.used == False
    ).first()

    if not token_record:
        raise HTTPException(status_code=400, detail="Invalid or already used password reset token.")

    if token_record.expires_at < datetime.utcnow():
        token_record.used = True
        db.commit()
        raise HTTPException(status_code=400, detail="Password reset token has expired.")

    user = db.query(User).filter(User.id == token_record.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User account not found.")

    user.hashed_password = hash_password(req.new_password)
    token_record.used = True
    db.commit()

    logger.info(f"Password successfully reset for user {user.id}")
    return {
        "status": "success",
        "message": "Password successfully updated. You may now log in with your new password."
    }



class GoogleAuthRequest(BaseModel):
    access_token: str


@router.post("/google", response_model=TokenResponse)
async def google_auth(req: GoogleAuthRequest, db: Session = Depends(get_db)):
    """
    Verify a Google OAuth access token, then find or create the user and
    return an application JWT.
    """
    import httpx

    # Fetch the Google user profile using the access token
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(
                "https://www.googleapis.com/oauth2/v3/userinfo",
                headers={"Authorization": f"Bearer {req.access_token}"},
                timeout=10,
            )
    except Exception:
        raise HTTPException(status_code=503, detail="Could not reach Google servers. Check your connection.")

    if resp.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid Google token. Please sign in with Google again.")

    profile = resp.json()
    google_email: str = profile.get("email", "").lower()
    google_name: str = profile.get("name") or profile.get("given_name") or google_email.split("@")[0]

    if not google_email:
        raise HTTPException(status_code=400, detail="Google account has no email address.")

    # Find existing user or create a new one (no password needed for Google users)
    user = db.query(User).filter(User.email == google_email).first()
    if not user:
        import secrets
        # Create account with a random secure password (user will never need it)
        dummy_password = secrets.token_hex(32)
        user = User(
            name=google_name,
            email=google_email,
            hashed_password=hash_password(dummy_password),
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        logger.info(f"New user registered via Google: {google_email}")
    else:
        logger.info(f"Existing user signed in via Google: {google_email}")

    access_token = create_access_token(subject=str(user.id))
    return TokenResponse(access_token=access_token)


@router.post("/logout")
async def logout():
    # Token invalidation requires a blacklist/rotation strategy.
    # For now, client just discards the token.
    return {"status": "ok"}


