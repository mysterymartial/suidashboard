# ================================
# app/core/config.py - Configuration Management
from pydantic_settings import BaseSettings
from typing import Dict
import os


class Settings(BaseSettings):
    DEBUG: bool = True
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000

    HF_API_URL: str = os.getenv("HF_API_URL", "")
    HF_MODEL: str = os.getenv("HF_MODEL", "microsoft/DialoGPT-medium")
    HF_TOKEN: str = os.getenv("HF_TOKEN", "")

    DATABASE_URL: str = os.getenv("DATABASE_URL", "")

    CACHE_DURATION: int = 3600  # 1 hour

    RATE_LIMIT_PER_MINUTE: int = 60
    RATE_LIMIT_PER_HOUR: int = 1000

    SUI_ENDPOINTS: Dict[str, str] = {
        "mainnet": "https://fullnode.mainnet.sui.io:443",
        "testnet": "https://fullnode.testnet.sui.io:443",
        "devnet": "https://fullnode.devnet.sui.io:443"
    }

    BATCH_SIZE: int = 50
    MAX_CONCURRENT_REQUESTS: int = 20
    REQUEST_DELAY: float = 0.1

    class Config:
        env_file = ".env"


settings = Settings()
