from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.plan import SubscriptionPlan

router = APIRouter(prefix="/plans", tags=["Plans"])


@router.get("/")
def get_plans(db: Session = Depends(get_db)):
    return db.query(SubscriptionPlan).filter(SubscriptionPlan.active == True).all()


@router.post("/")
def create_plan(name: str, amount: float, interval_months: int, db: Session = Depends(get_db)):
    plan = SubscriptionPlan(
        name=name,
        amount=amount,
        interval_months=interval_months,
        active=True
    )
    db.add(plan)
    db.commit()
    return {"message": "Plan created", "plan": plan}
