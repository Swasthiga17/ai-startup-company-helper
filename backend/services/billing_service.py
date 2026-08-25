from typing import Dict, Any, Optional

class BillingService:
    """
    Phase 24 Commercial Billing, Feature Entitlement Middleware, AI Cost Tracking, and SaaS Metrics Engine.
    """
    PLAN_LIMITS = {
        "FREE": {"max_analyses": 3, "max_startups": 1, "has_live_watch": False, "has_decision_center": True},
        "PRO": {"max_analyses": 50, "max_startups": 5, "has_live_watch": True, "has_decision_center": True},
        "FOUNDER": {"max_analyses": 500, "max_startups": 100, "has_live_watch": True, "has_decision_center": True}
    }

    def check_entitlement(self, user_plan: str = "FREE", current_usage: int = 1) -> Dict[str, Any]:
        plan = user_plan.upper()
        limits = self.PLAN_LIMITS.get(plan, self.PLAN_LIMITS["FREE"])
        max_allowed = limits["max_analyses"]

        if current_usage >= max_allowed:
            return {
                "allowed": False,
                "reason": f"You've reached your monthly analysis limit ({current_usage}/{max_allowed} for {plan} plan).",
                "action_cta": "Upgrade to Pro",
                "current_usage": current_usage,
                "max_allowed": max_allowed
            }

        return {
            "allowed": True,
            "current_usage": current_usage,
            "max_allowed": max_allowed,
            "remaining": max_allowed - current_usage
        }

    def calculate_ai_unit_economics(
        self,
        paid_user_arpu: float = 999.0,
        avg_tokens_per_user: int = 120000,
        token_cost_per_1k: float = 0.0708  # ~₹0.07 per 1k tokens
    ) -> Dict[str, Any]:
        ai_cost_per_user = round((avg_tokens_per_user / 1000.0) * token_cost_per_1k, 2)
        gross_margin_pct = round(((paid_user_arpu - ai_cost_per_user) / paid_user_arpu) * 100, 1)

        return {
            "arpu": f"₹{paid_user_arpu:,.2f}",
            "avg_tokens_per_user": avg_tokens_per_user,
            "ai_cost_per_user": f"₹{ai_cost_per_user:,.2f}",
            "gross_margin_pct": f"{gross_margin_pct}%",
            "is_profitable": gross_margin_pct > 80.0
        }

    def get_saas_business_metrics(self) -> Dict[str, Any]:
        total_users = 1250
        active_users = 680
        paid_users = 120
        conversion_rate = round((paid_users / total_users) * 100, 1) # 9.6%

        # 100 Pro at ₹999 + 20 Founder at ₹2499
        mrr = (100 * 999) + (20 * 2499) # ₹149,860
        arr = mrr * 12

        return {
            "total_users": total_users,
            "active_users": active_users,
            "paid_users": paid_users,
            "conversion_rate_pct": conversion_rate,
            "mrr": f"₹{mrr:,.2f}",
            "arr": f"₹{arr:,.2f}",
            "churn_rate_pct": 1.8,
            "ai_cost_per_user": "₹14.20",
            "gross_margin": "91.5%",
            "founder_value_score": 91.2
        }

billing_service = BillingService()
