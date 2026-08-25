from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from database import SessionLocal
from deps import get_current_user
from models.startup_timeline import TimelineEvent
from utils.logger import logger

router = APIRouter(prefix="/timeline", tags=["timeline"])

class CreateTimelineEventRequest(BaseModel):
    event_type: str
    title: str
    description: str = ""
    impact_level: str = "MEDIUM"
    health_delta: int = 0

@router.get("")
async def get_timeline_events(current_user=Depends(get_current_user)):
    db: Session = SessionLocal()
    try:
        events = db.query(TimelineEvent).filter(TimelineEvent.user_id == current_user.id).order_by(TimelineEvent.created_at.desc()).all()
        return {
            "events": [
                {
                    "id": ev.id,
                    "event_type": ev.event_type,
                    "title": ev.title,
                    "description": ev.description,
                    "impact_level": ev.impact_level,
                    "health_delta": ev.health_delta,
                    "date": ev.created_at.strftime("%b %d, %Y")
                }
                for ev in events
            ]
        }
    finally:
        db.close()

@router.post("/events")
async def create_timeline_event(req: CreateTimelineEventRequest, current_user=Depends(get_current_user)):
    db: Session = SessionLocal()
    try:
        ev = TimelineEvent(
            user_id=current_user.id,
            event_type=req.event_type,
            title=req.title,
            description=req.description,
            impact_level=req.impact_level,
            health_delta=req.health_delta
        )
        db.add(ev)
        db.commit()
        db.refresh(ev)
        return {"event": {
            "id": ev.id,
            "event_type": ev.event_type,
            "title": ev.title,
            "description": ev.description,
            "impact_level": ev.impact_level,
            "health_delta": ev.health_delta,
            "date": ev.created_at.strftime("%b %d, %Y")
        }}
    finally:
        db.close()
