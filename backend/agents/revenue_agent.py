from agents.gemini_client import model, GEMINI_AVAILABLE
from agents.utils import safe_json_parse
from agents.domain_engine import get_idea_domain

def revenue_forecast(idea: str) -> dict:
    domain_data = get_idea_domain(idea)
    base = domain_data["rev_base"]
    mult = domain_data["rev_mult"]
    fallback_data = {
        "projections": [
            {"year": "Year 1", "revenue": round(base, 1), "users": 1000, "growth": 0},
            {"year": "Year 2", "revenue": round(base * mult, 1), "users": 10000, "growth": 400},
            {"year": "Year 3", "revenue": round(base * mult * 2.2, 1), "users": 50000, "growth": 220},
            {"year": "Year 4", "revenue": round(base * mult * 4.5, 1), "users": 150000, "growth": 125},
            {"year": "Year 5", "revenue": round(base * mult * 8.0, 1), "users": 400000, "growth": 94}
        ],
        "revenue_streams": domain_data["revenue_streams"]
    }
    
    if not GEMINI_AVAILABLE:
        return fallback_data
    try:
        prompt = f"""
        Create a 5-year revenue forecast for: {idea}

        Return strictly as JSON:
        {{
            "projections": [
                {{"year": "string", "revenue": number, "users": number, "growth": number}}
            ],
            "revenue_streams": ["string"]
        }}
        """
        response = model.generate_content(prompt, generation_config={"response_mime_type": "application/json"})
        return safe_json_parse(response.text, fallback_data)
    except Exception:
        return fallback_data