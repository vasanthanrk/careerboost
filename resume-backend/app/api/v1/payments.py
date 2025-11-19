from fastapi import APIRouter, Request, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.config import settings
from app.utils.razorpay_service import verify_razorpay_signature
from app.utils.stripe_service import verify_stripe_webhook
from app.utils.subscription_service import update_after_successful_payment
from app.utils.payment_service import record_payment
from app.utils.subscription_service import create_subscription
from app.models.subscription import Subscription
from app.models.plan import SubscriptionPlan
from app.core.database import get_db
import json

router = APIRouter(prefix="/payments", tags=["Payments"])

@router.post("/verify")
def verify_payment(data: dict, db: Session = Depends(get_db)):
    order_id = data["order_id"]
    payment_id = data["payment_id"]
    signature = data["signature"]
    user_id = data["user_id"]
    plan_id = data["plan_id"]

    if not verify_razorpay_signature(order_id, payment_id, signature):
        record_payment(db, user_id, 0, payment_id, plan.amount, "failed")
        raise HTTPException(400, "Invalid signature")

    plan = db.query(SubscriptionPlan).filter(SubscriptionPlan.name == plan_id).first()
    subscription = create_subscription(db, user_id, plan)

    record_payment(db, user_id, subscription.id, payment_id, plan.amount, "success")

    return {"message": "Payment verified"}

@router.post("/webhook")
async def payment_webhook(request: Request, db: Session = Depends(get_db)):
    body = await request.body()
    data = json.loads(body)

    gateway = settings.PAYMENT_GATEWAY

    # ---------------------------
    # 🔵 STRIPE WEBHOOK 
    # ---------------------------
    if gateway == "stripe":
        signature = request.headers.get("Stripe-Signature")
        event = verify_stripe_webhook(body, signature)

        if not event:
            raise HTTPException(400, "Invalid Stripe signature")

        if event["type"] == "invoice.paid":
            sub_id = event["data"]["object"]["subscription"]
            stripe_customer = event["data"]["object"]["customer"]

            payment_id = event["data"]["object"]["id"]
            amount = event["data"]["object"]["amount_paid"] / 100

            subscription = db.query(Subscription).filter_by(stripe_subscription_id=sub_id).first()
            plan = db.query(SubscriptionPlan).get(subscription.plan_id)

            update_after_successful_payment(db, subscription, plan)
            record_payment(db, subscription.user_id, subscription.id, payment_id, amount, "success")

        return {"status": "stripe-ok"}

    # ---------------------------
    # 🔵 RAZORPAY WEBHOOK
    # ---------------------------
    if gateway == "razorpay":
        event = data.get("event")

        if event == "payment.captured":
            payment = data["payload"]["payment"]["entity"]
            order_id = payment["order_id"]
            payment_id = payment["id"]
            amount = payment["amount"] / 100

            # find subscription by order mapping
            subscription = db.query(Subscription).filter_by(order_id=order_id).first()
            plan = db.query(SubscriptionPlan).get(subscription.plan_id)

            update_after_successful_payment(db, subscription, plan)
            record_payment(db, subscription.user_id, subscription.id, payment_id, amount, "success")

        return {"status": "razorpay-ok"}

    return {"status": "ignored"}

@router.post("/verify")
def verify_payment(data: dict, db: Session = Depends(get_db)):
    order_id = data["order_id"]
    payment_id = data["payment_id"]
    signature = data["signature"]
    user_id = data["user_id"]
    plan_id = data["plan_id"]

    if not verify_razorpay_signature(order_id, payment_id, signature):
        raise HTTPException(400, "Invalid signature")

    plan = db.query(SubscriptionPlan).get(plan_id)
    subscription = create_subscription(db, user_id, plan)

    record_payment(db, user_id, subscription.id, payment_id, plan.amount, "success")

    return {"message": "Payment verified"}