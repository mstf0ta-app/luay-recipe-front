import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper";
import "swiper/css";
import "swiper/css/free-mode";
import { Avatar, Card, message } from 'antd';
import { GrUserFemale,GrUser } from "react-icons/gr";
import { getData } from '../../globalFunctions/api';

export default function RecentSwiper() {

  const [recent, setrecent] = useState([])
  const [loading, setloading] = useState(true)

  const getRecent = (current=1,pageSize=25)=>{
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    
    fetch("https://haitham-chamber-of-commerce.herokuapp.com/api/infos?populate=*&filters[type][$eq]=individual ", requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log('result', result)
        setrecent(result?.data)
      })
      .catch(error => console.log('error', error));
  }


  useEffect(() => {
    getRecent()

  }, [])
  

  return (
   <>

   <Swiper
   style={{width:'100%', paddingTop:20}}
   speed={5000}
   grabCursor={true}
        slidesPerView={4}
        spaceBetween={30}
        dir="rtl"
        className="mySwiper"
        centeredSlides={true}
        autoplay={{
          delay: 1,
          disableOnInteraction: false,
          pauseOnMouseEnter:true
        }}
        modules={[Autoplay,FreeMode]}
        loop={true}
        freeMode={true}
      >
        {
          recent.map((item,index) => {
            return(
              
            <SwiperSlide key={index} >
                <CardItem phone={item?.phone} name={item?.name} city={item?.city?.name} gender={item?.gender} />
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
    const {phone,name,city, gender} = props|| ''
  return (
    <Card
        style={{backgroundColor:'#fff', width: 300,boxShadow: '0px 0px 9px 1px rgba(0,0,8,0.04)'}}
        
        cover={gender&&(
          gender == 'F' ? <GrUserFemale style={{fontSize:50, marginTop:20, color:'#121455'}} /> : <GrUser style={{fontSize:50, marginTop:20, color:'#121455'}} />
        )
        
        }
        
    >
        <Meta
        style={{alignItems:'center', justifyContent:'center',fontSize:20, textAlign:'center'}}
        title={name}
        description={phone}
        />

        <Meta
        style={{alignItems:'center', justifyContent:'center',fontSize:20, textAlign:'center'}}
        title={city}
        description={''}
        />
    </Card>
  )
}