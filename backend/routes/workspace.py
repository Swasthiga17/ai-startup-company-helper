import json
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import SessionLocal
from deps import get_current_user_optional
from models.auth_models import Analysis
from utils.logger import logger

router = APIRouter(prefix="/workspaces", tags=["workspaces"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class CreateWorkspaceRequest(BaseModel):
    name: str
    idea: str


@router.get("")
async def list_workspaces(current_user=Depends(get_current_user_optional), db: Session = Depends(get_db)):
    if not current_user:
        # Return fallback demo projects if unauthenticated
        return {
            "status": "success",
            "workspaces": [
                {
                    "id": 1,
                    "title": "IdeaExecutor AI",
                    "idea": "AI Startup Operating System",
                    "createdAt": "2026-08-05T00:00:00Z"
                }
            ]
        }
    
    analyses = db.query(Analysis).filter(Analysis.user_id == current_user.id).order_by(Analysis.created_at.desc()).all()
    res = []
    for a in analyses:
        res.append({
            "id": a.id,
            "title": a.idea[:30] + ("..." if len(a.idea) > 30 else ""),
            "idea": a.idea,
            "createdAt": a.created_at.isoformat() if a.created_at else ""
        })
    return {"status": "success", "workspaces": res}


@router.delete("/{workspace_id}")
async def delete_workspace(workspace_id: int, current_user=Depends(get_current_user_optional), db: Session = Depends(get_db)):
    if not current_user:
        return {"status": "success", "message": "Demo workspace removed"}
        
    analysis = db.query(Analysis).filter(Analysis.id == workspace_id, Analysis.user_id == current_user.id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Workspace not found")
        
    db.delete(analysis)
    db.commit()
    return {"status": "success", "message": f"Workspace {workspace_id} deleted"}
