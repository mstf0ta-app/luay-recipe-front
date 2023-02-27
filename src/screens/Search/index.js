import { Col, Form, Layout, Row, Input, Button, message, Alert, Table, Space, Tag, Divider, Select } from 'antd'
import { Fragment, useContext, useEffect, useState,useRef } from 'react'
import Helmet from 'react-helmet'
import Colors from '../../assets/themes/colors'
import GlobalHeader from '../../components/GlobalHeader'
import './style.scss'
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import GlobalFooter from '../../components/GlobalFooter'

import CompanyCarousel from './CompanyCarousel'
import Column from 'antd/lib/table/Column'

const {Footer} = Layout

const scrollToRef = (ref) => ref.current.scrollIntoView({ behavior: "smooth" })   

export default function Search() {

  const navigate = useNavigate();
  const rescueRef = useRef(null)
  const goToRescue = () => scrollToRef(rescueRef)
  const [searchParams, setSearchParams] = useSearchParams();
 
  const [infos, setInfos] = useState([])
  const [loading, setloading] = useState([])
  const [totalCount, setTotalCount] = useState(null);

  
  useEffect(() => {
    getInfos()
    console.log('searchParams',searchParams.get('q'))

  }, [searchParams])
  

  const getInfos = (current=1,pageSize=25)=>{
    const searchQ = searchParams.get("q")
    if(searchQ&&searchQ?.length>0){
      setloading(true)
      var requestOptions = {
          method: 'GET',
          redirect: 'follow'
        };
        
        fetch(`https://haitham-chamber-of-commerce.herokuapp.com/api/infos?populate=*&filters[$or][0][name][$containsi]=${searchQ}`, requestOptions)
          .then(response => response.json())
          .then(result => {
            console.log('reees', result)
            setloading(false);
              setInfos(result?.data);
              setTotalCount(result?.meta?.pagination?.total)
              
            
          })
          .catch(error => console.log('error', error));
      }else{
        setInfos([]);
      }
    
  }


  const handleTableChange = (pagination, filters, sorter) => {
    const{current,pageSize} = pagination 
    getInfos(current,pageSize)
  };


  return (
    <>
      <Row>
        

         <GlobalHeader title="البحث"  goToRescue={()=>goToRescue()}  />
          <Col span={24} className="mainCol" >
              <Row>
                <Col span={8} style={{paddingRight:40,paddingTop:20}} >
                <Input.Search
                    placeholder="اكتب اسم شركة"
                    enterButton="بحث"
                    
                    className='containerforSearch'
                    size="large"
                    style={{minWidth:600}}
                    onChange={(val)=>setSearchParams(`q=${val.target.value}`)}
                    onSearch={(searchVal)=>setSearchParams(`q=${searchVal}`)}
                  />
                  
                </Col>
                <Divider/>
                
              </Row>

              <Row style={{paddingRight:40}}>
               {/* <CompanyCarousel arr={infos}/> */}


               <Table 
                        dataSource={infos}
                        pagination={{ position: ['bottomCenter'],total:totalCount}}
                        onChange={handleTableChange}
                        loading={loading}
                        scroll={{ x: '100%'}}
                >
                  <Column title="اسم الشركة"  width="300px" key="name" fixed="left" dataIndex="name" />
                  <Column title="المحافظة"  width="200px" key="city" 
                            render={(text, record) => (
                                <Space>
                                    {record?.city?.name} 
                                </Space>
                                
                            )}
                        /> 

                        <Column title="النشاط"  width="200px" key="activities" 
                            render={(text, record) => (
                                <Space>
                                   {
                                    record?.activities?.map(element => {
                                        return(<Tag color="geekblue">{element?.name}</Tag>)
                                    })
                                   }
                                </Space>
                                
                            )}
                        /> 

                </Table>
              
              </Row>
              
             
          </Col>
          

          <Footer  style={{ textAlign: 'center', backgroundColor:'#16697a', color:'#fff',width:'100vw' }}>جميع الحقوق محفوظة  ٢٠٢٢</Footer>
      </Row>
      
    </>
  )
}

