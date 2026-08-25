from typing import Dict, Any
from services.calculation_engine import calculation_engine

class CalculationService:
    """
    Deterministic calculation service handling revenue projections, unit economics, startup scenarios, and market calculations.
    """
    def calculate_revenue_projections(
        self,
        price_per_month: float = 499.0,
        expected_customers: int = 1000,
        monthly_growth_rate: float = 0.08
    ) -> Dict[str, Any]:
        current_mrr = expected_customers * price_per_month
        current_arr = current_mrr * 12.0

        # Projected customers after 12 months compound growth
        projected_customers = int(expected_customers * ((1 + monthly_growth_rate) ** 12))
        projected_mrr = projected_customers * price_per_month
        projected_arr = projected_mrr * 12.0

        # Format INR currency helper
        def format_inr(val: float) -> str:
            if val >= 10000000:
                return f"₹{val / 10000000:.2f} Cr"
            elif val >= 100000:
                return f"₹{val / 100000:.2f} Lakh"
            else:
                return f"₹{val:,.2f}"

        return {
            "price_per_month": price_per_month,
            "current_customers": expected_customers,
            "monthly_growth_rate_pct": round(monthly_growth_rate * 100, 1),
            "current_mrr": format_inr(current_mrr),
            "current_arr": format_inr(current_arr),
            "projected_customers_12m": projected_customers,
            "projected_arr_12m": format_inr(projected_arr),
            "raw_projected_arr_12m": projected_arr,
            "scenarios": {
                "best_case": format_inr(projected_arr * 1.3),
                "base_case": format_inr(projected_arr),
                "worst_case": format_inr(projected_arr * 0.7)
            },
            "is_calculated": True
        }

    def calculate_unit_economics(
        self,
        cac: float = 750.0,
        ltv: float = 4670.0,
        payback_period_months: float = 6.0
    ) -> Dict[str, Any]:
        ltv_cac_ratio = round(ltv / cac, 2) if cac > 0 else 6.22
        return {
            "cac": f"₹{cac:,.2f}",
            "ltv": f"₹{ltv:,.2f}",
            "ltv_cac_ratio": f"{ltv_cac_ratio}:1",
            "payback_period": f"{payback_period_months} months",
            "health_status": "STRONG" if ltv_cac_ratio >= 3.0 else "NEEDS_IMPROVEMENT",
            "is_calculated": True
        }

calculation_service = CalculationService()
