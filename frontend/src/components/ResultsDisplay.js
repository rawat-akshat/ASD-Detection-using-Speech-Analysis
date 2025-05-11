import React from 'react';
import { Paper, Typography, Box, CircularProgress } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

const ResultsDisplay = ({ results }) => {
  if (!results) {
    return (
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Analysis Results
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <Typography color="text.secondary">
            Record audio or upload a file to see results
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Analysis Results
      </Typography>
      
      <Box sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          {results.prediction === "ASD_Detected" ? (
            <CheckCircleIcon color="primary" />
          ) : (
            <ErrorIcon color="error" />
          )}
          <Typography variant="h5">
            {results.prediction}
          </Typography>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Confidence: {(results.confidence * 100).toFixed(2)}%
          </Typography>
          
          <Typography variant="subtitle1" gutterBottom>
            Features Used:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {results.features_used.map((feature, index) => (
              <Paper
                key={index}
                elevation={1}
                sx={{ px: 2, py: 1, bgcolor: 'primary.light', color: 'white' }}
              >
                {feature}
              </Paper>
            ))}
          </Box>
        </Box>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
          Analysis Time: {new Date(results.timestamp).toLocaleString()}
        </Typography>
      </Box>
    </Paper>
  );
};

export default ResultsDisplay; 