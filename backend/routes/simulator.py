from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from services.llm_service import llm_service
from services.simulator_service import simulator_service
from deps import get_current_user
from utils.logger import logger

router = APIRouter(tags=["simulator"])


class DevilsAdvocateRequest(BaseModel):
    idea: str


class ExecutionScoreRequest(BaseModel):
    idea: str
    team_skills: List[str]
    budget: float
    timeline: int


class SimChatRequest(BaseModel):
    idea: str
    simulator_type: str
    persona: str
    message: str
    chat_history: List[dict] = []


class SimEvaluateRequest(BaseModel):
    idea: str
    simulator_type: str
    persona: str
    chat_history: List[dict]


class WhatIfScenarioRequest(BaseModel):
    idea: str
    price_change_percent: float = 0.0
    cac_change_percent: float = 0.0
    new_engineers_count: int = 0
    marketing_spend_change_percent: float = 0.0
    expenses_change_percent: float = 0.0
    baseline_data: Optional[Dict[str, Any]] = None


@router.post("/devils-advocate")
async def devils_advocate(request: DevilsAdvocateRequest, current_user=Depends(get_current_user)):
    prompt = f"""
    You are the ultimate Devil's Advocate startup critic. Stress-test and point out every single vulnerability, market risk, and reason for potential failure of this startup idea:
    "{request.idea}"

    Be brutal, realistic, and highly specific. Focus on market saturation, customer acquisition costs, distribution bottlenecks, switching costs, and competitive moats.
    Also, act as a Pivot Recommendation Engine. Suggest 2-3 specific, high-potential pivots/niches where this startup can find a stronger moat and higher success rate.

    Return strictly as a JSON object with this format:
    {{
        "critique": ["critique point 1", "critique point 2", "critique point 3"],
        "suggestions": ["actionable suggestion 1", "actionable suggestion 2"],
        "pivots": [
            {{
                "original_focus": "original focus description",
                "original_score": 55,
                "proposed_pivot": "proposed niche solution",
                "pivot_score": 88,
                "reason": "strategic reason explaining why this pivot works and builds a moat"
            }}
        ]
    }}
    """
    result = llm_service.generate_json(prompt)
    if result and ("critique" in result or "pivots" in result):
        return {"status": "success", "data": result}

    idea_lower = request.idea.lower()
    fallback = {
        "critique": [
            "Low switching costs for users mean customer retention will be difficult without a strong product moat.",
            "Large tech companies can easily copy your core feature as a minor add-on to their existing suites.",
            "High customer acquisition cost (CAC) relative to initial customer lifetime value (LTV)."
        ],
        "suggestions": [
            "Focus on a narrow vertical niche first to build initial traction and domain authority.",
            "Integrate deeply with existing software platforms to reduce friction."
        ],
        "pivots": [
            {
                "original_focus": f"Generic version of: {request.idea}",
                "original_score": 60,
                "proposed_pivot": f"Niche-targeted enterprise integration solution for {request.idea}",
                "pivot_score": 90,
                "reason": "Targeting high-value business clients who require security, API integrations, and customized workflows creates a defensible enterprise moat."
            }
        ]
    }
    return {"status": "success", "data": fallback}


@router.post("/execution-score")
async def execution_score(request: ExecutionScoreRequest, current_user=Depends(get_current_user)):
    prompt = f"""
    You are a venture capital associate evaluating execution capability.
    Evaluate the execution probability of a team building this idea:
    "{request.idea}"

    Based on these details:
    - Team Skills: {", ".join(request.team_skills)}
    - Budget: ${request.budget:,}
    - Development Timeline: {request.timeline} months

    Return strictly as a JSON object with this format:
    {{
        "execution_score": 82,
        "skill_gap_analysis": {{
            "missing_expertise": ["missing skill 1"],
            "risk_rating": "Medium",
            "risk_reason": "Specific risk explanation"
        }},
        "suggestions": [
            "recommendation 1",
            "recommendation 2"
        ]
    }}
    """
    result = llm_service.generate_json(prompt)
    if result and "execution_score" in result:
        return {"status": "success", "data": result}

    skills_lower = [s.lower() for s in request.team_skills]
    score = 75
    missing = []
    if "cto" not in skills_lower and "technical lead" not in skills_lower:
        score -= 15
        missing.append("Technical leadership (CTO)")

    fallback = {
        "execution_score": score,
        "skill_gap_analysis": {
            "missing_expertise": missing if missing else ["Regulatory Advisor"],
            "risk_rating": "Medium" if score >= 70 else "High",
            "risk_reason": "Lean core team requiring complementary domain advising."
        },
        "suggestions": [
            "Partner with a technical advisor to validate system architecture.",
            "Maintain a lean MVP launch scope."
        ]
    }
    return {"status": "success", "data": fallback}


@router.post("/simulator/chat")
async def simulator_chat(request: SimChatRequest, current_user=Depends(get_current_user)):
    system_prompts = {
        "yc": "You are Michael Seibel, a partner at Y Combinator. You are fast-paced, analytical, and direct. Ask sharp questions about growth, user traction, and MVP progress.",
        "sequoia": "You are a Sequoia Capital General Partner. You look for massive market opportunities and structural competitive advantages (moats). Ask deep questions about scale and defensibility.",
        "angel": "You are Naval, a prominent tech angel investor. Ask vision-oriented questions about founder-market fit and long-term leverage.",
        "busy_professional": "You are Sarah, a busy corporate project manager. Ask about pricing, onboarding friction, and exact time savings."
    }

    p_prompt = system_prompts.get(request.persona, "You are a helpful startup advisor.")
    history_text = ""
    for msg in request.chat_history:
        role = "User / Founder" if msg.get("role") == "user" else "Advisor"
        history_text += f"{role}: {msg.get('content')}\n"

    prompt = f"""
    System Role: {p_prompt}
    The founder is pitching / interviewing you about their startup idea: "{request.idea}"

    History:
    {history_text}

    Founder's message: "{request.message}"

    Respond directly in-character. Keep it concise.
    """
    reply = llm_service.generate_text(prompt)
    if reply:
        return JSONResponse(content={"reply": reply})

    fallback_reply = "What is your primary distribution channel for acquiring early power users?"
    return JSONResponse(content={"reply": fallback_reply})


@router.post("/simulator/evaluate")
async def simulator_evaluate(request: SimEvaluateRequest, current_user=Depends(get_current_user)):
    history_text = ""
    for msg in request.chat_history:
        role = "Founder" if msg.get("role") == "user" else "Simulator Persona"
        history_text += f"{role}: {msg.get('content')}\n"

    prompt = f"""
    You are a senior startup coach. Review this roleplay transcript for startup "{request.idea}":
    {history_text}

    Return strictly as a JSON object:
    {{
        "score": 78,
        "strengths": ["strength 1", "strength 2"],
        "weaknesses": ["weakness 1", "weakness 2"],
        "recommendations": ["advice 1", "advice 2"]
    }}
    """
    result = llm_service.generate_json(prompt)
    if result and "score" in result:
        return {"status": "success", "data": result}

    fallback = {
        "score": 75,
        "strengths": ["Clear problem articulation", "Prompt responses"],
        "weaknesses": ["Needs more quantitative traction evidence"],
        "recommendations": ["Quantify key user metrics in future pitches"]
    }
    return {"status": "success", "data": fallback}


@router.post("/simulator/evaluate-scenario")
async def evaluate_scenario(request: WhatIfScenarioRequest, current_user=Depends(get_current_user)):
    try:
        res = simulator_service.calculate_scenario(
            idea=request.idea,
            price_change_percent=request.price_change_percent,
            cac_change_percent=request.cac_change_percent,
            new_engineers_count=request.new_engineers_count,
            marketing_spend_change_percent=request.marketing_spend_change_percent,
            expenses_change_percent=request.expenses_change_percent,
            baseline_data=request.baseline_data
        )
        return {"status": "success", "data": res}
    except Exception as e:
        logger.error(f"Scenario evaluation failed: {e}")
        raise HTTPException(status_code=400, detail=str(e))
