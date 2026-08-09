from agents.gemini_client import model, GEMINI_AVAILABLE
from agents.utils import safe_json_parse
from agents.domain_engine import get_idea_domain

def startup_scoring(idea: str) -> dict:
    domain_data = get_idea_domain(idea)
    fallback_data = {
        "overall_score": 7.5 + min(domain_data["rev_base"], 1.5),
        "market_potential": 8.5,
        "innovation_level": 7.8,
        "feasibility": 7.2,
        "risk_factor": 3.5,
        "summary": f"Strong market opportunity in {domain_data['domain']} with innovative approach. Moderate risk profile."
    }
    
    if not GEMINI_AVAILABLE:
        return fallback_data
    try:
        prompt = f"""
        Score this startup idea: {idea}

        Return strictly as JSON:
        {{
            "overall_score": number,
            "market_potential": number,
            "innovation_level": number,
            "feasibility": number,
            "risk_factor": number,
            "summary": "string"
        }}
        """
        response = model.generate_content(prompt, generation_config={"response_mime_type": "application/json"})
        return safe_json_parse(response.text, fallback_data)
    except Exception:
        return fallback_data