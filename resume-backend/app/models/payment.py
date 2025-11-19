from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, DECIMAL
from datetime import datetime
from app.core.database import Base

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    subscription_id = Column(Integer, ForeignKey("subscriptions.id"))
    payment_id = Column(String(255))
    amount = Column(DECIMAL(10, 2))
    currency = Column(String(10))
    status = Column(String(20))
    paid_at = Column(DateTime, default=datetime.utcnow)
