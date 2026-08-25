from __future__ import annotations
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database import Base

class TimelineEvent(Base):
    __tablename__ = "timeline_events"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    event_type = Column(String(64), nullable=False) # COMPETITOR_ALERT / HEALTH_SHIFT / RECOMMENDATION_CREATED / EXPERIMENT_APPROVED / DECISION_LOGGED
    title = Column(String(256), nullable=False)
    description = Column(Text, nullable=True)
    impact_level = Column(String(32), default="MEDIUM", nullable=False) # HIGH / MEDIUM / LOW / POSITIVE
    health_delta = Column(Integer, default=0, nullable=False) # e.g. -4 or +6
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User")
