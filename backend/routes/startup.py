from __future__ import annotations

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import SessionLocal
from deps import get_current_user_optional, get_current_user
from models.auth_models import User
from models.startup_models import StartupProfile, StartupGoal, StartupTask, StartupSignal
from utils.logger import logger

router = APIRouter(prefix="/startup", tags=["startup"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class ProfileUpdateRequest(BaseModel):
    startup_name: Optional[str] = None
    tagline: Optional[str] = None
    industry: Optional[str] = None
    target_customer: Optional[str] = None
    problem_statement: Optional[str] = None
    solution_overview: Optional[str] = None
    business_model: Optional[str] = None
    pricing_tier: Optional[str] = None
    stage: Optional[str] = None
    market_score: Optional[int] = None
    product_score: Optional[int] = None
    revenue_score: Optional[int] = None
    competition_score: Optional[int] = None
    execution_score: Optional[int] = None


class GoalCreateRequest(BaseModel):
    title: str
    category: str = "GROWTH"
    target_value: str = "100 Customers"


class TaskCreateRequest(BaseModel):
    title: str
    description: Optional[str] = None
    priority: str = "MEDIUM"
    goal_id: Optional[int] = None
    due_date: Optional[str] = None


def _get_or_create_profile(db: Session, user_id: int) -> StartupProfile:
    profile = db.query(StartupProfile).filter(StartupProfile.user_id == user_id).first()
    if not profile:
        profile = StartupProfile(
            user_id=user_id,
            startup_name="IdeaExecutor OS",
            tagline="AI-Powered Founder Workspace",
            industry="Artificial Intelligence",
            target_customer="Early-Stage Founders",
            problem_statement="Building a startup is complex, disconnected, and manual.",
            solution_overview="An AI Operating System providing persistent context, proactive agents, and cascading goals.",
            business_model="B2B SaaS",
            pricing_tier="Freemium / $29 mo",
            stage="MVP & Validation"
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)

        # Seed initial Goals
        goal1 = StartupGoal(startup_id=profile.id, title="Reach 100 Paying Customers", category="GROWTH", target_value="100 Customers", progress_percentage=34, status="ON_TRACK")
        goal2 = StartupGoal(startup_id=profile.id, title="Launch MVP v1.0", category="PRODUCT", target_value="Release v1", progress_percentage=72, status="ON_TRACK")
        goal3 = StartupGoal(startup_id=profile.id, title="Achieve ₹10L ARR", category="REVENUE", target_value="₹10,00,000", progress_percentage=21, status="AT_RISK")
        db.add_all([goal1, goal2, goal3])
        db.commit()
        db.refresh(goal1)

        # Seed initial Tasks
        task1 = StartupTask(startup_id=profile.id, goal_id=goal1.id, title="Interview 5 potential customers", priority="HIGH", status="TODO", ai_generated=True, ai_recommendation_reason="Validate problem-solution fit with real users.", due_date="Today")
        task2 = StartupTask(startup_id=profile.id, goal_id=goal2.id, title="Update pricing & tier model", priority="MEDIUM", status="IN_PROGRESS", ai_generated=True, ai_recommendation_reason="Simulations indicate $29 tier maximizes MRR.", due_date="Tomorrow")
        task3 = StartupTask(startup_id=profile.id, goal_id=goal2.id, title="Review competitor feature set", priority="LOW", status="COMPLETED", ai_generated=False, due_date="Completed")
        db.add_all([task1, task2, task3])

        # Seed initial Signals
        sig1 = StartupSignal(startup_id=profile.id, title="Competitor Price Drop", severity="HIGH", message="Competitor X reduced tier prices by 20%.", recommendation="Review pricing strategy in What-If Simulator.", action_type="SIMULATION")
        sig2 = StartupSignal(startup_id=profile.id, title="Market Research Outdated", severity="MEDIUM", message="Primary competitor analysis is over 14 days old.", recommendation="Re-run Competitor Agent for updated market data.", action_type="ANALYSIS")
        sig3 = StartupSignal(startup_id=profile.id, title="Customer Lead Spike", severity="POSITIVE", message="10 new organic waitlist signups today.", recommendation="Reach out for initial problem validation interviews.", action_type="TASK")
        db.add_all([sig1, sig2, sig3])

        db.commit()
        db.refresh(profile)
    return profile


@router.get("/profile")
async def get_startup_profile(current_user=Depends(get_current_user_optional), db: Session = Depends(get_db)):
    if not current_user:
        # Return fallback demo profile
        return {
            "status": "success",
            "profile": {
                "startup_name": "FoodFlow AI",
                "tagline": "AI Operating Layer for FoodTech",
                "industry": "FoodTech",
                "target_customer": "Independent Restaurants",
                "problem_statement": "High operational cost and inventory waste.",
                "solution_overview": "Autonomous AI inventory forecasting.",
                "business_model": "SaaS Subscription",
                "pricing_tier": "$49/month",
                "stage": "Validation",
                "health_score": 78,
                "scores": {
                    "market": 82,
                    "product": 74,
                    "revenue": 69,
                    "competition": 81,
                    "execution": 88
                }
            }
        }
    profile = _get_or_create_profile(db, current_user.id)
    return {
        "status": "success",
        "profile": {
            "id": profile.id,
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
            }
        }
    }


from services.health_score import calculate_startup_health

@router.put("/profile")
async def update_startup_profile(req: ProfileUpdateRequest, current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    profile = _get_or_create_profile(db, current_user.id)
    for field, val in req.dict(exclude_unset=True).items():
        if hasattr(profile, field) and val is not None:
            setattr(profile, field, val)
    
    # Recalculate deterministic health score
    profile.health_score = calculate_startup_health(
        market=profile.market_score,
        product=profile.product_score,
        revenue=profile.revenue_score,
        competition=profile.competition_score,
        execution=profile.execution_score
    )
    db.commit()
    db.refresh(profile)
    return {"status": "success", "message": "Startup profile updated", "profile_id": profile.id}


@router.get("/command-center")
async def get_command_center(current_user=Depends(get_current_user_optional), db: Session = Depends(get_db)):
    if not current_user:
        return {
            "status": "success",
            "greeting": "Good morning, Founder 👋",
            "health_score": 78,
            "scores": {"market": 82, "product": 74, "revenue": 69, "competition": 81, "execution": 88},
            "priorities": [
                {"id": 1, "title": "Validate customer problem with 5 interviews", "severity": "HIGH"},
                {"id": 2, "title": "Review competitor pricing adjustments", "severity": "MEDIUM"},
                {"id": 3, "title": "Finalize MVP feature list for v1.0 release", "severity": "MEDIUM"}
            ],
            "goals": [
                {"id": 1, "title": "100 Paying Customers", "progress": 34, "status": "ON_TRACK"},
                {"id": 2, "title": "MVP Launch", "progress": 72, "status": "ON_TRACK"},
                {"id": 3, "title": "Revenue ₹10L ARR", "progress": 21, "status": "AT_RISK"}
            ],
            "signals": [
                {"id": 1, "title": "Competitor Price Drop", "severity": "HIGH", "message": "Competitor X reduced pricing by 20%."},
                {"id": 2, "title": "Outdated Competitor Analysis", "severity": "MEDIUM", "message": "Market research is over 14 days old."}
            ],
            "ai_co_founder_briefing": {
                "recommendation": "Your current MVP scope is slightly broad. I recommend locking the first release to 3 core features and validating pricing.",
                "action_prompt": "What should I work on today?"
            }
        }

    profile = _get_or_create_profile(db, current_user.id)
    goals = db.query(StartupGoal).filter(StartupGoal.startup_id == profile.id).all()
    tasks = db.query(StartupTask).filter(StartupTask.startup_id == profile.id).all()
    signals = db.query(StartupSignal).filter(StartupSignal.startup_id == profile.id, StartupSignal.resolved == False).all()

    user_name = current_user.name.split()[0] if current_user and current_user.name else "Founder"

    return {
        "status": "success",
        "greeting": f"Good morning, {user_name} 👋",
        "health_score": profile.health_score,
        "scores": {
            "market": profile.market_score,
            "product": profile.product_score,
            "revenue": profile.revenue_score,
            "competition": profile.competition_score,
            "execution": profile.execution_score
        },
        "priorities": [
            {"id": t.id, "title": t.title, "severity": t.priority, "status": t.status}
            for t in tasks if t.status != "COMPLETED"
        ],
        "goals": [
            {"id": g.id, "title": g.title, "progress": g.progress_percentage, "status": g.status}
            for g in goals
        ],
        "signals": [
            {"id": s.id, "title": s.title, "severity": s.severity, "message": s.message, "recommendation": s.recommendation}
            for s in signals
        ],
        "ai_co_founder_briefing": {
            "recommendation": f"Focus today on achieving your high priority task '{tasks[0].title if tasks else 'Customer Validation'}'.",
            "action_prompt": "What should I work on today?"
        }
    }


@router.get("/goals")
async def list_goals(current_user=Depends(get_current_user_optional), db: Session = Depends(get_db)):
    if not current_user:
        return {
            "status": "success",
            "goals": [
                {"id": 1, "title": "Reach 100 Paying Customers", "category": "GROWTH", "target_value": "100 Customers", "progress_percentage": 34, "status": "ON_TRACK"},
                {"id": 2, "title": "Launch MVP v1.0", "category": "PRODUCT", "target_value": "Release v1", "progress_percentage": 72, "status": "ON_TRACK"},
                {"id": 3, "title": "Achieve ₹10L ARR", "category": "REVENUE", "target_value": "₹10,00,000", "progress_percentage": 21, "status": "AT_RISK"}
            ]
        }
    profile = _get_or_create_profile(db, current_user.id)
    goals = db.query(StartupGoal).filter(StartupGoal.startup_id == profile.id).all()
    return {
        "status": "success",
        "goals": [
            {
                "id": g.id,
                "title": g.title,
                "category": g.category,
                "target_value": g.target_value,
                "progress_percentage": g.progress_percentage,
                "status": g.status
            } for g in goals
        ]
    }


@router.post("/goals")
async def create_goal(req: GoalCreateRequest, current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    profile = _get_or_create_profile(db, current_user.id)
    goal = StartupGoal(
        startup_id=profile.id,
        title=req.title,
        category=req.category,
        target_value=req.target_value,
        progress_percentage=0,
        status="ON_TRACK"
    )
    db.add(goal)
    db.commit()
    db.refresh(goal)
    return {"status": "success", "goal_id": goal.id}


@router.get("/tasks")
async def list_tasks(current_user=Depends(get_current_user_optional), db: Session = Depends(get_db)):
    if not current_user:
        return {
            "status": "success",
            "tasks": [
                {"id": 1, "title": "Interview 5 potential customers", "priority": "HIGH", "status": "TODO", "ai_generated": True, "due_date": "Today"},
                {"id": 2, "title": "Update pricing & tier model", "priority": "MEDIUM", "status": "IN_PROGRESS", "ai_generated": True, "due_date": "Tomorrow"},
                {"id": 3, "title": "Review competitor feature set", "priority": "LOW", "status": "COMPLETED", "ai_generated": False, "due_date": "Completed"}
            ]
        }
    profile = _get_or_create_profile(db, current_user.id)
    tasks = db.query(StartupTask).filter(StartupTask.startup_id == profile.id).all()
    return {
        "status": "success",
        "tasks": [
            {
                "id": t.id,
                "title": t.title,
                "description": t.description,
                "priority": t.priority,
                "status": t.status,
                "ai_generated": t.ai_generated,
                "ai_recommendation_reason": t.ai_recommendation_reason,
                "due_date": t.due_date,
                "goal_id": t.goal_id
            } for t in tasks
        ]
    }


@router.post("/tasks")
async def create_task(req: TaskCreateRequest, current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    profile = _get_or_create_profile(db, current_user.id)
    task = StartupTask(
        startup_id=profile.id,
        goal_id=req.goal_id,
        title=req.title,
        description=req.description,
        priority=req.priority,
        status="TODO",
        ai_generated=False,
        due_date=req.due_date or "Next Week"
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return {"status": "success", "task_id": task.id}


@router.patch("/tasks/{task_id}")
async def update_task_status(task_id: int, status_str: str, current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    profile = _get_or_create_profile(db, current_user.id)
    task = db.query(StartupTask).filter(StartupTask.id == task_id, StartupTask.startup_id == profile.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    task.status = status_str
    db.commit()
    return {"status": "success", "message": f"Task {task_id} status updated to {status_str}"}
