from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime

from app.core.database import Base


class VisitorLog(Base):
    __tablename__ = "visitor_logs"

    id = Column(Integer, primary_key=True, index=True)
    ip = Column(String(50))
    country = Column(String(100))
    city = Column(String(100))
    user_agent = Column(String(500))
    timestamp = Column(DateTime, default=datetime.utcnow)
