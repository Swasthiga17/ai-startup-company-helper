"""
Domain Engine - Generates dynamic, context-aware analysis tailored to any startup idea
when LLM services are offline or API keys are unauthenticated.
"""
import re
import math
import hashlib

def _resolve_domain_template(idea: str) -> dict:
    text = idea.lower()

    # Keyword categorization
    if any(k in text for k in ['hospital', 'health', 'patient', 'doctor', 'medical', 'clinic', 'pharma', 'care']):
        return {
            "domain": "HealthTech",
            "competitors": [
                {"name": "Epic Systems", "market_share": "31%", "strengths": ["EHR Dominance", "Hospital Network"], "weaknesses": ["Legacy UI", "High Cost"], "competitive_advantage": "AI Automation & Fast Integration"},
                {"name": "Cerner (Oracle)", "market_share": "24%", "strengths": ["Enterprise Scale", "Cloud Infrastructure"], "weaknesses": ["Slow Implementation"], "competitive_advantage": "Specialized Clinical Workflow AI"},
                {"name": "Teladoc Health", "market_share": "15%", "strengths": ["Telehealth Coverage"], "weaknesses": ["Patient Retention"], "competitive_advantage": "Real-time Diagnostic AI Copilot"}
            ],
            "tam": "$450B", "sam": "$120B", "som": "$8.5B", "growth": "18.2% CAGR",
            "swot": {
                "strengths": ["HIPAA-Compliant AI Architecture", "High Customer Lifetime Value", "Solves Doctor Burnout"],
                "weaknesses": ["Long B2B Sales Cycles", "Strict Regulatory Approval Needs"],
                "opportunities": ["Hospital Digital Transformation", "Remote Patient Monitoring Expansion"],
                "threats": ["EHR Vendor Lock-In", "Evolving Health Data Regulations"]
            },
            "revenue_streams": ["B2B SaaS / Hospital Seat License", "Enterprise Integration Fee", "Usage-Based API Pricing"],
            "cost_structure": ["HIPAA Compliance & Security Audits", "AI Model Fine-tuning", "Clinical Sales Team"],
            "mvp_phases": [
                {"phase": "Phase 1", "title": "Clinical Discovery & Pilot", "duration": "6 weeks", "tasks": ["Doctor interviews", "HIPAA security review", "Dataset sandbox testing"]},
                {"phase": "Phase 2", "title": "Hospital Integration Build", "duration": "14 weeks", "tasks": ["EHR API connector", "Clinical decision UI", "HIPAA audit logs"]},
                {"phase": "Phase 3", "title": "Hospital Beta Deployment", "duration": "8 weeks", "tasks": ["Pilot hospital onboarding", "Clinical accuracy metrics", "Billing workflow"]}
            ],
            "rev_base": 1.2, "rev_mult": 4.5
        }

    elif any(k in text for k in ['farm', 'crop', 'plant', 'agri', 'agriculture', 'soil', 'yield', 'harvest']):
        return {
            "domain": "AgriTech",
            "competitors": [
                {"name": "Plantix", "market_share": "35%", "strengths": ["Global Farmer Community", "Large Image Database"], "weaknesses": ["Low Commercial Monetization"], "competitive_advantage": "Precision Drone & Sensor Integration"},
                {"name": "Cropin", "market_share": "22%", "strengths": ["Enterprise Agribusiness Reach"], "weaknesses": ["Complex Setup for Small Farms"], "competitive_advantage": "Localized Yield Prediction Engine"},
                {"name": "Agrio", "market_share": "14%", "strengths": ["Mobile Diagnostics"], "weaknesses": ["Limited Offline Features"], "competitive_advantage": "Early-Stage Pest Early Warning System"}
            ],
            "tam": "$32B", "sam": "$9.4B", "som": "$650M", "growth": "14.5% CAGR",
            "swot": {
                "strengths": ["High Accuracy Diagnostic Model", "Works Offline in Remote Fields", "Reduces Crop Loss by 30%"],
                "weaknesses": ["Seasonality of Crop Cycles", "Variable Connectivity in Rural Regions"],
                "opportunities": ["Climate-Smart Agriculture Subsidies", "Agri-Chemical Partner Synergies"],
                "threats": ["Unpredictable Extreme Weather Events", "Low Technology Adoption Rate in Smallholder Farms"]
            },
            "revenue_streams": ["Annual Agribusiness Subscription", "Per-Acre Diagnostic Fee", "Fertilizer Partner Commission"],
            "cost_structure": ["Computer Vision Dataset Labeling", "Agronomist Consultations", "Rural Channel Marketing"],
            "mvp_phases": [
                {"phase": "Phase 1", "title": "Field Dataset Collection", "duration": "4 weeks", "tasks": ["Collect 5,000 disease images", "Agronomist annotation", "Model baseline training"]},
                {"phase": "Phase 2", "title": "Mobile App & Model Build", "duration": "10 weeks", "tasks": ["Offline camera scanning UI", "TensorFlow Lite model", "Disease treatment database"]},
                {"phase": "Phase 3", "title": "Regional Farmer Pilot", "duration": "6 weeks", "tasks": ["Deploy to 200 farmers", "Measure yield improvement", "Refine disease alerts"]}
            ],
            "rev_base": 0.35, "rev_mult": 3.8
        }

    elif any(k in text for k in ['law', 'lawyer', 'legal', 'contract', 'compliance', 'attorney', 'clause']):
        return {
            "domain": "LegalTech",
            "competitors": [
                {"name": "Harvey AI", "market_share": "28%", "strengths": ["Venture Funded", "Top-Tier Law Firm Adoption"], "weaknesses": ["Extremely Expensive"], "competitive_advantage": "Middle-Market Law Firm Accessibility"},
                {"name": "Casetext (Thomson Reuters)", "market_share": "32%", "strengths": ["Incumbent Legal Database"], "weaknesses": ["Slower Innovation Cycle"], "competitive_advantage": "Automated Multi-Jurisdictional Analysis"},
                {"name": "Ironclad", "market_share": "18%", "strengths": ["Contract Lifecycle Management"], "weaknesses": ["Complex Setup for Small Teams"], "competitive_advantage": "Instant Clause Redlining & Risk Scoring"}
            ],
            "tam": "$42B", "sam": "$11B", "som": "$780M", "growth": "16.8% CAGR",
            "swot": {
                "strengths": ["Reduces Legal Review Time by 80%", "High Legal Accuracy Benchmarks", "Encrypted Document Vault"],
                "weaknesses": ["High Liability Expectations", "Strict Bar Association Data Standards"],
                "opportunities": ["Corporate Legal Ops Expansion", "Cross-Border Contract Standardisation"],
                "threats": ["Hallucination Concerns in Legal Drafts", "Incumbent Legal Publishers Entering AI"]
            },
            "revenue_streams": ["Per-Lawyer Monthly Subscription", "Enterprise Contract Volume Tier", "Custom Clause API Access"],
            "cost_structure": ["Legal Data Licensing", "Security & SOC2 Audits", "Legal Counsel Advisory Board"],
            "mvp_phases": [
                {"phase": "Phase 1", "title": "Legal Prompt & Corpus Validation", "duration": "4 weeks", "tasks": ["Ingest case law database", "Benchmarking accuracy", "Law firm discovery"]},
                {"phase": "Phase 2", "title": "Redline Editor Engine", "duration": "12 weeks", "tasks": ["Document upload & diffing", "Risk score highlighting", "Export to Word"]},
                {"phase": "Phase 3", "title": "Boutique Law Firm Pilot", "duration": "6 weeks", "tasks": ["Pilot with 10 law firms", "Time saved tracking", "Security certification"]}
            ],
            "rev_base": 0.8, "rev_mult": 4.2
        }

    elif any(k in text for k in ['school', 'student', 'learn', 'education', 'course', 'tutor', 'edtech', 'university']):
        return {
            "domain": "EdTech",
            "competitors": [
                {"name": "Duolingo", "market_share": "40%", "strengths": ["Gamification", "Massive User Base"], "weaknesses": ["Limited Deep Mastery"], "competitive_advantage": "Personalized Socratic AI Tutoring"},
                {"name": "Coursera", "market_share": "25%", "strengths": ["University Partnerships"], "weaknesses": ["Low Completion Rates"], "competitive_advantage": "Adaptive Skill Mastery Pathways"},
                {"name": "Chegg", "market_share": "15%", "strengths": ["Homework Database"], "weaknesses": ["Declining Subscriptions"], "competitive_advantage": "Real-time Interactive Concept Diagnostics"}
            ],
            "tam": "$180B", "sam": "$45B", "som": "$3.2B", "growth": "15.2% CAGR",
            "swot": {
                "strengths": ["Hyper-Personalized Learning Pace", "High Student Engagement", "Instant Homework Breakdown"],
                "weaknesses": ["School Procurement Delay", "Student Churn During Summer Break"],
                "opportunities": ["AI Tutor for K-12 & Higher Ed", "Corporate Reskilling Programs"],
                "threats": ["Big Tech Free AI Models", "School District Budget Cuts"]
            },
            "revenue_streams": ["Freemium Student Subscription", "School District License", "Parent Analytics Add-on"],
            "cost_structure": ["Curriculum Content Creation", "Cloud Inference Costs", "EdTech Growth Marketing"],
            "mvp_phases": [
                {"phase": "Phase 1", "title": "Curriculum Mapping & Prompt Design", "duration": "3 weeks", "tasks": ["Map subject standards", "Design tutoring personas", "User testing"]},
                {"phase": "Phase 2", "title": "Interactive Learning App", "duration": "10 weeks", "tasks": ["Speech/text tutor interface", "Mastery tracking", "Gamified progress dashboard"]},
                {"phase": "Phase 3", "title": "Beta Classroom Trial", "duration": "6 weeks", "tasks": ["Deploy to 500 students", "Track grade improvements", "Teacher dashboard launch"]}
            ],
            "rev_base": 0.4, "rev_mult": 3.5
        }

    elif any(k in text for k in ['finance', 'bank', 'money', 'invest', 'fintech', 'crypto', 'pay', 'trading', 'tax']):
        return {
            "domain": "FinTech",
            "competitors": [
                {"name": "Stripe", "market_share": "38%", "strengths": ["Developer Mindshare", "Global API Infrastructure"], "weaknesses": ["High Transaction Fees"], "competitive_advantage": "AI Fraud Prevention & Automated Yield"},
                {"name": "Plaid", "market_share": "28%", "strengths": ["Financial Data Connectivity"], "weaknesses": ["Bank API Reliability"], "competitive_advantage": "Real-Time Multi-Bank Cashflow Predictive AI"},
                {"name": "Brex", "market_share": "16%", "strengths": ["Corporate Cards"], "weaknesses": ["Enterprise-Only Focus"], "competitive_advantage": "Automated Expense Audit & Tax Categorization"}
            ],
            "tam": "$210B", "sam": "$60B", "som": "$4.5B", "growth": "19.5% CAGR",
            "swot": {
                "strengths": ["Automates 90% of Financial Operations", "SOC2 / PCI-DSS Security Standard", "Real-Time Cash Runway Forecasts"],
                "weaknesses": ["Strict Financial Regulations (FINRA/SEC)", "Capital Intensive Customer Acquisition"],
                "opportunities": ["SMB Automated Tax Optimization", "Global Embedded Finance Integration"],
                "threats": ["Traditional Bank In-House Tech Upgrades", "Interest Rate Volatility"]
            },
            "revenue_streams": ["Monthly SaaS Platform Fee", "Interchange & Transaction Split", "Premium Financial Insights Fee"],
            "cost_structure": ["Banking API Aggregation Costs", "Financial Regulatory Compliance", "Security Infrastructure"],
            "mvp_phases": [
                {"phase": "Phase 1", "title": "Banking API & Security Build", "duration": "5 weeks", "tasks": ["Plaid/Yodlee connector", "AES-256 encryption setup", "Regulatory review"]},
                {"phase": "Phase 2", "title": "Financial Engine & Analytics UI", "duration": "12 weeks", "tasks": ["Automated ledger tagging", "Runway predictor chart", "Tax reporting dashboard"]},
                {"phase": "Phase 3", "title": "FinTech Beta Launch", "duration": "6 weeks", "tasks": ["Onboard 100 beta startups", "Verify transaction audit trail", "SOC2 audit completion"]}
            ],
            "rev_base": 0.6, "rev_mult": 4.0
        }

    # Default Industry Dynamic Generator (for generalized software, logistics, retail, etc.)
    clean_words = [w.capitalize() for w in re.findall(r'\b[a-zA-Z]{4,}\b', idea) if w.lower() not in ['this', 'that', 'with', 'from', 'your', 'about', 'using', 'based', 'powered']]
    main_kw = clean_words[0] if clean_words else "Innovation"
    second_kw = clean_words[1] if len(clean_words) > 1 else "Tech"

    return {
        "domain": f"{main_kw} Platform",
        "competitors": [
            {"name": f"{main_kw}Leader Inc", "market_share": "30%", "strengths": ["First-Mover Advantage", "Global Sales Force"], "weaknesses": ["Legacy Architecture", "Slower Innovation"], "competitive_advantage": f"Next-Gen AI {second_kw} Automation"},
            {"name": f"{second_kw}Flow Systems", "market_share": "20%", "strengths": ["Broad Feature Suite"], "weaknesses": ["Complex Onboarding"], "competitive_advantage": "1-Click Workflow Self-Service"},
            {"name": f"NextGen {main_kw}", "market_share": "12%", "strengths": ["Modern UX"], "weaknesses": ["High Pricing"], "competitive_advantage": "Transparent Usage-Based Pricing"}
        ],
        "tam": "$40B", "sam": "$12B", "som": "$850M", "growth": "15.0% CAGR",
        "swot": {
            "strengths": [f"Differentiated AI algorithm for {main_kw}", "Modular Cloud Architecture", "Fast Time-to-Value"],
            "weaknesses": ["Early-Stage Brand Awareness", "Developing Partner Ecosystem"],
            "opportunities": [f"Digitalization of {main_kw} Workflows", "International Market Expansion"],
            "threats": ["Competitive Price Wars", "Macroeconomic Slowdowns"]
        },
        "revenue_streams": [f"{main_kw} Monthly Subscription", "Enterprise Custom Deployment", "API Usage Tier"],
        "cost_structure": ["Cloud Infrastructure & GPU Compute", "Engineering Team R&D", "Customer Acquisition Marketing"],
        "mvp_phases": [
            {"phase": "Phase 1", "title": "Customer Research & Architecture", "duration": "4 weeks", "tasks": [f"Interview {main_kw} practitioners", "Draft system architecture", "UX wireframing"]},
            {"phase": "Phase 2", "title": "Core Platform MVP Build", "duration": "12 weeks", "tasks": [f"Build {main_kw} automated engine", "Frontend dashboard", "API integrations"]},
            {"phase": "Phase 3", "title": "Public Beta & Launch", "duration": "6 weeks", "tasks": ["Beta user onboarding", "Performance tuning", "Growth marketing launch"]}
        ],
        "rev_base": 0.5, "rev_mult": 3.6
    }


def get_idea_domain(idea: str) -> dict:
    """
    Returns domain analysis template clearly annotated as a heuristic benchmark
    to avoid presenting fallback values as empirical research.
    """
    data = _resolve_domain_template(idea)
    data["is_simulated_benchmark"] = True
    data["verification_status"] = "HEURISTIC_ESTIMATE"
    data["benchmark_notice"] = "Heuristic domain benchmark. Pending empirical verification."
    return data

