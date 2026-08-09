import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import unittest
import asyncio
from services.llm_service import llm_service
from models.schemas import (
    IdeaAnalysisSchema,
    MarketAnalysisSchema,
    BusinessAnalysisSchema,
    ProductAnalysisSchema,
    OperationsAnalysisSchema,
    GrowthAnalysisSchema,
    MentorResponseSchema
)
from agents.domain_agents import (
    run_idea_agent,
    run_market_agent
)
from workflows.startup_graph import startup_graph


class TestAIPipeline(unittest.TestCase):

    def test_llm_service_initialization(self):
        """Test A: Verify that LLMService initializes with model candidate."""
        self.assertIsNotNone(llm_service)

    def test_pydantic_schema_validation(self):
        """Test A: Verify Pydantic model validation and default response metadata."""
        data = {
            "problem": "Manual market analysis takes weeks",
            "target_customers": ["Startups", "VCs"],
            "pain_score": 9.0,
            "personas": [{"name": "Founder", "demographics": "Tech", "pain_point": "No time"}],
            "value_proposition": "Automated startup OS",
            "validation_questions": ["Is this fast?"],
            "confidence": 90.0,
            "recommendations": ["Build MVP"],
            "sources": ["✓ Market Benchmark"]
        }
        validated = IdeaAnalysisSchema.model_validate(data)
        self.assertTrue(validated.success)
        self.assertEqual(validated.problem, "Manual market analysis takes weeks")
        self.assertEqual(validated.pain_score, 9.0)

    def test_domain_agents_execution(self):
        """Test A: Verify individual agent response generation."""
        if not llm_service.available:
            self.skipTest("Gemini API key unconfigured or rate limited.")
        state = {"idea": "AI tool for small business accounting"}
        idea_res = run_idea_agent(state)
        if isinstance(idea_res, dict) and idea_res.get("success", True) is False:
            self.skipTest(f"Gemini API Idea Agent temporarily unavailable: {idea_res.get('error')}")
        self.assertIn("problem", idea_res)

        state["idea_analysis"] = idea_res
        market_res = run_market_agent(state)
        if isinstance(market_res, dict) and market_res.get("success", True) is False:
            self.skipTest(f"Gemini API Market Agent temporarily unavailable: {market_res.get('error')}")
        self.assertIn("tam", market_res)

    def test_langgraph_workflow_execution(self):
        """Test B: End-to-end multi-agent LangGraph workflow execution."""
        if not llm_service.available:
            self.skipTest("Gemini API key unconfigured or rate limited.")
        test_idea = "AI tool for small business accounting"

        async def run_graph():
            return await startup_graph.ainvoke({"idea": test_idea})

        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        result = loop.run_until_complete(run_graph())
        loop.close()

        self.assertIsNotNone(result)
        self.assertIn("idea_analysis", result)
        self.assertIn("market_analysis", result)
        self.assertIn("business_analysis", result)
        self.assertIn("product_analysis", result)
        self.assertIn("operations_analysis", result)
        self.assertIn("growth_analysis", result)
        self.assertIn("mentor_analysis", result)
        self.assertIn("score", result)


if __name__ == "__main__":
    unittest.main()
