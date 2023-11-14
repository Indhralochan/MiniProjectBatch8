import React, { useState, useEffect,useRef} from 'react';
import { getAuth } from 'firebase/auth';
import axios from 'axios';
import { useSongUriContext } from './useSongContext';
import Songs from './Songs';
import img from '../assets/Demos.jpg';
import play from '../assets/play.svg';
import Player from './Player';
const Playlist = () => {
  const [user_id, setuser_id] = useState('');
  const [data, setData] = useState([]);
  const [links, setLinks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { selectedSongUri, setSelectedSongUri ,playlists ,setPlaylists} = useSongUriContext();
  const playerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
       const id = localStorage.getItem('user_id')
       const playList=localStorage.getItem('playlists')
       const Links = localStorage.getItem('Links')
      //  if(playList && Links){
      //       setData(playList)
      //       setLinks(Links)
      //  }
      //  else{
        console.log("here 1")

        if (id) {
          console.log("here")
          const response = await axios.get(`http://localhost:5000/playlist?user_id=${id}`);
          console.log(response)
          const { playlists, links } = response.data;
          console.log(playlists[0], "test")
          localStorage.setItem("playlists",{data:playlists})
          localStorage.setItem("Links",links)
          setData(playlists);
          setLinks(links);
          setSelectedSongUri(links[0]);
        }
      // }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleSetSong = (uri, index) => {
    setSelectedSongUri(uri);
    setCurrentIndex(index);
  };

  useEffect(()=>{
    console.log(data)
    console.log("sdfsdfdsf")

    // const playlistObj = localStorage.getItem("playlists")
    // console.log(playlistObj.data)
    // console.log("from use effect")
  }, [data])

  const playAllSongs = (links) => {
    console.log(links)
    setPlaylists(links)
    console.log(playlists)
  };

  useEffect(()=>{
    console.log(playlists)
    console.log("hereee")
  },[playlists])
  

  return (
    <>
      <div className="w-full  py-5 h-screen overflow-y-scroll text-white pb-20">
      <div className="text-2xl justify-start">Playlist</div>
        <div className="flex flex-col border border-gray-300 rounded-xl shadow-lg shadow-[#294936]">
          {data.length >= 4 && currentIndex >= 0 && currentIndex < data.length && (
            <div className="flex  justify-start bg-gradient-to-r from-sky-400 to-sky-900 rounded rounded-xl border border-gray-300 shadow-lg shadow-[#294936]">
              <div className="w-[40%]">
                <div className="flex">
                  {data.slice(0, 2).map((song, index) => (
                    <div key={index} className="w-1/2">
                      {song && song.album && song.album.images[1] ? (
                        <img src={song.album.images[1].url} alt="" className='rounded rounded-lg'/>
                      ) : (
                        <img src={data[index + 1]?.album.images[1]?.url} alt="" />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex">
                  {data.slice(2, 4).map((song, index) => (
                    <div key={index} className="w-1/2">
                      {song && song.album && song.album.images[1] ? (
                        <img src={song.album.images[1].url} alt="" className='rounded rounded-lg'/>
                      ) : (
                        <img src={data[index + 3]?.album.images[1]?.url} alt="" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            <div className="flex flex-col text-white text-xl  px-20 justify-center align-center">
            <div className="">
              Top Songs of your choosing.
              </div>
              <div className="pt-10 text-2xl">
              My Mix 1
              </div>
              <div className="pt-5"><button onClick={()=>playAllSongs(links)}><div className=""><img src={play} alt="" /></div></button></div>
            </div>
            </div>
          )}
        </div>
        <div className='py-5'>
        <ul className='border border-gray-300'>
          {data && data.map((song, index) => (
            <button onClick={() => handleSetSong(links[index], index)} key={song.id} className='w-full'>
            <li className= 'bg-[#09090B] border border-gray-200 rounded-xl shadow-lg shadow-[#294936] mx-auto dark:bg-gray-800 dark:border-gray-700 flex '>
              {song.album.images[2] && (
                <img src={song.album.images[2].url || img} alt="" />
              )}
              <div className="px-10">{song.name}</div>
            </li>
            </button>
          ))}
        </ul>
        </div>        
      </div>
    </>
  );
};

export default Playlist;
