from __future__ import annotations
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from models.startup_models import StartupProfile, StartupGoal, StartupTask, StartupSignal

def run_signal_engine(db: Session, startup_id: int) -> List[StartupSignal]:
    """
    Evaluates rule-based signals and risk conditions on a startup.
    Generates or updates signals deterministically.
    """
    profile = db.query(StartupProfile).filter(StartupProfile.id == startup_id).first()
    if not profile:
        return []

    goals = db.query(StartupGoal).filter(StartupGoal.startup_id == startup_id).all()
    tasks = db.query(StartupTask).filter(StartupTask.startup_id == startup_id).all()
    
    generated_signals = []

    # Rule 1: Goal At Risk check
    at_risk_goals = [g for g in goals if g.progress_percentage < 30 and g.status != "COMPLETED"]
    if at_risk_goals:
        sig_title = "Goal Progress Falling Behind"
        existing = db.query(StartupSignal).filter(
            StartupSignal.startup_id == startup_id,
            StartupSignal.title == sig_title,
            StartupSignal.resolved == False
        ).first()
        if not existing:
            sig = StartupSignal(
                startup_id=startup_id,
                title=sig_title,
                severity="HIGH",
                message=f"Goal '{at_risk_goals[0].title}' progress is at {at_risk_goals[0].progress_percentage}%.",
                recommendation="Break down this goal into 3 high-priority execution tasks.",
                action_type="TASK"
            )
            db.add(sig)
            generated_signals.append(sig)

    # Rule 2: Unvalidated Pricing Tier Check
    if profile.pricing_tier and "unvalidated" in profile.pricing_tier.lower():
        sig_title = "Pricing Strategy Unvalidated"
        existing = db.query(StartupSignal).filter(
            StartupSignal.startup_id == startup_id,
            StartupSignal.title == sig_title,
            StartupSignal.resolved == False
        ).first()
        if not existing:
            sig = StartupSignal(
                startup_id=startup_id,
                title=sig_title,
                severity="MEDIUM",
                message="Your pricing model has not been validated with customer interviews.",
                recommendation="Run What-If Scenario simulator to evaluate pricing tiers.",
                action_type="SIMULATION"
            )
            db.add(sig)
            generated_signals.append(sig)

    # Rule 3: High Priority Task Backlog
    high_prio_tasks = [t for t in tasks if t.priority == "HIGH" and t.status == "TODO"]
    if len(high_prio_tasks) >= 3:
        sig_title = "High Priority Task Backlog"
        existing = db.query(StartupSignal).filter(
            StartupSignal.startup_id == startup_id,
            StartupSignal.title == sig_title,
            StartupSignal.resolved == False
        ).first()
        if not existing:
            sig = StartupSignal(
                startup_id=startup_id,
                title=sig_title,
                severity="HIGH",
                message=f"You have {len(high_prio_tasks)} uncompleted high-priority tasks.",
                recommendation="Focus today exclusively on completing customer validation tasks.",
                action_type="TASK"
            )
            db.add(sig)
            generated_signals.append(sig)

    db.commit()
    return generated_signals
