from __future__ import annotations
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from database import Base

class FounderInterview(Base):
    __tablename__ = "founder_interviews"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    problem_solved = Column(Text, nullable=True)
    best_feature = Column(String(128), default="AI Decision Center", nullable=False)
    inaccurate_result = Column(Text, nullable=True)
    acted_recommendation = Column(String(256), nullable=True)
    alternative_used = Column(String(128), default="Manual spreadsheets & ChatGPT prompts", nullable=False)
    reuse_intent = Column(Boolean, default=True, nullable=False)
    willingness_to_pay = Column(Boolean, default=True, nullable=False)
    indispensable_feature = Column(String(128), default="Evidence-backed analysis & Live Market Watch", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User")
