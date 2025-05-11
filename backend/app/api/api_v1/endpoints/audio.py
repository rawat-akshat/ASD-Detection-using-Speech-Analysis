from fastapi import APIRouter, UploadFile, File, WebSocket, BackgroundTasks, HTTPException
from fastapi.responses import JSONResponse, FileResponse
from typing import List
import numpy as np
import librosa
from app.core.config import settings
from app.models.audio_processor import AudioProcessor
from app.schemas.audio import AudioResponse, AudioFeatures
import os

router = APIRouter()
audio_processor = AudioProcessor()

RECORDINGS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../data/recordings'))

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

@router.post("/store")
async def store_audio(file: UploadFile = File(...)):
    """
    Store uploaded audio file permanently in the recordings directory
    """
    try:
        os.makedirs(RECORDINGS_DIR, exist_ok=True)
        file_location = os.path.join(RECORDINGS_DIR, file.filename)
        with open(file_location, "wb") as f:
            f.write(await file.read())
        return {"message": f"File '{file.filename}' stored successfully."}
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"message": f"Error storing audio: {str(e)}"}
        )

@router.get("/recordings")
async def list_recordings():
    """
    List all stored recordings
    """
    try:
        os.makedirs(RECORDINGS_DIR, exist_ok=True)
        files = [f for f in os.listdir(RECORDINGS_DIR) if os.path.isfile(os.path.join(RECORDINGS_DIR, f))]
        return {"recordings": files}
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"message": f"Error listing recordings: {str(e)}"}
        )

@router.get("/recordings/{filename}")
async def get_recording(filename: str):
    """
    Download a specific recording by filename
    """
    file_path = os.path.join(RECORDINGS_DIR, filename)
    if os.path.exists(file_path):
        return FileResponse(file_path, media_type='audio/wav', filename=filename)
    else:
        return JSONResponse(
            status_code=404,
            content={"message": f"Recording '{filename}' not found."}
        )

@router.delete("/recordings/{filename}")
async def delete_recording(filename: str):
    """
    Delete a specific recording by filename
    """
    file_path = os.path.join(RECORDINGS_DIR, filename)
    if os.path.exists(file_path):
        try:
            os.remove(file_path)
            return {"message": f"Recording '{filename}' deleted successfully."}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error deleting recording: {str(e)}")
    else:
        raise HTTPException(status_code=404, detail=f"Recording '{filename}' not found.") 