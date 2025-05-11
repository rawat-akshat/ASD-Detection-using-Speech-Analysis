from fastapi import APIRouter
from app.api.api_v1.endpoints import audio, auth, users

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(audio.router, prefix="/audio", tags=["audio processing"]) 