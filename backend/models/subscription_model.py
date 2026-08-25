from __future__ import annotations
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Float
from sqlalchemy.orm import relationship
from database import Base

class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    plan_id = Column(String(64), default="FREE", nullable=False) # FREE / PRO / FOUNDER
    status = Column(String(32), default="ACTIVE", nullable=False) # ACTIVE / CANCELLED / EXPIRED / PAST_DUE
    started_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    current_period_start = Column(DateTime, default=datetime.utcnow, nullable=False)
    current_period_end = Column(DateTime, nullable=True)
    provider_customer_id = Column(String(128), nullable=True)
    provider_subscription_id = Column(String(128), nullable=True)

    user = relationship("User")


class UsageRecord(Base):
    __tablename__ = "usage_records"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    month_period = Column(String(16), nullable=False) # e.g. "2026-08"
    analysis_count = Column(Integer, default=0, nullable=False)
    ai_token_count = Column(Integer, default=0, nullable=False)
    ai_cost_inr = Column(Float, default=0.0, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User")
