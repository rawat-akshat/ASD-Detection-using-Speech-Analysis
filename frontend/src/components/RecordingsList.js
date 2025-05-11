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
  CircularProgress,
  Alert,
  Tooltip,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

const BACKEND_URL = 'http://localhost:8000';

const RecordingsList = () => {
  const [recordings, setRecordings] = useState([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [audioPlayer] = useState(new Audio());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchRecordings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/audio/recordings`);
      if (!response.ok) {
        throw new Error('Failed to fetch recordings');
      }
      const data = await response.json();
      setRecordings(data.recordings || []);
    } catch (err) {
      setError(err.message);
      setRecordings([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecordings();
    // Set up auto-refresh every 30 seconds
    const intervalId = setInterval(fetchRecordings, 30000);
    
    // Cleanup audio player and interval on unmount
    return () => {
      audioPlayer.pause();
      audioPlayer.src = '';
      clearInterval(intervalId);
    };
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

  const formatFilename = (filename) => {
    // Remove the .wav extension and format the date
    const name = filename.replace('.wav', '');
    const date = new Date(name.replace('recording_', '').replace(/-/g, ':'));
    return date.toLocaleString();
  };

  const handleDeleteClick = (filename) => {
    setToDelete(filename);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/audio/recordings/${toDelete}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete recording');
      }
      await fetchRecordings();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
      setToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setToDelete(null);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Stored Recordings
        </Typography>
        <Tooltip title="Refresh recordings">
          <IconButton onClick={fetchRecordings} disabled={isLoading}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>
      
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      ) : recordings.length === 0 ? (
        <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
          No recordings available
        </Typography>
      ) : (
        <List>
          {recordings.map((filename, index) => (
            <React.Fragment key={filename}>
              <ListItem
                sx={{
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
                secondaryAction={
                  <Box>
                    <Tooltip title={currentlyPlaying === filename ? "Pause" : "Play"}>
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
                    </Tooltip>
                    <Tooltip title="Delete recording">
                      <span>
                        <IconButton edge="end" onClick={() => handleDeleteClick(filename)} disabled={deleting}>
                          <DeleteIcon />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </Box>
                }
              >
                <ListItemText
                  primary={formatFilename(filename)}
                  secondary={`Recording ${index + 1}`}
                />
              </ListItem>
              {index < recordings.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      )}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Recording</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this recording?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={deleting}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" disabled={deleting}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default RecordingsList; 