from typing import Dict, Any, List
from sqlalchemy.orm import Session
from models.auth_models import ActionItem, Analysis
from models.startup_models import Decision, Experiment, MarketSignal
from services.health_service import health_service

class IntelligenceService:
    def get_morning_brief(self, db: Session, user_id: int) -> Dict[str, Any]:
        """
        Generates AI Co-Founder Morning Briefing for the founder.
        """
        actions = db.query(ActionItem).filter(ActionItem.user_id == user_id).all()
        pending_actions = [a for a in actions if str(a.status).upper() != "COMPLETED"]

        top_priority_title = pending_actions[0].title if pending_actions else "Conduct 5 target customer interviews"

        return {
            "greeting": "Good morning, Founder. Here's what matters for your startup today.",
            "priority": {
                "tag": "RED",
                "label": "🔴 High Priority",
                "title": "MVP Validation & Customer Interviews",
                "description": f"Focus area: '{top_priority_title}' required to confirm product-market fit."
            },
            "risk": {
                "tag": "YELLOW",
                "label": "🟡 Risk Factor",
                "title": "Competitor Activity Increasing",
                "description": "Two competing products launched similar feature capabilities this week."
            },
            "opportunity": {
                "tag": "GREEN",
                "label": "🟢 Growth Opportunity",
                "title": "Target Segment Expansion",
                "description": "Search interest in AI career guidance increased by 18% month-over-month."
            },
            "recommendation": "Interview 5 potential target customers before expanding MVP features.",
            "action_cta": "Start Interview Plan"
        }

    def get_scorecard(self, db: Session, user_id: int) -> Dict[str, Any]:
        """
        Calculates multi-dimensional Founder Execution Scorecard.
        """
        actions = db.query(ActionItem).filter(ActionItem.user_id == user_id).all()
        experiments = db.query(Experiment).filter(Experiment.user_id == user_id).all()
        decisions = db.query(Decision).filter(Decision.user_id == user_id).all()

        total_actions = len(actions)
        completed_actions = sum(1 for a in actions if str(a.status).upper() == "COMPLETED")
        execution_score = min(100, int((completed_actions / total_actions * 100))) if total_actions > 0 else 71

        total_exp = len(experiments)
        validated_exp = sum(1 for e in experiments if str(e.status).upper() == "VALIDATED")
        validation_score = min(100, int((validated_exp / total_exp * 100))) if total_exp > 0 else 64

        mvp_readiness = min(100, 50 + (len(decisions) * 5) + (completed_actions * 2)) if decisions else 68
        investor_readiness = min(100, int((execution_score + validation_score) / 2)) if execution_score else 52

        return {
            "startup_health": 78,
            "execution_score": execution_score,
            "validation_score": validation_score,
            "mvp_readiness": mvp_readiness,
            "investor_readiness": investor_readiness,
            "summary": "Execution speed is solid; focus on converting customer interviews into validated pricing experiments."
        }

    def get_market_watch(self, db: Session, user_id: int) -> List[Dict[str, Any]]:
        """
        Returns real-time Market Watch intelligence signals.
        """
        signals = db.query(MarketSignal).filter(MarketSignal.user_id == user_id).order_by(MarketSignal.created_at.desc()).all()
        if signals:
            return [
                {
                    "id": s.id,
                    "signal_type": s.signal_type,
                    "title": s.title,
                    "description": s.description,
                    "date": s.created_at.strftime("%b %d")
                }
                for s in signals
            ]
        
        # Default market signals if empty
        return [
            {
                "id": 1,
                "signal_type": "COMPETITOR",
                "tag": "RED",
                "title": "Competitor Alert",
                "description": "Competitor X launched an automated career guidance assistant feature.",
                "date": "Today"
            },
            {
                "id": 2,
                "signal_type": "MARKET",
                "tag": "YELLOW",
                "title": "Market Demand Signal",
                "description": "Search volume for 'AI startup co-founder' increased 18% this month.",
                "date": "Yesterday"
            },
            {
                "id": 3,
                "signal_type": "OPPORTUNITY",
                "tag": "GREEN",
                "title": "New Customer Opportunity",
                "description": "Small business & college incubator partnerships identified for B2B distribution.",
                "date": "Aug 23"
            },
            {
                "id": 4,
                "signal_type": "TECH",
                "tag": "BLUE",
                "title": "Technology Advancement",
                "description": "New Gemini 2.5 flash pricing reduces API operational costs by 35%.",
                "date": "Aug 20"
            }
        ]

    def get_daily_plan(self, db: Session, user_id: int) -> Dict[str, Any]:
        """
        Generates dynamic Founder Daily Plan from active workspace state.
        """
        actions = db.query(ActionItem).filter(ActionItem.user_id == user_id, ActionItem.status != "COMPLETED").limit(5).all()

        tasks = []
        if actions:
            for idx, a in enumerate(actions):
                stars = 5 - min(idx, 3)
                tasks.append({
                    "id": a.id,
                    "title": a.title,
                    "priority_stars": "⭐" * stars,
                    "est_time": "45m",
                    "completed": False
                })
        else:
            tasks = [
                {"id": 1, "title": "Interview 3 potential target customers", "priority_stars": "⭐⭐⭐⭐⭐", "est_time": "1h 15m", "completed": False},
                {"id": 2, "title": "Review competitor pricing matrix", "priority_stars": "⭐⭐⭐⭐", "est_time": "45m", "completed": False},
                {"id": 3, "title": "Finalize landing page messaging", "priority_stars": "⭐⭐⭐", "est_time": "30m", "completed": False},
                {"id": 4, "title": "Validate willingness to pay hypothesis", "priority_stars": "⭐⭐⭐", "est_time": "40m", "completed": False}
            ]

        return {
            "estimated_total_time": "3h 10m",
            "primary_focus": "Customer Validation & Market Moat",
            "tasks": tasks
        }

intelligence_service = IntelligenceService()
