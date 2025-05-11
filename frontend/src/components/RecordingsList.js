import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import DeleteIcon from '@mui/icons-material/Delete';

const BACKEND_URL = 'http://localhost:8000';

const RecordingsList = () => {
  const [recordings, setRecordings] = useState([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [audioPlayer] = useState(new Audio());

  useEffect(() => {
    // Fetch recordings from backend
    const fetchRecordings = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/v1/audio/recordings`);
        const data = await response.json();
        setRecordings(data.recordings || []);
      } catch (err) {
        setRecordings([]);
      }
    };
    fetchRecordings();
    // Cleanup audio player on unmount
    return () => {
      audioPlayer.pause();
      audioPlayer.src = '';
    };
    // eslint-disable-next-line
  }, []);

  const handlePlay = (filename) => {
    const url = `${BACKEND_URL}/api/v1/audio/recordings/${filename}`;
    if (currentlyPlaying === filename) {
      audioPlayer.pause();
      setCurrentlyPlaying(null);
    } else {
      audioPlayer.src = url;
      audioPlayer.play();
      setCurrentlyPlaying(filename);
      audioPlayer.onended = () => setCurrentlyPlaying(null);
    }
  };

  // Optionally, implement delete functionality if you add a backend endpoint for it

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Stored Recordings
      </Typography>
      
      {recordings.length === 0 ? (
        <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
          No recordings available
        </Typography>
      ) : (
        <List>
          {recordings.map((filename, index) => (
            <React.Fragment key={filename}>
              <ListItem
                secondaryAction={
                  <Box>
                    <IconButton
                      edge="end"
                      onClick={() => handlePlay(filename)}
                      sx={{ mr: 1 }}
                    >
                      {currentlyPlaying === filename ? (
                        <PauseIcon />
                      ) : (
                        <PlayArrowIcon />
                      )}
                    </IconButton>
                    <IconButton edge="end" disabled>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemText
                  primary={filename}
                />
              </ListItem>
              {index < recordings.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default RecordingsList; 