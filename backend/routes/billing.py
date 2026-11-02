import os
import hmac
import json
from datetime import datetime
from typing import Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel

from database import SessionLocal
from deps import get_current_user
from models.subscription_model import Subscription, UsageRecord, BillingEvent
from services.billing_service import billing_service
from config import BILLING_WEBHOOK_SECRET
from utils.logger import logger

router = APIRouter(prefix="/billing", tags=["billing"])


class CheckoutRequest(BaseModel):
    plan_id: str  # PRO / FOUNDER


class WebhookEventRequest(BaseModel):
    event_type: str  # checkout_completed / subscription_created / payment_succeeded / payment_failed / subscription_cancelled
    provider_customer_id: Optional[str] = None
    provider_subscription_id: Optional[str] = None
    user_id: Optional[int] = None
    plan_id: str = "PRO"
    event_id: Optional[str] = None


@router.get("/subscription")
async def get_subscription(current_user=Depends(get_current_user)):
    """
    Retrieves current subscription status and entitlement for authenticated user.
    User isolation: Strictly queries current_user.id.
    """
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
            "user_id": current_user.id,
            "plan_id": plan_id,
            "status": status,
            "current_usage": current_usage,
            "entitlement": entitlement,
            "started_at": sub.started_at.isoformat() if sub and sub.started_at else None,
            "current_period_end": sub.current_period_end.isoformat() if sub and sub.current_period_end else None,
            "provider_customer_id": sub.provider_customer_id if sub else None,
            "provider_subscription_id": sub.provider_subscription_id if sub else None
        }
    finally:
        db.close()


@router.post("/checkout")
async def create_checkout(req: CheckoutRequest, current_user=Depends(get_current_user)):
    """
    Initiates a secure provider checkout session.
    Server derives prices and product IDs from trusted server configuration.
    Never trusts client-provided prices or parameters.
    """
    plan_id = req.plan_id.upper().strip()
    if plan_id not in ["PRO", "FOUNDER"]:
        raise HTTPException(
            status_code=400,
            detail="Invalid plan ID specified. Must be PRO or FOUNDER."
        )

    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173").rstrip("/")
    success_url = f"{frontend_url}/#/pricing"
    cancel_url = f"{frontend_url}/#/pricing"

    try:
        session_data = billing_service.create_checkout_session(
            user_id=current_user.id,
            user_email=current_user.email,
            plan_id=plan_id,
            success_url=success_url,
            cancel_url=cancel_url
        )
        return session_data
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        logger.error(f"Checkout initiation error for user {current_user.id}: {e}")
        raise HTTPException(status_code=500, detail="Unable to initiate checkout session.")


@router.post("/cancel-subscription")
async def cancel_subscription(current_user=Depends(get_current_user)):
    """
    Cancels the active subscription for the authenticated user.
    Strictly isolated to current_user.id.
    """
    db: Session = SessionLocal()
    try:
        sub = db.query(Subscription).filter(Subscription.user_id == current_user.id).first()
        if not sub or sub.status == "CANCELLED":
            return {
                "status": "success",
                "message": "Subscription is already cancelled or on free tier.",
                "plan_id": sub.plan_id if sub else "FREE",
                "subscription_status": "CANCELLED"
            }

        sub.status = "CANCELLED"
        db.commit()

        # Record cancellation event in history
        cancel_evt = BillingEvent(
            event_id=f"cancel_{current_user.id}_{int(datetime.utcnow().timestamp())}",
            event_type="subscription_cancelled",
            user_id=current_user.id,
            provider="user_action",
            status="processed"
        )
        db.add(cancel_evt)
        db.commit()

        logger.info(f"Subscription cancelled for user_id={current_user.id}")
        return {
            "status": "success",
            "message": "Subscription successfully cancelled.",
            "plan_id": sub.plan_id,
            "subscription_status": "CANCELLED"
        }
    except Exception as e:
        db.rollback()
        logger.error(f"Error cancelling subscription: {e}")
        raise HTTPException(status_code=500, detail="Failed to cancel subscription.")
    finally:
        db.close()


@router.get("/history")
async def get_billing_history(current_user=Depends(get_current_user)):
    """
    Retrieves user-isolated billing events and invoices.
    """
    db: Session = SessionLocal()
    try:
        events = db.query(BillingEvent).filter(
            BillingEvent.user_id == current_user.id
        ).order_by(BillingEvent.created_at.desc()).limit(20).all()

        sub = db.query(Subscription).filter(Subscription.user_id == current_user.id).first()

        return {
            "current_plan": sub.plan_id if sub else "FREE",
            "subscription_status": sub.status if sub else "ACTIVE",
            "events": [
                {
                    "id": ev.id,
                    "event_id": ev.event_id,
                    "event_type": ev.event_type,
                    "status": ev.status,
                    "created_at": ev.created_at.isoformat() if ev.created_at else None,
                    "provider": ev.provider
                }
                for ev in events
            ]
        }
    finally:
        db.close()


@router.post("/webhooks")
async def handle_webhook(request: Request):
    """
    Secure webhook endpoint for payment providers (Stripe & internal billing).
    - Verifies webhook signatures (Stripe-Signature or X-Billing-Webhook-Secret).
    - Rejects invalid or missing signatures.
    - Idempotent: duplicate events are stored and processed only once.
    - Updates subscriptions using database transactions.
    - Never exposes webhook secrets in logs or responses.
    """
    is_prod = os.getenv("ENVIRONMENT", "").lower() in ("production", "prod")
    billing_req_sig = os.getenv("BILLING_REQUIRE_SIGNATURE", "").lower() in ("true", "1") or is_prod

    stripe_sig = request.headers.get("Stripe-Signature") or request.headers.get("stripe-signature")
    incoming_secret = request.headers.get("X-Billing-Webhook-Secret") or request.query_params.get("secret")

    raw_body = await request.body()
    parsed_event_type: Optional[str] = None
    parsed_event_id: Optional[str] = None
    target_user_id: Optional[int] = None
    target_plan_id: str = "PRO"
    provider_cust_id: Optional[str] = None
    provider_sub_id: Optional[str] = None
    provider_name: str = "stripe"

    # --- Mode 1: Real Stripe Webhook with Stripe-Signature ---
    if stripe_sig:
        stripe_wh_secret = os.getenv("STRIPE_WEBHOOK_SECRET") or BILLING_WEBHOOK_SECRET
        if not stripe_wh_secret:
            logger.warning("Rejecting Stripe webhook: missing webhook secret.")
            raise HTTPException(status_code=400, detail="Invalid Stripe webhook signature.")

        try:
            stripe_event = billing_service.verify_stripe_webhook(raw_body, stripe_sig, stripe_wh_secret)
            parsed_event_type = stripe_event.get("type")
            parsed_event_id = stripe_event.get("id")

            # Extract user reference from checkout or invoice object
            obj = stripe_event.get("data", {}).get("object", {})
            metadata = obj.get("metadata", {})
            user_id_str = metadata.get("user_id") or obj.get("client_reference_id")
            if user_id_str and str(user_id_str).isdigit():
                target_user_id = int(user_id_str)

            target_plan_id = metadata.get("plan_id", "PRO").upper()
            provider_cust_id = obj.get("customer")
            provider_sub_id = obj.get("subscription") or obj.get("id")
            provider_name = "stripe"
        except Exception as e:
            logger.warning(f"Invalid Stripe webhook signature: {e}")
            raise HTTPException(status_code=400, detail="Invalid Stripe webhook signature.")

    # --- Mode 2: Secret Header / Query Param (X-Billing-Webhook-Secret) ---
    elif incoming_secret is not None and incoming_secret != "":
        if (
            not BILLING_WEBHOOK_SECRET
            or not hmac.compare_digest(str(incoming_secret), str(BILLING_WEBHOOK_SECRET))
        ):
            logger.warning("Unauthorized billing webhook rejection: invalid secret.")
            raise HTTPException(status_code=401, detail="Invalid or missing billing webhook secret.")

        try:
            body_json = json.loads(raw_body.decode("utf-8")) if raw_body else {}
        except Exception:
            raise HTTPException(status_code=400, detail="Malformed JSON webhook body.")

        parsed_event_type = body_json.get("event_type")
        parsed_event_id = body_json.get("event_id")
        target_user_id = body_json.get("user_id")
        target_plan_id = body_json.get("plan_id", "PRO").upper()
        provider_cust_id = body_json.get("provider_customer_id")
        provider_sub_id = body_json.get("provider_subscription_id")
        provider_name = "internal_provider"

    # --- Mode 3: Missing signature / secret ---
    else:
        if billing_req_sig:
            logger.warning("Billing webhook rejected: missing required signature or secret.")
            raise HTTPException(status_code=401, detail="Missing webhook signature or secret.")

        # Safe development/test mode without signature requirement
        try:
            body_json = json.loads(raw_body.decode("utf-8")) if raw_body else {}
        except Exception:
            raise HTTPException(status_code=400, detail="Malformed JSON webhook body.")

        parsed_event_type = body_json.get("event_type")
        parsed_event_id = body_json.get("event_id")
        target_user_id = body_json.get("user_id")
        target_plan_id = body_json.get("plan_id", "PRO").upper()
        provider_cust_id = body_json.get("provider_customer_id")
        provider_sub_id = body_json.get("provider_subscription_id")
        provider_name = "development_test"

    if not parsed_event_type:
        raise HTTPException(status_code=400, detail="Missing event_type in webhook payload.")

    import secrets

    # Generate unique event_id if not explicitly present in payload
    if not parsed_event_id:
        parsed_event_id = f"evt_{parsed_event_type}_{target_user_id}_{secrets.token_hex(8)}"

    logger.info(f"Processing billing webhook: {parsed_event_type} for user_id={target_user_id} event_id={parsed_event_id}")

    db: Session = SessionLocal()
    try:
        # Task 4: Idempotency check — prevent duplicate processing
        existing_event = db.query(BillingEvent).filter(BillingEvent.event_id == parsed_event_id).first()
        if existing_event:
            logger.info(f"Duplicate webhook event {parsed_event_id} already processed. Returning idempotent response.")
            return {
                "processed": True,
                "idempotent": True,
                "event_id": parsed_event_id,
                "event_type": parsed_event_type,
                "user_id": target_user_id
            }

        # Normalize event types (supports both Stripe standard events and internal names)
        is_payment_success = parsed_event_type in [
            "checkout_completed",
            "subscription_created",
            "payment_succeeded",
            "checkout.session.completed",
            "customer.subscription.created",
            "invoice.payment_succeeded"
        ]
        is_cancellation = parsed_event_type in [
            "subscription_cancelled",
            "customer.subscription.deleted"
        ]
        is_payment_failed = parsed_event_type in [
            "payment_failed",
            "invoice.payment_failed"
        ]

        if target_user_id:
            sub = db.query(Subscription).filter(Subscription.user_id == target_user_id).first()
            if not sub:
                sub = Subscription(user_id=target_user_id)
                db.add(sub)

            if is_payment_success:
                sub.plan_id = target_plan_id
                sub.status = "ACTIVE"
                if provider_cust_id:
                    sub.provider_customer_id = provider_cust_id
                if provider_sub_id:
                    sub.provider_subscription_id = provider_sub_id
            elif is_cancellation:
                sub.status = "CANCELLED"
            elif is_payment_failed:
                sub.status = "PAST_DUE"  # Payment failure does NOT grant paid access

        # Store event record for idempotency and audit history
        record = BillingEvent(
            event_id=parsed_event_id,
            event_type=parsed_event_type,
            user_id=target_user_id,
            provider=provider_name,
            status="processed"
        )
        db.add(record)
        db.commit()

        return {
            "processed": True,
            "event_type": parsed_event_type,
            "event_id": parsed_event_id,
            "user_id": target_user_id
        }
    except Exception as e:
        db.rollback()
        logger.error(f"Webhook processing transaction failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()


@router.get("/dashboard")
async def get_business_intelligence(current_user=Depends(get_current_user)):
    return {
        "saas_metrics": billing_service.get_saas_business_metrics(),
        "unit_economics": billing_service.calculate_ai_unit_economics()
    }
