from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import SessionLocal
from deps import get_current_user
from models.auth_models import Notification
from socket_server import sio, send_user_notification
from utils.logger import logger

router = APIRouter(prefix="/notifications", tags=["notifications"])


class SendNotificationRequest(BaseModel):
    title: str
    message: str
    type: Optional[str] = "info"


@router.get("")
async def get_notifications(current_user=Depends(get_current_user)):
    """Retrieve all notifications for the authenticated user only."""
    db: Session = SessionLocal()
    try:
        notifs = (
            db.query(Notification)
            .filter(Notification.user_id == current_user.id)
            .order_by(Notification.created_at.desc())
            .all()
        )
        serialized = [
            {
                "id": n.id,
                "user_id": n.user_id,
                "title": n.title,
                "message": n.message,
                "type": n.type,
                "read": n.read,
                "timestamp": n.created_at.isoformat(),
                "text": f"{n.title}: {n.message}",
                "time": n.created_at.strftime("%I:%M %p")
            }
            for n in notifs
        ]
        unread = sum(1 for n in notifs if not n.read)
        return {
            "status": "success",
            "notifications": serialized,
            "unread_count": unread
        }
    finally:
        db.close()


@router.post("/push")
async def send_push_notification(req: SendNotificationRequest, current_user=Depends(get_current_user)):
    """Creates a notification persisted in DB and emits real-time push exclusively to the user's room."""
    db: Session = SessionLocal()
    try:
        new_notif = Notification(
            user_id=current_user.id,
            title=req.title,
            message=req.message,
            type=req.type or "info",
            read=False,
            created_at=datetime.utcnow()
        )
        db.add(new_notif)
        db.commit()
        db.refresh(new_notif)

        notif_dict = {
            "id": new_notif.id,
            "user_id": new_notif.user_id,
            "title": new_notif.title,
            "message": new_notif.message,
            "type": new_notif.type,
            "read": new_notif.read,
            "timestamp": new_notif.created_at.isoformat(),
            "text": f"{new_notif.title}: {new_notif.message}",
            "time": new_notif.created_at.strftime("%I:%M %p")
        }

        # Emit real-time push event strictly to the user's private room
        await send_user_notification(current_user.id, notif_dict)

        return {"status": "success", "notification": notif_dict}
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to push notification: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()


@router.patch("/{notification_id}/read")
async def mark_notification_as_read(notification_id: int, current_user=Depends(get_current_user)):
    """Marks a notification as read, enforcing user ownership."""
    db: Session = SessionLocal()
    try:
        notif = db.query(Notification).filter(Notification.id == notification_id).first()
        if not notif:
            raise HTTPException(status_code=404, detail="Notification not found")
        if notif.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Access denied: You do not own this notification")

        notif.read = True
        db.commit()
        db.refresh(notif)
        return {
            "status": "success",
            "notification": {
                "id": notif.id,
                "user_id": notif.user_id,
                "title": notif.title,
                "message": notif.message,
                "type": notif.type,
                "read": notif.read,
                "timestamp": notif.created_at.isoformat()
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()


@router.delete("/{notification_id}")
async def delete_notification(notification_id: int, current_user=Depends(get_current_user)):
    """Deletes a notification, enforcing user ownership."""
    db: Session = SessionLocal()
    try:
        notif = db.query(Notification).filter(Notification.id == notification_id).first()
        if not notif:
            raise HTTPException(status_code=404, detail="Notification not found")
        if notif.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Access denied: You do not own this notification")

        db.delete(notif)
        db.commit()
        return {"status": "success", "message": "Notification deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()


@router.delete("")
async def clear_all_notifications(current_user=Depends(get_current_user)):
    """Clears all notifications for the authenticated user only."""
    db: Session = SessionLocal()
    try:
        db.query(Notification).filter(Notification.user_id == current_user.id).delete()
        db.commit()
        return {"status": "success", "message": "All user notifications cleared"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()
