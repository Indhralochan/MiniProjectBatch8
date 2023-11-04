import  { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const SongContext = createContext();

export const useSongContext = () => useContext(SongContext);

const SongProvider = ({ children }) => {
  const [songId, setSongId] = useState(null);

  const setSongById = (id) => {
    setSongId(id);
  };

  const getSongId = () => {
    return songId;
  };

  return (
    <SongContext.Provider value={{ songId, setSongById, getSongId }}>
      {children}
    </SongContext.Provider>
  );
};

SongProvider.propTypes = {
  children: PropTypes.node.isRequired, 
};

export default SongProvider;
