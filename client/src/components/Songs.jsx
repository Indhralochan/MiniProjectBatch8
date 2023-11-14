import axios from "axios";
import { useState, useEffect } from "react";
import NavbarMain from "./NavbarMain";
import InfiniteScroll from "react-infinite-scroll-component";
import SkeletonCards from "./ui/SkeletonCards";
import HoverRating from "./ui/HoverRating";
import { useSongContext } from './SongContext';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from "react-router-dom";
import TransitionsModal from "./ui/TransitionsModal";
import { useClickContext } from "./SelectedContext";
import useAuth from "./useAuth";
import SpotifyWebApi from "spotify-web-api-node"
import { useSongUriContext } from './useSongContext';
import '../components/CustomCss/scroll.css'

const spotifyApi = new SpotifyWebApi({
  clientId: "e547c3b2d7ba459693e6ccf458347f9e",
})

function Songs() {
  const { selectedSongUri, setSelectedSongUri } = useSongUriContext();
  const code = new URLSearchParams(window.location.search).get("code")
  const accessToken = useAuth(code)
  console.log(accessToken);
  const [songs, setSongs] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const songsPerPage = 15;
  const [isLoading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { setSongById } = useSongContext();
  const [uid, setUid] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();
  const { setClickedModel } = useClickContext();
  const { clicked } = useClickContext();
  const [modal, setModal] = useState('');
  const [renderedSongs, setRenderedSongs] = useState(new Set());
  const [playingTrack, setPlayingTrack] = useState()
  const [search, setSearch] = useState("")
  const [searchResults, setSearchResults] = useState([])

  useEffect(() => {
    if (!accessToken) return
    spotifyApi.setAccessToken(accessToken)
  }, [accessToken])

  function chooseTrack(track) {
    setPlayingTrack(track)
    setSearch("")
    setLyrics("")
  }
  const loadSongs = (page) => {
    if (isLoading || !hasMore || page !== currentPage) return; // Skip if not the current page
    setLoading(true);
    axios
      .get(`http://127.0.0.1:5000/songs?page=${page}&itemsPerPage=${songsPerPage}`)
      .then((response) => {
        if (response.data.length > 0) {
          // Filter out songs that have already been rendered
          const newSongs = response.data.filter((song) => !renderedSongs.has(song.id));
          setSongs((prevSongs) => [...prevSongs, ...newSongs]);
          // Add newly rendered song IDs to the set
          newSongs.forEach((song) => renderedSongs.add(song.id));
          setCurrentPage(page + 1);
          setLoading(false);
        } else {
          setHasMore(false);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadSongs(currentPage);
  }, [currentPage]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
      } else {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, []);

  const renderSkeletonBatch = () => {
    const skeletonBatch = [];
    for (let i = 0; i < 6; i++) {
      skeletonBatch.push(<SkeletonCards key={i} />);
    }
    return skeletonBatch;
  };
  useEffect(() => {
    if (!accessToken) return
    spotifyApi.setAccessToken(accessToken)
  }, [accessToken])

  const SetSongToContext = (songId) => {
    setSongById(songId);
    console.log(songId);
  };
  const handleSetClick = (song) => {
    setModal(song);
    console.log(song);
    setClickedModel(true);
    console.log(clicked);
  };
  const handleSetSong = (uri) => {
    setSelectedSongUri(uri);
  };
    useEffect(() => {
    if (!search) return setSearchResults([])
    if (!accessToken) return

    let cancel = false
    spotifyApi.searchTracks(search).then(res => {
      if (cancel) return
      setSearchResults(
        res.body.tracks.items.map(track => {
          const smallestAlbumImage = track.album.images.reduce(
            (smallest, image) => {
              if (image.height < smallest.height) return image
              return smallest
            },
            track.album.images[0]
          )

          return {
            artist: track.artists[0].name,
            title: track.name,
            uri: track.uri,
            albumUrl: smallestAlbumImage.url,
          }
        })
      )
    })

    return () => (cancel = true)
  }, [search, accessToken])

  return (
    <div className="overflow-y-scroll overflow-x-hidden h-screen bg-[#09090B] ">
      <h1 className="text-3xl font-bold my-4 px-3 text-white mx-auto flex justify-start">
        Recommended Songs
      </h1>
      <InfiniteScroll
        dataLength={songs.length}
        next={() => loadSongs(currentPage)}
        hasMore={hasMore}
        loader={<div className="grid grid-cols-3 gap-2 px-5 rounded-lg">{renderSkeletonBatch()}</div>}
      >
        <div className="px-5 py-5 grid grid-cols-3 gap-3 h-[60%]">
          {songs.map((song) => (
            <div key={song.id} className="bg-[#09090B] border border-gray-200 rounded-xl shadow-lg shadow-[#294936] dark:bg-gray-800 dark:border-gray-700 " >
              {song.album.images && song.album.images.length > 0 && (
                <button className="w-full">
                <img
                className="rounded-t-xl"
                src={song.album.images[0].url}
                alt={song.name}
                onClick={() => handleSetSong(song.uri)}
              /></button>
              )}
              <div className="text-white px-2 text-semibold text-xl mx-auto" onClick={() => handleSetClick(song.id)}>{song.name}</div>
              <div className="flex flex-row">
                <div className="w-full text-white rounded-lg px-5 py-5">
                  Rating
                </div>
                <div className="px-3 py-5">
                  <HoverRating songId={song.id} />
                </div>
              </div>
              <div className="" >
                {console.log(song.album.uri)}
                {clicked && song.id === modal && <TransitionsModal data={[song.id, song.album.images[0].url, song.name, song.album.external_urls.spotify]} />}
              </div>
            </div>
          ))} 
        </div>
      </InfiniteScroll>
    </div>
  );
}

export default Songs;
