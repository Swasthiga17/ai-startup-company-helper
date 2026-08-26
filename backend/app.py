import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import logging
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
from routes.workspace import router as workspace_router
from routes.notifications import router as notifications_router
from routes.action_items import router as action_items_router
from routes.decisions import router as decisions_router
from routes.experiments import router as experiments_router
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
if cors_origins_env and cors_origins_env.strip() != "*":
    allowed_origins = [origin.strip() for origin in cors_origins_env.split(",") if origin.strip()]
    for default_origin in ["https://buildyourowncompanyusingaibss.netlify.app", "https://ideaexecutor.onrender.com"]:
        if default_origin not in allowed_origins:
            allowed_origins.append(default_origin)
elif cors_origins_env.strip() == "*":
    allowed_origins = ["*"]
else:
    allowed_origins = [
        "http://localhost:3000",
        "http://localhost:3002",
        "http://127.0.0.1:3002",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "https://buildyourowncompanyusingaibss.netlify.app",
        "https://ideaexecutor.onrender.com"
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request ID & Security Headers Middleware
@app.middleware("http")
async def add_request_id_and_security_headers(request: Request, call_next):
    request_id = request.headers.get("X-Request-ID") or uuid.uuid4().hex[:12]
    request.state.request_id = request_id

    response = await call_next(request)
    response.headers["X-Request-ID"] = request_id
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response


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


@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "IdeaExecutor API", "version": "1.0.0"}


@app.get("/readiness")
async def readiness_check():
    try:
        from database import engine
        from sqlalchemy import text
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {e}"

    from services.llm_service import llm_service
    llm_status = "ready" if llm_service.available else "unconfigured_or_limited"

    return {
        "status": "ready" if db_status == "connected" else "degraded",
        "database": db_status,
        "llm_service": llm_status,
        "timestamp": os.environ.get("CURRENT_TIME", "")
    }


# Ensure static/audio folder exists and mount static directory
os.makedirs("static/audio", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Register sub-routers
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
from routes.timeline import router as timeline_router
from routes.feedback import router as feedback_router
from routes.optimization import router as optimization_router
from routes.pmf import router as pmf_router
from routes.billing import router as billing_router
from routes.founder_os import router as founder_os_router
from routes.synthetic_validation import router as synthetic_router

app.include_router(decisions_router)
app.include_router(experiments_router)
app.include_router(intelligence_router)
app.include_router(timeline_router)
app.include_router(feedback_router)
app.include_router(optimization_router)
app.include_router(pmf_router)
app.include_router(billing_router)
app.include_router(founder_os_router)
app.include_router(synthetic_router)

# Mount frontend/dist if built (for single-server Render deployment)
frontend_dist_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "frontend", "dist")
if os.path.exists(frontend_dist_path):
    assets_dir = os.path.join(frontend_dist_path, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="frontend_assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        file_path = os.path.join(frontend_dist_path, full_path)
        if full_path and os.path.exists(file_path) and os.path.isfile(file_path):
            from fastapi.responses import FileResponse
            return FileResponse(file_path)
        from fastapi.responses import FileResponse
        return FileResponse(os.path.join(frontend_dist_path, "index.html"))


from socket_server import sio
socket_app = socketio.ASGIApp(sio, other_asgi_app=app, socketio_path="/socket.io")