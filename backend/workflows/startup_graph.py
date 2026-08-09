import time
import json
import operator
from typing import TypedDict, Dict, List, Any, Optional, Annotated
from langgraph.graph import StateGraph, START, END

from agents.domain_agents import (
    run_idea_agent,
    run_market_agent,
    run_business_agent,
    run_product_agent,
    run_operations_agent,
    run_growth_agent,
    run_mentor_agent
)
from utils.logger import logger


class StartupState(TypedDict, total=False):
    startup_idea: str
    idea: str  # Backwards compatibility alias
    user_id: int
    startup_name: str
    target_customer: str
    business_model: str

    idea_analysis: Dict[str, Any]
    market_analysis: Dict[str, Any]
    business_analysis: Dict[str, Any]
    product_analysis: Dict[str, Any]
    operations_analysis: Dict[str, Any]
    growth_analysis: Dict[str, Any]
    mentor_analysis: Dict[str, Any]

    risks: List[str]
    confidence_scores: Dict[str, Any]
    sources: List[str]
    recommendations: List[str]
    action_items: List[str]

    errors: Annotated[List[Dict[str, Any]], operator.add]
    execution_status: str  # STARTING, IDEA_COMPLETED, SYNTHESIZING, COMPLETED, PARTIAL_FAILURE, FAILED
    success: bool

    # Backward compatibility keys for React UI components
    market: Dict[str, Any]
    competitors: Dict[str, Any]
    swot: Dict[str, Any]
    business_model_ui: Dict[str, Any]
    mvp: Dict[str, Any]
    revenue: Dict[str, Any]
    score: Dict[str, Any]
    pitch: Dict[str, Any]
    brand: Dict[str, Any]
    tech_stack: Dict[str, Any]
    sales: Dict[str, Any]
    hiring: Dict[str, Any]
    growth: Dict[str, Any]
    problem_validation: Dict[str, Any]
    value_proposition: Dict[str, Any]
    confidence: Dict[str, Any]


def idea_node(state: StartupState) -> Dict[str, Any]:
    t0 = time.time()
    logger.info("[LangGraph] [Agent:Idea] Started")
    idea = state.get("startup_idea") or state.get("idea", "")
    
    try:
        res = run_idea_agent({"idea": idea})
        dt = round(time.time() - t0, 2)
        
        if res.get("success", True) is not False:
            logger.info(f"[LangGraph] [Agent:Idea] Completed in {dt}s")
            return {
                "idea_analysis": res,
                "execution_status": "IDEA_COMPLETED",
                "problem_validation": {
                    "intensity_score": int(res.get("pain_score", 8.5) * 10),
                    "pain_points": [res.get("problem", "Core customer problem")],
                    "validation_status": "Validated Pain Point"
                },
                "value_proposition": {
                    "core_headline": res.get("value_proposition", "Core value proposition"),
                    "key_benefits": res.get("recommendations", [])
                }
            }
        else:
            logger.warning(f"[LangGraph] [Agent:Idea] Failed in {dt}s: {res.get('error')}")
            return {
                "idea_analysis": res,
                "execution_status": "FAILED",
                "errors": [{"agent": "IdeaAgent", "error": res.get("error")}]
            }
    except Exception as e:
        dt = round(time.time() - t0, 2)
        logger.error(f"[LangGraph] [Agent:Idea] Exception in {dt}s: {e}")
        err_res = {"success": False, "error": f"IdeaAgent failed: {str(e)}", "retryable": True}
        return {
            "idea_analysis": err_res,
            "execution_status": "FAILED",
            "errors": [{"agent": "IdeaAgent", "error": str(e)}]
        }


def market_node(state: StartupState) -> Dict[str, Any]:
    t0 = time.time()
    logger.info("[LangGraph] [Agent:Market] Started")
    idea = state.get("startup_idea") or state.get("idea", "")
    idea_analysis = state.get("idea_analysis", {})

    try:
        res = run_market_agent({"idea": idea, "idea_analysis": idea_analysis})
        dt = round(time.time() - t0, 2)

        if res.get("success", True) is not False:
            logger.info(f"[LangGraph] [Agent:Market] Completed in {dt}s")
            return {
                "market_analysis": res,
                "market": {
                    "target_market": {"demographics": ["Urban professionals", "Target users"], "psychographics": ["Tech-savvy"]},
                    "market_size": {"tam": res.get("tam", "$50B"), "sam": res.get("sam", "$15B"), "som": res.get("som", "$2B")},
                    "growth_potential": "High market opportunity",
                    "risks": res.get("risks", [])
                },
                "competitors": {"competitors": res.get("competitors", [])},
                "swot": {
                    "strengths": ["Innovative solution", "Lean setup"],
                    "weaknesses": ["Early traction"],
                    "opportunities": res.get("trends", []),
                    "threats": res.get("risks", [])
                }
            }
        else:
            logger.warning(f"[LangGraph] [Agent:Market] Failed in {dt}s: {res.get('error')}")
            return {
                "market_analysis": res,
                "errors": [{"agent": "MarketAgent", "error": res.get("error")}]
            }
    except Exception as e:
        dt = round(time.time() - t0, 2)
        logger.error(f"[LangGraph] [Agent:Market] Exception in {dt}s: {e}")
        err_res = {"success": False, "error": f"MarketAgent failed: {str(e)}", "retryable": True}
        return {
            "market_analysis": err_res,
            "errors": [{"agent": "MarketAgent", "error": str(e)}]
        }


def business_node(state: StartupState) -> Dict[str, Any]:
    t0 = time.time()
    logger.info("[LangGraph] [Agent:Business] Started")
    idea = state.get("startup_idea") or state.get("idea", "")
    idea_analysis = state.get("idea_analysis", {})
    market_analysis = state.get("market_analysis", {})

    try:
        res = run_business_agent({"idea": idea, "idea_analysis": idea_analysis, "market_analysis": market_analysis})
        dt = round(time.time() - t0, 2)

        if res.get("success", True) is not False:
            logger.info(f"[LangGraph] [Agent:Business] Completed in {dt}s")
            return {
                "business_analysis": res,
                "business_model_ui": {
                    "revenue_streams": res.get("revenue_streams", []),
                    "cost_structure": res.get("cost_structure", []),
                    "key_metrics": ["MRR", "CAC", "LTV", "Churn Rate"]
                },
                "revenue": {
                    "projections": [
                        {"year": "Year 1", "revenue": 0.5, "users": 1000, "growth": 0},
                        {"year": "Year 2", "revenue": 2.5, "users": 10000, "growth": 400},
                        {"year": "Year 3", "revenue": 8.0, "users": 50000, "growth": 220}
                    ],
                    "revenue_streams": res.get("revenue_streams", [])
                }
            }
        else:
            logger.warning(f"[LangGraph] [Agent:Business] Failed in {dt}s: {res.get('error')}")
            return {
                "business_analysis": res,
                "errors": [{"agent": "BusinessAgent", "error": res.get("error")}]
            }
    except Exception as e:
        dt = round(time.time() - t0, 2)
        logger.error(f"[LangGraph] [Agent:Business] Exception in {dt}s: {e}")
        err_res = {"success": False, "error": f"BusinessAgent failed: {str(e)}", "retryable": True}
        return {
            "business_analysis": err_res,
            "errors": [{"agent": "BusinessAgent", "error": str(e)}]
        }


def product_node(state: StartupState) -> Dict[str, Any]:
    t0 = time.time()
    logger.info("[LangGraph] [Agent:Product] Started")
    idea = state.get("startup_idea") or state.get("idea", "")
    idea_analysis = state.get("idea_analysis", {})
    business_analysis = state.get("business_analysis", {})

    try:
        res = run_product_agent({"idea": idea, "idea_analysis": idea_analysis, "business_analysis": business_analysis})
        dt = round(time.time() - t0, 2)

        if res.get("success", True) is not False:
            logger.info(f"[LangGraph] [Agent:Product] Completed in {dt}s")
            return {
                "product_analysis": res,
                "mvp": {"phases": res.get("roadmap", [])},
                "tech_stack": res.get("technology_stack", {})
            }
        else:
            logger.warning(f"[LangGraph] [Agent:Product] Failed in {dt}s: {res.get('error')}")
            return {
                "product_analysis": res,
                "errors": [{"agent": "ProductAgent", "error": res.get("error")}]
            }
    except Exception as e:
        dt = round(time.time() - t0, 2)
        logger.error(f"[LangGraph] [Agent:Product] Exception in {dt}s: {e}")
        err_res = {"success": False, "error": f"ProductAgent failed: {str(e)}", "retryable": True}
        return {
            "product_analysis": err_res,
            "errors": [{"agent": "ProductAgent", "error": str(e)}]
        }


def operations_node(state: StartupState) -> Dict[str, Any]:
    t0 = time.time()
    logger.info("[LangGraph] [Agent:Operations] Started")
    idea = state.get("startup_idea") or state.get("idea", "")
    product_analysis = state.get("product_analysis", {})
    business_analysis = state.get("business_analysis", {})

    try:
        res = run_operations_agent({"idea": idea, "product_analysis": product_analysis, "business_analysis": business_analysis})
        dt = round(time.time() - t0, 2)

        if res.get("success", True) is not False:
            logger.info(f"[LangGraph] [Agent:Operations] Completed in {dt}s")
            return {
                "operations_analysis": res,
                "hiring": {"first_hires": res.get("hiring_plan", [])}
            }
        else:
            logger.warning(f"[LangGraph] [Agent:Operations] Failed in {dt}s: {res.get('error')}")
            return {
                "operations_analysis": res,
                "errors": [{"agent": "OperationsAgent", "error": res.get("error")}]
            }
    except Exception as e:
        dt = round(time.time() - t0, 2)
        logger.error(f"[LangGraph] [Agent:Operations] Exception in {dt}s: {e}")
        err_res = {"success": False, "error": f"OperationsAgent failed: {str(e)}", "retryable": True}
        return {
            "operations_analysis": err_res,
            "errors": [{"agent": "OperationsAgent", "error": str(e)}]
        }


def growth_node(state: StartupState) -> Dict[str, Any]:
    t0 = time.time()
    logger.info("[LangGraph] [Agent:Growth] Started")
    idea = state.get("startup_idea") or state.get("idea", "")
    operations_analysis = state.get("operations_analysis", {})
    business_analysis = state.get("business_analysis", {})

    try:
        res = run_growth_agent({"idea": idea, "operations_analysis": operations_analysis, "business_analysis": business_analysis})
        dt = round(time.time() - t0, 2)

        if res.get("success", True) is not False:
            logger.info(f"[LangGraph] [Agent:Growth] Completed in {dt}s")
            return {
                "growth_analysis": res,
                "brand": res.get("brand", {}),
                "sales": res.get("sales_strategy", {}),
                "growth": {"growth_hacks": res.get("growth_strategy", [])}
            }
        else:
            logger.warning(f"[LangGraph] [Agent:Growth] Failed in {dt}s: {res.get('error')}")
            return {
                "growth_analysis": res,
                "errors": [{"agent": "GrowthAgent", "error": res.get("error")}]
            }
    except Exception as e:
        dt = round(time.time() - t0, 2)
        logger.error(f"[LangGraph] [Agent:Growth] Exception in {dt}s: {e}")
        err_res = {"success": False, "error": f"GrowthAgent failed: {str(e)}", "retryable": True}
        return {
            "growth_analysis": err_res,
            "errors": [{"agent": "GrowthAgent", "error": str(e)}]
        }


def synthesis_node(state: StartupState) -> Dict[str, Any]:
    logger.info("[LangGraph] [Synthesis] Consolidating all domain agent outputs")
    
    # Consolidate risks, sources, recommendations, confidence scores
    all_risks = []
    all_sources = []
    all_recs = []
    conf_scores = {}

    for key, name in [
        ("idea_analysis", "Idea"),
        ("market_analysis", "Market"),
        ("business_analysis", "Business"),
        ("product_analysis", "Product"),
        ("operations_analysis", "Operations"),
        ("growth_analysis", "Growth")
    ]:
        an = state.get(key, {})
        if isinstance(an, dict) and an.get("success", True) is not False:
            all_risks.extend(an.get("risks", []))
            all_sources.extend(an.get("sources", []))
            all_recs.extend(an.get("recommendations", []))
            conf_scores[name] = an.get("confidence", 85.0)

    # Deduplicate lists
    all_risks = list(dict.fromkeys(all_risks))
    all_sources = list(dict.fromkeys(all_sources))
    all_recs = list(dict.fromkeys(all_recs))

    from services.confidence_service import confidence_service
    contradictions = confidence_service.detect_contradictions(state)

    return {
        "risks": all_risks,
        "sources": all_sources,
        "recommendations": all_recs,
        "confidence_scores": conf_scores,
        "contradictions": contradictions,
        "execution_status": "SYNTHESIZING"
    }


def mentor_node(state: StartupState) -> Dict[str, Any]:
    t0 = time.time()
    logger.info("[LangGraph] [Agent:Mentor] Started")
    idea = state.get("startup_idea") or state.get("idea", "")

    try:
        res = run_mentor_agent({
            "idea": idea,
            "idea_analysis": state.get("idea_analysis", {}),
            "market_analysis": state.get("market_analysis", {}),
            "business_analysis": state.get("business_analysis", {}),
            "product_analysis": state.get("product_analysis", {}),
            "operations_analysis": state.get("operations_analysis", {}),
            "growth_analysis": state.get("growth_analysis", {})
        })
        dt = round(time.time() - t0, 2)

        has_errors = bool(state.get("errors")) or res.get("success", True) is False
        final_status = "PARTIAL_FAILURE" if has_errors else "COMPLETED"

        if res.get("success", True) is not False:
            logger.info(f"[LangGraph] [Agent:Mentor] Completed in {dt}s")
            return {
                "mentor_analysis": res,
                "score": res.get("score", {}),
                "pitch": res.get("pitch", {}),
                "action_items": res.get("action_items", []),
                "confidence": {
                    "score": int(res.get("score", {}).get("overall_score", 8.2) * 10),
                    "sources_used": state.get("sources", ["✓ Benchmark Data"])
                },
                "execution_status": final_status,
                "success": not has_errors
            }
        else:
            logger.warning(f"[LangGraph] [Agent:Mentor] Failed in {dt}s: {res.get('error')}")
            return {
                "mentor_analysis": res,
                "execution_status": "PARTIAL_FAILURE",
                "errors": [{"agent": "MentorAgent", "error": res.get("error")}],
                "success": False
            }
    except Exception as e:
        dt = round(time.time() - t0, 2)
        logger.error(f"[LangGraph] [Agent:Mentor] Exception in {dt}s: {e}")
        err_res = {"success": False, "error": f"MentorAgent failed: {str(e)}", "retryable": True}
        return {
            "mentor_analysis": err_res,
            "execution_status": "PARTIAL_FAILURE",
            "errors": [{"agent": "MentorAgent", "error": str(e)}],
            "success": False
        }


builder = StateGraph(StartupState)
builder.add_node("idea_node", idea_node)
builder.add_node("market_node", market_node)
builder.add_node("business_node", business_node)
builder.add_node("product_node", product_node)
builder.add_node("operations_node", operations_node)
builder.add_node("growth_node", growth_node)
builder.add_node("synthesis_node", synthesis_node)
builder.add_node("mentor_node", mentor_node)

builder.add_edge(START, "idea_node")
builder.add_edge("idea_node", "market_node")
builder.add_edge("idea_node", "business_node")
builder.add_edge("idea_node", "product_node")
builder.add_edge(["market_node", "business_node", "product_node"], "operations_node")
builder.add_edge("operations_node", "growth_node")
builder.add_edge("growth_node", "synthesis_node")
builder.add_edge("synthesis_node", "mentor_node")
builder.add_edge("mentor_node", END)

startup_graph = builder.compile()
