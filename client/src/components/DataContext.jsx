import React, { createContext, useContext, useState } from 'react';

const UserDataContext = createContext();

export { UserDataContext };
export const useDataContext = () => useContext(UserDataContext);

// eslint-disable-next-line react/prop-types
export function UserDataProvider({ children }) {
  const [userData, setUserData] = useState([]);
  return (
    <UserDataContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserDataContext.Provider>
  );
}

export default UserDataProvider;
