import json
from typing import Dict, Any, List, Optional
from services.llm_service import llm_service
from services.confidence_service import confidence_service
from utils.logger import logger


class SimulatorService:
    """
    Production What-If Decision Simulator Engine.
    Executes deterministic financial and operational calculations in Python.
    Passes pre-calculated deltas to Gemini for strategic explanation.
    """

    @staticmethod
    def calculate_scenario(
        idea: str,
        price_change_percent: float = 0.0,
        cac_change_percent: float = 0.0,
        new_engineers_count: int = 0,
        marketing_spend_change_percent: float = 0.0,
        expenses_change_percent: float = 0.0,
        baseline_data: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Calculates baseline vs scenario metrics deterministically.
        Handles zero baseline safely to prevent division by zero.
        """
        baseline_data = baseline_data or {}
        
        # 1. Establish Baseline Values
        b_mrr = float(baseline_data.get("monthly_revenue", 10000.0))
        b_cac = float(baseline_data.get("cac", 250.0))
        b_ltv = float(baseline_data.get("ltv", 2500.0))
        b_expenses = float(baseline_data.get("monthly_expenses", 8000.0))
        b_treasury = float(baseline_data.get("treasury_cash", 100000.0))
        
        b_burn = max(0.0, b_expenses - b_mrr)
        b_runway = round(b_treasury / b_burn, 1) if b_burn > 0 else 99.0
        b_ltv_cac = round(b_ltv / b_cac, 2) if b_cac > 0 else 10.0

        # 2. Compute Scenario Values (Deterministic Python Math)
        s_mrr = max(0.0, b_mrr * (1.0 + price_change_percent / 100.0))
        s_cac = max(1.0, b_cac * (1.0 + cac_change_percent / 100.0))
        s_ltv = b_ltv  # LTV remains grounded unless customer lifespan changes
        s_ltv_cac = round(s_ltv / s_cac, 2) if s_cac > 0 else 0.0

        engineer_cost = new_engineers_count * 5000.0  # $5,000/mo per dev
        s_expenses = max(0.0, (b_expenses * (1.0 + expenses_change_percent / 100.0)) + engineer_cost)
        s_burn = max(0.0, s_expenses - s_mrr)
        s_runway = round(b_treasury / s_burn, 1) if s_burn > 0 else 99.0
        s_dev_velocity = 100.0 + (new_engineers_count * 20.0)

        # Helper for delta calculation
        def get_metric_obj(name: str, baseline: float, scenario: float, lower_is_better: bool = False, is_ratio: bool = False) -> Dict[str, Any]:
            delta = round(scenario - baseline, 2)
            if baseline != 0.0:
                pct = round(((scenario - baseline) / abs(baseline)) * 100.0, 1)
            else:
                pct = 0.0

            if delta == 0:
                impact = "NEUTRAL"
            elif lower_is_better:
                impact = "POSITIVE" if delta < 0 else "NEGATIVE"
            else:
                impact = "POSITIVE" if delta > 0 else "NEGATIVE"

            if name == "LTV/CAC Ratio" and scenario < 3.0:
                impact = "CRITICAL"
            elif name == "Runway (Months)" and scenario < 6.0:
                impact = "CRITICAL"

            return {
                "name": name,
                "baseline": round(baseline, 2) if not is_ratio else baseline,
                "scenario": round(scenario, 2) if not is_ratio else scenario,
                "delta": delta,
                "percentage_change": pct,
                "impact": impact
            }

        metrics = [
            get_metric_obj("Monthly Revenue (MRR)", b_mrr, s_mrr, lower_is_better=False),
            get_metric_obj("CAC ($)", b_cac, s_cac, lower_is_better=True),
            get_metric_obj("LTV/CAC Ratio", b_ltv_cac, s_ltv_cac, lower_is_better=False, is_ratio=True),
            get_metric_obj("Monthly Expenses ($)", b_expenses, s_expenses, lower_is_better=True),
            get_metric_obj("Monthly Burn Rate ($)", b_burn, s_burn, lower_is_better=True),
            get_metric_obj("Runway (Months)", b_runway, s_runway, lower_is_better=False, is_ratio=True),
            get_metric_obj("Dev Velocity (Index)", 100.0, s_dev_velocity, lower_is_better=False)
        ]

        # 3. Risk Re-evaluation
        risk_changes = {
            "financial": "CRITICAL" if s_runway < 6.0 else ("HIGHER" if s_burn > b_burn else ("LOWER" if s_burn < b_burn else "UNCHANGED")),
            "growth": "LOWER" if s_mrr > b_mrr else ("HIGHER" if s_mrr < b_mrr else "UNCHANGED"),
            "operational": "HIGHER" if new_engineers_count >= 3 else "UNCHANGED",
            "market": "HIGHER" if s_cac > b_cac * 1.2 else "UNCHANGED"
        }

        any_critical = any(m["impact"] == "CRITICAL" for m in metrics)
        any_negative = any(m["impact"] == "NEGATIVE" for m in metrics)
        overall_impact = "CRITICAL" if any_critical else ("NEGATIVE" if any_negative else "POSITIVE")

        # 4. Ingest Calculated Values into Gemini for Explanation
        prompt = f"""
        You are IdeaExecutor's Strategic Scenario Advisor.
        Analyze these EXACT pre-calculated financial scenario results for startup: "{idea}".

        DETERMINISTIC PRE-CALCULATED RESULTS:
        {json.dumps(metrics, indent=2)}

        RISK CHANGES:
        {json.dumps(risk_changes, indent=2)}

        OVERALL IMPACT: {overall_impact}

        ANTI-HALLUCINATION RULES:
        - Do not recalculate numerical values.
        - Use the provided calculated values exactly.
        - Do not invent financial metrics.
        - Explain the implications of the supplied calculations concisely.

        Return strictly as a JSON object:
        {{
            "explanation": "Clear 2-sentence summary of why this scenario produces the calculated outcome.",
            "key_impacts": ["impact point 1", "impact point 2"],
            "recommendations": ["strategic recommendation 1", "strategic recommendation 2"],
            "next_steps": ["actionable next step 1"]
        }}
        """

        ai_res = llm_service.generate_json(prompt) or {
            "explanation": f"Adjusting pricing by {price_change_percent}% and CAC by {cac_change_percent}% changes projected runway to {s_runway} months.",
            "key_impacts": [f"MRR shifts to ${s_mrr:,.2f}", f"Burn rate shifts to ${s_burn:,.2f}/mo"],
            "recommendations": ["Monitor unit economics closely before expanding team size."],
            "next_steps": ["Run customer willingness-to-pay survey."]
        }

        # 5. Formulate Response Object
        return {
            "scenario": {
                "price_change_percent": price_change_percent,
                "cac_change_percent": cac_change_percent,
                "new_engineers_count": new_engineers_count,
                "marketing_spend_change_percent": marketing_spend_change_percent,
                "expenses_change_percent": expenses_change_percent
            },
            "baseline": {
                "monthly_revenue": b_mrr,
                "cac": b_cac,
                "ltv": b_ltv,
                "monthly_expenses": b_expenses,
                "burn_rate": b_burn,
                "runway_months": b_runway,
                "ltv_cac_ratio": b_ltv_cac
            },
            "metrics": metrics,
            "risk_changes": risk_changes,
            "overall_impact": overall_impact,
            "confidence": {
                "score": 95,
                "calculation_confidence": "HIGH_DETERMINISTIC",
                "ai_reasoning_status": "AI_GENERATED"
            },
            "ai_explanation": ai_res.get("explanation", ""),
            "key_impacts": ai_res.get("key_impacts", []),
            "recommendations": ai_res.get("recommendations", []),
            "next_steps": ai_res.get("next_steps", [])
        }


# Singleton instance
simulator_service = SimulatorService()
