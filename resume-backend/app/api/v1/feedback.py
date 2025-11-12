from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.models.user_feedback import UserFeedback
from app.core.database import get_db
from pydantic import BaseModel
from datetime import datetime
from app.core.security import get_current_user

router = APIRouter()

class FeedbackRequest(BaseModel):
    user_id: int
    rating: int | None = None
    description: str | None = None
    type_used: str
    maybe_later: bool = False

@router.post("/feedback")
def create_or_update_feedback(data: FeedbackRequest,db: Session = Depends(get_db),current_user=Depends(get_current_user)):
    """
    Create or update feedback for the current user and feedback type.
    """
    # Check if the user already has feedback for the same type
    existing_feedback = (
        db.query(UserFeedback)
        .filter(
            UserFeedback.user_id == current_user.id,
            UserFeedback.type_used == data.type_used
        )
        .first()
    )

    if existing_feedback:
        # ✅ Update existing record
        existing_feedback.rating = data.rating
        existing_feedback.description = data.description
        existing_feedback.maybe_later = data.maybe_later
        existing_feedback.created_at = datetime.utcnow()

        db.commit()
        db.refresh(existing_feedback)
        return {
            "status": "updated",
            "message": "Feedback updated successfully",
            "feedback_id": existing_feedback.id
        }
    else:
        # ✅ Create new feedback entry
        feedback = UserFeedback(
            user_id=current_user.id,
            rating=data.rating,
            description=data.description,
            type_used=data.type_used,
            maybe_later=data.maybe_later,
            created_at=datetime.utcnow()
        )
        db.add(feedback)
        db.commit()
        db.refresh(feedback)
        return {
            "status": "created",
            "message": "Feedback updated successfully",
            "feedback_id": feedback.id
        }

