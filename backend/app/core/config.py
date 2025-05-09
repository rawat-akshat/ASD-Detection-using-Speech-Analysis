from pydantic import BaseSettings
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str = "ASD Detection System"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-here")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    
    # Rockdo Configuration
    ROCKDO_IP: Optional[str] = os.getenv("ROCKDO_IP", "192.168.1.100")
    ROCKDO_PORT: int = int(os.getenv("ROCKDO_PORT", "8765"))
    ROCKDO_MODEL_PATH: str = os.getenv("ROCKDO_MODEL_PATH", "models/rockdo_model.tflite")
    
    # Redis Configuration
    REDIS_HOST: str = os.getenv("REDIS_HOST", "localhost")
    REDIS_PORT: int = int(os.getenv("REDIS_PORT", "6379"))
    
    # Audio Processing
    SAMPLE_RATE: int = 16000
    MFCC_FEATURES: int = 13
    AUDIO_CHUNK_SIZE: int = 4096
    
    class Config:
        case_sensitive = True

settings = Settings() 