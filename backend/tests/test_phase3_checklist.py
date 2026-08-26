import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import unittest
from services.llm_service import LLMService, llm_service
from models.schemas import IdeaAnalysisSchema
from agents.domain_agents import run_idea_agent


class TestPhase3Checklist(unittest.TestCase):

    def test_1_normal_input_ai_tutor(self):
        """Test 1: Normal input 'AI tutor for engineering students' -> valid Pydantic response."""
        if not llm_service.available:
            self.skipTest("Gemini API key unconfigured or rate limited.")

        state = {"idea": "AI tutor for engineering students"}
        res = run_idea_agent(state)
        if not res or not res.get("success", True):
            self.skipTest("Gemini API rate limited or returned error response.")
        self.assertIsNotNone(res)
        self.assertIn("problem", res)
        self.assertIn("value_proposition", res)
        self.assertTrue(res.get("success", False))

    def test_2_different_idea_meal_delivery(self):
        """Test 2: Different idea 'Healthy meal delivery for college students' -> meaningfully different result."""
        if not llm_service.available:
            self.skipTest("Gemini API key unconfigured or rate limited.")

        state1 = {"idea": "AI tutor for engineering students"}
        res1 = run_idea_agent(state1)

        state2 = {"idea": "Healthy meal delivery for college students"}
        res2 = run_idea_agent(state2)

        if not res1.get("success", True) or not res2.get("success", True):
            self.skipTest("Gemini API rate limited or returned error response.")

        self.assertNotEqual(res1.get("value_proposition"), res2.get("value_proposition"))
        self.assertIn("meal", res2.get("value_proposition", "").lower() + " " + res2.get("problem", "").lower() + " " + " ".join(res2.get("target_customers", [])).lower())

    def test_3_empty_input(self):
        """Test 3: Empty input handling."""
        state = {"idea": "   "}
        res = run_idea_agent(state)
        # Verify it returns an explicit error object instead of crashing or generating fake data
        self.assertFalse(res.get("success", True))
        self.assertIn("error", res)

    def test_4_gemini_failure_no_fake_fallback(self):
        """Test 4: Unconfigured LLM service -> controlled error response, NO fake results."""
        broken_llm = LLMService(model_name="nonexistent-model")
        broken_llm.available = False
        res = broken_llm.generate_json("Test prompt", schema_cls=IdeaAnalysisSchema)
        self.assertIsNone(res)

    def test_5_malformed_llm_response_handling(self):
        """Test 5: Malformed JSON string repair and validation handling."""
        malformed_json_text = """```json
        {
          "success": true,
          "confidence": 90.0,
          "problem": "Unclear concepts",
          "target_customers": ["Students"],
          "pain_score": 8.0,
          "value_proposition": "Step-by-step tutoring"
        }
        ```"""
        clean = llm_service._clean_json_text(malformed_json_text)
        repaired = llm_service._repair_json(clean)
        self.assertIsNotNone(repaired)


if __name__ == "__main__":
    unittest.main()
