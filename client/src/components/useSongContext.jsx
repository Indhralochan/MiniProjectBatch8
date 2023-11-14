/* eslint-disable react/prop-types */
import { createContext, useContext, useState } from 'react';

const SongUriContext = createContext();

export const SongUriProvider = ({ children }) => {
  const [selectedSongUri, setSelectedSongUri] = useState(null); // Add this line
  const [selectedPlaylistIndex, setSelectedPlaylistIndex] = useState(0);
  const [playlists, setPlaylists] = useState();
  return (
    <SongUriContext.Provider value={{  selectedSongUri, setSelectedSongUri ,selectedPlaylistIndex, setSelectedPlaylistIndex ,playlists, setPlaylists }}>
      {children}
    </SongUriContext.Provider>
  );
};

export const useSongUriContext = () => {
  return useContext(SongUriContext);
};

export default SongUriProvider;