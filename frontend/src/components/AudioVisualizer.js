import React, { useRef, useEffect } from 'react';
import { Paper, Typography, Box } from '@mui/material';
import WaveSurfer from 'wavesurfer.js';
import MicIcon from '@mui/icons-material/Mic';

const AudioVisualizer = ({ isRecording }) => {
  const waveformRef = useRef(null);
  const wavesurferRef = useRef(null);

  useEffect(() => {
    if (!wavesurferRef.current) {
      wavesurferRef.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#2196f3',
        progressColor: '#f50057',
        cursorColor: 'transparent',
        barWidth: 2,
        barRadius: 3,
        responsive: true,
        height: 100,
        barGap: 3
      });
    }

    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
      }
    };
  }, []);

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Audio Visualization
      </Typography>
      {isRecording ? (
        <div ref={waveformRef} style={{ width: '100%', height: '100px' }} />
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