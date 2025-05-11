import React, { useRef, useEffect } from 'react';
import { Paper, Typography } from '@mui/material';
import WaveSurfer from 'wavesurfer.js';

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
      <div ref={waveformRef} style={{ width: '100%', height: '100px' }} />
    </Paper>
  );
};

export default AudioVisualizer; 