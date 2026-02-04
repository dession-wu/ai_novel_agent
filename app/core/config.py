from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Novel Agent"
    API_V1_STR: str = "/api/v1"
    # Auth
    SECRET_KEY: str = "development_secret_key"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # LLM
    OPENAI_API_KEY: str
    OPENAI_MODEL: str = "gpt-4-turbo-preview"
    DEEPSEEK_API_KEY: str = ""
    DOUBAO_API_KEY: str = ""
    
    # Database
    DATABASE_URL: str = "sqlite:///./sql_app.db" # Default to sqlite for easy start
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # Vector DB
    CHROMA_PERSIST_DIRECTORY: str = "./chroma_db"
    
    # Notification
    DINGTALK_WEBHOOK: str = ""
    
    # Email
    EMAIL_SENDER: str = ""
    EMAIL_PASSWORD: str = ""
    EMAIL_RECEIVER: str = ""
    EMAIL_SMTP_SERVER: str = ""
    EMAIL_SMTP_PORT: int = 465

    model_config = SettingsConfigDict(env_file=".env", env_ignore_empty=True, extra="ignore")

settings = Settings()
