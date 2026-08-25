from __future__ import annotations
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database import Base

class Feedback(Base):
    __tablename__ = "feedbacks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    recommendation_title = Column(String(256), nullable=False)
    rating = Column(String(64), nullable=False) # VERY_USEFUL / USEFUL / PARTIALLY_USEFUL / NOT_USEFUL
    acted_status = Column(String(32), default="YES", nullable=False) # YES / PARTIALLY / NO
    feedback_text = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User")
