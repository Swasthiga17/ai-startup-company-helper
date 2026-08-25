from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from database import SessionLocal
from deps import get_current_user
from models.interview_model import FounderInterview
from services.pmf_service import pmf_service

router = APIRouter(prefix="/pmf", tags=["pmf"])

class SubmitInterviewRequest(BaseModel):
    problem_solved: str = "Validate AI startup idea"
    best_feature: str = "AI Decision Center"
    inaccurate_result: Optional[str] = None
    acted_recommendation: Optional[str] = "Interview 20 customers"
    alternative_used: str = "Spreadsheets & ChatGPT"
    reuse_intent: bool = True
    willingness_to_pay: bool = True
    indispensable_feature: str = "Evidence-Backed Research & Live Market Watch"

@router.get("/metrics")
async def get_pmf_metrics(current_user=Depends(get_current_user)):
    return pmf_service.calculate_pmf_metrics()

@router.get("/pricing")
async def get_pricing(current_user=Depends(get_current_user)):
    return {"tiers": pmf_service.get_pricing_tiers()}

@router.post("/interviews")
async def submit_interview(req: SubmitInterviewRequest, current_user=Depends(get_current_user)):
    db: Session = SessionLocal()
    try:
        iv = FounderInterview(
            user_id=current_user.id,
            problem_solved=req.problem_solved,
            best_feature=req.best_feature,
            inaccurate_result=req.inaccurate_result,
            acted_recommendation=req.acted_recommendation,
            alternative_used=req.alternative_used,
            reuse_intent=req.reuse_intent,
            willingness_to_pay=req.willingness_to_pay,
            indispensable_feature=req.indispensable_feature
        )
        db.add(iv)
        db.commit()
        db.refresh(iv)
        return {
            "success": True,
            "message": "Founder interview response logged successfully.",
            "interview_id": iv.id
        }
    finally:
        db.close()

@router.get("/interviews")
async def get_interviews(current_user=Depends(get_current_user)):
    db: Session = SessionLocal()
    try:
        ivs = db.query(FounderInterview).all()
        return {
            "total_interviews": len(ivs),
            "interviews": [
                {
                    "id": i.id,
                    "best_feature": i.best_feature,
                    "reuse_intent": i.reuse_intent,
                    "willingness_to_pay": i.willingness_to_pay,
                    "indispensable_feature": i.indispensable_feature
                }
                for i in ivs
            ]
        }
    finally:
        db.close()
