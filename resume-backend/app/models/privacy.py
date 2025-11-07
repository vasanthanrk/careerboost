from sqlalchemy import Column, Integer, Boolean, Enum, ForeignKey
from app.core.database import Base


class PrivacySetting(Base):
    __tablename__ = "privacy_settings"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    profile_visibility = Column(Enum("public", "private"), default="private")
    show_email = Column(Boolean, default=False)
    show_phone = Column(Boolean, default=False)
    use_data_for_ai = Column(Boolean, default=True)
    allow_analytics = Column(Boolean, default=True)
    marketing_consent = Column(Boolean, default=False)
