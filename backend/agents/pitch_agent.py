from agents.gemini_client import model, GEMINI_AVAILABLE
from agents.utils import safe_json_parse
from agents.domain_engine import get_idea_domain

def pitch_generation(idea: str) -> dict:
    domain_data = get_idea_domain(idea)
    fallback_data = {
        "slides": [
            {
                "title": "Problem",
                "content": f"Existing solutions in {domain_data['domain']} suffer from high manual overhead, fragmented workflows, and lack of real-time automation.",
                "icon": "🎯"
            },
            {
                "title": "Solution",
                "content": f"Our platform provides automated, AI-driven workflows tailored specifically for {domain_data['domain']} teams, reducing execution time by over 70%.",
                "icon": "💡"
            },
            {
                "title": "Market Opportunity",
                "content": f"Total Addressable Market (TAM) is {domain_data['tam']} with a Serviceable Addressable Market (SAM) of {domain_data['sam']}, expanding at {domain_data['growth']}.",
                "icon": "📊"
            },
            {
                "title": "Product Architecture",
                "content": "Modular cloud architecture featuring direct API connectivity, real-time intelligence telemetry, and enterprise-grade security encryption.",
                "icon": "🚀"
            },
            {
                "title": "Business & Monetization Strategy",
                "content": f"Monetized via: {', '.join(domain_data['revenue_streams'])}. Designed for high gross margin retention and low payback period.",
                "icon": "💰"
            },
            {
                "title": "Competitive Landscape",
                "content": f"Key incumbents include {', '.join([c['name'] for c in domain_data['competitors']])}. Our key moat lies in superior AI velocity and cost efficiency.",
                "icon": "⚔️"
            },
            {
                "title": "Go-to-Market Strategy",
                "content": "Phased customer acquisition leveraging targeted B2B direct sales, organic search authority, and strategic partner ecosystem integrations.",
                "icon": "📈"
            },
            {
                "title": "Financial Projections",
                "content": f"Projected ARR acceleration reaching scale by Year 3 with strong unit economics and projected margin expansion.",
                "icon": "📊"
            },
            {
                "title": "The Ask",
                "content": "Seeking Seed financing to accelerate engineering hire velocity, scale pilot hospital/enterprise deployments, and expand market coverage.",
                "icon": "🤝"
            },
            {
                "title": "Team & Execution",
                "content": "Led by domain experts in software engineering, artificial intelligence, and specialized industry operations.",
                "icon": "👥"
            }
        ]
    }

    if not GEMINI_AVAILABLE:
        return fallback_data
    try:
        prompt = f"""
        Create a detailed, investor-grade pitch deck outline for this startup idea: "{idea}".
        Return 10 slides with real, detailed, specific data points tailored specifically to this business (e.g. realistic TAM/SAM, specific problem statements, clear product moat, and financial metrics).

        Return strictly valid JSON with this exact structure:
        {{
            "slides": [
                {{
                    "title": "Slide Title",
                    "content": "Comprehensive 2-3 sentence detailed slide summary with specific data points",
                    "icon": "Emoji Icon (e.g. 🎯, 💡, 📊, 🚀, 💰, ⚔️, 📈, 🤝, 👥)"
                }}
            ]
        }}
        """
        response = model.generate_content(prompt, generation_config={"response_mime_type": "application/json"})
        return safe_json_parse(response.text, fallback_data)
    except Exception:
        return fallback_data