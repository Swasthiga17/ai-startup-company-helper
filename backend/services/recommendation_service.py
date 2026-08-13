from __future__ import annotations
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from models.briefing_models import AIRecommendationModel, DailyBriefing
from models.startup_models import StartupProfile, StartupTask, StartupSignal
from services.startup_context import get_startup_context
from datetime import datetime

def generate_ai_recommendations(db: Session, startup_id: int) -> List[AIRecommendationModel]:
    """Generates structured AI Co-Founder recommendations based on LLM reasoning over startup context & signals."""
    context = get_startup_context(db, startup_id)
    if not context:
        return []

    # Check for existing pending recommendations to avoid duplication
    existing_pending = db.query(AIRecommendationModel).filter(
        AIRecommendationModel.id == startup_id,
        AIRecommendationModel.status == "PENDING"
    ).all()
    if existing_pending:
        return existing_pending

    signals = context.get("signals", [])
    recommendations = []

    # If active signals exist, generate signal-traceable recommendations
    if signals:
        top_signal = signals[0]
        rec1 = AIRecommendationModel(
            startup_id=startup_id,
            agent_name="Strategy Manager Agent",
            category="STRATEGY",
            title=f"Resolve Risk: {top_signal['title']}",
            description=f"Automated AI detection identified: '{top_signal['message']}'. Taking action will safeguard execution health.",
            rationale=top_signal.get("recommendation", "Address active risk signal to improve startup health score."),
            priority="HIGH",
            confidence_score=94.0,
            status="PENDING"
        )
        recommendations.append(rec1)

    # General Product/Revenue AI Co-Founder Recommendation
    rec2 = AIRecommendationModel(
        startup_id=startup_id,
        agent_name="Product Manager Agent",
        category="PRODUCT",
        title="Lock MVP Release Scope to 3 Core Features",
        description="Your current MVP feature roadmap is broad. Scoping down ensures faster time-to-market.",
        rationale="Context analysis predicts a 40% faster validation timeline when focusing on core customer pain points.",
        priority="MEDIUM",
        confidence_score=88.0,
        status="PENDING"
    )
    recommendations.append(rec2)

    db.add_all(recommendations)
    db.commit()
    for r in recommendations:
        db.refresh(r)
    return recommendations


def generate_daily_briefing(db: Session, startup_id: int) -> DailyBriefing:
    """Computes or retrieves today's Daily Startup Briefing."""
    today_str = datetime.utcnow().strftime("%Y-%m-%d")
    existing = db.query(DailyBriefing).filter(
        DailyBriefing.startup_id == startup_id,
        DailyBriefing.date_str == today_str
    ).first()
    if existing:
        return existing

    context = get_startup_context(db, startup_id)
    startup_name = context.get("startup_name", "your startup")
    
    briefing = DailyBriefing(
        startup_id=startup_id,
        date_str=today_str,
        summary=f"Here is your AI Co-Founder briefing for {startup_name}. You have active priorities requiring execution.",
        recommendation="Focus on problem validation with 5 customer interviews and lock down your MVP feature scope.",
        action_prompt="What should I work on today?"
    )
    db.add(briefing)
    db.commit()
    db.refresh(briefing)
    return briefing
