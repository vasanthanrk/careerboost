from sqlalchemy import Column, Integer, ForeignKey, Text, Float, DateTime, JSON
from sqlalchemy.sql import func
from app.core.database import Base


class JobFitAnalysis(Base):
    __tablename__ = "job_fit_analyses"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    resume_id = Column(Integer, ForeignKey("resumes.id", ondelete="CASCADE"))
    job_description = Column(Text)
    match_score = Column(Float)
    matched_skills = Column(JSON)
    missing_skills = Column(JSON)
    recommendations = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
