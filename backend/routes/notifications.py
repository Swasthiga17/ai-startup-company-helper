from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

from deps import get_current_user_optional
from socket_server import sio

router = APIRouter(prefix="/notifications", tags=["notifications"])

# In-memory notification log
notifications_db = [
    {
        "id": 1,
        "title": "Welcome to IdeaExecutor",
        "message": "AI startup co-founder engine is active and ready for your first idea.",
        "type": "success",
        "timestamp": datetime.utcnow().isoformat()
    }
]


class SendNotificationRequest(BaseModel):
    title: str
    message: str
    type: Optional[str] = "info"


@router.get("")
async def get_notifications(current_user=Depends(get_current_user_optional)):
    return {"status": "success", "notifications": notifications_db}


@router.post("/push")
async def send_push_notification(req: SendNotificationRequest, current_user=Depends(get_current_user_optional)):
    new_notif = {
        "id": len(notifications_db) + 1,
        "title": req.title,
        "message": req.message,
        "type": req.type,
        "timestamp": datetime.utcnow().isoformat()
    }
    notifications_db.insert(0, new_notif)

    # Emit real-time Push event via Socket.IO
    await sio.emit("push_notification", new_notif)

    return {"status": "success", "notification": new_notif}
