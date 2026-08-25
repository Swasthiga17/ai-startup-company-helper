import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import unittest
from services.beta_validation_service import beta_validation_service

class TestPhase21BetaValidation(unittest.TestCase):

    def test_1_beta_founder_metrics(self):
        """TEST 1: Beta Validation Service calculates acceptance and completion metrics."""
        metrics = beta_validation_service.calculate_beta_metrics()
        self.assertEqual(metrics["target_beta_founders"], 30)
        self.assertEqual(metrics["founder_acceptance_rate_pct"], 88.0)
        self.assertEqual(metrics["action_completion_rate_pct"], 85.7)
        self.assertEqual(metrics["status"], "READY_FOR_PRIVATE_BETA")


if __name__ == "__main__":
    unittest.main()
