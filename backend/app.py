import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import logging
import time
import uuid
from fastapi import FastAPI, Request, HTTPException
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import socketio

from database import init_db
from core.exceptions import IdeaExecutorError
from utils.logger import logger
from routes.auth import router as auth_router
from routes.analyze import router as analyze_router
from routes.documents import router as documents_router
from routes.reports import router as reports_router
from routes.simulator import router as simulator_router
from routes.admin import router as admin_router
from routes.voice import router as voice_router
from routes.health import router as health_router
from routes.workspace import router as workspace_router
from routes.notifications import router as notifications_router
from routes.action_items import router as action_items_router
from routes.startup import router as startup_router
from routes.intelligence import router as intelligence_router

logging.basicConfig(level=logging.INFO)
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield

app = FastAPI(
    title="IdeaExecutor API",
    description="AI-powered startup operating system with multi-agent architecture",
    version="1.0.0",
    lifespan=lifespan
)

cors_origins_env = os.environ.get("CORS_ORIGINS", "")
if cors_origins_env:
    allowed_origins = [origin.strip() for origin in cors_origins_env.split(",") if origin.strip()]
else:
    allowed_origins = [
        "http://localhost:3000",
        "http://localhost:3002",
        "http://127.0.0.1:3002",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request ID, Observability & Security Headers Middleware
@app.middleware("http")
async def add_request_id_and_security_headers(request: Request, call_next):
    start_time = time.time()
    request_id = request.headers.get("X-Request-ID") or uuid.uuid4().hex[:12]
    request.state.request_id = request_id

    try:
        response = await call_next(request)
        duration_ms = round((time.time() - start_time) * 1000.0, 2)
        response.headers["X-Request-ID"] = request_id
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"

        from core.observability import metrics_collector, log_structured_event
        metrics_collector.inc_request(success=(response.status_code < 400))
        log_structured_event("http_request", {
            "request_id": request_id,
            "method": request.method,
            "endpoint": request.url.path,
            "status_code": response.status_code,
            "duration_ms": duration_ms
        })
        return response
    except Exception as e:
        duration_ms = round((time.time() - start_time) * 1000.0, 2)
        from core.observability import metrics_collector, log_structured_event
        metrics_collector.inc_request(success=False)
        log_structured_event("http_request_error", {
            "request_id": request_id,
            "method": request.method,
            "endpoint": request.url.path,
            "status_code": 500,
            "duration_ms": duration_ms,
            "error": str(e)
        }, level=logging.ERROR)
        raise e


# Global Exception Handlers
@app.exception_handler(IdeaExecutorError)
async def ideaexecutor_exception_handler(request: Request, exc: IdeaExecutorError):
    request_id = getattr(request.state, "request_id", "unknown")
    logger.error(f"[{request_id}] Custom Exception [{exc.error_code}]: {exc.message}")
    return JSONResponse(
        status_code=400 if not exc.retryable else 500,
        content={
            "success": False,
            "error": exc.message,
            "error_code": exc.error_code,
            "retryable": exc.retryable,
            "request_id": request_id
        }
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    request_id = getattr(request.state, "request_id", "unknown")
    logger.warning(f"[{request_id}] Validation Error: {exc}")
    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "error": "Invalid request payload parameters.",
            "error_code": "VALIDATION_ERROR",
            "retryable": False,
            "request_id": request_id
        }
    )


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    request_id = getattr(request.state, "request_id", "unknown")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": exc.detail if isinstance(exc.detail, str) else "HTTP request failed.",
            "error_code": f"HTTP_{exc.status_code}",
            "retryable": exc.status_code in [429, 500, 502, 503, 504],
            "request_id": request_id
        }
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    request_id = getattr(request.state, "request_id", "unknown")
    logger.error(f"[{request_id}] Unhandled Exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": "An unexpected server error occurred.",
            "error_code": "INTERNAL_SERVER_ERROR",
            "retryable": True,
            "request_id": request_id
        }
    )


# Ensure static/audio folder exists and mount static directory
os.makedirs("static/audio", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Register sub-routers
app.include_router(health_router)
app.include_router(auth_router)
app.include_router(analyze_router)
app.include_router(documents_router)
app.include_router(reports_router)
app.include_router(simulator_router)
app.include_router(admin_router)
app.include_router(voice_router)
app.include_router(workspace_router)
app.include_router(notifications_router)
app.include_router(action_items_router)
app.include_router(startup_router)
app.include_router(intelligence_router)


from socket_server import sio
socket_app = socketio.ASGIApp(sio, other_asgi_app=app, socketio_path="/socket.io")