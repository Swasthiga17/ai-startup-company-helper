import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import unittest
from services.simulator_service import simulator_service, SimulatorService


class TestPhase10Simulator(unittest.TestCase):

    def test_1_baseline_preservation_and_calculation(self):
        """TEST 1: Baseline metrics remain unchanged while scenario metrics are calculated."""
        baseline = {"monthly_revenue": 10000.0, "cac": 200.0, "monthly_expenses": 8000.0}
        res = simulator_service.calculate_scenario("Test Idea", price_change_percent=0.0, baseline_data=baseline)
        
        self.assertEqual(res["baseline"]["monthly_revenue"], 10000.0)
        self.assertEqual(res["baseline"]["cac"], 200.0)
        self.assertEqual(res["baseline"]["monthly_expenses"], 8000.0)

    def test_2_cac_increase_impact(self):
        """TEST 2: CAC increase produces NEGATIVE impact and increases CAC metric."""
        res = simulator_service.calculate_scenario("Test Idea", cac_change_percent=30.0, baseline_data={"cac": 200.0})
        cac_metric = next(m for m in res["metrics"] if m["name"] == "CAC ($)")
        
        self.assertEqual(cac_metric["baseline"], 200.0)
        self.assertEqual(cac_metric["scenario"], 260.0)
        self.assertEqual(cac_metric["delta"], 60.0)
        self.assertEqual(cac_metric["percentage_change"], 30.0)
        self.assertEqual(cac_metric["impact"], "NEGATIVE")

    def test_3_cac_decrease_impact(self):
        """TEST 3: CAC decrease produces POSITIVE impact."""
        res = simulator_service.calculate_scenario("Test Idea", cac_change_percent=-20.0, baseline_data={"cac": 200.0})
        cac_metric = next(m for m in res["metrics"] if m["name"] == "CAC ($)")
        self.assertEqual(cac_metric["scenario"], 160.0)
        self.assertEqual(cac_metric["impact"], "POSITIVE")

    def test_4_pricing_increase_revenue(self):
        """TEST 4: Pricing increase raises projected MRR with POSITIVE impact."""
        res = simulator_service.calculate_scenario("Test Idea", price_change_percent=25.0, baseline_data={"monthly_revenue": 10000.0})
        mrr_metric = next(m for m in res["metrics"] if m["name"] == "Monthly Revenue (MRR)")
        self.assertEqual(mrr_metric["scenario"], 12500.0)
        self.assertEqual(mrr_metric["impact"], "POSITIVE")

    def test_5_pricing_decrease_revenue(self):
        """TEST 5: Pricing decrease lowers MRR with NEGATIVE impact."""
        res = simulator_service.calculate_scenario("Test Idea", price_change_percent=-10.0, baseline_data={"monthly_revenue": 10000.0})
        mrr_metric = next(m for m in res["metrics"] if m["name"] == "Monthly Revenue (MRR)")
        self.assertEqual(mrr_metric["scenario"], 9000.0)
        self.assertEqual(mrr_metric["impact"], "NEGATIVE")

    def test_6_burn_increase_runway_decrease(self):
        """TEST 6: Adding engineers increases expenses and burn rate."""
        res = simulator_service.calculate_scenario("Test Idea", new_engineers_count=2, baseline_data={"monthly_expenses": 8000.0, "monthly_revenue": 5000.0})
        exp_metric = next(m for m in res["metrics"] if m["name"] == "Monthly Expenses ($)")
        self.assertEqual(exp_metric["scenario"], 18000.0)  # $8k + 2 * $5k

    def test_7_ltv_cac_recalculation(self):
        """TEST 7: Recalculates LTV/CAC ratio when CAC shifts."""
        res = simulator_service.calculate_scenario("Test Idea", cac_change_percent=100.0, baseline_data={"cac": 200.0, "ltv": 2000.0})
        ltv_cac = next(m for m in res["metrics"] if m["name"] == "LTV/CAC Ratio")
        self.assertEqual(ltv_cac["baseline"], 10.0)
        self.assertEqual(ltv_cac["scenario"], 5.0)

    def test_8_zero_division_safety(self):
        """TEST 8: Safely handles zero baseline and zero CAC without crashing or NaN."""
        res = simulator_service.calculate_scenario("Test Idea", cac_change_percent=50.0, baseline_data={"cac": 0.0, "monthly_revenue": 0.0})
        for m in res["metrics"]:
            self.assertFalse(str(m["scenario"]) == "nan")
            self.assertFalse(str(m["delta"]) == "nan")

    def test_9_risk_re_evaluation(self):
        """TEST 9: Risk changes correctly flag financial and operational shifts."""
        res = simulator_service.calculate_scenario("Test Idea", new_engineers_count=4, expenses_change_percent=50.0)
        self.assertIn(res["risk_changes"]["financial"], ["HIGHER", "CRITICAL"])
        self.assertEqual(res["risk_changes"]["operational"], "HIGHER")

    def test_10_response_schema_structure(self):
        """TEST 10: Simulator response matches expected schema structure."""
        res = simulator_service.calculate_scenario("Test Idea")
        self.assertIn("scenario", res)
        self.assertIn("baseline", res)
        self.assertIn("metrics", res)
        self.assertIn("risk_changes", res)
        self.assertIn("overall_impact", res)
        self.assertIn("confidence", res)
        self.assertIn("ai_explanation", res)


if __name__ == "__main__":
    unittest.main()
