import React, { useRef, useEffect } from 'react';
import { Paper, Typography, Box } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';

const AudioVisualizer = ({ isRecording }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);

  // Function to start visualization
  const startVisualization = async () => {
    try {
      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Create audio context and analyzer
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256; // Size of the FFT (Fast Fourier Transform)
      
      // Connect microphone to analyzer
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      
      // Store references
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      // Start drawing
      draw();
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  // Function to draw the visualization
  const draw = () => {
    if (!canvasRef.current || !analyserRef.current) return;

    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');
    const analyser = analyserRef.current;
    
    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Create animation frame
    animationRef.current = requestAnimationFrame(draw);

    // Get frequency data
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    // Clear canvas
    canvasCtx.fillStyle = 'rgb(255, 255, 255)';
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw bars
    const barWidth = (canvas.width / bufferLength) * 2.5;
    let barHeight;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      barHeight = dataArray[i] / 2;

      // Create gradient
      const gradient = canvasCtx.createLinearGradient(0, canvas.height, 0, 0);
      gradient.addColorStop(0, '#2196f3');
      gradient.addColorStop(1, '#f50057');
      
      canvasCtx.fillStyle = gradient;
      canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

      x += barWidth + 1;
    }
  };

  // Start/Stop visualization based on recording state
  useEffect(() => {
    if (isRecording) {
      startVisualization();
    } else {
      // Clean up
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (
        audioContextRef.current &&
        typeof audioContextRef.current.close === 'function' &&
        audioContextRef.current.state !== 'closed'
      ) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (
        audioContextRef.current &&
        typeof audioContextRef.current.close === 'function' &&
        audioContextRef.current.state !== 'closed'
      ) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, [isRecording]);

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Audio Visualization
      </Typography>
      {isRecording ? (
        <canvas 
          ref={canvasRef} 
          style={{ 
            width: '100%', 
            height: '100px',
            backgroundColor: 'white',
            borderRadius: '4px'
          }} 
        />
      ) : (
        <Box 
          sx={{ 
            width: '100%', 
            height: '100px', 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'grey.100',
            borderRadius: 1
          }}
        >
          <MicIcon sx={{ fontSize: 40, color: 'grey.400', mb: 1 }} />
          <Typography variant="body2" color="text.secondary">
            Click "Start Recording" to begin audio visualization
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default AudioVisualizer; 