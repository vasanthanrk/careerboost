from sqlalchemy import Column, String, Integer, Text, ForeignKey, Boolean, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class Portfolio(Base):
    __tablename__ = "portfolios"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    title = Column(String(150), nullable=False)
    summary = Column(Text, nullable=True)
    theme = Column(String(50), nullable=False, default="modern")
    published_url = Column(String(255), nullable=True)
    is_published = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    personal = relationship("PortfolioPersonal", back_populates="portfolio", cascade="all, delete-orphan", uselist=False)

    experiences = relationship(
        "PortfolioExperience",
        back_populates="portfolio",
        cascade="all, delete-orphan"
    )
    skills = relationship(
        "PortfolioSkill",
        back_populates="portfolio",
        cascade="all, delete-orphan"
    )
    projects = relationship(
        "PortfolioProject",
        back_populates="portfolio",
        cascade="all, delete-orphan"
    )

    def __repr__(self):
        return f"<Portfolio(id={self.id}, title='{self.title}', user_id={self.user_id})>"


class PortfolioPersonal(Base):
    __tablename__ = "portfolio_personal"

    id = Column(Integer, primary_key=True, index=True)
    portfolio_id = Column(Integer, ForeignKey("portfolios.id", ondelete="CASCADE"))
    name = Column(String(100), nullable=False)
    title = Column(String(150), nullable=True)
    bio = Column(Text, nullable=True)
    email = Column(String(150), nullable=True)
    location = Column(String(100), nullable=True)
    github_url = Column(String(150), nullable=True)
    linkedin_url = Column(String(150), nullable=True)
    website_url = Column(String(150), nullable=True)

    portfolio = relationship("Portfolio", back_populates="personal")

    def __repr__(self):
        return f"<PortfolioPersonal(name='{self.name}', title='{self.title}')>"


class PortfolioExperience(Base):
    __tablename__ = "portfolio_experiences"

    id = Column(Integer, primary_key=True, index=True)
    portfolio_id = Column(Integer, ForeignKey("portfolios.id", ondelete="CASCADE"))
    job_title = Column(String(150), nullable=False)
    company = Column(String(150), nullable=True)
    duration = Column(String(100), nullable=True)
    description = Column(Text, nullable=True)
    achievements = Column(Text, nullable=True)

    portfolio = relationship("Portfolio", back_populates="experiences")

    def __repr__(self):
        return f"<PortfolioExperience(job_title='{self.job_title}', company='{self.company}')>"


class PortfolioSkill(Base):
    __tablename__ = "portfolio_skills"

    id = Column(Integer, primary_key=True, index=True)
    portfolio_id = Column(Integer, ForeignKey("portfolios.id", ondelete="CASCADE"))
    name = Column(String(100), nullable=False)
    category = Column(String(50), nullable=True, default="General")

    portfolio = relationship("Portfolio", back_populates="skills")

    def __repr__(self):
        return f"<PortfolioSkill(name='{self.name}')>"


class PortfolioProject(Base):
    __tablename__ = "portfolio_projects"

    id = Column(Integer, primary_key=True, index=True)
    portfolio_id = Column(Integer, ForeignKey("portfolios.id", ondelete="CASCADE"))
    name = Column(String(150), nullable=False)
    description = Column(Text, nullable=True)
    technologies = Column(String(255), nullable=True)
    project_url = Column(String(255), nullable=True)
    github_url = Column(String(255), nullable=True)
    image_url = Column(String(255), nullable=True)

    portfolio = relationship("Portfolio", back_populates="projects")

    def __repr__(self):
        return f"<PortfolioProject(name='{self.name}')>"
