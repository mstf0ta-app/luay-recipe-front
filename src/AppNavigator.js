import { Fragment,useContext,useEffect, useState } from 'react'
import { ConfigProvider } from 'antd';
import { createBrowserHistory } from "history";
import {

    Routes,
    Route,
    useLocation
  } from "react-router-dom";



import { Login } from './screens/login';
import NotMatch from './screens/notMatch';
import { appIdentifier, getLocal } from './globalFunctions/api';
import { GlobalContext } from './contexts/GlobalContext';
import { ProtectedRoute } from './ProtectedRoute';
import HomePage from './screens/HomePage';


import MngHome from './screens/adminManagement';
import MngInfos from './screens/adminManagement/mngInfos';
import MngCities from './screens/adminManagement/mngCities';
import MngAdmins from './screens/adminManagement/mngAdmins';
import Search from './screens/Search';
import MngCompanyTypes from './screens/adminManagement/mngCompanyTypes';
import MngActivities from './screens/adminManagement/mngActivities';
import MngClients from './screens/adminManagement/mngClients';
import MngSales from './screens/adminManagement/mngSales';

// import MngUniversities from './screens/adminManagement/mngUniversities';

// import MngColleges from './screens/adminManagement/mngColleges';
// import MngDeparts from './screens/adminManagement/mngDeparts';
// import MngInfos from './screens/adminManagement/mngInfos';
// import MngAdmins from './screens/adminManagement/mngMngAdmins';






export default function AppNavigator() {

  const {loggedIn,setLoggedIn,} = useContext(GlobalContext);
  const [loading, setLoading] = useState(true)
  const localUserType = getLocal(appIdentifier)?.user?.user_type || null 
  const location = useLocation();
  useEffect(() => {
    
    const token = getLocal(appIdentifier)?.jwt|| ''
    if (token) {
      setLoggedIn(true);
      setLoading(false);
    }else{
      setLoggedIn(false);
      setLoading(false);
    }
    
  }, [location])

  
  


  return (
   <Fragment>
     {
       loading?
       <div
         style={{
           display: "flex",
           justifyContent: "center",
           alignItems: "center",
           height: "100vh",
           flexDirection: "column",
         }}
       >
         <p>Loading....</p>
       </div>
       :
        <ConfigProvider direction='rtl'  >
              
                  <Routes>
                      <Route path='/' exact  element={<ProtectedRoute><MngHome/></ProtectedRoute> } /> 
                      <Route path='/login' exact element={<Login/>} /> 
                      <Route path='/search' exact element={<Search/>} /> 

                      <Route path='/mnghome' exact element={<ProtectedRoute><MngHome/></ProtectedRoute> } /> 
                      <Route path='/admins' exact element={<ProtectedRoute><MngAdmins/></ProtectedRoute>} /> 
                      <Route path='/clients' exact element={<ProtectedRoute><MngClients/></ProtectedRoute>} />
                      <Route path='/sales' exact element={<ProtectedRoute><MngSales/></ProtectedRoute>} />
                      <Route path='/user-orders/:id' exact element={<ProtectedRoute><MngSales/></ProtectedRoute>} />



                       <Route path='/infos' exact element={<ProtectedRoute><MngInfos/></ProtectedRoute>} /> 
                       <Route path='/cities' exact element={<ProtectedRoute><MngCities/></ProtectedRoute>} /> 
                        
                       <Route path='/companytypes' exact element={<ProtectedRoute><MngCompanyTypes/></ProtectedRoute>} /> 
                       <Route path='/activities' exact element={<ProtectedRoute><MngActivities/></ProtectedRoute>} /> 

                
                       {/*
                      {
                        localUserType === 'main'&&<Route path='/unviversities' exact element={<ProtectedRoute><MngUniversities/></ProtectedRoute>} /> 
                      }

                      {
                        (localUserType === 'university' || localUserType === 'main') &&<Route path='/colleges' exact element={<ProtectedRoute><MngColleges/></ProtectedRoute>} /> 
                      }

                      {
                        (localUserType === 'college' || localUserType === 'main')&&<Route path='/departs' exact element={<ProtectedRoute><MngDeparts/></ProtectedRoute>} /> 
                      }
                      

                      <Route path='/infos' exact element={<ProtectedRoute><MngInfos/></ProtectedRoute>} /> 
                      <Route path='/admins' exact element={<ProtectedRoute><MngAdmins/></ProtectedRoute>} />  */}
                     
                      
                      <Route path='*' exact element={<NotMatch/>} /> 
                  </Routes>
              

        </ConfigProvider>

     }
       
   </Fragment>
  )
}



