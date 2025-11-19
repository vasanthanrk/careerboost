import razorpay
from app.core.config import settings

razorpay_client = razorpay.Client(
    auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
)

def create_razorpay_order(amount: float, currency="INR"):
    print(settings.RAZORPAY_KEY_ID)
    return razorpay_client.order.create({
        "amount": int(amount * 100),
        "currency": currency,
        "payment_capture": 1
    })


def verify_razorpay_signature(order_id, payment_id, signature):
    body = f"{order_id}|{payment_id}"
    try:
        razorpay_client.utility.verify_payment_signature({
            'razorpay_order_id': order_id,
            'razorpay_payment_id': payment_id,
            'razorpay_signature': signature
        })
        return True
    except:
        return False
