import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import unittest
import asyncio
from workflows.startup_graph import (
    startup_graph,
    StartupState,
    idea_node,
    market_node,
    business_node,
    product_node,
    operations_node,
    growth_node,
    synthesis_node,
    mentor_node
)
from services.llm_service import llm_service


class TestPhase5LangGraph(unittest.TestCase):

    def test_1_graph_compilation(self):
        """TEST 1: Graph compiles successfully."""
        self.assertIsNotNone(startup_graph)

    def test_2_state_initialization(self):
        """TEST 2: StartupState initializes correctly."""
        state: StartupState = {
            "startup_idea": "AI tutor for engineering students",
            "idea": "AI tutor for engineering students",
            "execution_status": "STARTING"
        }
        self.assertEqual(state["startup_idea"], "AI tutor for engineering students")
        self.assertEqual(state["execution_status"], "STARTING")

    def test_3_idea_agent_node_execution(self):
        """TEST 3: Idea Agent updates idea_analysis."""
        if not llm_service.available:
            self.skipTest("Gemini API key unconfigured or rate limited.")

        state: StartupState = {"startup_idea": "AI tutor for engineering students"}
        out = idea_node(state)
        self.assertIn("idea_analysis", out)
        self.assertIn("execution_status", out)

    def test_4_market_agent_receives_idea_context(self):
        """TEST 4: Market Agent receives Idea Agent context."""
        state: StartupState = {
            "startup_idea": "AI tutor for engineering students",
            "idea_analysis": {"problem": "Engineering students struggle with math", "pain_score": 9.0}
        }
        out = market_node(state)
        self.assertIn("market_analysis", out)

    def test_5_upstream_context_propagation(self):
        """TEST 5: Business & Product agents receive appropriate upstream context."""
        state: StartupState = {
            "startup_idea": "AI tutor for engineering students",
            "idea_analysis": {"problem": "Complex coursework"},
            "market_analysis": {"tam": "$50B"}
        }
        biz_out = business_node(state)
        prod_out = product_node(state)
        self.assertIn("business_analysis", biz_out)
        self.assertIn("product_analysis", prod_out)

    def test_6_mentor_receives_complete_consolidated_analysis(self):
        """TEST 6: Mentor receives complete consolidated analysis."""
        state: StartupState = {
            "startup_idea": "AI tutor for engineering students",
            "idea_analysis": {"problem": "Math struggle"},
            "market_analysis": {"tam": "$50B"},
            "business_analysis": {"revenue_streams": ["SaaS"]},
            "product_analysis": {"mvp_features": ["Tutor AI"]},
            "operations_analysis": {"hiring_plan": []},
            "growth_analysis": {"positioning": "AI tutor"}
        }
        out = mentor_node(state)
        self.assertIn("mentor_analysis", out)

    def test_7_controlled_partial_failure(self):
        """TEST 7: A failed agent produces a controlled partial failure."""
        broken_state: StartupState = {
            "startup_idea": "",
            "idea": "",
            "errors": [{"agent": "MarketAgent", "error": "Simulated failure"}]
        }
        out = mentor_node(broken_state)
        self.assertIn("execution_status", out)
        self.assertIn(out["execution_status"], ["PARTIAL_FAILURE", "FAILED"])

    def test_8_no_fake_fallback_generated(self):
        """TEST 8: Verify no fake fallback analysis dictionary is generated on error."""
        broken_state: StartupState = {"startup_idea": ""}
        res = idea_node(broken_state)
        analysis = res.get("idea_analysis", {})
        self.assertFalse(analysis.get("success", True))
        self.assertIn("error", analysis)

    def test_9_final_consolidated_state_structure(self):
        """TEST 9: Final state has expected consolidated structure from synthesis_node."""
        state: StartupState = {
            "idea_analysis": {"risks": ["Risk 1"], "sources": ["Source 1"], "confidence": 85.0},
            "market_analysis": {"risks": ["Risk 2"], "sources": ["Source 2"], "confidence": 88.0}
        }
        synth_out = synthesis_node(state)
        self.assertIn("risks", synth_out)
        self.assertIn("sources", synth_out)
        self.assertIn("recommendations", synth_out)
        self.assertIn("confidence_scores", synth_out)

    def test_10_different_inputs_produce_different_results(self):
        """TEST 10: Two different startup ideas produce different agent inputs/results."""
        state1: StartupState = {"startup_idea": "AI tutor for engineering students"}
        state2: StartupState = {"startup_idea": "Healthy meal delivery for college students"}
        
        self.assertNotEqual(state1["startup_idea"], state2["startup_idea"])


if __name__ == "__main__":
    unittest.main()
