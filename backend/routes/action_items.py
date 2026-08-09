import json
from datetime import datetime
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import SessionLocal
from deps import get_current_user
from models.auth_models import ActionItem, User
from utils.logger import logger

router = APIRouter(prefix="/action-items", tags=["action-items"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class CreateActionItemRequest(BaseModel):
    title: str
    description: Optional[str] = None
    category: Optional[str] = "VALIDATION"
    priority: Optional[str] = "HIGH"
    reason: Optional[str] = None
    analysis_id: Optional[int] = None


class UpdateActionItemRequest(BaseModel):
    status: Optional[str] = None  # TODO / IN_PROGRESS / COMPLETED / ARCHIVED
    priority: Optional[str] = None  # LOW / MEDIUM / HIGH / CRITICAL
    category: Optional[str] = None
    title: Optional[str] = None


@router.get("")
async def list_action_items(
    status: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieves authenticated user action items with filtering and non-hardcoded task counters."""
    query = db.query(ActionItem).filter(ActionItem.user_id == current_user.id)

    if status:
        query = query.filter(ActionItem.status == status.upper())
    if priority:
        query = query.filter(ActionItem.priority == priority.upper())
    if category:
        query = query.filter(ActionItem.category == category.upper())

    items = query.order_by(ActionItem.created_at.desc()).all()

    # Calculate real non-hardcoded task counters for authenticated user
    all_user_items = db.query(ActionItem).filter(ActionItem.user_id == current_user.id).all()
    counters = {
        "total": len(all_user_items),
        "todo": sum(1 for i in all_user_items if i.status == "TODO"),
        "in_progress": sum(1 for i in all_user_items if i.status == "IN_PROGRESS"),
        "completed": sum(1 for i in all_user_items if i.status == "COMPLETED"),
        "high_priority": sum(1 for i in all_user_items if i.priority in ["HIGH", "CRITICAL"])
    }

    return {
        "status": "success",
        "counters": counters,
        "items": [
            {
                "id": item.id,
                "user_id": item.user_id,
                "analysis_id": item.analysis_id,
                "title": item.title,
                "description": item.description or item.reason or "",
                "category": item.category or "VALIDATION",
                "priority": item.priority or "HIGH",
                "reason": item.reason or "",
                "status": item.status or "TODO",
                "source_agent": item.source_agent or "IdeaAgent",
                "confidence_score": item.confidence_score or 85.0,
                "verification_status": item.verification_status or "SUPPORTED",
                "source_references": json.loads(item.source_references or "[]"),
                "created_at": item.created_at.isoformat() if item.created_at else "",
                "updated_at": item.updated_at.isoformat() if item.updated_at else "",
                "completed_at": item.completed_at.isoformat() if item.completed_at else None
            }
            for item in items
        ]
    }


@router.post("")
async def create_action_item(
    req: CreateActionItemRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Manually creates an action item owned by current_user."""
    if not req.title or not req.title.strip():
        raise HTTPException(status_code=400, detail="Action item title cannot be empty")

    item = ActionItem(
        user_id=current_user.id,
        analysis_id=req.analysis_id,
        title=req.title.strip(),
        description=req.description or req.reason or "Manually added task",
        category=(req.category or "VALIDATION").upper(),
        priority=(req.priority or "HIGH").upper(),
        reason=req.reason or req.description,
        status="TODO",
        source_agent="User",
        confidence_score=100.0,
        verification_status="VERIFIED",
        source_references="[]"
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return {"status": "success", "item": {"id": item.id, "title": item.title, "status": item.status}}


@router.patch("/{item_id}")
async def update_action_item(
    item_id: int,
    req: UpdateActionItemRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Updates action item status/priority with completion timestamp handling."""
    item = db.query(ActionItem).filter(ActionItem.id == item_id, ActionItem.user_id == current_user.id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Action item not found or unauthorized access")

    if req.status is not None:
        new_status = req.status.upper()
        if new_status == "COMPLETED" and item.status != "COMPLETED":
            item.completed_at = datetime.utcnow()
        elif new_status == "TODO" and item.status == "COMPLETED":
            item.completed_at = None
        item.status = new_status

    if req.priority is not None:
        item.priority = req.priority.upper()

    if req.category is not None:
        item.category = req.category.upper()

    if req.title is not None and req.title.strip():
        item.title = req.title.strip()

    item.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(item)

    return {
        "status": "success",
        "item": {
            "id": item.id,
            "title": item.title,
            "status": item.status,
            "priority": item.priority,
            "completed_at": item.completed_at.isoformat() if item.completed_at else None
        }
    }


@router.delete("/{item_id}")
async def delete_action_item(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Deletes an action item owned by current_user."""
    item = db.query(ActionItem).filter(ActionItem.id == item_id, ActionItem.user_id == current_user.id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Action item not found or unauthorized access")

    db.delete(item)
    db.commit()
    return {"status": "success", "message": "Action item deleted successfully"}
