import { Col, Form, Layout, Row, Input, Button, message } from 'antd'
import React, { Fragment } from 'react'
import Helmet from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import Colors from '../assets/themes/colors';
import { appIdentifier, appName, getLocal, removeLocal } from '../globalFunctions/api';
import { MdContactPhone } from "react-icons/md";
import './headerStyle.scss'
import logo from '../assets/images/logo.png'


const {Header} = Layout

function AdminHeader(props) {
  const {title} = props || ''
  const {goToRescue} = props ;
  const {isMain} = props ||false
  const navigate = useNavigate();

  return (
    <Fragment>

      

      <Helmet>
        <meta charSet="utf-8" />
        <title>   {`${title} ||  ${appName}  `}   </title>
      </Helmet>
        <Col span={24} className="headerCol"  >
          <Row  >
            <Col span={12} style={{height:64,  alignItems:'center', display:'flex',}} >
              <img src={logo} className='logoImage'/>
              <h2 className='gr_text'>{appName}</h2>
              <Col span={3} />
            </Col>
            <Col span={12} style={{height:64,  alignItems:'center', display:'flex', justifyContent:'flex-end'}} >
                <Button onClick={()=> removeLocal(appIdentifier,()=>navigate('/login')) }  type="primary" htmlType="submit" className='loginButtonItem' style={{borderWidth:0,fontSize:16,fontWeight:'bold', minWidth:200}}>
                      ( {`${getLocal(appIdentifier)?.user?.username }`} )   - تسجيل الخروج 
                </Button>
            </Col>
          </Row>
        </Col>
    </Fragment>
      
      
    
  )
}

export default AdminHeader

