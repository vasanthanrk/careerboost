from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str
    ENVIRONMENT: str
    DATABASE_URL: str
    JWT_SECRET: str
    GEMINI_API_KEY: str
    CORS_ORIGINS:str
    PAYMENT_GATEWAY:str
    RAZORPAY_KEY_ID:str
    RAZORPAY_KEY_SECRET:str
    STRIPE_SECRET_KEY:str
    STRIPE_WEBHOOK_SECRET:str
    MAIL_USERNAME:str
    MAIL_PASSWORD:str
    MAIL_FROM:str
    MAIL_PORT:str
    MAIL_SERVER:str
    MAIL_TLS:str
    ADMIN_EMAIL:str

    class Config:
        env_file = ".env"


settings = Settings()
