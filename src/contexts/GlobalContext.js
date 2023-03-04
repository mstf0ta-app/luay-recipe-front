import React, { useState, } from 'react';

const GlobalContext = React.createContext();


const GlobalContextProvider = (props) => {
    const [userName, setUserName] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);
    

    


  return (
    <GlobalContext.Provider value={{loggedIn,setLoggedIn,userName,setUserName}}>
      {props.children}
    </GlobalContext.Provider>
  )
}

export {GlobalContext,GlobalContextProvider };