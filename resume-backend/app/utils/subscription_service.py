from datetime import datetime
from dateutil.relativedelta import relativedelta
from sqlalchemy.orm import Session
from app.models.subscription import Subscription, SubscriptionStatus
from app.models.plan import SubscriptionPlan

def create_subscription(db: Session, user_id: int, plan: SubscriptionPlan):
    now = datetime.utcnow()
    period_end = now + relativedelta(months=plan.interval_months)

    subscription = Subscription(
        user_id=user_id,
        plan_id=plan.id,
        status=SubscriptionStatus.active,
        current_period_start=now,
        current_period_end=period_end,
        next_billing_date=period_end,
        cancel_at_period_end=False
    )

    db.add(subscription)
    db.commit()
    db.refresh(subscription)
    return subscription


def cancel_subscription(db: Session, subscription: Subscription):
    subscription.cancel_at_period_end = True
    subscription.status = SubscriptionStatus.canceled
    subscription.updated_at = datetime.utcnow()

    db.commit()
    return subscription


def update_after_successful_payment(
    db: Session, subscription: Subscription, plan: SubscriptionPlan
):
    subscription.current_period_start = subscription.current_period_end
    subscription.current_period_end = subscription.current_period_end + relativedelta(
        months=plan.interval_months
    )
    subscription.next_billing_date = subscription.current_period_end
    subscription.status = SubscriptionStatus.active
    subscription.cancel_at_period_end = False
    subscription.updated_at = datetime.utcnow()

    db.commit()
    return subscription


def expire_subscriptions(db: Session):
    now = datetime.utcnow()
    subs = db.query(Subscription).filter(
        Subscription.status == SubscriptionStatus.canceled,
        Subscription.current_period_end < now
    ).all()

    for sub in subs:
        sub.status = SubscriptionStatus.expired
        sub.updated_at = now

    db.commit()
