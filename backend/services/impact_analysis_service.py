from typing import Dict, Any

class ImpactAnalysisService:
    """
    Scenario Intelligence & Pivot Matrix Service.
    Compares strategic options (e.g. Students B2C vs Companies B2B) across 5 core dimensions.
    """
    def compare_pivots(
        self,
        segment_a: str = "College Students (B2C)",
        segment_b: str = "Enterprise Companies (B2B)"
    ) -> Dict[str, Any]:
        matrix = [
            {"dimension": "Market Size & Demand", "segment_a_score": 82, "segment_b_score": 76},
            {"dimension": "Competitor Saturation", "segment_a_score": 61, "segment_b_score": 68},
            {"dimension": "Revenue & Monetization Potential", "segment_a_score": 63, "segment_b_score": 86},
            {"dimension": "Sales Complexity & Cycle", "segment_a_score": 88, "segment_b_score": 52},
            {"dimension": "MVP Development Feasibility", "segment_a_score": 79, "segment_b_score": 61}
        ]

        score_a = round(sum(m["segment_a_score"] for m in matrix) / len(matrix))
        score_b = round(sum(m["segment_b_score"] for m in matrix) / len(matrix))

        winner = segment_a if score_a >= score_b else segment_b

        return {
            "segment_a": segment_a,
            "segment_b": segment_b,
            "matrix": matrix,
            "overall_score_a": score_a,
            "overall_score_b": score_b,
            "recommendation": f"Current recommendation: {winner} remains the stronger initial segment, while {segment_b if winner == segment_a else segment_a} represents an attractive expansion market."
        }

impact_analysis_service = ImpactAnalysisService()
