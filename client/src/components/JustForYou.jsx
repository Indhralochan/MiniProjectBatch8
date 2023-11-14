import React, { useEffect, useState, useContext } from 'react';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import img from '../assets/speaker.svg';
import { useSongUriContext } from './useSongContext';
import { UserDataContext } from './DataContext';
import axios from 'axios';

const JustForYou = () => {
  const [user_uuid, setuser_uuid] = useState('');
  const { selectedSongUri, setSelectedSongUri } = useSongUriContext();
  const navigate = useNavigate();
  const { userData, setUserData } = useContext(UserDataContext);

  useEffect(() => {
    const storedUserData = localStorage.getItem(user_uuid);
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    } else {
      getAuth().onAuthStateChanged((user) => {
        if (!user) navigate('/');
        else {
          setuser_uuid(user.uid);
          axios
            .get(`http://localhost:5000/collaborative-recommendations?user_id=${user.uid}`)
            .then((response) => {
              setUserData(response.data);
              localStorage.setItem(user.uid, JSON.stringify(response.data));
              localStorage.setItem("user_id", user.uid);
              console.log(response.data);
            })
            .catch((error) => {
              console.error('Error fetching data:', error);
            });
        }
      }, []);
    }
  }, []);

  const handleSetSong = (uri) => {
    setSelectedSongUri(uri);
  };
  useEffect(() => {
    console.log(userData);
  }, []);

  return (
    <>
      <div className="w-full h-screen">
        <div className="flex flex-row">
          <div className="px-5"> <img src={img} alt='speaker' /></div>
          <div className="text-white px-5 text-2xl justify-center py-5">Just For You</div>
        </div>
        <div className="flex flex-col py-5 h-[80%] overflow-y-scroll">
          {userData.data &&
            Array.isArray(userData.data) &&
            userData.data.map((song) => (
              song.album && song.album.images && song.album.images.length > 0 && (
                <div key={song.id} className="mb-3">
                  <div className="bg-[#09090B] w-[80%] border border-gray-200 rounded-xl shadow-lg shadow-[#294936] mx-auto dark:bg-gray-800 dark:border-gray-700 flex">
                    <button className="w-1/4">
                      <img
                        className="rounded-xl rounded-r-none"
                        src={song.album.images[0].url}
                        alt={song.name}
                        onClick={() => handleSetSong(song.uri)}
                      />
                    </button>
                    <div className="flex-1 text-white px-2 text-semibold text-xl">
                      {song.name}
                    </div>
                  </div>
                </div>
              )
            ))
          }
        </div>
      </div>
    </>
  );
}

export default JustForYou;
