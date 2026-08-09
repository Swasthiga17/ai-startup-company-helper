from agents.gemini_client import model, GEMINI_AVAILABLE
from agents.utils import safe_json_parse
from agents.domain_engine import get_idea_domain

def brand_generation(idea: str) -> dict:
    domain_data = get_idea_domain(idea)
    domain_name = domain_data.get("domain", "SaaS")
    fallback_data = {
        "company_names": [f"{domain_name}ly", f"Nova{domain_name}", f"Apex{domain_name}", f"Build{domain_name}"],
        "taglines": [f"Unleash the power of AI in {domain_name}.", f"The future of {domain_name} starts here.", f"Scale your operations with automated {domain_name}."],
        "mission": f"To democratize and streamline operations in the {domain_name} space using cutting edge technology.",
        "vision": f"To be the leading global platform powering the next generation of {domain_name} tools.",
        "brand_voice": "Professional, authoritative, yet approachable and highly innovative.",
        "colors": ["#4F46E5 (Indigo)", "#06B6D4 (Cyan)", "#1E293B (Slate)"],
        "logo_ideas": [
            "A stylized geometric symbol combining a rocket and a cloud node.",
            "An abstract infinity loop merging into a spark / star icon.",
            "Minimalist clean wordmark with a glowing accent dot on the 'i'."
        ],
        "domain_suggestions": [f"get{domain_name.lower()}.com", f"join{domain_name.lower()}.io", f"{domain_name.lower()}app.ai"]
    }
    
    if not GEMINI_AVAILABLE:
        return fallback_data
    try:
        prompt = f"""
        Generate brand details for a startup based on this idea: {idea}

        Return strictly as JSON:
        {{
            "company_names": ["string"],
            "taglines": ["string"],
            "mission": "string",
            "vision": "string",
            "brand_voice": "string",
            "colors": ["string"],
            "logo_ideas": ["string"],
            "domain_suggestions": ["string"]
        }}
        """
        response = model.generate_content(prompt, generation_config={"response_mime_type": "application/json"})
        return safe_json_parse(response.text, fallback_data)
    except Exception:
        return fallback_data

def tech_stack_recommendation(idea: str) -> dict:
    domain_data = get_idea_domain(idea)
    domain_name = domain_data.get("domain", "SaaS")
    fallback_data = {
        "frontend": ["React 18", "Vite", "Tailwind CSS", "Framer Motion"],
        "backend": ["FastAPI", "Python 3.10", "Uvicorn"],
        "database": ["PostgreSQL", "ChromaDB (for vector search)", "Redis (caching)"],
        "auth": ["JWT (JSON Web Tokens)", "OAuth 2.0 / Google Auth"],
        "cloud": ["AWS (S3 for media, ECS for hosting)", "Vercel (frontend deployment)"],
        "ai": ["Google Gemini Pro API", "LangGraph", "LangChain"],
        "apis": ["Stripe (payments)", "SendGrid (transactional emails)"],
        "devops": ["Docker", "GitHub Actions (CI/CD)"]
    }
    
    if not GEMINI_AVAILABLE:
        return fallback_data
    try:
        prompt = f"""
        Recommend a complete technology stack for this startup idea: {idea}

        Return strictly as JSON:
        {{
            "frontend": ["string"],
            "backend": ["string"],
            "database": ["string"],
            "auth": ["string"],
            "cloud": ["string"],
            "ai": ["string"],
            "apis": ["string"],
            "devops": ["string"]
        }}
        """
        response = model.generate_content(prompt, generation_config={"response_mime_type": "application/json"})
        return safe_json_parse(response.text, fallback_data)
    except Exception:
        return fallback_data

def sales_strategy_generation(idea: str) -> dict:
    fallback_data = {
        "sales_funnel": [
            "Awareness: Content marketing & social outreach showing the core problem.",
            "Interest: Product demos & downloadable guide / case study.",
            "Decision: Personalized consultation or free trial access.",
            "Action: Standard contract closing with onboarding support."
        ],
        "outreach_emails": [
            {
                "subject": "Speed up your workflows with AI",
                "body": "Hi {{first_name}},\n\nI noticed you are managing operations at {{company}}. Many teams struggle with productivity leaks in this area. We built a tool that automates these manual pipelines, helping teams save up to 15 hours a week.\n\nWould you be open to a quick 10-minute demo next Tuesday?\n\nBest,\n[Your Name]"
            }
        ],
        "cold_messages": [
            "Hi [Name], loved your recent post on industry scaling! We are building something to automate the exact bottleneck you mentioned. Would love to connect and share notes."
        ],
        "lead_magnets": [
            "Ultimate Industry Benchmark Guide (PDF)",
            "Free Cost & Time Savings ROI Calculator"
        ],
        "crm_workflow": [
            "Lead Captured -> Auto-send welcome resources -> Trigger manual Linkedin connect -> Book discovery call -> Demo -> Follow-up proposal -> Close."
        ]
    }
    
    if not GEMINI_AVAILABLE:
        return fallback_data
    try:
        prompt = f"""
        Generate a sales strategy for this startup idea: {idea}

        Return strictly as JSON:
        {{
            "sales_funnel": ["string"],
            "outreach_emails": [
                {{
                    "subject": "string",
                    "body": "string"
                }}
            ],
            "cold_messages": ["string"],
            "lead_magnets": ["string"],
            "crm_workflow": ["string"]
        }}
        """
        response = model.generate_content(prompt, generation_config={"response_mime_type": "application/json"})
        return safe_json_parse(response.text, fallback_data)
    except Exception:
        return fallback_data

def hiring_plan_generation(idea: str) -> dict:
    fallback_data = {
        "first_hires": [
            {"role": "Lead Full-Stack Developer", "skills": "React, Python, API Integrations", "timeline": "Month 1-2", "salary_estimate": "$90,000 - $120,000 / yr"},
            {"role": "Growth Marketing Manager", "skills": "SEO, Cold Outreach, Paid Ads", "timeline": "Month 3", "salary_estimate": "$70,000 - $90,000 / yr"},
            {"role": "Customer Success Specialist", "skills": "Support, Onboarding, Documentation", "timeline": "Month 5", "salary_estimate": "$50,000 - $65,000 / yr"}
        ],
        "team_structure": "Lean founder-led team transitioning to functional heads (Engineering, Growth, Operations) post-seed round."
    }
    
    if not GEMINI_AVAILABLE:
        return fallback_data
    try:
        prompt = f"""
        Generate a hiring plan for this startup idea: {idea}

        Return strictly as JSON:
        {{
            "first_hires": [
                {{
                    "role": "string",
                    "skills": "string",
                    "timeline": "string",
                    "salary_estimate": "string"
                }}
            ],
            "team_structure": "string"
        }}
        """
        response = model.generate_content(prompt, generation_config={"response_mime_type": "application/json"})
        return safe_json_parse(response.text, fallback_data)
    except Exception:
        return fallback_data

def growth_advisor_generation(idea: str) -> dict:
    fallback_data = {
        "growth_hacks": [
            "Viral Loop: Reward users with free credits or extended features for referring other founders.",
            "Side Project Marketing: Launch a free mini-tool related to the niche on Product Hunt to drive organic traffic."
        ],
        "ab_testing": [
            "Test pricing page layout: Compare package-first grid layout against usage-based slider calculator.",
            "Test Landing Hero Copy: Differentiate direct ROI statement ('Save $5k/mo') vs. feature statement ('AI Co-founder')."
        ],
        "partnerships": [
            "Co-marketing with local startup incubators and software accelerators.",
            "Integrate directly with popular industry slack channels or platform marketplaces."
        ],
        "feedback_loops": [
            "Automate NPS surveys 14 days after signup.",
            "Schedule short 15-minute product interviews with active churned users."
        ],
        "revenue_optimization": [
            "Introduce an annual plan with a 20% discount to boost upfront cash reserves.",
            "Offer cross-sell premium add-ons like dedicated support channels or custom API endpoints."
        ]
    }
    
    if not GEMINI_AVAILABLE:
        return fallback_data
    try:
        prompt = f"""
        Generate growth advisory recommendations for this startup idea: {idea}

        Return strictly as JSON:
        {{
            "growth_hacks": ["string"],
            "ab_testing": ["string"],
            "partnerships": ["string"],
            "feedback_loops": ["string"],
            "revenue_optimization": ["string"]
        }}
        """
        response = model.generate_content(prompt, generation_config={"response_mime_type": "application/json"})
        return safe_json_parse(response.text, fallback_data)
    except Exception:
        return fallback_data
