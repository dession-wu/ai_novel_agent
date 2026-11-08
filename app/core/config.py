import json
from typing import List
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Novel Agent"
    API_V1_STR: str = "/api/v1"
    # Environment
    ENVIRONMENT: str = "development" # development / staging / production
    # Auth
    SECRET_KEY: str = "development_secret_key"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # LLM
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4-turbo-preview"
    
    # Database
    DATABASE_URL: str = "sqlite:///./sql_app.db" # Default to sqlite for easy start
    
    # CORS 白名单（可经环境变量覆盖，支持 JSON 数组或逗号分隔字符串）
    CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000"]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def _parse_cors_origins(cls, v):
        if isinstance(v, str):
            v = v.strip()
            if v.startswith("["):
                return json.loads(v)
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        return v

    # 基础文本检查：敏感词列表（可通过环境变量覆盖，JSON 数组）
    SENSITIVE_WORDS: List[str] = [
        "暴力", "血腥", "涉黄", "赌博", "毒品", "诈骗",
        "自杀", "自残", "色情", "枪支", "弹药", "爆炸",
        "恐怖袭击", "邪教", "传销", "洗钱", "贩毒",
        "人口贩卖", "走私", "黑客攻击",
    ]

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

# 生产环境安全校验：SECRET_KEY 仍为默认值时拒绝启动
# （SECRET_KEY 同时用于 JWT 签名与 AES 加密 key 派生，漏配可伪造令牌、解密平台账号密码）
_DEFAULT_SECRET_KEY = "development_secret_key"
if (
    settings.ENVIRONMENT.strip().lower() in ("production", "prod")
    and settings.SECRET_KEY == _DEFAULT_SECRET_KEY
):
    raise RuntimeError(
        "SECRET_KEY is set to the default development value; "
        "refusing to start in production. Set a strong SECRET_KEY via environment/.env."
    )
