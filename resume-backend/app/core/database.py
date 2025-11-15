from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

# from app.models.user import User
# from app.models.resume import Resume
# from app.models.ats import ATSResult
# from app.models.activity import UserActivity
# from app.models.metrics import UserMetrics
# from app.models.cover_letter import CoverLetter
# from app.models.feature_request import FeatureRequest
# from app.models.job_fit import JobFitAnalysis
# from app.models.linkedin import LinkedInProfile
# from app.models.notification import Notification
# from app.models.portfolio import Portfolio, PortfolioExperience, PortfolioPersonal, PortfolioProject, PortfolioSkill
# from app.models.privacy import PrivacySetting
# from app.models.settings import Setting
# from app.models.subscription import Subscription
# from app.models.user_feedback import UserFeedback

engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency for FastAPI routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
