import { Col, Form, Layout, Row, Input, Button, message ,Select } from 'antd'
import { Fragment, useContext, useEffect, useState,useRef } from 'react'
import Helmet from 'react-helmet'
import Colors from '../../assets/themes/colors'
import GlobalHeader from '../../components/GlobalHeader'
import './style.scss'
import { useLocation, useNavigate } from "react-router-dom";
import mainImage from '../../assets/images/back.png'

import GlobalFooter from '../../components/GlobalFooter'
import { TitleUnder } from '../../components/objects'
import { addData, appIdentifier, appName, saveLocal } from '../../globalFunctions/api'
import { GlobalContext } from '../../contexts/GlobalContext'
import { MdOutlineSearch } from "react-icons/md";
import TitleText from '../../components/title'
import RecentSwiper from './recentSwiper'
import ServicesGrid from './servicesGrid'
import CompanyCarousel from './CompanyCarousel'
const { Option } = Select;
const handleChange = (value) => {
  console.log(`selected ${value}`);
};
const {Footer} = Layout

const scrollToRef = (ref) => ref.current.scrollIntoView({ behavior: "smooth" }) 






export default function HomePage() {

  const navigate = useNavigate();
  const rescueRef = useRef(null)
  const companyRef = useRef(null)
  const goToRescue = () => scrollToRef(rescueRef)
  const goToCompany = () => scrollToRef(companyRef)
  const [searchQ, setsearchQ] = useState('')
  const [companyTypes, setCompanyTypes] = useState([])
  const [errorVisible, seterrorVisible] = useState(false)

  useEffect(() => {
    getCompanyTypes()
  }, [])
  


  const getCompanyTypes = (current=1,pageSize=25)=>{
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    
    fetch("https://haitham-chamber-of-commerce.herokuapp.com/api/activities", requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log('typeees', result)
        setCompanyTypes(result?.data)
      })
      .catch(error => console.log('error', error));
  }

  const handleTextChange = (value)=>{
    setsearchQ(value.target.value); 
    if(value){
      seterrorVisible(false)
    }
    
  }

  const search = ()=>{
    let q = searchQ;
    seterrorVisible(false)
    if(q?.length>0){
      seterrorVisible(false)
      navigate(`search?q=${q}`)
    }else{
      seterrorVisible(true)
    }
    
  }

  return (
    <>
      <Row>
        

         <GlobalHeader title="الرئيسية"  goToRescue={()=>goToRescue()} goToCompany={()=>goToCompany()}  isMain={true}/>
          
          <Col span={24} className="mainPageContainer" >
          <CompanyCarousel/>
          <Row>
          
          <Col span={12} offset={6} style={{ paddingTop:50,paddingBottom:40}} >
            <h2 className='gr_text_main_txt' > ابحث عن شركة او نشاط</h2>

            <Col className='searchFormContainer' >
                <Input onChange={handleTextChange}  placeholder="اسم شركة" style={{height:'100%', borderWidth:0, }} size='large'  prefix={<MdOutlineSearch style={{fontSize:22,color:'#BFBFBF'}} />} />
                <Select
                  placeholder='نشاط الشركة'
                  size='large'
                  style={{width:300, height:40,marginTop:12, borderRight:'1px solid #BFBFBF'}}
                  bordered={false}
                  onChange={handleChange}
                >
                   {
                    companyTypes.map((item,index) => {
                      return(
                        <Option key={index} value={item?.name}>{item?.name}</Option>
                        
            
                      )
                      
                    })
          
                    }
                  
                  
                </Select>
                <Button onClick={search}  size='large' className='searchButton' type="primary"  >بحث</Button>
          

            </Col>
            {
              errorVisible&&<h3 style={{margin:16,color:'#f5222d'}} >يرجى كتابة اسم شركة</h3>
            }
            
            
          </Col>

                
              
          </Row>
              
          </Col>
          

          {/* <Col md={24} className='secondCol'>
            <TitleText underlineWidth='20vw' title="الارقام المضافة حديثاً" />
            <RecentSwiper/>
          </Col>

          <Col span={24} className="mainCol"  ref={rescueRef} >
            <TitleText underlineWidth='20vw' title="ارقام الطوارئ" />
            <ServicesGrid />
          </Col>

          <Col span={24} className="secondCol" ref={companyRef}  >
            <TitleText underlineWidth='20vw' title="الشركات المضافة حديثاً" />
            <CompanyCarousel />
          </Col> */}
          <Footer  style={{ textAlign: 'center', backgroundColor:'#16697a', color:'#fff',width:'100vw' }}>جميع الحقوق محفوظة  ٢٠٢٢</Footer>
      </Row>
      
    </>
  )
}

