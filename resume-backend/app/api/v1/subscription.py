from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.config import settings
from app.utils.subscription_service import (cancel_subscription)
from app.models.subscription import Subscription
from app.models.plan import SubscriptionPlan
from app.utils.payment_service import record_payment
from app.utils.razorpay_service import create_razorpay_order
from app.utils.stripe_service import create_stripe_checkout_session
from app.utils.subscription_service import get_subscription_info
from pydantic import BaseModel
from app.core.security import get_current_user
from datetime import datetime

router = APIRouter()

class SubscriptionStartRequest(BaseModel):
    user_id: int
    plan_id: str   # because you passed "pro" (string)

@router.post("/subscription/start")
def start_subscription(payload: SubscriptionStartRequest, db: Session = Depends(get_db)):
    user_id = payload.user_id
    plan_id = payload.plan_id

    plan = db.query(SubscriptionPlan).filter(SubscriptionPlan.name == plan_id).first()
    if not plan:
        raise HTTPException(404, "Plan not found")

    print(settings.PAYMENT_GATEWAY)
    # Razorpay Flow
    if settings.PAYMENT_GATEWAY == "razorpay":
        order = create_razorpay_order(plan.amount)
        return {
            "gateway": "razorpay",
            "order": order
        }

    # Stripe Flow
    if settings.PAYMENT_GATEWAY == "stripe":
        session = create_stripe_checkout_session(plan.amount, user_id, plan_id)
        return {
            "gateway": "stripe",
            "checkout_url": session.url
        }

    raise HTTPException(400, "Invalid PAYMENT_GATEWAY setting")


@router.get("/subscription/status")
def subscription_status(current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    return get_subscription_info(current_user, db)

@router.post("/subscription/cancel")
def cancel_subscription(current_user=Depends(get_current_user), db: Session = Depends(get_db)):
    sub = db.query(Subscription).filter_by(user_id=current_user.id, status="active").first()

    if not sub:
        raise HTTPException(404, "Active subscription not found")

    sub.cancel_at_period_end = True
    sub.status = "canceled"
    db.commit()

    return {"message": "Subscription canceled. Plan will remain active until the end of billing cycle."}