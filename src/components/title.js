import { Col } from 'antd'
import React from 'react'



export default function TitleText(props) {
    const {underlineWidth} = props || '20vw';
    const {title} = props || ''
  return (
    <Col span={24} style={{marginBottom:40}} >        
            <h1 className='titleText' >{title}</h1>
            <div className='under_gr' style={{width:underlineWidth}}/>
              
    </Col>
  )
}
