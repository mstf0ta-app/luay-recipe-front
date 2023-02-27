import React, { useState,useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const GlobalContext = React.createContext();


const GlobalContextProvider = (props) => {
    let location = useLocation();
    const [userName, setUserName] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);
    
    useEffect(() => {
      console.log('location isss', location)
    }, [location])
    


  return (
    <GlobalContext.Provider value={{loggedIn,setLoggedIn,userName,setUserName}}>
      {props.children}
    </GlobalContext.Provider>
  )
}

export {GlobalContext,GlobalContextProvider };