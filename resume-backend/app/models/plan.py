from sqlalchemy import Column, Integer, String, DECIMAL, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class SubscriptionPlan(Base):
    __tablename__ = "subscription_plans"

    id = Column(Integer, primary_key=True)
    name = Column(String(100))
    amount = Column(DECIMAL(10, 2))
    interval_months = Column(Integer, default=1)
    description = Column(String(255))
    active = Column(Boolean, default=True)

    subscriptions = relationship("Subscription", back_populates="plan")
