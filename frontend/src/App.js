import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Box, Typography, Button, Stack } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import AudioRecorder from './components/AudioRecorder';
import AudioVisualizer from './components/AudioVisualizer';
import ResultsDisplay from './components/ResultsDisplay';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

function App() {
  const [results, setResults] = React.useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleStartAnalysis = () => {
    setIsAnalyzing(true);
    // TODO: Add analysis logic
  };

  const handleStopAnalysis = () => {
    setIsAnalyzing(false);
    // TODO: Add stop logic
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom align="center">
            ASD Detection System
          </Typography>
          <Typography variant="h6" component="h2" gutterBottom align="center" color="text.secondary">
            Speech Analysis for Autism Spectrum Disorder Detection
          </Typography>
          
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<PlayArrowIcon />}
                onClick={handleStartAnalysis}
                disabled={isAnalyzing}
              >
                Run Analysis
              </Button>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                startIcon={<StopIcon />}
                onClick={handleStopAnalysis}
                disabled={!isAnalyzing}
              >
                Stop Analysis
              </Button>
            </Stack>
          </Box>

          <Box sx={{ mt: 4 }}>
            <AudioRecorder 
              onResultsChange={setResults}
              isRecording={isAnalyzing}
              setIsRecording={setIsAnalyzing}
            />
          </Box>

          <Box sx={{ mt: 4 }}>
            <AudioVisualizer isRecording={isAnalyzing} />
          </Box>

          <Box sx={{ mt: 4 }}>
            <ResultsDisplay results={results} />
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App; 