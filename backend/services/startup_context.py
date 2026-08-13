from __future__ import annotations
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from models.startup_models import StartupProfile, StartupGoal, StartupTask, StartupSignal

def get_startup_context(db: Session, startup_id: int) -> Dict[str, Any]:
    """
    Aggregates the complete context of a startup:
    Profile, Goals, Tasks, Signals, Health Scores, and active priorities.
    """
    profile = db.query(StartupProfile).filter(StartupProfile.id == startup_id).first()
    if not profile:
        return {}

    goals = db.query(StartupGoal).filter(StartupGoal.startup_id == startup_id).all()
    tasks = db.query(StartupTask).filter(StartupTask.startup_id == startup_id).all()
    signals = db.query(StartupSignal).filter(StartupSignal.startup_id == startup_id, StartupSignal.resolved == False).all()

    return {
        "startup_id": profile.id,
        "startup_name": profile.startup_name,
        "tagline": profile.tagline,
        "industry": profile.industry,
        "target_customer": profile.target_customer,
        "problem_statement": profile.problem_statement,
        "solution_overview": profile.solution_overview,
        "business_model": profile.business_model,
        "pricing_tier": profile.pricing_tier,
        "stage": profile.stage,
        "health_score": profile.health_score,
        "scores": {
            "market": profile.market_score,
            "product": profile.product_score,
            "revenue": profile.revenue_score,
            "competition": profile.competition_score,
            "execution": profile.execution_score
        },
        "goals": [
            {"id": g.id, "title": g.title, "category": g.category, "progress": g.progress_percentage, "status": g.status}
            for g in goals
        ],
        "tasks": [
            {"id": t.id, "title": t.title, "priority": t.priority, "status": t.status, "due_date": t.due_date}
            for t in tasks
        ],
        "signals": [
            {"id": s.id, "title": s.title, "severity": s.severity, "message": s.message, "recommendation": s.recommendation}
            for s in signals
        ]
    }
