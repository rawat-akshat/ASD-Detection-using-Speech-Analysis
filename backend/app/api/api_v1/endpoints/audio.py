from fastapi import APIRouter, UploadFile, File, WebSocket, BackgroundTasks
from fastapi.responses import JSONResponse
from typing import List
import numpy as np
import librosa
from app.core.config import settings
from app.models.audio_processor import AudioProcessor
from app.schemas.audio import AudioResponse, AudioFeatures

router = APIRouter()
audio_processor = AudioProcessor()

@router.post("/process", response_model=AudioResponse)
async def process_audio(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...)
):
    """
    Process an audio file for ASD detection
    """
    try:
        # Save uploaded file temporarily
        temp_file = f"temp_{file.filename}"
        with open(temp_file, "wb") as f:
            f.write(await file.read())
        
        # Process audio
        result = await audio_processor.process_file(temp_file)
        
        # Clean up temp file in background
        background_tasks.add_task(audio_processor.cleanup_file, temp_file)
        
        return result
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"message": f"Error processing audio: {str(e)}"}
        )

@router.websocket("/stream")
async def websocket_endpoint(websocket: WebSocket):
    """
    WebSocket endpoint for real-time audio processing
    """
    await websocket.accept()
    try:
        while True:
            # Receive audio chunk
            audio_data = await websocket.receive_bytes()
            
            # Convert to numpy array
            audio_np = np.frombuffer(audio_data, dtype=np.float32)
            
            # Process audio chunk
            result = await audio_processor.process_chunk(audio_np)
            
            # Send result back
            await websocket.send_json(result.dict())
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        await websocket.close()

@router.get("/features", response_model=List[AudioFeatures])
async def get_audio_features():
    """
    Get list of supported audio features
    """
    return [
        AudioFeatures(
            name="MFCC",
            description="Mel-frequency cepstral coefficients",
            parameters={"n_mfcc": settings.MFCC_FEATURES}
        ),
        AudioFeatures(
            name="Mel Spectrogram",
            description="Mel spectrogram features",
            parameters={"n_mels": 128}
        )
    ] 