import time
import logging
import json
from typing import Dict, Any, Optional

logger = logging.getLogger("ideaexecutor.observability")


class MetricsCollector:
    """
    In-memory lightweight metrics collector for IdeaExecutor production monitoring.
    """
    def __init__(self):
        self.requests_total = 0
        self.requests_failed = 0
        self.llm_requests = 0
        self.llm_failures = 0
        self.llm_retries = 0
        self.rag_requests = 0
        self.rag_failures = 0
        self.db_operations = 0
        self.db_failures = 0
        self.agent_executions = 0
        self.agent_failures = 0
        self.simulator_evaluations = 0
        self.exports_generated = 0

    def inc_request(self, success: bool = True):
        self.requests_total += 1
        if not success:
            self.requests_failed += 1

    def inc_llm(self, success: bool = True, retries: int = 0):
        self.llm_requests += 1
        if not success:
            self.llm_failures += 1
        self.llm_retries += retries

    def inc_rag(self, success: bool = True):
        self.rag_requests += 1
        if not success:
            self.rag_failures += 1

    def inc_db(self, success: bool = True):
        self.db_operations += 1
        if not success:
            self.db_failures += 1

    def inc_agent(self, success: bool = True):
        self.agent_executions += 1
        if not success:
            self.agent_failures += 1

    def inc_simulator(self):
        self.simulator_evaluations += 1

    def inc_export(self):
        self.exports_generated += 1

    def get_metrics_summary(self) -> Dict[str, Any]:
        return {
            "status": "ok",
            "requests_total": self.requests_total,
            "requests_failed": self.requests_failed,
            "llm_requests": self.llm_requests,
            "llm_failures": self.llm_failures,
            "llm_retries": self.llm_retries,
            "rag_requests": self.rag_requests,
            "rag_failures": self.rag_failures,
            "db_operations": self.db_operations,
            "db_failures": self.db_failures,
            "agent_executions": self.agent_executions,
            "agent_failures": self.agent_failures,
            "simulator_evaluations": self.simulator_evaluations,
            "exports_generated": self.exports_generated
        }


def log_structured_event(event_type: str, details: Dict[str, Any], level: int = logging.INFO):
    """
    Logs structured JSON events safely without exposing API keys, secrets, or document texts.
    """
    # Safety filter rules: Mask sensitive keys if present
    masked_details = {}
    sensitive_keys = {"api_key", "token", "password", "prompt", "secret", "document_text", "content"}

    for k, v in details.items():
        if any(s in k.lower() for s in sensitive_keys):
            masked_details[k] = "[MASKED_SENSITIVE_DATA]"
        else:
            masked_details[k] = v

    log_entry = {
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "event": event_type,
        **masked_details
    }
    logger.log(level, json.dumps(log_entry))


# Global Singleton Metrics Collector
metrics_collector = MetricsCollector()
