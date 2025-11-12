from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from app.core.database import get_db
from app.models.metrics import UserMetrics
from app.models.feature_request import FeatureRequest
from app.core.security import get_current_user  # token auth helper
from pydantic import BaseModel, EmailStr, Field

router = APIRouter()

LIMIT_PER_FEATURE = 3

@router.get("/check-feature/{feature_name}")
def check_feature_usage(feature_name: str, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    metric = (
        db.query(UserMetrics)
        .filter(UserMetrics.user_id == current_user.id, UserMetrics.feature_name == feature_name)
        .first()
    )
    
    if not metric:
        metric = UserMetrics(user_id=current_user.id, feature_name=feature_name, count=0)
        db.add(metric)
        db.commit()
        db.refresh(metric)

    if metric.count >= LIMIT_PER_FEATURE:
        return {"allowed": False, "used": metric.count, "limit": LIMIT_PER_FEATURE}
    
    return {"allowed": True, "used": metric.count, "limit": LIMIT_PER_FEATURE}


@router.post("/update-feature/{feature_name}")
def update_feature_usage(feature_name: str, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    metric = (
        db.query(UserMetrics)
        .filter(UserMetrics.user_id == current_user.id, UserMetrics.feature_name == feature_name)
        .first()
    )
    
    if not metric:
        metric = UserMetrics(user_id=current_user.id, feature_name=feature_name, count=1)
        db.add(metric)
    else:
        metric.count += 1
        metric.updated_at = datetime.utcnow()
    
    db.commit()
    return {"message": "Feature count updated", "count": metric.count}

class FeatureRequestCreate(BaseModel):
    email: EmailStr
    phone: str
    message: str
    feature_name: str
    
@router.post("/contact")
def submit_contact_request(data: FeatureRequestCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    request = FeatureRequest(
        user_id=current_user.id,
        email=data.email,
        phone=data.phone,
        message=data.message,
        feature_name=data.feature_name,
        created_at=datetime.utcnow()
    )
    db.add(request)
    db.commit()
    return {"status": "success", "message": "Your request has been submitted"}
