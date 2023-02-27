import React from 'react'
import AppNavigator from './AppNavigator'
import { GlobalContextProvider } from './contexts/GlobalContext'
import {BrowserRouter as Router,} from 'react-router-dom'
const  App = ()=> {
  return (
    <Router>
      <GlobalContextProvider>
          <AppNavigator/>
      </GlobalContextProvider>
    </Router>
  )
}

export default App