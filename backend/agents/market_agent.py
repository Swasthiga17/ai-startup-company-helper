from agents.gemini_client import model, GEMINI_AVAILABLE
from agents.utils import safe_json_parse
from agents.domain_engine import get_idea_domain

def market_analysis(idea: str, context: str = "") -> dict:
    domain_data = get_idea_domain(idea)
    fallback_data = {
        "target_market": {"demographics": [f"Professionals in {domain_data['domain']}", "Enterprise customers"], "psychographics": ["Efficiency-driven", "Tech-adopters"]},
        "market_size": {"tam": domain_data["tam"], "sam": domain_data["sam"], "som": domain_data["som"]},
        "growth_potential": f"High - {domain_data['growth']} expected",
        "risks": domain_data["swot"]["threats"]
    }
    
    if not GEMINI_AVAILABLE:
        return fallback_data
    try:
        prompt = f"""
        You are a professional Market Research Analyst.
        Analyze the startup idea: {idea}
        Additional knowledge base context: {context}

        Return strictly as JSON:
        {{
            "target_market": {{
                "demographics": ["string"],
                "psychographics": ["string"]
            }},
            "market_size": {{
                "tam": "string",
                "sam": "string",
                "som": "string"
            }},
            "growth_potential": "string",
            "risks": ["string"]
        }}
        """
        response = model.generate_content(prompt, generation_config={"response_mime_type": "application/json"})
        return safe_json_parse(response.text, fallback_data)
    except Exception:
        return fallback_data