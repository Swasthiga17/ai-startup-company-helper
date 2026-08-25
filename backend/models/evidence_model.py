from __future__ import annotations
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Float
from sqlalchemy.orm import relationship
from database import Base

class Evidence(Base):
    __tablename__ = "evidence"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    analysis_id = Column(Integer, ForeignKey("analyses.id"), nullable=True, index=True)
    claim = Column(Text, nullable=False)
    source_url = Column(String(512), nullable=True)
    source_title = Column(String(256), nullable=True)
    source_type = Column(String(64), default="VERIFIED_DATA", nullable=False) # COMPANY_WEBSITE / MARKET_REPORT / CALCULATION_ENGINE / FOUNDER_INPUT
    source_date = Column(String(64), nullable=True)
    evidence_text = Column(Text, nullable=True)
    confidence = Column(Float, default=85.0, nullable=False)
    agent = Column(String(64), default="ResearchEngine", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User")
