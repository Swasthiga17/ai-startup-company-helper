from typing import Optional, Dict, Any
import socketio
from utils.logger import logger

sio = socketio.AsyncServer(
    async_mode="asgi",
    cors_allowed_origins="*"
)


def extract_token(environ: Dict[str, Any], auth: Optional[Dict[str, Any]] = None) -> Optional[str]:
    """Extracts JWT token from Socket.IO auth dictionary, query string, or HTTP headers."""
    # 1. Socket.IO v4 client auth dict
    if isinstance(auth, dict):
        token = auth.get("token") or auth.get("Authorization") or auth.get("access_token")
        if token:
            return token.replace("Bearer ", "").strip()

    # 2. Query parameters (e.g. ws://host/socket.io/?token=...)
    qs = environ.get("QUERY_STRING", "")
    if qs:
        import urllib.parse
        parsed = urllib.parse.parse_qs(qs)
        token = parsed.get("token", [None])[0] or parsed.get("auth_token", [None])[0] or parsed.get("access_token", [None])[0]
        if token:
            return token.replace("Bearer ", "").strip()

    # 3. HTTP headers in ASGI environ
    auth_header = environ.get("HTTP_AUTHORIZATION", "")
    if auth_header:
        return auth_header.replace("Bearer ", "").strip()

    return None


def verify_jwt_token(token: Optional[str]) -> Optional[int]:
    """Decodes and validates JWT token, returning user_id or None."""
    if not token:
        return None
    try:
        from jose import jwt
        from config import SECRET_KEY, ALGORITHM
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        sub = payload.get("sub")
        if sub is None:
            return None
        return int(sub)
    except Exception as e:
        logger.debug(f"Socket.IO JWT verification failed: {e}")
        return None


authenticated_sessions: Dict[str, dict] = {}


@sio.event
async def connect(sid, environ, auth=None):
    """Authenticates Socket.IO connections and binds connection to the user's private room."""
    token = extract_token(environ, auth)
    user_id = verify_jwt_token(token)

    if not user_id:
        logger.warning(f"Socket.IO connection rejected for {sid}: Invalid or missing auth token.")
        raise socketio.exceptions.ConnectionRefusedError("Authentication failed: Valid JWT token required")

    # Store user identity in memory and socket session
    authenticated_sessions[sid] = {"user_id": user_id, "token": token}
    try:
        await sio.save_session(sid, {"user_id": user_id, "token": token})
    except Exception:
        pass

    # Associate connection exclusively with its user room
    user_room = f"user_{user_id}"
    try:
        sio.enter_room(sid, user_room)
    except Exception:
        pass
    logger.info(f"Socket.IO client connected: {sid} (user_id={user_id}, room={user_room})")

    try:
        await sio.emit("connection_ack", {
            "status": "connected",
            "sid": sid,
            "user_id": user_id,
            "room": user_room
        }, room=sid)
    except Exception:
        pass


@sio.event
async def disconnect(sid):
    """Handles client disconnect cleanly."""
    session = authenticated_sessions.pop(sid, None)
    if not session:
        try:
            session = await sio.get_session(sid) or {}
        except Exception:
            session = {}
    uid = session.get("user_id", "anonymous")
    logger.info(f"Socket.IO client disconnected: {sid} (user_id={uid})")


@sio.event
async def join_room(sid, data):
    """Enforces multi-tenant isolation when joining rooms."""
    session = authenticated_sessions.get(sid)
    if not session:
        try:
            session = await sio.get_session(sid) or {}
        except Exception:
            session = {}
    user_id = session.get("user_id")
    target_room = str(data.get("room") or data.get("room_name") or "")

    # Prevent users from joining another user's private room
    if target_room.startswith("user_"):
        allowed_room = f"user_{user_id}"
        if target_room != allowed_room:
            logger.warning(f"Unauthorized room subscription blocked: sid {sid} (user {user_id}) -> {target_room}")
            try:
                await sio.emit("error", {
                    "status": "error",
                    "message": f"Unauthorized: Cannot join room '{target_room}'"
                }, room=sid)
            except Exception:
                pass
            return {"status": "error", "message": "Unauthorized room access"}

    try:
        sio.enter_room(sid, target_room)
    except Exception:
        pass
    try:
        await sio.emit("room_joined", {"room": target_room}, room=sid)
    except Exception:
        pass
    return {"status": "success", "room": target_room}


@sio.event
async def join_workspace(sid, data):
    """Enforces workspace room security."""
    session = authenticated_sessions.get(sid)
    if not session:
        try:
            session = await sio.get_session(sid) or {}
        except Exception:
            session = {}
    user_id = session.get("user_id")
    workspace_id = str(data.get("workspace_id", "default"))

    if workspace_id.startswith("user_"):
        allowed_room = f"user_{user_id}"
        if workspace_id != allowed_room:
            logger.warning(f"Unauthorized workspace join blocked: sid {sid} tried to join {workspace_id}")
            try:
                await sio.emit("error", {"status": "error", "message": "Unauthorized room access"}, room=sid)
            except Exception:
                pass
            return {"status": "error", "message": "Unauthorized room access"}

    try:
        sio.enter_room(sid, workspace_id)
    except Exception:
        pass
    logger.info(f"Client {sid} (user {user_id}) joined workspace room: {workspace_id}")
    try:
        await sio.emit("workspace_joined", {"workspace_id": workspace_id}, room=sid)
    except Exception:
        pass
    return {"status": "success", "workspace_id": workspace_id}


@sio.event
async def ping_server(sid, data):
    await sio.emit("pong_client", {"message": "Socket.IO server active", "data": data}, room=sid)


@sio.event
async def start_analysis_stream(sid, data):
    idea = data.get("idea", "Startup Idea")
    stages = [
        ("idea_domain", "Validating problem intensity & value proposition..."),
        ("market_domain", "Calculating TAM/SAM/SOM & PESTLE macro-analysis..."),
        ("business_domain", "Building financial model, unit economics & pricing..."),
        ("product_domain", "Generating MVP roadmap, SQL DB schema & API specs..."),
        ("operations_domain", "Assessing 5-axis risk meter & legal checklist..."),
        ("growth_domain", "Formulating growth playbook & customer acquisition..."),
        ("mentor_domain", "Finalizing startup score & investor pitch deck...")
    ]
    
    for idx, (stage, msg) in enumerate(stages):
        progress = int(((idx + 1) / len(stages)) * 100)
        await sio.emit("analysis_progress", {
            "stage": stage,
            "message": msg,
            "progress": progress
        }, room=sid)
        import asyncio
        await asyncio.sleep(0.1)
        
    await sio.emit("analysis_complete", {"idea": idea, "status": "completed"}, room=sid)


async def send_user_notification(user_id: int, notification_data: dict):
    """Helper to emit push notification strictly to the user's authenticated room."""
    user_room = f"user_{user_id}"
    await sio.emit("push_notification", notification_data, room=user_room)
