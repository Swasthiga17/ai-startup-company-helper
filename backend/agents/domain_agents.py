import json
from typing import Dict, Any

from services.llm_service import llm_service
from services.rag_service import build_rag_context
from services.confidence_service import confidence_service
from models.schemas import (
    IdeaAnalysisSchema,
    MarketAnalysisSchema,
    BusinessAnalysisSchema,
    ProductAnalysisSchema,
    OperationsAnalysisSchema,
    GrowthAnalysisSchema,
    MentorResponseSchema
)
from prompts.idea_prompt import IDEA_SYSTEM_PROMPT
from prompts.market_prompt import MARKET_SYSTEM_PROMPT
from prompts.business_prompt import BUSINESS_SYSTEM_PROMPT
from prompts.product_prompt import PRODUCT_SYSTEM_PROMPT
from prompts.operations_prompt import OPERATIONS_SYSTEM_PROMPT
from prompts.growth_prompt import GROWTH_SYSTEM_PROMPT
from prompts.mentor_prompt import MENTOR_SYSTEM_PROMPT
from utils.logger import logger


def run_idea_agent(state: Dict[str, Any]) -> Dict[str, Any]:
    idea = state.get("idea", "").strip()
    if not idea:
        return {
            "success": False,
            "error": "Invalid input: Startup idea cannot be empty.",
            "retryable": False
        }

    prompt = IDEA_SYSTEM_PROMPT.format(idea=idea)
    result = llm_service.generate_json(prompt, schema_cls=IdeaAnalysisSchema)
    if result:
        raw_conf = result.get("confidence", 85.0)
        eval_res = confidence_service.evaluate_analysis(
            agent_result=result,
            rag_sources=[],
            all_agent_results=state,
            gemini_confidence=raw_conf
        )
        result["confidence"] = eval_res["score"]
        result["confidence_metadata"] = eval_res
        return result
    
    return {
        "success": False,
        "error": "AI Idea Agent analysis temporarily unavailable. Please retry.",
        "retryable": True
    }


def run_market_agent(state: Dict[str, Any]) -> Dict[str, Any]:
    idea = state.get("idea", "").strip()
    user_id = state.get("user_id")

    rag_info = {"has_evidence": False, "sources": []}
    if user_id:
        rag_info = build_rag_context(query=idea, user_id=user_id)

    upstream_data = {
        "idea_analysis": state.get("idea_analysis", {}),
        "uploaded_evidence": rag_info.get("context_text", "No relevant uploaded evidence found.")
    }
    prompt = MARKET_SYSTEM_PROMPT.format(idea=idea, upstream_context=json.dumps(upstream_data))
    result = llm_service.generate_json(prompt, schema_cls=MarketAnalysisSchema)
    if result:
        if rag_info.get("has_evidence"):
            retrieved = [f"{s['filename']} (Page {s['page_number']})" for s in rag_info.get("sources", [])]
            result["sources"] = list(dict.fromkeys(retrieved + result.get("sources", [])))
        
        raw_conf = result.get("confidence", 85.0)
        eval_res = confidence_service.evaluate_analysis(
            agent_result=result,
            rag_sources=rag_info.get("sources", []),
            all_agent_results=state,
            gemini_confidence=raw_conf
        )
        result["confidence"] = eval_res["score"]
        result["confidence_metadata"] = eval_res
        return result

    return {
        "success": False,
        "error": "AI Market Agent analysis temporarily unavailable. Please retry.",
        "retryable": True
    }


def run_business_agent(state: Dict[str, Any]) -> Dict[str, Any]:
    idea = state.get("idea", "").strip()
    user_id = state.get("user_id")

    rag_info = {"has_evidence": False, "sources": []}
    if user_id:
        rag_info = build_rag_context(query=idea, user_id=user_id)

    upstream_data = {
        "idea": state.get("idea_analysis", {}),
        "market": state.get("market_analysis", {}),
        "uploaded_evidence": rag_info.get("context_text", "No relevant uploaded evidence found.")
    }
    prompt = BUSINESS_SYSTEM_PROMPT.format(idea=idea, upstream_context=json.dumps(upstream_data))
    result = llm_service.generate_json(prompt, schema_cls=BusinessAnalysisSchema)
    if result:
        if rag_info.get("has_evidence"):
            retrieved = [f"{s['filename']} (Page {s['page_number']})" for s in rag_info.get("sources", [])]
            result["sources"] = list(dict.fromkeys(retrieved + result.get("sources", [])))

        raw_conf = result.get("confidence", 85.0)
        eval_res = confidence_service.evaluate_analysis(
            agent_result=result,
            rag_sources=rag_info.get("sources", []),
            all_agent_results=state,
            gemini_confidence=raw_conf
        )
        result["confidence"] = eval_res["score"]
        result["confidence_metadata"] = eval_res
        return result

    return {
        "success": False,
        "error": "AI Business Agent analysis temporarily unavailable. Please retry.",
        "retryable": True
    }


def run_product_agent(state: Dict[str, Any]) -> Dict[str, Any]:
    idea = state.get("idea", "").strip()
    upstream_context = json.dumps({
        "idea": state.get("idea_analysis", {}),
        "business": state.get("business_analysis", {})
    })
    prompt = PRODUCT_SYSTEM_PROMPT.format(idea=idea, upstream_context=upstream_context)
    result = llm_service.generate_json(prompt, schema_cls=ProductAnalysisSchema)
    if result:
        raw_conf = result.get("confidence", 85.0)
        eval_res = confidence_service.evaluate_analysis(
            agent_result=result,
            rag_sources=[],
            all_agent_results=state,
            gemini_confidence=raw_conf
        )
        result["confidence"] = eval_res["score"]
        result["confidence_metadata"] = eval_res
        return result

    return {
        "success": False,
        "error": "AI Product Agent analysis temporarily unavailable. Please retry.",
        "retryable": True
    }


def run_operations_agent(state: Dict[str, Any]) -> Dict[str, Any]:
    idea = state.get("idea", "").strip()
    user_id = state.get("user_id")

    rag_info = {"has_evidence": False, "sources": []}
    if user_id:
        rag_info = build_rag_context(query=idea, user_id=user_id)

    upstream_data = {
        "product": state.get("product_analysis", {}),
        "business": state.get("business_analysis", {}),
        "uploaded_evidence": rag_info.get("context_text", "No relevant uploaded evidence found.")
    }
    prompt = OPERATIONS_SYSTEM_PROMPT.format(idea=idea, upstream_context=json.dumps(upstream_data))
    result = llm_service.generate_json(prompt, schema_cls=OperationsAnalysisSchema)
    if result:
        if rag_info.get("has_evidence"):
            retrieved = [f"{s['filename']} (Page {s['page_number']})" for s in rag_info.get("sources", [])]
            result["sources"] = list(dict.fromkeys(retrieved + result.get("sources", [])))

        raw_conf = result.get("confidence", 85.0)
        eval_res = confidence_service.evaluate_analysis(
            agent_result=result,
            rag_sources=rag_info.get("sources", []),
            all_agent_results=state,
            gemini_confidence=raw_conf
        )
        result["confidence"] = eval_res["score"]
        result["confidence_metadata"] = eval_res
        return result

    return {
        "success": False,
        "error": "AI Operations Agent analysis temporarily unavailable. Please retry.",
        "retryable": True
    }


def run_growth_agent(state: Dict[str, Any]) -> Dict[str, Any]:
    idea = state.get("idea", "").strip()
    user_id = state.get("user_id")

    rag_info = {"has_evidence": False, "sources": []}
    if user_id:
        rag_info = build_rag_context(query=idea, user_id=user_id)

    upstream_data = {
        "operations": state.get("operations_analysis", {}),
        "business": state.get("business_analysis", {}),
        "uploaded_evidence": rag_info.get("context_text", "No relevant uploaded evidence found.")
    }
    prompt = GROWTH_SYSTEM_PROMPT.format(idea=idea, upstream_context=json.dumps(upstream_data))
    result = llm_service.generate_json(prompt, schema_cls=GrowthAnalysisSchema)
    if result:
        if rag_info.get("has_evidence"):
            retrieved = [f"{s['filename']} (Page {s['page_number']})" for s in rag_info.get("sources", [])]
            result["sources"] = list(dict.fromkeys(retrieved + result.get("sources", [])))

        raw_conf = result.get("confidence", 85.0)
        eval_res = confidence_service.evaluate_analysis(
            agent_result=result,
            rag_sources=rag_info.get("sources", []),
            all_agent_results=state,
            gemini_confidence=raw_conf
        )
        result["confidence"] = eval_res["score"]
        result["confidence_metadata"] = eval_res
        return result

    return {
        "success": False,
        "error": "AI Growth Agent analysis temporarily unavailable. Please retry.",
        "retryable": True
    }


def run_mentor_agent(state: Dict[str, Any]) -> Dict[str, Any]:
    idea = state.get("idea", "").strip()
    user_id = state.get("user_id")

    rag_info = {"has_evidence": False, "sources": []}
    if user_id:
        rag_info = build_rag_context(query=idea, user_id=user_id)

    full_context = {
        "idea": state.get("idea_analysis", {}),
        "market": state.get("market_analysis", {}),
        "business": state.get("business_analysis", {}),
        "product": state.get("product_analysis", {}),
        "operations": state.get("operations_analysis", {}),
        "growth": state.get("growth_analysis", {}),
        "uploaded_evidence": rag_info.get("context_text", "No relevant uploaded evidence found.")
    }
    prompt = MENTOR_SYSTEM_PROMPT.format(idea=idea, full_analysis_context=json.dumps(full_context))
    result = llm_service.generate_json(prompt, schema_cls=MentorResponseSchema)
    if result:
        if rag_info.get("has_evidence"):
            retrieved = [f"{s['filename']} (Page {s['page_number']})" for s in rag_info.get("sources", [])]
            result["sources"] = list(dict.fromkeys(retrieved + result.get("sources", [])))

        raw_conf = result.get("confidence", 85.0)
        eval_res = confidence_service.evaluate_analysis(
            agent_result=result,
            rag_sources=rag_info.get("sources", []),
            all_agent_results=state,
            gemini_confidence=raw_conf
        )
        result["confidence"] = eval_res["score"]
        result["confidence_metadata"] = eval_res
        return result

    return {
        "success": False,
        "error": "AI Mentor Agent analysis temporarily unavailable. Please retry.",
        "retryable": True
    }
