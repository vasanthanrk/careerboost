from sqlalchemy import Column, String, Integer, DateTime, Enum, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base
import enum


class UserRole(enum.Enum):
    user = "user"
    admin = "admin"


class PlanType(enum.Enum):
    free = "free"
    pro = "pro"
    enterprise = "enterprise"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    career_level = Column(String(50), nullable=True)
    phone = Column(String(50), nullable=True)
    location = Column(String(50), nullable=True)
    role = Column(Enum(UserRole), default=UserRole.user)
    avatar_url = Column(String(255), nullable=True)
    plan = Column(Enum(PlanType), default=PlanType.free)
    settings = Column(JSON, default={})  # 👈 Add this for dark mode, notifications, etc.
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    resumes = relationship("Resume", back_populates="user", cascade="all, delete")
