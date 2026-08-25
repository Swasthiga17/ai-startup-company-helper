from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from models.startup_timeline import TimelineEvent
from utils.logger import logger

class ChangeDetectionService:
    """
    Autonomous Change Detection & Health Recalculation Engine.
    Detects external market events, recalculates competition and overall health scores, and issues priority recommendations.
    """
    def process_market_event(
        self,
        event_type: str,
        title: str,
        threat_level: str = "HIGH",
        current_health: int = 78,
        user_id: Optional[int] = None,
        db: Optional[Session] = None
    ) -> Dict[str, Any]:
        logger.info(f"Processing market event '{title}' with threat level {threat_level}")

        # Recalculate Health Score based on threat impact
        health_delta = -4 if threat_level == "HIGH" else -2 if threat_level == "MEDIUM" else 3
        new_health = max(0, min(100, current_health + health_delta))

        new_priority = {
            "title": "Validate Customer Differentiation",
            "why": f"Competitor event '{title}' increased competitive overlap.",
            "recommendation": "Interview 20 target users on unique AI career features.",
            "action_cta": "Launch Validation Experiment"
        }

        # Log to timeline ledger
        if db and user_id:
            try:
                tl_event = TimelineEvent(
                    user_id=user_id,
                    event_type=event_type,
                    title=title,
                    description=f"Health score shifted from {current_health} to {new_health} ({health_delta:+d} pts).",
                    impact_level=threat_level,
                    health_delta=health_delta
                )
                db.add(tl_event)
                db.commit()
            except Exception as e:
                db.rollback()
                logger.warning(f"Failed to log timeline event: {e}")

        return {
            "event_title": title,
            "threat_level": threat_level,
            "previous_health": current_health,
            "new_health": new_health,
            "health_delta": health_delta,
            "new_priority": new_priority,
            "is_recalculated": True
        }

change_detection_service = ChangeDetectionService()
