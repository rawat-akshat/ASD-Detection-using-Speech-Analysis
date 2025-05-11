import React, { useRef, useEffect } from 'react';
import { Paper, Typography, Box } from '@mui/material';
import WaveSurfer from 'wavesurfer.js';
import MicIcon from '@mui/icons-material/Mic';

const AudioVisualizer = ({ isRecording }) => {
  const containerRef = useRef(null);
  const waveSurferRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && !waveSurferRef.current) {
      waveSurferRef.current = WaveSurfer.create({
        container: containerRef.current,
        waveColor: '#2196f3',
        progressColor: '#f50057',
        cursorColor: '#333',
        barWidth: 2,
        barRadius: 2,
        responsive: true,
        height: 80,
      });
    }

    return () => {
      if (waveSurferRef.current) {
        waveSurferRef.current.destroy();
        waveSurferRef.current = null;
      }
    };
  }, []);

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Audio Visualization
      </Typography>
      {isRecording ? (
        <div ref={containerRef} style={{ width: '100%', minHeight: 80 }} />
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