import { Fragment,useContext,useEffect, useState } from 'react'
import { ConfigProvider } from 'antd';

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



import MngHome from './screens/adminManagement';
import MngInfos from './screens/adminManagement/mngInfos';
import MngCities from './screens/adminManagement/mngCities';
import MngAdmins from './screens/adminManagement/mngAdmins';

import MngCompanyTypes from './screens/adminManagement/mngCompanyTypes';
import MngActivities from './screens/adminManagement/mngActivities';
import MngClients from './screens/adminManagement/mngClients';
import MngSales from './screens/adminManagement/mngSales';








export default function AppNavigator() {

  // const {loggedIn,setLoggedIn,} = useContext(GlobalContext);
  const [loading, setLoading] = useState(false) 
  const location = useLocation();
  // useEffect(() => {
    
  //   const token = getLocal(appIdentifier)?.jwt|| ''
  //   if (token) {
  //     setLoggedIn(true);
  //     setLoading(false);
  //   }else{
  //     setLoggedIn(false);
  //     setLoading(false);
  //   }
    
  // }, [location])

  
  


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
              
                  <Routes  >
                      <Route path='/' exact  element={<ProtectedRoute><MngHome/></ProtectedRoute> } /> 
                      {/* <Route path='/login' exact element={<Login/>} /> 


                      <Route path='/mnghome' exact element={<ProtectedRoute><MngHome/></ProtectedRoute> } /> 
                      <Route path='/admins' exact element={<ProtectedRoute><MngAdmins/></ProtectedRoute>} /> 
                      <Route path='/clients' exact element={<ProtectedRoute><MngClients/></ProtectedRoute>} />
                      <Route path='/sales' exact element={<ProtectedRoute><MngSales/></ProtectedRoute>} />
                      <Route path='/user-orders/:id' exact element={<ProtectedRoute><MngSales/></ProtectedRoute>} />



                       <Route path='/infos' exact element={<ProtectedRoute><MngInfos/></ProtectedRoute>} /> 
                       <Route path='/cities' exact element={<ProtectedRoute><MngCities/></ProtectedRoute>} /> 
                        
                       <Route path='/companytypes' exact element={<ProtectedRoute><MngCompanyTypes/></ProtectedRoute>} /> 
                       <Route path='/activities' exact element={<ProtectedRoute><MngActivities/></ProtectedRoute>} /> 

                 */}
                       
                      
                      <Route path='*' exact element={<NotMatch/>} /> 
                  </Routes>
              

        </ConfigProvider>

     }
       
   </Fragment>
  )
}



