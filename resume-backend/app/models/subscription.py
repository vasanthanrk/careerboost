from sqlalchemy import Column, Integer, String, Enum, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.core.database import Base
import enum


class SubscriptionStatus(enum.Enum):
    active = "active"
    cancelled = "cancelled"
    expired = "expired"


class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    plan_name = Column(String(50))
    payment_id = Column(String(100))
    status = Column(Enum(SubscriptionStatus))
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    next_billing = Column(DateTime)
