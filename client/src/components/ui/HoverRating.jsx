import { useState, useEffect } from 'react';
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';
import StarIcon from '@mui/icons-material/Star';
import axios from 'axios';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useSongContext } from '../SongContext';

const auth = getAuth();

const HoverRating = ({ songId }) => {
  const [value, setValue] = useState(null);
  const [uid, setUid] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
        // Call a function to get the song rating from the database
        fetchSongRating(songId, uid, setValue).catch((error) => {
          console.error('Error fetching song rating:', error);
        });
      } else {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate, songId, uid]);

  const sendRatingToServer = (newValue) => {
    axios.post('http://127.0.0.1:5000/rate-song', {
      "rating": newValue,
      "user_id": uid,
      "song_id": songId,
    })
      .then((response) => {
        console.log('Rating sent to server:', response.data);
      })
      .catch((error) => {
        console.error('Error sending rating to server:', error);
      });
  };

  const handleRatingChange = (event, newValue) => {
    setValue(newValue);
    sendRatingToServer(newValue);
  };

  return (
    <Box
      sx={{
        width: 200,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Rating
        name="hover-feedback"
        value={value !== null ? value : 0}
        precision={0.5}
        onChange={handleRatingChange}
        emptyIcon={<StarIcon style={{ opacity: 0.55, color: 'white' }} fontSize="inherit" />}
      />
    </Box>
  );
};

// Create a function to get the song rating from the database
async function fetchSongRating(songId, uid, setValue) {
  const response = await axios.get(`http://127.0.0.1:5000/get-user-rating?user_id=${uid}&song_id=${songId}`);
  if (response.data.rating !== undefined) {
    setValue(response.data.rating);
  } else {
    setValue(0);
  }
}

export default HoverRating;
