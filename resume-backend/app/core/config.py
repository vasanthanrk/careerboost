from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str
    ENVIRONMENT: str
    DATABASE_URL: str
    JWT_SECRET: str
    GEMINI_API_KEY: str

    class Config:
        env_file = ".env"


settings = Settings()
