from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import SessionLocal
from deps import get_current_user
from models.auth_models import User, Analysis, Document
from utils.logger import logger

router = APIRouter(tags=["admin"])


@router.get("/admin/stats")
async def get_admin_stats(current_user=Depends(get_current_user)):
    # Restrict to administrator (User ID 1 or is_admin flag)
    if current_user.id != 1 and not getattr(current_user, "is_admin", False):
        raise HTTPException(
            status_code=403,
            detail="Administrative privileges required to access system statistics."
        )

    try:
        db: Session = SessionLocal()
        try:
            total_users = db.query(User).count()
            total_analyses = db.query(Analysis).count()
            total_documents = db.query(Document).count()

            users = db.query(User).order_by(User.id.desc()).all()
            user_list = [
                {
                    "name": u.name,
                    "email": u.email,
                    "created_at": u.created_at.isoformat(),
                    "status": "Admin" if u.id == 1 else "Starter"
                }
                for u in users
            ]

            return {
                "status": "success",
                "stats": {
                    "total_users": total_users,
                    "total_analyses": total_analyses,
                    "total_documents": total_documents
                },
                "users": user_list
            }
        finally:
            db.close()
    except Exception as e:
        logger.error(f"Failed to get admin stats: {e}")
        raise HTTPException(status_code=500, detail=str(e))
