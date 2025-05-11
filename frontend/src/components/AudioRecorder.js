import React, { useRef, useEffect, useState } from 'react';
import { Box, Button, Paper, Typography } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import Recorder from 'recorder-js';

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const recorder = new Recorder(audioContext);

const AudioRecorder = ({ onResultsChange, isRecording, setIsRecording }) => {
  const streamRef = useRef(null);
  const [audioStream, setAudioStream] = useState(null);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
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
      streamRef.current = stream;
      setAudioStream(stream);
      await recorder.init(stream);
      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const stopRecording = async () => {
    try {
      const { blob } = await recorder.stop();
      setIsRecording(false);
      setAudioStream(null);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      // Now blob is a real WAV file!
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `recording_${timestamp}.wav`;
      saveRecordingToBackend(blob, filename);
    } catch (err) {
      console.error('Error stopping recording:', err);
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
    </>
  );
};

export default AudioRecorder; 