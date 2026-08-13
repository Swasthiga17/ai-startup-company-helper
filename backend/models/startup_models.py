from __future__ import annotations

from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship

from database import Base


class StartupProfile(Base):
    __tablename__ = "startup_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True, index=True)
    
    startup_name = Column(String(255), default="My AI Startup", nullable=False)
    tagline = Column(String(512), default="AI Startup Operating System", nullable=True)
    industry = Column(String(128), default="SaaS / AI", nullable=False)
    target_customer = Column(String(255), default="Early-stage Founders & Innovators", nullable=False)
    problem_statement = Column(Text, nullable=True)
    solution_overview = Column(Text, nullable=True)
    business_model = Column(String(128), default="B2B SaaS Subscription", nullable=False)
    pricing_tier = Column(String(128), default="Free / Pro $29/mo", nullable=True)
    stage = Column(String(64), default="Idea & Validation", nullable=False)
    
    health_score = Column(Integer, default=78, nullable=False)
    market_score = Column(Integer, default=82, nullable=False)
    product_score = Column(Integer, default=74, nullable=False)
    revenue_score = Column(Integer, default=69, nullable=False)
    competition_score = Column(Integer, default=81, nullable=False)
    execution_score = Column(Integer, default=88, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    user = relationship("User", backref="startup_profile")
    goals = relationship("StartupGoal", back_populates="startup", cascade="all, delete-orphan")
    tasks = relationship("StartupTask", back_populates="startup", cascade="all, delete-orphan")
    signals = relationship("StartupSignal", back_populates="startup", cascade="all, delete-orphan")


class StartupGoal(Base):
    __tablename__ = "startup_goals"

    id = Column(Integer, primary_key=True, index=True)
    startup_id = Column(Integer, ForeignKey("startup_profiles.id"), nullable=False, index=True)
    
    title = Column(String(255), nullable=False)
    category = Column(String(64), default="GROWTH", nullable=False) # GROWTH, PRODUCT, REVENUE, RESEARCH
    target_value = Column(String(128), default="100 Customers", nullable=False)
    progress_percentage = Column(Integer, default=0, nullable=False)
    status = Column(String(32), default="ON_TRACK", nullable=False) # ON_TRACK, AT_RISK, BEHIND, COMPLETED
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    startup = relationship("StartupProfile", back_populates="goals")
    tasks = relationship("StartupTask", back_populates="goal")


class StartupTask(Base):
    __tablename__ = "startup_tasks"

    id = Column(Integer, primary_key=True, index=True)
    startup_id = Column(Integer, ForeignKey("startup_profiles.id"), nullable=False, index=True)
    goal_id = Column(Integer, ForeignKey("startup_goals.id"), nullable=True, index=True)
    
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    priority = Column(String(32), default="MEDIUM", nullable=False) # HIGH, MEDIUM, LOW
    status = Column(String(32), default="TODO", nullable=False) # TODO, IN_PROGRESS, COMPLETED
    ai_generated = Column(Boolean, default=True, nullable=False)
    ai_recommendation_reason = Column(Text, nullable=True)
    due_date = Column(String(64), nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    startup = relationship("StartupProfile", back_populates="tasks")
    goal = relationship("StartupGoal", back_populates="tasks")


class StartupSignal(Base):
    __tablename__ = "startup_signals"

    id = Column(Integer, primary_key=True, index=True)
    startup_id = Column(Integer, ForeignKey("startup_profiles.id"), nullable=False, index=True)
    
    title = Column(String(255), nullable=False)
    severity = Column(String(32), default="MEDIUM", nullable=False) # HIGH, MEDIUM, LOW, POSITIVE
    message = Column(Text, nullable=False)
    recommendation = Column(Text, nullable=True)
    action_type = Column(String(64), default="TASK", nullable=True) # TASK, SIMULATION, ANALYSIS
    resolved = Column(Boolean, default=False, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    startup = relationship("StartupProfile", back_populates="signals")
