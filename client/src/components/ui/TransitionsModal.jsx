import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import PropTypes from "prop-types";
import { useClickContext } from '../SelectedContext';
import { useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useRef } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import spotify from '../../assets/pngwing.com.png'
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'black',
  border: '2px solid #3e6259',
  boxShadow: 24,
  p: 4,

};
export default function TransitionsModal(props) {
  const navigate = useNavigate();
  const { clicked, setClickedModel } = useClickContext(); // Use the context
  const data = props.data;
  const songId = data[0];
  const imageUrl = data[1];
  const songName = data[2];
  const songLinks = data[3];
  console.log(songLinks)
  const [open, setOpen] = React.useState(false);
  const [uid, setUid] = React.useState(null);
  const auth = getAuth();
  const commentRef = useRef();

  const handleOpen = () => {
    setOpen(true);
    addToHistory(songId);
  }
  const handleClose = () => setOpen(false);
  useEffect(() => {
    if (clicked) {
      handleOpen();
    }
    else {
      handleClose();
      setClickedModel(false);
    }
  }, [clicked])
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
        console.log(uid);
      } else {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, []);
  const showSuccessMessage = () => {
    toast.success('Review added successffully!', {
        position: toast.POSITION.TOP_CENTER
    });
};
const showFailureMessage = () => {
    toast.error('Review Not Added!', {
        position: toast.POSITION.TOP_CENTER
    });
};
  const addToHistory = (songId) => {
    axios.post('http://localhost:5000/add-to-history', {
      "user_id": uid,
      "song_id": songId,
    })
      .then((response) => {
        console.log('Song added to history:', response.data);
      })
      .catch((error) => {
        console.error('Error adding song to history:', error);
      });
  };
  const openSong = (songlink) => {
    window.open(songlink);
  }
  const addReview = (event , songId , reviewText) => {
    event.preventDefault();
    if (reviewText.trim() !== '') {
    axios.post('http://localhost:5000/rate-song', {
      "user_id": uid,
      "song_id": songId,
      "review_text": reviewText
  }).then((response) => {
    showSuccessMessage();
    console.log('review added:', response.data);
  }).catch((error) => {
    showFailureMessage();
    console.error('Error adding review:', error);
  });
}
};
  return (
    <div className='bg-black'>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h3" className='text-white text-md'>
              {songName}
            </Typography>
            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
              <div className="text-white justify-center w-full">
                Review Box
              </div>      
<form onClick={(event) => addReview(event, songId, commentRef.current.value)}>
<div className="w-full mb-4 border border-gray-200 rounded-lg bg-black dark:bg-gray-700 dark:border-gray-600">
    <div className="px-4 py-2 bg-black rounded-t-lg dark:bg-gray-800">
        <label htmlFor="comment" className="sr-only">Your Review</label>
        <textarea ref={commentRef} id="comment" rows="4" className="w-full px-0 text-sm text-white bg-black border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400" placeholder="Write a review..." required></textarea>
    </div>
    <div className="flex items-center justify-between px-3 py-2 border-t dark:border-gray-600">
        <button type="submit" className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-[#294936] rounded-xl focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800">
            Post review
        </button>
    </div>
</div>
</form>
  <div className='flex flex-row border border-gray-300 rounded rounded-xl' onClick={()=>openSong(songLinks)}>
  <div className="px-10 py-3"><img src={spotify} alt={songName} /></div>
  <div className="text-white py-5">play the song</div>
  </div>
            </Typography>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
TransitionsModal.propTypes = {
  data: PropTypes.array.isRequired,
};
