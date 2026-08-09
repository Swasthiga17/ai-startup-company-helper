from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field


class BaseAgentResponseSchema(BaseModel):
    success: bool = Field(default=True, description="Execution status")
    confidence: float = Field(default=85.0, description="AI Confidence score 0-100%")
    confidence_metadata: Optional[Dict[str, Any]] = Field(default=None, description="Detailed backend-evaluated confidence metrics")
    assumptions: List[str] = Field(default_factory=list, description="Key analysis assumptions")
    risks: List[str] = Field(default_factory=list, description="Identified risks")
    recommendations: List[str] = Field(default_factory=list, description="Actionable recommendations")
    sources: List[str] = Field(default_factory=list, description="Supporting sources or benchmark references")


class PersonaSchema(BaseModel):
    name: str = Field(description="Name or title of target persona")
    demographics: str = Field(description="Key demographics")
    pain_point: str = Field(description="Primary pain point")


class IdeaAnalysisSchema(BaseAgentResponseSchema):
    problem: str = Field(description="Clear problem statement")
    target_customers: List[str] = Field(default_factory=list, description="Target customer segments")
    pain_score: float = Field(default=8.5, description="Pain score out of 10")
    personas: List[PersonaSchema] = Field(default_factory=list, description="User personas")
    value_proposition: str = Field(description="Core value proposition statement")
    validation_questions: List[str] = Field(default_factory=list, description="Key validation questions to ask")


class CompetitorItemSchema(BaseModel):
    name: str = Field(default="Competitor", description="Competitor name")
    market_share: Optional[str] = Field(default="15%", description="Market share")
    strengths: List[str] = Field(default_factory=list)
    weaknesses: List[str] = Field(default_factory=list)
    competitive_advantage: Optional[str] = Field(default="Key advantage", description="Competitive advantage")


class MarketAnalysisSchema(BaseAgentResponseSchema):
    tam: str = Field(default="$50B", description="Total Addressable Market")
    sam: str = Field(default="$15B", description="Serviceable Addressable Market")
    som: str = Field(default="$2B", description="Serviceable Obtainable Market")
    market_score: float = Field(default=8.5, description="Market score out of 10")
    competitors: List[CompetitorItemSchema] = Field(default_factory=list)
    trends: List[str] = Field(default_factory=list)


class BusinessAnalysisSchema(BaseAgentResponseSchema):
    business_model: str = Field(default="SaaS / Subscription", description="Core business model summary")
    revenue_streams: List[str] = Field(default_factory=list)
    pricing: List[str] = Field(default_factory=list)
    cost_structure: List[str] = Field(default_factory=list)
    financial_assumptions: List[str] = Field(default_factory=list)


class MVPPhaseSchema(BaseModel):
    phase: str = Field(default="Phase 1", description="Phase identifier")
    title: Optional[str] = Field(default="", description="Phase title")
    duration: Optional[str] = Field(default="4 weeks", description="Duration")
    tasks: List[str] = Field(default_factory=list, description="Phase tasks")


class ProductAnalysisSchema(BaseAgentResponseSchema):
    mvp_features: List[str] = Field(default_factory=list)
    feature_priorities: List[str] = Field(default_factory=list)
    technology_stack: Dict[str, List[str]] = Field(default_factory=dict)
    architecture: str = Field(default="Modular microservices / serverless API architecture")
    roadmap: List[MVPPhaseSchema] = Field(default_factory=list)


class RoleHiringSchema(BaseModel):
    role: str = Field(default="Engineering Lead", description="Role title")
    skills: Optional[str] = Field(default="Python, React", description="Skills required")
    timeline: Optional[str] = Field(default="Month 1-2", description="Hiring timeline")
    salary_estimate: Optional[str] = Field(default="$90K-$120K", description="Salary estimate")


class OperationsAnalysisSchema(BaseAgentResponseSchema):
    hiring_plan: List[RoleHiringSchema] = Field(default_factory=list)
    roles: List[str] = Field(default_factory=list)
    salary_assumptions: List[str] = Field(default_factory=list)
    legal_checklist: List[str] = Field(default_factory=list)
    operational_risks: List[str] = Field(default_factory=list)


class GrowthAnalysisSchema(BaseAgentResponseSchema):
    brand: Dict[str, Any] = Field(default_factory=dict)
    positioning: str = Field(default="Automated AI startup co-founder OS")
    gtm_strategy: List[str] = Field(default_factory=list)
    marketing_strategy: List[str] = Field(default_factory=list)
    sales_strategy: Dict[str, Any] = Field(default_factory=dict)
    growth_strategy: List[str] = Field(default_factory=list)


class MentorResponseSchema(BaseAgentResponseSchema):
    answer: str = Field(description="Main mentor reply")
    score: Dict[str, Any] = Field(default_factory=dict)
    pitch: Dict[str, Any] = Field(default_factory=dict)
    action_items: List[str] = Field(default_factory=list)
    follow_up_questions: List[str] = Field(default_factory=list)
