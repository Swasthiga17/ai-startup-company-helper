from agents.gemini_client import model, GEMINI_AVAILABLE
from agents.utils import safe_json_parse
from agents.domain_engine import get_idea_domain

def competitor_analysis(idea: str) -> dict:
    domain_data = get_idea_domain(idea)
    fallback_data = {
        "competitors": domain_data["competitors"],
        "positioning_matrix": {
            "x_axis": "Price (Low to High)",
            "y_axis": "Automation & AI Capabilities (Basic to Advanced)",
            "your_startup": {"name": "Your Startup", "x": 30, "y": 85},
            "competitors": [
                {"name": c["name"], "x": 75 - (idx * 20), "y": 40 + (idx * 15)}
                for idx, c in enumerate(domain_data["competitors"][:3])
            ]
        }
    }
    
    if not GEMINI_AVAILABLE:
        return fallback_data
    try:
        prompt = f"""
        Conduct a real-world competitive market analysis for this startup idea: "{idea}".
        Identify 3 REAL, EXISTING companies/products currently operating in this market or adjacent space (e.g., actual company names like Stripe, Epic Systems, Harvey AI, Salesforce, Duolingo, etc. - DO NOT use generic placeholders like 'Competitor A' or 'Company X').

        Return strictly valid JSON with this exact schema:
        {{
            "competitors": [
                {{
                    "name": "Exact Real Company Name",
                    "strengths": ["Key competitive strength"],
                    "weaknesses": ["Key vulnerability or product flaw"],
                    "market_share": "Estimated market share % (e.g. 28%)",
                    "threat": "High | Medium | Low",
                    "competitive_advantage": "How our startup wins against them"
                }}
            ],
            "positioning_matrix": {{
                "x_axis": "Price (Low to High)",
                "y_axis": "Automation & AI Features (Basic to Advanced)",
                "your_startup": {{ "name": "Your Startup", "x": 30, "y": 85 }},
                "competitors": [
                    {{ "name": "Exact Real Company Name", "x": 80, "y": 55 }}
                ]
            }}
        }}
        """
        response = model.generate_content(prompt, generation_config={"response_mime_type": "application/json"})
        return safe_json_parse(response.text, fallback_data)
    except Exception:
        return fallback_data