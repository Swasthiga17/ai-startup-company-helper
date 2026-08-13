from __future__ import annotations
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import SessionLocal
from deps import get_current_user_optional, get_current_user
from models.startup_models import StartupProfile, StartupTask, StartupSignal
from models.briefing_models import AIRecommendationModel, DailyBriefing
from services.startup_context import get_startup_context
from services.signal_engine import run_signal_engine
from services.recommendation_service import generate_ai_recommendations, generate_daily_briefing
from utils.logger import logger

router = APIRouter(prefix="/startup/intelligence", tags=["startup-intelligence"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def _get_profile(db: Session, user_id: int) -> StartupProfile:
    profile = db.query(StartupProfile).filter(StartupProfile.user_id == user_id).first()
    if not profile:
        from routes.startup import _get_or_create_profile
        profile = _get_or_create_profile(db, user_id)
    return profile


@router.get("/briefing")
async def get_briefing(current_user=Depends(get_current_user_optional), db: Session = Depends(get_db)):
    if not current_user:
        return {
            "status": "success",
            "briefing": {
                "date": "2026-08-13",
                "summary": "AI Co-Founder briefing: Focus today on customer problem validation.",
                "recommendation": "Lock initial MVP scope to 3 core features and validate pricing model.",
                "action_prompt": "What should I work on today?"
            }
        }
    profile = _get_profile(db, current_user.id)
    briefing = generate_daily_briefing(db, profile.id)
    return {
        "status": "success",
        "briefing": {
            "id": briefing.id,
            "date": briefing.date_str,
            "summary": briefing.summary,
            "recommendation": briefing.recommendation,
            "action_prompt": briefing.action_prompt
        }
    }


@router.get("/signals")
async def get_signals(current_user=Depends(get_current_user_optional), db: Session = Depends(get_db)):
    if not current_user:
        return {
            "status": "success",
            "signals": [
                {"id": 1, "title": "Competitor Price Drop", "severity": "HIGH", "message": "Competitor X reduced tier pricing by 20%.", "recommendation": "Run What-If Simulator on pricing."},
                {"id": 2, "title": "Market Research Outdated", "severity": "MEDIUM", "message": "Competitor analysis is 14 days old.", "recommendation": "Re-run Competitor Agent."}
            ]
        }
    profile = _get_profile(db, current_user.id)
    run_signal_engine(db, profile.id)
    signals = db.query(StartupSignal).filter(StartupSignal.startup_id == profile.id, StartupSignal.resolved == False).all()
    return {
        "status": "success",
        "signals": [
            {
                "id": s.id,
                "title": s.title,
                "severity": s.severity,
                "message": s.message,
                "recommendation": s.recommendation,
                "action_type": s.action_type
            } for s in signals
        ]
    }


@router.get("/recommendations")
async def list_recommendations(current_user=Depends(get_current_user_optional), db: Session = Depends(get_db)):
    if not current_user:
        return {
            "status": "success",
            "recommendations": [
                {
                    "id": 1,
                    "agent_name": "Product Manager Agent",
                    "category": "PRODUCT",
                    "title": "Lock MVP Release to 3 Core Features",
                    "description": "Reduce initial MVP feature roadmap to core problem validation.",
                    "priority": "HIGH",
                    "confidence_score": 92.0,
                    "status": "PENDING"
                }
            ]
        }
    profile = _get_profile(db, current_user.id)
    recs = generate_ai_recommendations(db, profile.id)
    return {
        "status": "success",
        "recommendations": [
            {
                "id": r.id,
                "agent_name": r.agent_name,
                "category": r.category,
                "title": r.title,
                "description": r.description,
                "rationale": r.rationale,
                "priority": r.priority,
                "confidence_score": r.confidence_score,
                "status": r.status
            } for r in recs if r.status == "PENDING"
        ]
    }


@router.post("/recommendations/{rec_id}/approve")
async def approve_recommendation(rec_id: int, current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    profile = _get_profile(db, current_user.id)
    rec = db.query(AIRecommendationModel).filter(
        AIRecommendationModel.id == rec_id,
        AIRecommendationModel.startup_id == profile.id
    ).first()
    if not rec:
        raise HTTPException(status_code=404, detail="Recommendation not found")

    rec.status = "APPROVED"
    # Convert AI Recommendation into an Actionable Task!
    task = StartupTask(
        startup_id=profile.id,
        title=rec.title,
        description=rec.description,
        priority=rec.priority,
        status="TODO",
        ai_generated=True,
        ai_recommendation_reason=rec.rationale or f"Approved recommendation from {rec.agent_name}",
        due_date="This Week"
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return {"status": "success", "message": "Recommendation approved and converted to task", "task_id": task.id}


@router.post("/recommendations/{rec_id}/reject")
async def reject_recommendation(rec_id: int, current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    profile = _get_profile(db, current_user.id)
    rec = db.query(AIRecommendationModel).filter(
        AIRecommendationModel.id == rec_id,
        AIRecommendationModel.startup_id == profile.id
    ).first()
    if not rec:
        raise HTTPException(status_code=404, detail="Recommendation not found")

    rec.status = "REJECTED"
    db.commit()
    return {"status": "success", "message": "Recommendation rejected"}
