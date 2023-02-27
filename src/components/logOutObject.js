import { message } from 'antd';
import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import Colors from '../assets/themes/colors';
import { GlobalContext } from '../contexts/GlobalContext';
import { removeLocal } from '../globalFunctions/api';

function LogOutObject() {
    const navigate = useNavigate()
    const {setLoggedIn} = useContext(GlobalContext)
  return (
    <div style={{position :'absolute', left:50}} onClick={()=>{setLoggedIn(false);removeLocal('atabaData', message?.success('تم تسجيل الخروج')); navigate('/');}} >
                <h3 style={{color:Colors.clear, cursor:'pointer'}}>تسجيل الخروج</h3>
    </div>
  )
}

export default LogOutObject