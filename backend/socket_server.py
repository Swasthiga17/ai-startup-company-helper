import socketio
from utils.logger import logger

sio = socketio.AsyncServer(
    async_mode="asgi",
    cors_allowed_origins="*"
)


@sio.event
async def connect(sid, environ):
    logger.info(f"Socket.IO client connected: {sid}")
    await sio.emit("connection_ack", {"status": "connected", "sid": sid}, room=sid)


@sio.event
async def disconnect(sid):
    logger.info(f"Socket.IO client disconnected: {sid}")


@sio.event
async def join_workspace(sid, data):
    workspace_id = data.get("workspace_id", "default")
    sio.enter_room(sid, workspace_id)
    logger.info(f"Client {sid} joined workspace room: {workspace_id}")
    await sio.emit("workspace_joined", {"workspace_id": workspace_id}, room=sid)


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
        await asyncio.sleep(0.3)
        
    await sio.emit("analysis_complete", {"idea": idea, "status": "completed"}, room=sid)
