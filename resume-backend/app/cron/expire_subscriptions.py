from app.core.database import SessionLocal
from app.utils.subscription_service import expire_subscriptions

db = SessionLocal()
expire_subscriptions(db)
db.close()
