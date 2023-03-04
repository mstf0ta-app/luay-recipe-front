import React,{useContext, useState} from "react";
import { useEffect } from "react";
import {Navigate } from "react-router-dom";
import { GlobalContext } from './contexts/GlobalContext';


export const ProtectedRoute = ({children }) => {
    const {loggedIn} = useContext(GlobalContext)
    const [userLoggedin, setuserLoggedin] = useState(false)

    useEffect(() => {
      
    
    }, [loggedIn])
    




    if (!loggedIn) {
      return <Navigate to="/login" replace />;
    }
  
    return children;
  };