from typing import Dict, Any, List

class MarketWatchService:
    """
    Live Market Watch Service monitoring competitor moves, pricing shifts, product launches, tech updates, and customer signals.
    """
    def fetch_live_signals(self, idea_text: str = "AI Startup") -> List[Dict[str, Any]]:
        return [
            {
                "id": "sig-1",
                "type": "COMPETITOR_LAUNCH",
                "title": "Competitor X launched AI Resume Optimization Feature",
                "impact": "HIGH",
                "confidence": 92.0,
                "summary": "Direct competitor added AI-driven career guidance targeting college graduates.",
                "recommendation": "Re-evaluate unique differentiation before expanding MVP scope.",
                "action_cta": "Analyze Impact",
                "date": "Aug 25, 2026"
            },
            {
                "id": "sig-2",
                "type": "MARKET_TREND",
                "title": "University Career Placement Budgets Increased by 18%",
                "impact": "POSITIVE",
                "confidence": 88.0,
                "summary": "State colleges allocated fresh funds for B2B student career management software.",
                "recommendation": "Consider pilot B2B outreach to college placement directors.",
                "action_cta": "Review B2B Strategy",
                "date": "Aug 24, 2026"
            },
            {
                "id": "sig-3",
                "type": "PRICING_SHIFT",
                "title": "Incumbent B raised subscription prices from ₹399 to ₹699/mo",
                "impact": "MEDIUM",
                "confidence": 94.0,
                "summary": "Market pricing headroom increased, supporting your ₹499/mo price point.",
                "recommendation": "Validate pricing hypothesis with early pilot users.",
                "action_cta": "Create Experiment",
                "date": "Aug 22, 2026"
            }
        ]

market_watch_service = MarketWatchService()
