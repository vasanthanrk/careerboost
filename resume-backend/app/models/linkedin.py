from sqlalchemy import Column, Integer, String, Text, JSON, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.core.database import Base


class LinkedInProfile(Base):
    __tablename__ = "linkedin_profiles"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    headline = Column(String(220))
    about = Column(Text)
    current_position = Column(String(150))
    skills = Column(JSON)
    optimized_headline = Column(Text)
    optimized_about = Column(Text)
    recommendations = Column(JSON)
    profile_strength = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
