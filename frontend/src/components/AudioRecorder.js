import React, { useRef, useEffect } from 'react';
import { Box, Button, Paper, Typography } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import RecordingsList from './RecordingsList';

const AudioRecorder = ({ onResultsChange, isRecording, setIsRecording }) => {
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const wsRef = useRef(null);

  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const saveRecordingToBackend = async (audioBlob, filename) => {
    try {
      const formData = new FormData();
      formData.append('file', audioBlob, filename);
      await fetch('http://localhost:8000/api/v1/audio/store', {
        method: 'POST',
        body: formData,
      });
      // Optionally, trigger a refresh of the recordings list here
    } catch (err) {
      console.error('Error uploading recording to backend:', err);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      // Connect to WebSocket
      wsRef.current = new WebSocket('ws://localhost:8000/api/v1/audio/stream');
      
      wsRef.current.onmessage = (event) => {
        const result = JSON.parse(event.data);
        onResultsChange(result);
      };

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(event.data);
        }
      };

      mediaRecorderRef.current.start(1000); // Collect data every second
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      
      if (wsRef.current) {
        wsRef.current.close();
      }

      // Save the recording to backend
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `recording_${timestamp}.wav`;
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
      saveRecordingToBackend(audioBlob, filename);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/api/v1/audio/process', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      onResultsChange(result);
    } catch (err) {
      console.error('Error uploading file:', err);
    }
  };

  return (
    <>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Audio Recording
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 2 }}>
          <Button
            variant="contained"
            color={isRecording ? "secondary" : "primary"}
            startIcon={isRecording ? <StopIcon /> : <MicIcon />}
            onClick={isRecording ? stopRecording : startRecording}
          >
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </Button>

          <Button
            variant="outlined"
            component="label"
            startIcon={<UploadFileIcon />}
          >
            Upload Audio
            <input
              type="file"
              hidden
              accept="audio/*"
              onChange={handleFileUpload}
            />
          </Button>
        </Box>
      </Paper>
      
      <RecordingsList />
    </>
  );
};

export default AudioRecorder; 