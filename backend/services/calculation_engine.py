from typing import Dict, Any, Optional

class CalculationEngine:
    """
    Pure Python deterministic calculation engine for financial, unit economic, and market sizing metrics.
    Prevents LLM numerical hallucinations by separating math calculations from LLM interpretation.
    """
    def calculate_financial_projections(
        self,
        target_customers: int = 10000,
        conversion_rate: float = 0.05,
        price_per_month: float = 499.0,
        monthly_growth_rate: float = 0.125,
        monthly_expenses: float = 120000.0,
        starting_cash: float = 1500000.0
    ) -> Dict[str, Any]:
        # Paid Customers
        paid_customers = int(target_customers * conversion_rate)

        # Monthly Recurring Revenue (MRR)
        mrr = paid_customers * price_per_month

        # Annual Recurring Revenue (ARR)
        arr = mrr * 12.0

        # Customer Acquisition Cost (CAC estimate)
        cac = round(price_per_month * 1.5, 2)

        # Customer Lifetime Value (LTV estimate with 12 month average lifespan)
        ltv = round(price_per_month * 12.0 * 0.78, 2)  # 78% gross margin

        # LTV to CAC Ratio
        ltv_cac_ratio = round(ltv / cac, 2) if cac > 0 else 3.5

        # Burn Rate & Runway
        net_mrr = mrr * 0.78
        monthly_burn = max(0.0, monthly_expenses - net_mrr)
        runway_months = round(starting_cash / monthly_burn, 1) if monthly_burn > 0 else 24.0

        # Year 1, Year 2, Year 3 Projections
        year1_arr = arr
        year2_arr = round(arr * (1 + monthly_growth_rate * 12), 2)
        year3_arr = round(year2_arr * (1 + (monthly_growth_rate * 0.8) * 12), 2)

        return {
            "target_customers": target_customers,
            "conversion_rate_pct": round(conversion_rate * 100, 1),
            "paid_customers": paid_customers,
            "price_per_month": price_per_month,
            "mrr": f"₹{mrr:,.2f}",
            "arr": f"₹{arr:,.2f}",
            "cac": f"₹{cac:,.2f}",
            "ltv": f"₹{ltv:,.2f}",
            "ltv_cac_ratio": f"{ltv_cac_ratio}:1",
            "gross_margin": "78%",
            "monthly_burn": f"₹{monthly_burn:,.2f}",
            "runway": f"{runway_months} months",
            "year1_arr": f"₹{year1_arr:,.2f}",
            "year2_arr": f"₹{year2_arr:,.2f}",
            "year3_arr": f"₹{year3_arr:,.2f}",
            "is_calculated": True
        }

    def calculate_market_sizing(
        self,
        population_target: int = 50000000,
        penetration_sam_pct: float = 0.30,
        penetration_som_pct: float = 0.04,
        annual_arpu: float = 5988.0
    ) -> Dict[str, Any]:
        tam_val = population_target * annual_arpu
        sam_val = tam_val * penetration_sam_pct
        som_val = tam_val * penetration_som_pct

        def format_currency(val: float) -> str:
            if val >= 1e9:
                return f"${val / 1e9:.1f}B"
            elif val >= 1e6:
                return f"${val / 1e6:.1f}M"
            else:
                return f"${val:,.0f}"

        return {
            "tam": format_currency(tam_val),
            "sam": format_currency(sam_val),
            "som": format_currency(som_val),
            "raw_tam": tam_val,
            "raw_sam": sam_val,
            "raw_som": som_val,
            "arpu": f"${annual_arpu:,.0f}/yr",
            "is_calculated": True
        }

calculation_engine = CalculationEngine()
