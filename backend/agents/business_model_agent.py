from agents.gemini_client import model, GEMINI_AVAILABLE
from agents.utils import safe_json_parse
from agents.domain_engine import get_idea_domain

def business_model_analysis(idea: str) -> dict:
    domain_data = get_idea_domain(idea)
    fallback_data = {
        "revenue_streams": domain_data["revenue_streams"],
        "cost_structure": domain_data["cost_structure"],
        "key_metrics": ["MRR", "CAC", "LTV", "Churn Rate"]
    }
    
    if not GEMINI_AVAILABLE:
        return fallback_data
    try:
        prompt = f"""
        Create a business model for: {idea}

        Return strictly as JSON:
        {{
            "revenue_streams": ["string"],
            "cost_structure": ["string"],
            "key_metrics": ["string"]
        }}
        """
        response = model.generate_content(prompt, generation_config={"response_mime_type": "application/json"})
        return safe_json_parse(response.text, fallback_data)
    except Exception:
        return fallback_data