from sqlalchemy import Column, Integer, String, DateTime, func
from app.core.database import Base

class FeatureRequest(Base):
    __tablename__ = "feature_requests"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer)
    email = Column(String(255))
    phone = Column(String(50))
    message = Column(String(1000))
    feature_name = Column(String(100))
    created_at = Column(DateTime, default=func.now())