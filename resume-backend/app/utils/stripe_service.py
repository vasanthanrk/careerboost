import stripe
from app.core.config import settings

stripe.api_key = settings.STRIPE_SECRET_KEY

def create_stripe_checkout_session(amount, user_id, plan_id):
    session = stripe.checkout.Session.create(
        payment_method_types=['card'],
        mode='subscription',
        line_items=[{
            'price': plan_id,   # Stripe price ID
            'quantity': 1
        }],
        success_url=f"https://yourdomain.com/success?session_id={{CHECKOUT_SESSION_ID}}",
        cancel_url=f"https://yourdomain.com/cancel",
        metadata={"user_id": user_id}
    )
    return session


def verify_stripe_webhook(payload, sig):
    try:
        event = stripe.Webhook.construct_event(
            payload, sig, settings.STRIPE_WEBHOOK_SECRET
        )
        return event
    except Exception:
        return None
