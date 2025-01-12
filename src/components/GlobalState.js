import React, { createContext, useState, useContext } from 'react';

const GlobalContext = createContext();


export const GlobalProvider = ({ children }) => {
  const [pickedStudyStyle, setPickedStudyStyle] = useState(null);

  return (
    <GlobalContext.Provider value={{ pickedStudyStyle, setPickedStudyStyle }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
