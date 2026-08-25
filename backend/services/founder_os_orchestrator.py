from typing import Dict, Any, List

class FounderOSOrchestrator:
    """
    Phase 25 AI Chief of Staff & FounderOS Orchestrator.
    Coordinates 6 specialized department agents and generates Weekly Founder Briefs.
    """
    DEPARTMENT_AGENTS = [
        {"name": "Strategy Agent", "focus": "Priorities, Goals, Risk & Decisions", "status": "ACTIVE"},
        {"name": "Research Agent", "focus": "Market Intelligence & Competitors", "status": "ACTIVE"},
        {"name": "Growth Agent", "focus": "Acquisition & Conversion Experiments", "status": "ACTIVE"},
        {"name": "Finance Agent", "focus": "Revenue Forecasts & Unit Economics", "status": "ACTIVE"},
        {"name": "Product Agent", "focus": "MVP Roadmap & Feature Priorities", "status": "ACTIVE"},
        {"name": "Analytics Agent", "focus": "KPI Monitoring & Anomaly Detection", "status": "ACTIVE"}
    ]

    def generate_weekly_brief(self, startup_name: str = "My AI Startup") -> Dict[str, Any]:
        return {
            "startup": startup_name,
            "period": "Week 34, 2026",
            "brief_summary": "AI Chief of Staff weekly executive intelligence summary.",
            "signals": {
                "critical": [
                    {
                        "category": "🔴 Critical",
                        "title": "Competitor Launch Alert",
                        "detail": "Competitor X launched a feature similar to your planned MVP segment."
                    }
                ],
                "important": [
                    {
                        "category": "🟠 Important",
                        "title": "Pricing Conversion Risk",
                        "detail": "Your current pricing may reduce conversion at your target segment."
                    }
                ],
                "opportunity": [
                    {
                        "category": "🟢 Opportunity",
                        "title": "Strong Validation Signals",
                        "detail": "Three customer segments show stronger validation signals."
                    }
                ]
            },
            "recommended_actions": [
                {
                    "title": "Interview 5 target customers",
                    "risk_level": "🟢 LOW_RISK",
                    "requires_approval": False,
                    "action_cta": "Execute Task"
                },
                {
                    "title": "Run pricing experiment",
                    "risk_level": "🟡 MEDIUM_RISK",
                    "requires_approval": True,
                    "action_cta": "Approve Pricing Experiment"
                },
                {
                    "title": "Adjust MVP Feature Priorities",
                    "risk_level": "🟡 MEDIUM_RISK",
                    "requires_approval": True,
                    "action_cta": "Approve Roadmap Update"
                }
            ],
            "weekly_calendar": [
                {"day": "Monday", "focus": "Customer Interviews"},
                {"day": "Tuesday", "focus": "Competitor Analysis"},
                {"day": "Wednesday", "focus": "MVP Iteration"},
                {"day": "Thursday", "focus": "Pricing Experiment"},
                {"day": "Friday", "focus": "KPI & Metric Review"}
            ]
        }

    def classify_action_risk(self, action_type: str) -> Dict[str, Any]:
        high_risk_keywords = ["FINANCIAL", "CONTRACT", "LEGAL", "DELETE_DATA", "TRANSACTION"]
        medium_risk_keywords = ["EMAIL_CAMPAIGN", "PRICING_EXPERIMENT", "PUBLISH_CONTENT", "UPDATE_ROADMAP"]

        act_upper = action_type.upper()
        if any(k in act_upper for k in high_risk_keywords):
            return {
                "action_type": action_type,
                "risk_level": "🔴 HIGH_RISK",
                "requires_approval": True,
                "auto_executable": False,
                "policy": "Mandatory explicit founder approval required."
            }
        elif any(k in act_upper for k in medium_risk_keywords):
            return {
                "action_type": action_type,
                "risk_level": "🟡 MEDIUM_RISK",
                "requires_approval": True,
                "auto_executable": False,
                "policy": "Requires founder review & sign-off."
            }
        else:
            return {
                "action_type": action_type,
                "risk_level": "🟢 LOW_RISK",
                "requires_approval": False,
                "auto_executable": True,
                "policy": "Safe for automated execution."
            }

founder_os_orchestrator = FounderOSOrchestrator()
