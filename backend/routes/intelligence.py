from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import SessionLocal
from deps import get_current_user
from models.auth_models import User
from services.intelligence_service import intelligence_service

router = APIRouter(prefix="/intelligence", tags=["intelligence"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/morning-brief")
async def get_morning_brief(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Returns personalized AI Co-Founder Morning Brief."""
    data = intelligence_service.get_morning_brief(db, current_user.id)
    return {"status": "success", "data": data}

@router.get("/scorecard")
async def get_scorecard(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Returns multi-metric Founder Execution Scorecard."""
    data = intelligence_service.get_scorecard(db, current_user.id)
    return {"status": "success", "data": data}

@router.get("/market-watch")
async def get_market_watch(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Returns real-time Market Watch intelligence signals."""
    data = intelligence_service.get_market_watch(db, current_user.id)
    return {"status": "success", "data": data}

@router.get("/daily-plan")
async def get_daily_plan(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Returns dynamic Founder Daily Plan."""
    data = intelligence_service.get_daily_plan(db, current_user.id)
    return {"status": "success", "data": data}
