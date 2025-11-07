from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    name = Column(String(255))
    email = Column(String(255))
    phone = Column(String(100))
    location = Column(String(255))
    summary = Column(Text)

    user = relationship("User", back_populates="resumes")

    # ✅ joined relationships
    experiences = relationship(
        "ResumeExperience", back_populates="resume", cascade="all, delete-orphan", lazy="joined"
    )
    educations = relationship(
        "ResumeEducation", back_populates="resume", cascade="all, delete-orphan", lazy="joined"
    )
    skills = relationship(
        "ResumeSkill", back_populates="resume", cascade="all, delete-orphan", lazy="joined"
    )
    projects = relationship(
        "ResumeProject", back_populates="resume", cascade="all, delete-orphan", lazy="joined"
    )


class ResumeExperience(Base):
    __tablename__ = "resume_experiences"

    id = Column(Integer, primary_key=True, index=True)
    resume_id = Column(Integer, ForeignKey("resumes.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255))
    company = Column(String(255))
    duration = Column(String(255))
    description = Column(Text)

    resume = relationship("Resume", back_populates="experiences")


class ResumeEducation(Base):
    __tablename__ = "resume_educations"

    id = Column(Integer, primary_key=True, index=True)
    resume_id = Column(Integer, ForeignKey("resumes.id", ondelete="CASCADE"), nullable=False)
    degree = Column(String(255))
    school = Column(String(255))
    year = Column(String(50))

    resume = relationship("Resume", back_populates="educations")


class ResumeSkill(Base):
    __tablename__ = "resume_skills"

    id = Column(Integer, primary_key=True, index=True)
    resume_id = Column(Integer, ForeignKey("resumes.id", ondelete="CASCADE"), nullable=False)
    skill = Column(Text)

    resume = relationship("Resume", back_populates="skills")


class ResumeProject(Base):
    __tablename__ = "resume_projects"

    id = Column(Integer, primary_key=True, index=True)
    resume_id = Column(Integer, ForeignKey("resumes.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255))
    description = Column(Text)

    resume = relationship("Resume", back_populates="projects")
