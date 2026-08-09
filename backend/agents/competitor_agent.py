from agents.gemini_client import model, GEMINI_AVAILABLE
from agents.utils import safe_json_parse
from agents.domain_engine import get_idea_domain

def competitor_analysis(idea: str) -> dict:
    domain_data = get_idea_domain(idea)
    fallback_data = {"competitors": domain_data["competitors"]}
    
    if not GEMINI_AVAILABLE:
        return fallback_data
    try:
        prompt = f"""
        Analyze potential competitors for: {idea}

        Return strictly as JSON:
        {{
            "competitors": [
                {{
                    "name": "string",
                    "strengths": ["string"],
                    "weaknesses": ["string"],
                    "market_share": "string",
                    "competitive_advantage": "string"
                }}
            ]
        }}
        """
        response = model.generate_content(prompt, generation_config={"response_mime_type": "application/json"})
        return safe_json_parse(response.text, fallback_data)
    except Exception:
        return fallback_data