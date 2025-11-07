from sqlalchemy.orm import Session
from app.models.metrics import UserMetrics
from app.models.activity import UserActivity

def track_activity(db: Session, user_id: int, activity_type: str):
    """
    Increment or create user activity counter.
    """
    existing = db.query(UserMetrics).filter_by(user_id=user_id, feature_name=activity_type).first()
    if existing:
        existing.count += 1
    else:
        existing = UserMetrics(user_id=user_id, feature_name=activity_type, count=1)
        db.add(existing)
    db.commit()
    db.refresh(existing)
    return existing

def log_user_activity(db: Session, user_id: int, action: str, meta_data: dict = None):
    """
    Logs a user activity into the database.

    Args:
        db (Session): SQLAlchemy session object.
        user_id (int): The ID of the user performing the action.
        action (str): A short description of the user action.
        meta_data (dict, optional): Additional metadata related to the action.
    """
    activity = UserActivity(
        user_id=user_id,
        action=action,
        meta_data=meta_data or {}
    )

    db.add(activity)
    db.commit()
    db.refresh(activity)
    return activity