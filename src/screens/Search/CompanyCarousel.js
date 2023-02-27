import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper";
import "swiper/css";
import "swiper/css/free-mode";
import { Avatar, Card, Col, Row } from 'antd';
import { GrUserFemale,GrUser } from "react-icons/gr";

export default function CompanyCarrousel(props) {

  const [Companies, setCompanies] = useState([])
  const [loading, setloading] = useState(true)


  useEffect(() => {
   setCompanies(props?.arr)
  }, [props])
  


  return (
   <>
    <Row justify='start'  gutter={32} style={{paddingRight:40,marginTop:40}} >
      {
          Companies?.map((item,index) => {
            return(
              
             <Col span={6} style={{minWidth:400}} >
              <CardItem phone={item?.phone} name={item?.name} city={item?.city?.name} field={item?.field} description ={item?.description} />
             </Col>
                
            
  
            )
            
          })
        }
    </Row>
   </>
  )
}


const CardItem =(props)=> {
    const {Meta} = Card
    const {phone,name,city,description,field} = props|| ''
  return (
    <div 
        className='companyItemContainer'
        style={{minWidth:300}}
    >

        <h3 className='companyTitle' >
           {name}
        </h3>
        <h2 className='companyNumber' >{phone}</h2>
        <h2 className='companyFiled' >{field}</h2>
        <p className='companyDescription' >
       {description}
        </p>
        
    </div>
  )
}