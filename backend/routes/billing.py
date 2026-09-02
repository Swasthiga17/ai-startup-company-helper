from typing import Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel

from database import SessionLocal
from deps import get_current_user
from models.subscription_model import Subscription, UsageRecord
from services.billing_service import billing_service
from utils.logger import logger

router = APIRouter(prefix="/billing", tags=["billing"])

class CheckoutRequest(BaseModel):
    plan_id: str # PRO / FOUNDER

class WebhookEventRequest(BaseModel):
    event_type: str # checkout_completed / subscription_created / payment_succeeded / payment_failed / subscription_cancelled
    provider_customer_id: str
    provider_subscription_id: str
    user_id: int
    plan_id: str = "PRO"

@router.get("/subscription")
async def get_subscription(current_user=Depends(get_current_user)):
    db: Session = SessionLocal()
    try:
        sub = db.query(Subscription).filter(Subscription.user_id == current_user.id).first()
        plan_id = sub.plan_id if sub else "FREE"
        status = sub.status if sub else "ACTIVE"

        # Usage check
        usage_rec = db.query(UsageRecord).filter(UsageRecord.user_id == current_user.id).first()
        current_usage = usage_rec.analysis_count if usage_rec else 1

        entitlement = billing_service.check_entitlement(plan_id, current_usage)

        return {
            "plan_id": plan_id,
            "status": status,
            "current_usage": current_usage,
            "entitlement": entitlement
        }
    finally:
        db.close()

@router.post("/checkout")
async def create_checkout(req: CheckoutRequest, current_user=Depends(get_current_user)):
    if req.plan_id.upper() not in ["PRO", "FOUNDER"]:
        raise HTTPException(status_code=400, detail="Invalid plan ID specified.")

    price_str = "₹999/mo" if req.plan_id.upper() == "PRO" else "₹2,499/mo"
    return {
        "success": True,
        "plan_id": req.plan_id.upper(),
        "price": price_str,
        "checkout_url": f"https://billing.ideaexecutor.ai/checkout?user={current_user.id}&plan={req.plan_id.upper()}"
    }

import os
from config import BILLING_WEBHOOK_SECRET

@router.post("/webhooks")
async def handle_webhook(event: WebhookEventRequest, request: Request):
    is_prod = os.getenv("ENVIRONMENT", "").lower() == "production"
    incoming_secret = request.headers.get("X-Billing-Webhook-Secret") or request.query_params.get("secret")

    if is_prod or (incoming_secret is not None and incoming_secret != ""):
        if not incoming_secret or incoming_secret != BILLING_WEBHOOK_SECRET:
            logger.warning(f"Unauthorized billing webhook rejection for user_id={event.user_id}")
            raise HTTPException(status_code=401, detail="Invalid or missing billing webhook secret.")

    logger.info(f"Processing billing webhook: {event.event_type} for user_id={event.user_id}")

    db: Session = SessionLocal()
    try:
        sub = db.query(Subscription).filter(Subscription.user_id == event.user_id).first()
        if not sub:
            sub = Subscription(user_id=event.user_id)
            db.add(sub)

        if event.event_type in ["checkout_completed", "subscription_created", "payment_succeeded"]:
            sub.plan_id = event.plan_id.upper()
            sub.status = "ACTIVE"
            sub.provider_customer_id = event.provider_customer_id
            sub.provider_subscription_id = event.provider_subscription_id
        elif event.event_type == "subscription_cancelled":
            sub.status = "CANCELLED"
        elif event.event_type == "payment_failed":
            sub.status = "PAST_DUE"

        db.commit()
        return {"processed": True, "event_type": event.event_type, "user_id": event.user_id}
    except Exception as e:
        db.rollback()
        logger.error(f"Webhook processing error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()

@router.get("/dashboard")
async def get_business_intelligence(current_user=Depends(get_current_user)):
    return {
        "saas_metrics": billing_service.get_saas_business_metrics(),
        "unit_economics": billing_service.calculate_ai_unit_economics()
    }
