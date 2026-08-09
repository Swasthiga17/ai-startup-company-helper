import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import unittest
from services.confidence_service import confidence_service, ConfidenceService
from models.schemas import BaseAgentResponseSchema, IdeaAnalysisSchema


class TestPhase7Confidence(unittest.TestCase):

    def test_1_no_evidence_low_confidence(self):
        """TEST 1: No evidence results in lower evidence score."""
        eval_res = confidence_service.evaluate_analysis(
            agent_result={"analysis": "Test idea", "recommendations": ["Do X"]},
            rag_sources=[]
        )
        self.assertLess(eval_res["evidence_score"], 40)
        self.assertEqual(eval_res["verification_status"], "AI_GENERATED")

    def test_2_one_relevant_source_increased_confidence(self):
        """TEST 2: One relevant source increases evidence score."""
        eval_res = confidence_service.evaluate_analysis(
            agent_result={"analysis": "Test idea", "recommendations": ["Do X"]},
            rag_sources=[{"filename": "report.pdf", "page_number": 1, "relevance_score": 0.85}]
        )
        self.assertGreater(eval_res["evidence_score"], 50)
        self.assertIn(eval_res["verification_status"], ["PARTIALLY_SUPPORTED", "SUPPORTED"])

    def test_3_multiple_sources_stronger_evidence(self):
        """TEST 3: Multiple relevant sources yield higher evidence score."""
        sources = [
            {"filename": "report1.pdf", "page_number": 1, "relevance_score": 0.90},
            {"filename": "report2.pdf", "page_number": 5, "relevance_score": 0.88},
            {"filename": "report3.pdf", "page_number": 12, "relevance_score": 0.92}
        ]
        eval_res = confidence_service.evaluate_analysis(
            agent_result={"analysis": "Full analysis", "recommendations": ["A"], "risks": ["B"]},
            rag_sources=sources
        )
        self.assertGreaterEqual(eval_res["evidence_score"], 80)
        self.assertEqual(eval_res["verification_status"], "VERIFIED")

    def test_4_missing_fields_lower_completeness(self):
        """TEST 4: Empty analysis fields yield lower completeness score."""
        incomplete_res = {"analysis": ""}
        comp_score = confidence_service.calculate_completeness_score(incomplete_res)
        self.assertLess(comp_score, 50)

    def test_5_contradictory_agent_outputs_lower_consistency(self):
        """TEST 5: Contradictory agent outputs lower consistency score."""
        state_with_contradictions = {
            "market_analysis": {"analysis": "We target B2B Enterprise clients with enterprise sales strategy"},
            "business_analysis": {"analysis": "We sell to B2C Consumer end users via app store subscriptions"}
        }
        cons_score = confidence_service.calculate_consistency_score(state_with_contradictions)
        self.assertLess(cons_score, 100)
        contradictions = confidence_service.detect_contradictions(state_with_contradictions)
        self.assertTrue(len(contradictions) > 0)

    def test_6_consistent_agent_outputs_higher_consistency(self):
        """TEST 6: Consistent outputs yield 100% consistency score."""
        state_aligned = {
            "market_analysis": {"analysis": "Targeting B2B SaaS enterprise customers"},
            "business_analysis": {"analysis": "B2B SaaS annual recurring contract model"}
        }
        cons_score = confidence_service.calculate_consistency_score(state_aligned)
        self.assertEqual(cons_score, 100.0)

    def test_7_gemini_confidence_cannot_override(self):
        """TEST 7: Model self-reported 99% confidence cannot override backend calculation."""
        eval_res = confidence_service.evaluate_analysis(
            agent_result={"analysis": "Short", "recommendations": []},
            rag_sources=[],
            gemini_confidence=99.0
        )
        self.assertNotEqual(eval_res["score"], 99)
        self.assertLess(eval_res["score"], 70)

    def test_8_score_always_bounded_0_to_100(self):
        """TEST 8: Score is strictly normalized between 0 and 100."""
        eval_res = confidence_service.evaluate_analysis(agent_result={}, rag_sources=[])
        self.assertGreaterEqual(eval_res["score"], 0)
        self.assertLessEqual(eval_res["score"], 100)

    def test_9_verification_status_rules(self):
        """TEST 9: Verification status follows explicit evidence rules."""
        st_no_ev = confidence_service.determine_verification_status(20.0, [], [])
        self.assertEqual(st_no_ev, "AI_GENERATED")

        st_contradiction = confidence_service.determine_verification_status(80.0, [{"filename": "f.pdf"}], [{"issue": "mismatch"}])
        self.assertEqual(st_contradiction, "UNSUPPORTED")

    def test_10_confidence_schema_validates(self):
        """TEST 10: Pydantic BaseAgentResponseSchema accepts confidence_metadata."""
        obj = IdeaAnalysisSchema(
            problem="Test problem",
            value_proposition="Test value",
            confidence=82.0,
            confidence_metadata={"score": 82, "verification_status": "SUPPORTED"}
        )
        self.assertEqual(obj.confidence, 82.0)
        self.assertEqual(obj.confidence_metadata["verification_status"], "SUPPORTED")

    def test_11_real_evidence_test(self):
        """TEST 11 (REAL EVIDENCE TEST): Tests A, B, C, D progression."""
        # A: No evidence
        res_a = confidence_service.evaluate_analysis({"analysis": "Idea"}, rag_sources=[])
        # B: One source
        src1 = [{"filename": "doc1.pdf", "page_number": 2, "relevance_score": 0.80}]
        res_b = confidence_service.evaluate_analysis({"analysis": "Idea"}, rag_sources=src1)
        # C: Multiple sources
        src_multi = src1 + [{"filename": "doc2.pdf", "page_number": 5, "relevance_score": 0.90}]
        res_c = confidence_service.evaluate_analysis({"analysis": "Idea"}, rag_sources=src_multi)

        self.assertLess(res_a["score"], res_b["score"])
        self.assertLessEqual(res_b["score"], res_c["score"])


if __name__ == "__main__":
    unittest.main()
