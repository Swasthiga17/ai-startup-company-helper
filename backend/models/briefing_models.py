from __future__ import annotations

from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship

from database import Base


class DailyBriefing(Base):
    __tablename__ = "daily_briefings"

    id = Column(Integer, primary_key=True, index=True)
    startup_id = Column(Integer, ForeignKey("startup_profiles.id"), nullable=False, index=True)
    
    date_str = Column(String(32), nullable=False) # e.g. "2026-08-13"
    summary = Column(Text, nullable=False)
    recommendation = Column(Text, nullable=False)
    action_prompt = Column(String(255), default="What should I work on today?", nullable=False)
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    startup = relationship("StartupProfile", backref="briefings")


class AIRecommendationModel(Base):
    __tablename__ = "ai_recommendations"

    id = Column(Integer, primary_key=True, index=True)
    startup_id = Column(Integer, ForeignKey("startup_profiles.id"), nullable=False, index=True)
    
    agent_name = Column(String(64), default="AI Co-Founder", nullable=False)
    category = Column(String(64), default="STRATEGY", nullable=False) # STRATEGY, PRODUCT, REVENUE, MARKETING
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    rationale = Column(Text, nullable=True)
    priority = Column(String(32), default="HIGH", nullable=False) # HIGH, MEDIUM, LOW
    confidence_score = Column(Float, default=88.0, nullable=False)
    status = Column(String(32), default="PENDING", nullable=False) # PENDING, APPROVED, REJECTED

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    startup = relationship("StartupProfile", backref="recommendations")
