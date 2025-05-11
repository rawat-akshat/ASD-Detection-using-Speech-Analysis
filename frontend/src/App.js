import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Box, Typography, Button, Stack } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import AudioRecorder from './components/AudioRecorder';
import AudioVisualizer from './components/AudioVisualizer';
import ResultsDisplay from './components/ResultsDisplay';
import RecordingsList from './components/RecordingsList';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

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
  const [isRecording, setIsRecording] = useState(false);
  const [selectedRecording, setSelectedRecording] = useState(null);
  const [showSelectAlert, setShowSelectAlert] = useState(false);

  const handleStartAnalysis = async () => {
    if (!selectedRecording) {
      setShowSelectAlert(true);
      return;
    }
    setIsAnalyzing(true);
    setResults(null);
    try {
      // Fetch the audio file from backend
      const response = await fetch(`http://localhost:8000/api/v1/audio/recordings/${selectedRecording}`);
      if (!response.ok) throw new Error('Failed to fetch recording');
      const audioBlob = await response.blob();
      // Send to analysis endpoint
      const formData = new FormData();
      formData.append('file', audioBlob, selectedRecording);
      const analysisResponse = await fetch('http://localhost:8000/api/v1/audio/process', {
        method: 'POST',
        body: formData,
      });
      if (!analysisResponse.ok) throw new Error('Analysis failed');
      const result = await analysisResponse.json();
      setResults(result);
    } catch (err) {
      setResults({ prediction: 'Error', confidence: 0, features_used: [], timestamp: new Date().toISOString() });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleStopAnalysis = () => {
    setIsAnalyzing(false);
    setResults(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom align="center" fontWeight="bold">
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
              isRecording={isRecording}
              setIsRecording={setIsRecording}
            />
          </Box>

          <Box sx={{ mt: 4 }}>
            <AudioVisualizer isRecording={isRecording} />
          </Box>

          <Box sx={{ mt: 4 }}>
            <ResultsDisplay results={results} />
          </Box>

          <Box sx={{ mt: 4 }}>
            <RecordingsList 
              onSelect={setSelectedRecording}
              selectedRecording={selectedRecording}
            />
          </Box>
        </Box>
        <Snackbar
          open={showSelectAlert}
          autoHideDuration={3000}
          onClose={() => setShowSelectAlert(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={() => setShowSelectAlert(false)} severity="warning" sx={{ width: '100%' }}>
            Please select a recording
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
}

export default App; 