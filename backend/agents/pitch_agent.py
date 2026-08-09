from agents.gemini_client import model, GEMINI_AVAILABLE
from agents.utils import safe_json_parse
from agents.domain_engine import get_idea_domain

def pitch_generation(idea: str) -> dict:
    domain_data = get_idea_domain(idea)
    fallback_data = {
        "slides": [
            {"title": "Problem", "content": f"Inefficiencies in the {domain_data['domain']} space"},
            {"title": "Solution", "content": f"A targeted platform to optimize {domain_data['domain']} workflows"},
            {"title": "Market", "content": f"TAM: {domain_data['tam']} | SAM: {domain_data['sam']}"},
            {"title": "Product", "content": f"AI-driven {domain_data['domain']} tool"},
            {"title": "Business Model", "content": ", ".join(domain_data["revenue_streams"])},
            {"title": "Competition", "content": ", ".join([c["name"] for c in domain_data["competitors"]])},
            {"title": "Team", "content": f"Experts in {domain_data['domain']} and AI"},
            {"title": "Financials", "content": f"Expected Growth: {domain_data['growth']}"},
            {"title": "Ask", "content": "Seed funding for MVP development"},
            {"title": "Contact", "content": "hello@startup.ai"}
        ]
    }

    if not GEMINI_AVAILABLE:
        return fallback_data
    try:
        prompt = f"""
        Create a pitch deck outline for: {idea}

        Return strictly as JSON:
        {{
            "slides": [
                {{"title": "string", "content": "string"}}
            ]
        }}
        """
        response = model.generate_content(prompt, generation_config={"response_mime_type": "application/json"})
        return safe_json_parse(response.text, fallback_data)
    except Exception:
        return fallback_data