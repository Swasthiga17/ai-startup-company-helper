from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import SessionLocal
from deps import get_current_user
from models.auth_models import User
from models.startup_models import Experiment
from utils.logger import logger

router = APIRouter(prefix="/experiments", tags=["experiments"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class CreateExperimentRequest(BaseModel):
    hypothesis: str
    task: str
    success_criteria: str
    analysis_id: Optional[int] = None

class UpdateExperimentRequest(BaseModel):
    status: Optional[str] = None # IN_PROGRESS / VALIDATED / INVALIDATED
    results: Optional[str] = None
    ai_conclusion: Optional[str] = None

@router.get("")
async def list_experiments(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Lists startup validation experiments scoped by user."""
    experiments = db.query(Experiment).filter(Experiment.user_id == current_user.id).order_by(Experiment.created_at.desc()).all()
    return {
        "status": "success",
        "experiments": [
            {
                "id": e.id,
                "hypothesis": e.hypothesis,
                "task": e.task,
                "success_criteria": e.success_criteria,
                "status": e.status,
                "results": e.results,
                "ai_conclusion": e.ai_conclusion,
                "date": e.created_at.strftime("%b %d, %Y")
            }
            for e in experiments
        ]
    }

@router.post("")
async def create_experiment(req: CreateExperimentRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Creates a new validation experiment."""
    if not req.hypothesis or not req.hypothesis.strip():
        raise HTTPException(status_code=400, detail="Experiment hypothesis cannot be empty.")

    experiment = Experiment(
        user_id=current_user.id,
        analysis_id=req.analysis_id,
        hypothesis=req.hypothesis.strip(),
        task=req.task,
        success_criteria=req.success_criteria,
        status="IN_PROGRESS"
    )
    db.add(experiment)
    db.commit()
    db.refresh(experiment)

    return {
        "status": "success",
        "experiment": {
            "id": experiment.id,
            "hypothesis": experiment.hypothesis,
            "task": experiment.task,
            "success_criteria": experiment.success_criteria,
            "status": experiment.status,
            "results": experiment.results,
            "ai_conclusion": experiment.ai_conclusion,
            "date": experiment.created_at.strftime("%b %d, %Y")
        }
    }

@router.patch("/{experiment_id}")
async def update_experiment(experiment_id: int, req: UpdateExperimentRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Updates an experiment status, results, or AI conclusion."""
    experiment = db.query(Experiment).filter(Experiment.id == experiment_id, Experiment.user_id == current_user.id).first()
    if not experiment:
        raise HTTPException(status_code=404, detail="Experiment not found or access forbidden.")

    if req.status:
        experiment.status = req.status.upper()
    if req.results:
        experiment.results = req.results
    if req.ai_conclusion:
        experiment.ai_conclusion = req.ai_conclusion

    db.commit()
    db.refresh(experiment)

    return {
        "status": "success",
        "experiment": {
            "id": experiment.id,
            "hypothesis": experiment.hypothesis,
            "task": experiment.task,
            "success_criteria": experiment.success_criteria,
            "status": experiment.status,
            "results": experiment.results,
            "ai_conclusion": experiment.ai_conclusion,
            "date": experiment.created_at.strftime("%b %d, %Y")
        }
    }

@router.delete("/{experiment_id}")
async def delete_experiment(experiment_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Deletes an experiment owned by authenticated user."""
    experiment = db.query(Experiment).filter(Experiment.id == experiment_id, Experiment.user_id == current_user.id).first()
    if not experiment:
        raise HTTPException(status_code=404, detail="Experiment not found or access forbidden.")

    db.delete(experiment)
    db.commit()
    return {"status": "success", "message": "Experiment deleted."}
