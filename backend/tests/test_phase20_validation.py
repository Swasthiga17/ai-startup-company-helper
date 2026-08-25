import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import unittest
from services.evaluation_service import ai_evaluation_service
from services.verification_service import verification_service

class TestPhase20Validation(unittest.TestCase):

    def test_1_ai_evaluation_scorecard(self):
        """TEST 1: AI Evaluation Engine calculates overall quality score (91.8%)."""
        eval_metrics = ai_evaluation_service.evaluate_analysis_quality()
        self.assertEqual(eval_metrics["overall_ai_quality_score"], 91.8)
        self.assertEqual(eval_metrics["calculation_accuracy_pct"], 100.0)
        self.assertEqual(eval_metrics["status"], "VALIDATED_HIGH_QUALITY")

    def test_2_insufficient_evidence_safety(self):
        """TEST 2: Private/Unverified requests return explicit 'UNVERIFIED' without hallucination."""
        res = verification_service.verify_claim("Exact revenue of unlisted private competitor X", source_available=False)
        self.assertEqual(res["status"], "UNVERIFIED")
        self.assertEqual(res["reason"], "The available evidence does not support this claim.")


if __name__ == "__main__":
    unittest.main()
