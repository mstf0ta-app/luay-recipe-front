import React,{useContext} from "react";
import {Navigate } from "react-router-dom";
import { GlobalContext } from './contexts/GlobalContext';


export const ProtectedRoute = ({children }) => {
    const {loggedIn} = useContext(GlobalContext)

    if (!loggedIn) {
      return <Navigate to="/" replace />;
    }
  
    return children;
  };