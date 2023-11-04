import  { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const ClickContext = createContext();

export const useClickContext = () => useContext(ClickContext);
const ClickProvider = ({ children }) => {
  const [clicked, setClicked] = useState(false);

  const setClickedModel = (value) => {
    setClicked(value);
  };
  const getClicked = () => {
    return clicked;
  };

  return (
    <ClickContext.Provider value={{ clicked , setClickedModel , getClicked }}>
      {children}
    </ClickContext.Provider>
  );
};

ClickProvider.propTypes = {
  children: PropTypes.node.isRequired, 
};

export default ClickProvider;
