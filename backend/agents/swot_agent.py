from agents.gemini_client import model, GEMINI_AVAILABLE
from agents.utils import safe_json_parse
from agents.domain_engine import get_idea_domain

def swot_analysis(idea: str) -> dict:
    domain_data = get_idea_domain(idea)
    fallback_data = domain_data["swot"]
    
    if not GEMINI_AVAILABLE:
        return fallback_data
    try:
        prompt = f"""
        Perform SWOT analysis for: {idea}

        Return strictly as JSON:
        {{
            "strengths": ["string"],
            "weaknesses": ["string"],
            "opportunities": ["string"],
            "threats": ["string"]
        }}
        """
        response = model.generate_content(prompt, generation_config={"response_mime_type": "application/json"})
        return safe_json_parse(response.text, fallback_data)
    except Exception:
        return fallback_data