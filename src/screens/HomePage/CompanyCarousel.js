import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide, } from "swiper/react";
import { Autoplay, EffectFade,Pagination, Parallax} from "swiper";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import { Avatar, Card, Col } from 'antd';
import { GrUserFemale,GrUser } from "react-icons/gr";

export default function CompanyCarrousel() {

  const [Companies, setCompanies] = useState([])
  const [loading, setloading] = useState(true)


  const getCompanies = (current=1,pageSize=25)=>{
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    
    fetch("https://haitham-chamber-of-commerce.herokuapp.com/api/articles?populate=mainImage", requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log('result', result)
        setCompanies(result?.data)
      })
      .catch(error => console.log('error', error));
  }

  useEffect(() => {
    getCompanies()
  }, [])
  


  return (
   <>
   <Swiper
        style={{width:'100%'}}
        speed={600}
        grabCursor={true}
        parallax={true}
        pagination={{
          clickable: true,
 
        }}
        dir="rtl"
        className="mySwiper"
        centeredSlides={false}
        loop={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        modules={[Autoplay,Pagination,Parallax]}
      >

        {
          Companies.map((item,index) => {
            return(
              
              <SwiperSlide key={index}>
                <CardItem item={item} />
              </SwiperSlide>
  
            )
            
          })
        }

       
        

        

        
       
      </Swiper>
   </>
  )
}


const CardItem =(props)=> {
    const {Meta} = Card
    const {mainImage,title} = props?.item|| ''
    const {large} = mainImage?.formats

  return (
    <Col span={5}
        className='articleItemContainer'
    >

      
      <img  src={`https://haitham-chamber-of-commerce.herokuapp.com${large?.url}`} style={{width:'100vw', height:450, objectFit:'cover' }} />
      
    
      <h3 style={{ zIndex:2, position:'absolute', right:120, bottom:'50%',color:'#fff',fontSize:35,fontWeight:300,textShadow:'1px 2px 5px rgba(0, 0, 0, 1)', borderBottom:'4px solid #FFA62B', paddingBottom:5}} className="title" data-swiper-parallax="-300" >
        {title}
      </h3>

      <a class="bItem" href="/about/">
        
      </a>

        
    </Col>
  )
}