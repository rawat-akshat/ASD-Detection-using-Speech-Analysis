from pydantic import BaseModel
from typing import List, Dict, Any
from datetime import datetime

class AudioFeatures(BaseModel):
    name: str
    description: str
    parameters: Dict[str, Any]

class AudioResponse(BaseModel):
    prediction: str
    confidence: float
    timestamp: str
    features_used: List[str]

    class Config:
        schema_extra = {
            "example": {
                "prediction": "ASD_Detected",
                "confidence": 0.95,
                "timestamp": "2024-03-20T10:30:00Z",
                "features_used": ["MFCC", "Mel Spectrogram"]
            }
        } 