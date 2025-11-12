from sqlalchemy import Column, Integer, String, Text, DateTime, JSON, Boolean, ForeignKey
from sqlalchemy.sql import func
from app.core.database import Base

class ATSResult(Base):
    __tablename__ = "ats_results"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    # high-level numeric score
    overall = Column(Integer, nullable=True)

    # breakdown and suggestions saved as JSON
    breakdown = Column(JSON, nullable=True)   # e.g. {"formatting":80, "keywords":70, ...}
    missing_data = Column(JSON, nullable=True)  # list of objects {category, items, severity}
    suggestions = Column(JSON, nullable=True)
    improved_resume = Column(JSON, nullable=True)  # ATS-friendly resume text (plain or HTML)

    # file path if we store generated PDF
    generated_pdf_path = Column(String(1024), nullable=True)

    type_used = Column(String(64), default="ats")  # optional
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
