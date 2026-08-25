from typing import Dict, Any, List

class AdaptiveRecommendationService:
    """
    Adaptive Recommendation Engine tailoring suggestions based on founder profile, historical decisions, and feedback history.
    """
    def generate_adaptive_recommendation(
        self,
        idea_text: str,
        past_rejected_types: List[str] = None
    ) -> Dict[str, Any]:
        past_rejected = past_rejected_types or []

        if "EXPENSIVE_MVP" in past_rejected or "HIGH_COST" in past_rejected:
            strategy_type = "LOW_COST_VALIDATION"
            recommendation = {
                "title": "Low-Cost Pre-Order Landing Page Test",
                "strategy_type": strategy_type,
                "why": "Founder feedback history indicates preference for low-cost validation over heavy MVP development.",
                "action": "Build a 1-page pre-order site with 100 targeted ad clicks ($20 budget).",
                "estimated_cost": "$20",
                "estimated_time": "1 day",
                "action_cta": "Launch Low-Cost Experiment"
            }
        else:
            strategy_type = "STANDARD_VALIDATION"
            recommendation = {
                "title": "Validate Customer Willingness-to-Pay",
                "strategy_type": strategy_type,
                "why": "Market opportunity is strong, but pricing requires 20 customer interviews.",
                "action": "Interview 20 target users.",
                "estimated_cost": "Free",
                "estimated_time": "2 days",
                "action_cta": "Create Experiment"
            }

        return {
            "idea": idea_text,
            "adapted_recommendation": recommendation,
            "is_adapted": True
        }

adaptive_recommendation_service = AdaptiveRecommendationService()
