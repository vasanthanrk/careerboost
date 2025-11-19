from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Enum, DECIMAL
from sqlalchemy.orm import relationship
import enum
from datetime import datetime
from app.core.database import Base

class SubscriptionStatus(enum.Enum):
    active = "active"
    canceled = "canceled"
    expired = "expired"

class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    plan_id = Column(Integer, ForeignKey("subscription_plans.id"))
    status = Column(Enum(SubscriptionStatus), default=SubscriptionStatus.active)

    current_period_start = Column(DateTime, default=datetime.utcnow)
    current_period_end = Column(DateTime)
    next_billing_date = Column(DateTime)

    cancel_at_period_end = Column(Boolean, default=False)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

    plan = relationship("SubscriptionPlan", back_populates="subscriptions")
