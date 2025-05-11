# backend/config.py

from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "ASD Detection System"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    DEBUG: bool = False
    
    # Security
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    
    # Rockdo Configuration
    ROCKDO_IP: str
    ROCKDO_PORT: int
    ROCKDO_MODEL_PATH: str = "models/rockdo_model.tflite"
    
    # Redis Configuration
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    
    # Audio Processing
    SAMPLE_RATE: int = 16000
    MFCC_FEATURES: int = 13
    AUDIO_CHUNK_SIZE: int = 4096
    
    # CORS origins, defined in .env as a JSON array (e.g. '["http://foo","http://bar"]')
    BACKEND_CORS_ORIGINS: List[str] = []
    
    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "allow"  # Allow extra fields from .env

settings = Settings()
