from agents.gemini_client import model, GEMINI_AVAILABLE
from agents.utils import safe_json_parse
from agents.domain_engine import get_idea_domain

def mvp_plan(idea: str) -> dict:
    domain_data = get_idea_domain(idea)
    fallback_data = {"phases": domain_data["mvp_phases"]}
    
    if not GEMINI_AVAILABLE:
        return fallback_data
    try:
        prompt = f"""
        Create an MVP roadmap for: {idea}

        Return strictly as JSON:
        {{
            "phases": [
                {{
                    "phase": "string",
                    "title": "string",
                    "duration": "string",
                    "tasks": ["string"]
                }}
            ]
        }}
        """
        response = model.generate_content(prompt, generation_config={"response_mime_type": "application/json"})
        return safe_json_parse(response.text, fallback_data)
    except Exception:
        return fallback_data