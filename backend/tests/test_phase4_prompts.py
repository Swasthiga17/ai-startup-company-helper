import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import unittest
from prompts import (
    IDEA_SYSTEM_PROMPT,
    MARKET_SYSTEM_PROMPT,
    BUSINESS_SYSTEM_PROMPT,
    PRODUCT_SYSTEM_PROMPT,
    OPERATIONS_SYSTEM_PROMPT,
    GROWTH_SYSTEM_PROMPT,
    MENTOR_SYSTEM_PROMPT
)


class TestPhase4Prompts(unittest.TestCase):

    def test_all_prompts_formatting(self):
        """Test that all 7 prompt templates format dynamic placeholders cleanly."""
        idea = "AI tutor for engineering students"
        context = '{"dummy": "data"}'

        formatted_idea = IDEA_SYSTEM_PROMPT.format(idea=idea)
        self.assertIn("AI tutor for engineering students", formatted_idea)

        formatted_market = MARKET_SYSTEM_PROMPT.format(idea=idea, upstream_context=context)
        self.assertIn("AI tutor for engineering students", formatted_market)

        formatted_business = BUSINESS_SYSTEM_PROMPT.format(idea=idea, upstream_context=context)
        self.assertIn("AI tutor for engineering students", formatted_business)

        formatted_product = PRODUCT_SYSTEM_PROMPT.format(idea=idea, upstream_context=context)
        self.assertIn("AI tutor for engineering students", formatted_product)

        formatted_ops = OPERATIONS_SYSTEM_PROMPT.format(idea=idea, upstream_context=context)
        self.assertIn("AI tutor for engineering students", formatted_ops)

        formatted_growth = GROWTH_SYSTEM_PROMPT.format(idea=idea, upstream_context=context)
        self.assertIn("AI tutor for engineering students", formatted_growth)

        formatted_mentor = MENTOR_SYSTEM_PROMPT.format(idea=idea, full_analysis_context=context)
        self.assertIn("AI tutor for engineering students", formatted_mentor)

    def test_anti_hallucination_rules_present(self):
        """Test that prompts specify rules and output specs."""
        for prompt in [
            IDEA_SYSTEM_PROMPT, MARKET_SYSTEM_PROMPT, BUSINESS_SYSTEM_PROMPT,
            PRODUCT_SYSTEM_PROMPT, OPERATIONS_SYSTEM_PROMPT, GROWTH_SYSTEM_PROMPT,
            MENTOR_SYSTEM_PROMPT
        ]:
            self.assertIn("ANTI-HALLUCINATION RULES:", prompt)
            self.assertIn("OUTPUT REQUIREMENTS:", prompt)


if __name__ == "__main__":
    unittest.main()
