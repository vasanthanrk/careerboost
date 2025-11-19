from app.models.payment import Payment
from datetime import datetime

def record_payment(db, user_id, subscription_id, payment_id, amount, status):
    payment = Payment(
        user_id=user_id,
        subscription_id=subscription_id,
        payment_id=payment_id,
        amount=amount,
        currency="INR",
        status=status,
        paid_at=datetime.utcnow()
    )

    db.add(payment)
    db.commit()
    db.refresh(payment)
    return payment
