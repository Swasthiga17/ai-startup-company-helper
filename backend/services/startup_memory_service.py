from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from services.memory_service import memory_service
from services.market_watch_service import market_watch_service

class StartupMemoryService:
    """
    5-Layered Memory Architecture Manager:
    1. Short-Term Memory (Conversation)
    2. Working Memory (Current Analysis)
    3. Long-Term Memory (Decisions & Experiments)
    4. Knowledge Memory (Documents & RAG)
    5. External Intelligence (Market Signals)
    """
    def compile_layered_memory(self, db: Session, user_id: int, idea_hint: str = "") -> Dict[str, Any]:
        # Working & Long-Term Memory from persistent db
        base_mem = memory_service.get_startup_context(db, user_id, idea_hint)

        # External Intelligence
        live_signals = market_watch_service.fetch_live_signals(idea_hint or "AI Startup")

        layered_summary = {
            "short_term_memory": "Active co-founder chat turn",
            "working_memory": base_mem.get("startup_profile", {}),
            "long_term_memory": {
                "decisions_count": len(base_mem.get("decisions", [])),
                "experiments_count": len(base_mem.get("experiments", [])),
                "health_history": base_mem.get("health_history", [])
            },
            "knowledge_memory": "RAG Uploaded documents store active",
            "external_intelligence": live_signals
        }

        formatted_context = f"""
=== 5-LAYERED STARTUP MEMORY ===
WORKING MEMORY: {base_mem.get('startup_profile', {}).get('idea', 'Active Startup')}
LONG-TERM MEMORY: {len(base_mem.get('decisions', []))} Logged Decisions | {len(base_mem.get('experiments', []))} Active Experiments
EXTERNAL INTELLIGENCE: {len(live_signals)} Live Signals Monitored (Top Signal: '{live_signals[0]['title'] if live_signals else 'None'}')
HEALTH SCORE: {base_mem.get('startup_profile', {}).get('health_score', 78)}/100
"""

        return {
            "layered_memory": layered_summary,
            "formatted_context": formatted_context
        }

startup_memory_service = StartupMemoryService()
