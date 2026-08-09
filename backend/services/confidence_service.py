import re
from typing import Dict, Any, List, Optional


class ConfidenceService:
    """
    Independent Authoritative Confidence Evaluation Engine for IdeaExecutor.
    Calculates evidence score, source quality score, completeness score,
    and cross-agent consistency score. Never trusts model self-reported confidence.
    """

    @staticmethod
    def calculate_evidence_score(rag_sources: List[Dict[str, Any]]) -> float:
        """
        Calculates evidence score (0-100) based on retrieved RAG sources and relevance.
        """
        if not rag_sources:
            return 20.0  # Base score for un-evidenced AI generation

        count = len(rag_sources)
        avg_relevance = sum(s.get("relevance_score", 0.7) for s in rag_sources) / count if count > 0 else 0.7

        # 1 source: up to 65, 2 sources: up to 85, 3+ sources: up to 100
        count_multiplier = min(1.0, count / 3.0)
        score = (0.5 * count_multiplier * 100) + (0.5 * avg_relevance * 100)
        return round(max(0.0, min(100.0, score)), 2)

    @staticmethod
    def calculate_source_quality_score(rag_sources: List[Dict[str, Any]]) -> float:
        """
        Evaluates source metadata completeness (filename, page number, chunk ID).
        """
        if not rag_sources:
            return 0.0

        quality_points = 0
        total_possible = len(rag_sources) * 3

        for s in rag_sources:
            if s.get("filename") and s.get("filename") != "Document":
                quality_points += 1
            if s.get("page_number") is not None:
                quality_points += 1
            if s.get("relevance_score") and s.get("relevance_score") > 0:
                quality_points += 1

        score = (quality_points / total_possible) * 100 if total_possible > 0 else 0.0
        return round(max(0.0, min(100.0, score)), 2)

    @staticmethod
    def calculate_completeness_score(agent_result: Dict[str, Any]) -> float:
        """
        Evaluates analysis completeness against expected non-empty fields.
        """
        if not isinstance(agent_result, dict) or not agent_result.get("success", True):
            return 0.0

        key_fields = ["analysis", "recommendations", "risks", "target_customer", "pain_points", "features"]
        present_count = 0
        total_eval = 0

        for key, val in agent_result.items():
            if key in ["success", "confidence", "sources", "raw_model_confidence"]:
                continue
            total_eval += 1
            if val and (not isinstance(val, (list, dict, str)) or len(val) > 0):
                present_count += 1

        if total_eval == 0:
            return 50.0

        score = (present_count / total_eval) * 100
        return round(max(0.0, min(100.0, score)), 2)

    @staticmethod
    def detect_contradictions(all_agent_results: Dict[str, Dict[str, Any]]) -> List[Dict[str, str]]:
        """
        Detects cross-agent contradictions in terminology or strategy.
        Example: Market says B2B Enterprise while Business says B2C Consumer.
        """
        contradictions = []
        if not all_agent_results:
            return contradictions

        # Helper to extract text from agent output
        def extract_text(agent_key: str) -> str:
            res = all_agent_results.get(agent_key, {})
            if isinstance(res, dict):
                return str(res.get("analysis", "")) + " " + str(res.get("target_customer", "")) + " " + str(res)
            return ""

        market_text = extract_text("market_analysis").lower()
        business_text = extract_text("business_analysis").lower()
        product_text = extract_text("product_analysis").lower()

        # Check Target Customer contradiction
        if ("b2b" in market_text or "enterprise" in market_text) and ("b2c" in business_text or "consumer" in business_text):
            contradictions.append({
                "type": "TARGET_CUSTOMER_MISMATCH",
                "agents": "Market vs Business",
                "issue": "Market agent targets B2B Enterprise while Business agent references B2C Consumer strategy."
            })

        # Check Product Format contradiction
        if ("mobile app" in product_text or "ios/android" in product_text) and ("enterprise saas" in business_text or "desktop software" in business_text):
            contradictions.append({
                "type": "PRODUCT_FORMAT_MISMATCH",
                "agents": "Product vs Business",
                "issue": "Product agent specifies Mobile App while Business agent models Enterprise Desktop/SaaS."
            })

        return contradictions

    @classmethod
    def calculate_consistency_score(cls, all_agent_results: Dict[str, Dict[str, Any]]) -> float:
        """
        Calculates cross-agent consistency score (0-100) based on detected contradictions.
        """
        contradictions = cls.detect_contradictions(all_agent_results)
        if not contradictions:
            return 100.0
        
        penalty = len(contradictions) * 25.0
        score = max(0.0, 100.0 - penalty)
        return round(score, 2)

    @classmethod
    def determine_verification_status(cls, evidence_score: float, rag_sources: List[Dict[str, Any]], contradictions: List[Any]) -> str:
        """
        Determines verification status:
        AI_GENERATED | PARTIALLY_SUPPORTED | SUPPORTED | VERIFIED | UNSUPPORTED
        """
        if contradictions:
            return "UNSUPPORTED"
        if not rag_sources or evidence_score < 30:
            return "AI_GENERATED"
        if len(rag_sources) >= 3 and evidence_score >= 80:
            return "VERIFIED"
        if len(rag_sources) >= 2 and evidence_score >= 60:
            return "SUPPORTED"
        return "PARTIALLY_SUPPORTED"

    @classmethod
    def evaluate_analysis(
        cls,
        agent_result: Dict[str, Any],
        rag_sources: Optional[List[Dict[str, Any]]] = None,
        all_agent_results: Optional[Dict[str, Dict[str, Any]]] = None,
        gemini_confidence: Optional[float] = None
    ) -> Dict[str, Any]:
        """
        Main evaluation method. Calculates authoritative confidence score (0-100)
        using documented 35/25/20/20 weights. Ignores raw Gemini self-confidence.
        """
        rag_sources = rag_sources or []
        all_agent_results = all_agent_results or {}

        evidence_score = cls.calculate_evidence_score(rag_sources)
        source_quality_score = cls.calculate_source_quality_score(rag_sources)
        completeness_score = cls.calculate_completeness_score(agent_result)
        consistency_score = cls.calculate_consistency_score(all_agent_results)
        contradictions = cls.detect_contradictions(all_agent_results)

        # Documented Weighting System:
        # Evidence: 35%, Source Quality: 25%, Completeness: 20%, Consistency: 20%
        raw_final_score = (
            (0.35 * evidence_score) +
            (0.25 * source_quality_score) +
            (0.20 * completeness_score) +
            (0.20 * consistency_score)
        )

        final_score = int(round(max(0, min(100, raw_final_score))))
        verification_status = cls.determine_verification_status(evidence_score, rag_sources, contradictions)

        return {
            "score": final_score,
            "evidence_score": round(evidence_score, 1),
            "source_quality_score": round(source_quality_score, 1),
            "completeness_score": round(completeness_score, 1),
            "consistency_score": round(consistency_score, 1),
            "verification_status": verification_status,
            "contradictions": contradictions,
            "sources": rag_sources,
            "raw_model_confidence_ignored": gemini_confidence
        }


# Singleton instance
confidence_service = ConfidenceService()
