import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import unittest
from services.llm_service import llm_service
from models.schemas import IdeaAnalysisSchema


class TestPhase2LLM(unittest.TestCase):

    def test_real_gemini_text_generation(self):
        """Test ONE real Gemini text request."""
        if not llm_service.available:
            self.skipTest("Gemini API key unconfigured or rate limited.")
        
        prompt = "Explain this startup idea in 3 bullet points: 'AI tutor for engineering students'"
        text = llm_service.generate_text(prompt)
        print("\n--- Real Gemini Text Output ---")
        print(text)
        print("--------------------------------\n")
        self.assertIsNotNone(text)
        self.assertTrue(len(text) > 20)

    def test_real_gemini_structured_json(self):
        """Test ONE real Gemini structured output validated against Pydantic schema."""
        if not llm_service.available:
            self.skipTest("Gemini API key unconfigured or rate limited.")

        prompt = """
        Analyze this startup idea: "AI tutor for engineering students"
        Return a valid JSON matching:
        {
          "problem": "...",
          "target_customers": ["..."],
          "pain_score": 8.5,
          "value_proposition": "...",
          "validation_questions": ["..."],
          "confidence": 85.0,
          "recommendations": ["..."]
        }
        """
        result = llm_service.generate_json(prompt, schema_cls=IdeaAnalysisSchema)
        print("\n--- Real Gemini Pydantic Validated JSON Output ---")
        print(result)
        print("--------------------------------------------------\n")
        self.assertIsNotNone(result)
        self.assertIn("problem", result)
        self.assertIn("value_proposition", result)
        self.assertTrue(result.get("success", False))


if __name__ == "__main__":
    unittest.main()
