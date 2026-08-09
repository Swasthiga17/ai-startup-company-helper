import time
import os
from fastapi import APIRouter
from services.llm_service import llm_service
from services.rag_service import CHROMA_PATH
from database import SessionLocal
from core.observability import metrics_collector

router = APIRouter(prefix="", tags=["Health & Diagnostics"])

START_TIME = time.time()


@router.get("/health")
def health_check():
    """Basic operational health check endpoint."""
    uptime_seconds = round(time.time() - START_TIME, 2)
    return {
        "status": "ok",
        "service": "ideaexecutor-api",
        "version": "1.0.0",
        "uptime_seconds": uptime_seconds
    }


from sqlalchemy import text


@router.get("/health/ready")
def health_readiness():
    """Verifies critical dependencies (DB & RAG vector store) readiness."""
    db_status = "ok"
    try:
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        db.close()
    except Exception:
        db_status = "error"

    rag_status = "ok" if os.path.exists(CHROMA_PATH) else "initializing"

    return {
        "status": "ok" if db_status == "ok" else "degraded",
        "database": db_status,
        "vector_store": rag_status
    }


@router.get("/health/metrics")
def operational_metrics():
    """Returns safe production metrics counters without exposing sensitive data."""
    return metrics_collector.get_metrics_summary()


@router.get("/health/ai")
def ai_health_check():
    gemini_connected = llm_service.available
    model_name = llm_service.model_name if gemini_connected else "None"

    if gemini_connected:
        return {
            "success": True,
            "provider": "gemini",
            "model": model_name,
            "status": "connected"
        }
    else:
        return {
            "success": False,
            "status": "unavailable",
            "retryable": True
        }


@router.get("/metrics")
def metrics():
    return metrics_collector.get_metrics_summary()
