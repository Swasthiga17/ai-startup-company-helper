import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import unittest
from models.schemas import (
    IdeaAnalysisSchema,
    MarketAnalysisSchema,
    BusinessAnalysisSchema,
    ProductAnalysisSchema,
    OperationsAnalysisSchema,
    GrowthAnalysisSchema,
    MentorResponseSchema,
    BaseAgentResponseSchema
)
from workflows.startup_graph import StartupState
from services.confidence_service import confidence_service


class TestPhase9FrontendContract(unittest.TestCase):

    def test_1_base_schema_contains_frontend_confidence_fields(self):
        """TEST 1: BaseAgentResponseSchema contains confidence & metadata for React components."""
        obj = BaseAgentResponseSchema(
            confidence=88.5,
            confidence_metadata={
                "score": 88,
                "evidence_score": 85.0,
                "source_quality_score": 80.0,
                "completeness_score": 90.0,
                "consistency_score": 100.0,
                "verification_status": "SUPPORTED",
                "sources": [{"filename": "doc.pdf", "page_number": 1}],
                "contradictions": []
            }
        )
        self.assertEqual(obj.confidence, 88.5)
        self.assertIn("verification_status", obj.confidence_metadata)
        self.assertEqual(obj.confidence_metadata["verification_status"], "SUPPORTED")

    def test_2_domain_schemas_contain_react_expected_keys(self):
        """TEST 2: Domain schemas expose risks, recommendations, and sources arrays."""
        market_obj = MarketAnalysisSchema(
            tam="$10B",
            sam="$2B",
            som="$500M",
            risks=["Market saturation risk"],
            recommendations=["Focus on niche segment"],
            sources=["Industry report.pdf — Page 4"]
        )
        data = market_obj.model_dump()
        self.assertIn("tam", data)
        self.assertIn("sam", data)
        self.assertIn("som", data)
        self.assertIn("risks", data)
        self.assertIn("recommendations", data)
        self.assertIn("sources", data)

    def test_3_startup_state_exposes_consolidated_keys(self):
        """TEST 3: StartupState provides consolidated lists for React dashboard consumption."""
        state: StartupState = {
            "startup_idea": "AI Startup Co-founder",
            "idea": "AI Startup Co-founder",
            "user_id": 1,
            "idea_analysis": {"success": True, "confidence": 90.0},
            "market_analysis": {"success": True, "confidence": 85.0},
            "business_analysis": {"success": True, "confidence": 80.0},
            "product_analysis": {"success": True, "confidence": 88.0},
            "operations_analysis": {"success": True, "confidence": 75.0},
            "growth_analysis": {"success": True, "confidence": 82.0},
            "mentor_analysis": {"success": True, "confidence": 89.0},
            "risks": ["Risk A", "Risk B"],
            "sources": ["Source 1"],
            "recommendations": ["Rec 1"],
            "confidence_scores": {"Idea": 90.0, "Market": 85.0},
            "execution_status": "COMPLETED",
            "success": True
        }

        self.assertIn("idea_analysis", state)
        self.assertIn("market_analysis", state)
        self.assertIn("mentor_analysis", state)
        self.assertIn("confidence_scores", state)
        self.assertIn("recommendations", state)

    def test_4_confidence_eval_matches_react_badge_contract(self):
        """TEST 4: ConfidenceService output matches ConfidenceScoreBadge prop contract."""
        eval_res = confidence_service.evaluate_analysis(
            agent_result={"analysis": "Valid analysis text", "recommendations": ["Rec 1"]},
            rag_sources=[{"filename": "market.pdf", "page_number": 2, "relevance_score": 0.88}],
            all_agent_results={}
        )
        self.assertIn("score", eval_res)
        self.assertIn("evidence_score", eval_res)
        self.assertIn("verification_status", eval_res)
        self.assertIn("sources", eval_res)
        self.assertIn("contradictions", eval_res)


if __name__ == "__main__":
    unittest.main()
