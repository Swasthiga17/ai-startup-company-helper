from __future__ import annotations

from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
import bcrypt
from jose import jwt, JWTError

from database import SessionLocal
from config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
from models.auth_models import User
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


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


@router.post("/forgot-password")
async def forgot_password(req: ForgotPasswordRequest):
    # Simulated password reset
    return {"message": "If this email is registered, you will receive a reset link shortly."}


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


