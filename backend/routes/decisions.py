from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import SessionLocal
from deps import get_current_user
from models.auth_models import User
from models.startup_models import Decision
from utils.logger import logger

router = APIRouter(prefix="/decisions", tags=["decisions"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class CreateDecisionRequest(BaseModel):
    title: str
    reason: Optional[str] = None
    category: Optional[str] = "STRATEGY"
    impact: Optional[str] = "HIGH"
    analysis_id: Optional[int] = None

@router.get("")
async def list_decisions(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Lists founder decisions scoped by authenticated user."""
    decisions = db.query(Decision).filter(Decision.user_id == current_user.id).order_by(Decision.created_at.desc()).all()
    return {
        "status": "success",
        "decisions": [
            {
                "id": d.id,
                "title": d.title,
                "reason": d.reason,
                "category": d.category,
                "impact": d.impact,
                "date": d.created_at.strftime("%b %d, %Y")
            }
            for d in decisions
        ]
    }

@router.post("")
async def create_decision(req: CreateDecisionRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Records a new founder decision."""
    if not req.title or not req.title.strip():
        raise HTTPException(status_code=400, detail="Decision title cannot be empty.")

    decision = Decision(
        user_id=current_user.id,
        analysis_id=req.analysis_id,
        title=req.title.strip(),
        reason=req.reason,
        category=req.category or "STRATEGY",
        impact=req.impact or "HIGH"
    )
    db.add(decision)
    db.commit()
    db.refresh(decision)

    return {
        "status": "success",
        "decision": {
            "id": decision.id,
            "title": decision.title,
            "reason": decision.reason,
            "category": decision.category,
            "impact": decision.impact,
            "date": decision.created_at.strftime("%b %d, %Y")
        }
    }

@router.delete("/{decision_id}")
async def delete_decision(decision_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Deletes a decision owned by authenticated user."""
    decision = db.query(Decision).filter(Decision.id == decision_id, Decision.user_id == current_user.id).first()
    if not decision:
        raise HTTPException(status_code=404, detail="Decision not found or access forbidden.")

    db.delete(decision)
    db.commit()
    return {"status": "success", "message": "Decision deleted."}
