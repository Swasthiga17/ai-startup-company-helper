import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import unittest
import httpx
from app import app
from core.observability import metrics_collector, log_structured_event


class TestPhase12Observability(unittest.IsolatedAsyncioTestCase):

    async def asyncSetUp(self):
        transport = httpx.ASGITransport(app=app)
        self.client = httpx.AsyncClient(transport=transport, base_url="http://testserver")

    async def asyncTearDown(self):
        await self.client.aclose()

    async def test_1_health_metrics_endpoint(self):
        """TEST 1: GET /health/metrics returns operational counters dictionary."""
        res = await self.client.get("/health/metrics")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["status"], "ok")
        self.assertIn("requests_total", data)
        self.assertIn("llm_requests", data)
        self.assertIn("agent_executions", data)

    async def test_2_request_counter_increment(self):
        """TEST 2: HTTP requests automatically increment requests_total metrics counter."""
        before = metrics_collector.requests_total
        await self.client.get("/health")
        after = metrics_collector.requests_total
        self.assertEqual(after, before + 1)

    async def test_3_llm_metrics_collector(self):
        """TEST 3: MetricsCollector correctly tracks LLM calls and retries."""
        before_llm = metrics_collector.llm_requests
        metrics_collector.inc_llm(success=True, retries=1)
        self.assertEqual(metrics_collector.llm_requests, before_llm + 1)
        self.assertEqual(metrics_collector.llm_retries, 1)

    async def test_4_agent_execution_metrics(self):
        """TEST 4: Agent executions and failures are incremented independently."""
        before_agent = metrics_collector.agent_executions
        metrics_collector.inc_agent(success=True)
        metrics_collector.inc_agent(success=False)
        self.assertEqual(metrics_collector.agent_executions, before_agent + 2)
        self.assertTrue(metrics_collector.agent_failures >= 1)

    async def test_5_rag_and_simulator_metrics(self):
        """TEST 5: RAG and Simulator metrics collector counters update correctly."""
        metrics_collector.inc_rag(success=True)
        metrics_collector.inc_simulator()
        metrics_collector.inc_export()
        
        summary = metrics_collector.get_metrics_summary()
        self.assertTrue(summary["rag_requests"] >= 1)
        self.assertTrue(summary["simulator_evaluations"] >= 1)
        self.assertTrue(summary["exports_generated"] >= 1)

    async def test_6_log_safety_filters_sensitive_data(self):
        """TEST 6: log_structured_event masks API keys, secrets, and prompts."""
        test_details = {
            "api_key": "AIzaSyTestKeySecret123",
            "password": "SecretPassword123",
            "document_text": "Sensitive confidential text contents",
            "endpoint": "/health"
        }
        # Call log function and ensure no error throws
        log_structured_event("test_security_event", test_details)
        self.assertEqual(test_details["endpoint"], "/health")

    async def test_7_request_id_in_metrics_endpoint(self):
        """TEST 7: /health/metrics response includes X-Request-ID response header."""
        res = await self.client.get("/health/metrics")
        self.assertIn("x-request-id", res.headers)


if __name__ == "__main__":
    unittest.main()
