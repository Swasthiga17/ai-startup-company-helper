from __future__ import annotations
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Float
from sqlalchemy.orm import relationship
from database import Base

class Decision(Base):
    __tablename__ = "decisions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    analysis_id = Column(Integer, ForeignKey("analyses.id"), nullable=True, index=True)
    title = Column(String(512), nullable=False)
    reason = Column(Text, nullable=True)
    category = Column(String(64), default="STRATEGY", nullable=False)
    impact = Column(String(32), default="HIGH", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User")


class Experiment(Base):
    __tablename__ = "experiments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    analysis_id = Column(Integer, ForeignKey("analyses.id"), nullable=True, index=True)
    hypothesis = Column(Text, nullable=False)
    task = Column(Text, nullable=False)
    success_criteria = Column(Text, nullable=False)
    status = Column(String(32), default="IN_PROGRESS", nullable=False) # IN_PROGRESS / VALIDATED / INVALIDATED
    results = Column(Text, nullable=True)
    ai_conclusion = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    user = relationship("User")


class MarketSignal(Base):
    __tablename__ = "market_signals"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    signal_type = Column(String(32), default="OPPORTUNITY", nullable=False) # COMPETITOR / MARKET / OPPORTUNITY / TECH
    title = Column(String(512), nullable=False)
    description = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User")
