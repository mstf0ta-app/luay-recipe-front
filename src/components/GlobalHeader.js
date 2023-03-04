import { Col,  Layout, Row,  Button, } from 'antd'
import React, { Fragment } from 'react'
import Helmet from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import {appName, } from '../globalFunctions/api';
import './headerStyle.scss'
import logo from '../assets/images/logo.png'


function GlobalHeader(props) {
  const {title} = props || ''
  const {goToRescue} = props ;
  const {isMain} = props ||false
  const navigate = useNavigate();

  return (
    <Fragment>

      

      <Helmet>
        <meta charSet="utf-8" />
        <title>   {`${title} || ${appName}`}   </title>
      </Helmet>
        <Col span={24} className="headerCol"  >
          <Row  >
            <Col span={12} style={{height:75,  alignItems:'center', display:'flex',}} >
              <img src={logo} className='logoImage' alt='logo' />
              <h2 className='gr_text'>{appName}</h2>
              <Col span={3} />
              <a onClick={()=>navigate('/')}  style={{paddingTop:10}} >
                <h3 className='headerLink' style={{color: isMain ?'#16697a' :'#000'}} >الرئيسية</h3>
              </a>

              
             

                <a onClick={goToRescue} style={{paddingTop:10}}>
                  <h3 className='headerLink' >عن الاتحاد</h3>
                </a>
              
              
              
              
            </Col>
            <Col span={12} style={{height:75,  alignItems:'center', display:'flex', justifyContent:'flex-end'}} >
                <Button onClick={()=>navigate('/login')}  type="primary" htmlType="submit" className='loginButtonItem' style={{borderWidth:0,fontSize:16,fontWeight:'bold', minWidth:200}}>
                        دخول المدير
                </Button>
            </Col>
          </Row>
        </Col>
    </Fragment>
      
      
    
  )
}

export default GlobalHeader

