import { Col } from 'antd'
import React from 'react'
import './style.scss'

export const TitleUnder = (props)=> {
    const {title} = props|| null
  return (
    <>
        <h2 className='helpHeader'>{title}</h2>
        <div className="about-border"></div>
    </>
  )
}

export const TitleYellow = (props)=> {
    const {title} = props|| null
  return (
    <>
       <Col md={24} >
            <div className='page_title_container' >
              <h1 >{title}</h1>
            </div>
        </Col>
    </>
  )
}



