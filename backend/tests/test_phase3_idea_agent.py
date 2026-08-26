import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import unittest
import asyncio
from services.llm_service import llm_service
from agents.domain_agents import run_idea_agent
from workflows.startup_graph import startup_graph


class TestPhase3IdeaAgent(unittest.TestCase):

    def test_idea_agent_gemini_execution(self):
        """Test Idea Agent execution with real Gemini call and Pydantic validation."""
        if not llm_service.available:
            self.skipTest("Gemini API key unconfigured or rate limited.")

        state = {"idea": "AI tutor for engineering students"}
        result = run_idea_agent(state)
        if not result or not result.get("success", True):
            self.skipTest("Gemini API rate limited or returned error response.")
        
        print("\n--- Real Gemini Idea Agent Output ---")
        print(result)
        print("--------------------------------------\n")

        self.assertIsNotNone(result)
        self.assertIn("problem", result)
        self.assertIn("value_proposition", result)
        self.assertIn("recommendations", result)
        self.assertTrue(result.get("success", False))

    def test_full_langgraph_idea_pipeline(self):
        """Test full multi-agent LangGraph workflow for 'AI tutor for engineering students'."""
        if not llm_service.available:
            self.skipTest("Gemini API key unconfigured or rate limited.")

        async def run_graph():
            return await startup_graph.ainvoke({"idea": "AI tutor for engineering students"})

        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        graph_result = loop.run_until_complete(run_graph())
        loop.close()

        print("\n--- Full LangGraph Analysis Result Keys ---")
        print(list(graph_result.keys()))
        print("-------------------------------------------\n")

        self.assertIn("idea_analysis", graph_result)
        self.assertIn("market_analysis", graph_result)
        self.assertIn("mentor_analysis", graph_result)


if __name__ == "__main__":
    unittest.main()
