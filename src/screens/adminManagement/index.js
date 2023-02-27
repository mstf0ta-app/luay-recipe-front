
import React, { Fragment, memo, useEffect, useState } from 'react';
import { Layout, Menu, Breadcrumb,Row, Col, message } from 'antd';
import { UnorderedListOutlined } from '@ant-design/icons';
import './style.scss'
import { useNavigate } from "react-router-dom";
import Colors from '../../assets/themes/colors';
import GlobalSider from '../../components/GlobalSider';
import { appIdentifier, getLocal, globalUrl,} from '../../globalFunctions/api';
import GlobalHeader from '../../components/GlobalHeader';
import { GiModernCity } from "react-icons/gi";
import { MdAccountTree,MdLocationCity, MdPointOfSale } from "react-icons/md";
import { FaSitemap,FaChalkboardTeacher } from "react-icons/fa";
import { GiRotaryPhone } from "react-icons/gi";
import { RiAdminLine } from "react-icons/ri";
import AdminHeader from '../../components/AdminHeader';
import { FaUsers } from "react-icons/fa";

const { Content} = Layout;



const  MngAdminsHome = ()=> {

    const [totalInfos, settotalInfos] = useState(0)
    const [totalAdminCount, setTotalAdminCount] = useState(0)
    const [totalCitiesCount, setTotalCitiesCount] = useState(0)
    const [totalTypesCount, settotalTypesCount] = useState(0)
    const [setsalesCount, salesCount] = useState(0)
    const [countOfSales, setcountOfSales] = useState(0)
    const getInfos = (current=1,pageSize=25)=>{
        const token = getLocal(appIdentifier)?.jwt ; 
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}` );
        myHeaders.append("Content-Type", "application/json");

        var requestOptions = {
            method: 'GET',
            redirect: 'follow',
            headers: myHeaders,
        };
        
        fetch(`${globalUrl}clients`, requestOptions)
            .then(response => response.json())
            .then(result => {
                settotalInfos(result?.meta?.pagination?.total)
            })
            .catch(error => console.log('error', error));
    }

    const getAdmins = (current=1,pageSize=25)=>{
        const token = getLocal(appIdentifier)?.jwt ; 
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}` );
        myHeaders.append("Content-Type", "application/json");

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
          };
          
          fetch(`${globalUrl}users`, requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log('setTotalAdminCountresult',result)
                setTotalAdminCount(result?.length)
                
            })
            .catch(error => console.log('error', error));
      }

      const getSales = (current=1,pageSize=25)=>{
        const token = getLocal(appIdentifier)?.jwt ; 
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}` );
        myHeaders.append("Content-Type", "application/json");

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
          };
          
          fetch(`${globalUrl}sales`, requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log('getSales',result?.meta?.pagination?.total)
                setcountOfSales(result?.meta?.pagination?.total)
                
            })
            .catch(error => console.log('error', error));
      }


      
    


    


    useEffect(() => {
        getInfos()
        getAdmins()
        getSales();

    }, [])
    

    
    const localUserType = getLocal(appIdentifier)?.user?.user_type || null 
    
    return(
        <Layout className='mainContainer'>
            
            
            <AdminHeader title="لوحة ادارة النظام"/>
           
            <Layout>
            
            <GlobalSider currentPage={'mnghome'} currentSub={'sub1'} />
            <Layout
                style={{
                padding: '0 24px 24px',
                marginTop:75
                }}
            >
                <Breadcrumb
                style={{
                    margin: '16px 0',
                }}
                >
                <Breadcrumb.Item>الرئيسية</Breadcrumb.Item>
                
                </Breadcrumb>
                <Content
                className="site-layout-background"
                style={{
                    padding: 24,
                    margin: 0,
                    minHeight: 280,
                }}
                >
                <Row justify="space-around" style={{padding:50}} >
                
                    

                   
                    <DashItem
                        visible={true}
                        primaryColor={'#16697A'} 
                        secondaryColor={'#16697A    '} 
                        icon={<FaUsers  style={{color:Colors.clear, fontSize:70,textShadow: '0px 1px 2px #000000'}} />} 
                        title = {'ادارة الزبائن'}
                        count={totalInfos}
                        pageName={'/clients'}
                    />

                    <DashItem
                        visible={true}
                        primaryColor={'#ff906b'} 
                        secondaryColor={'#ff906b    '} 
                        icon={<MdPointOfSale  style={{color:Colors.clear, fontSize:70,textShadow: '0px 1px 2px #000000'}} />} 
                        title = {'ادارة المبيعات'}
                        count={countOfSales}
                        pageName={'/sales'}
                    />

                    {/* <DashItem
                        visible={true}
                        primaryColor={'#ff906b'} 
                        secondaryColor={'#ff906b    '} 
                        icon={<GiModernCity  style={{color:Colors.clear, fontSize:70, textShadow: '0px 1px 2px #000000'}} />} 
                        title = {' ادارة المحافظات'}
                        count={totalCitiesCount}
                        pageName={'/cities'}
                    />

                    <DashItem
                        visible={true}
                        primaryColor={'#e9c46a'} 
                        secondaryColor={'#e9c46a    '} 
                        icon={<MdAccountTree  style={{color:Colors.clear, fontSize:70, textShadow: '0px 1px 2px #000000'}} />} 
                        title = {'ادارة انواع الشركات'}
                        count={totalTypesCount}
                        pageName={'/companytypes'}
                    />

                    <DashItem
                        visible={true}
                        primaryColor={'#457b9d'} 
                        secondaryColor={'#457b9d    '} 
                        icon={<MdAccountTree  style={{color:Colors.clear, fontSize:70, textShadow: '0px 1px 2px #000000'}} />} 
                        title = {'ادارة نشاطات الشركات'}
                        count={activitiesCount}
                        pageName={'/activities'}
                    /> */}


                    <DashItem
                        visible={true}
                        primaryColor={'#16415b'} 
                        secondaryColor={'#16415b    '} 
                        icon={<RiAdminLine  style={{color:Colors.clear, fontSize:70, textShadow: '0px 1px 2px #000000'}} />} 
                        title = {' ادارة المدراء'}
                        count={totalAdminCount}
                        pageName={'/admins'}
                    />

                </Row>
                </Content>
            </Layout>
            </Layout>
        </Layout>
    )
}

export default MngAdminsHome




const DashItem = memo( (props)=> {
    const {primaryColor, secondaryColor,icon,title,count,pageName} = props||null
    const {visible} = props||false
    const navigate = useNavigate()

  return (
      <Fragment>
          {
            visible&&
            <Col onClick={()=>navigate(pageName)}  lg={{offset:1, span:7}} md={12} sm={24} xs={24} style={{
                cursor:'pointer',
                borderRadius:8,
                overflow:'hidden',
                height:180,marginBottom:40,
                background: `${primaryColor}`, /* Old browsers */
                background: `-moz-linear-gradient(top,  ${primaryColor} 0%, ${secondaryColor} 100%)` ,/* FF3.6-15 */
                background: `-webkit-linear-gradient(top,  ${primaryColor} 0%,${secondaryColor} 100%)`,/* Chrome10-25,Safari5.1-6 */
                background: `linear-gradient(to bottom,  ${primaryColor} 0%,${secondaryColor} 100%)`, /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
            }}>
                <Row style={{height:'100%'}}>
                    <div style={{backgroundColor:primaryColor,width:'40%', height:'100%',alignItems:'center', justifyContent:'center', display:'flex'}} >
                        {icon}
                    </div>
                    <div style={{width:'60%'}}>
                        <h1 style={{textAlign:'center', fontWeight:'bold', fontSize:22, color:Colors.clear, marginTop:32, textShadow: '0px 1px 2px #000000'}}>{title}</h1>
                        <h1 style={{textAlign:'center',fontSize:30, color:Colors.clear, marginTop:32,fontWeight:'bolder'}}>{count}</h1>
                    </div>
                </Row>
                
               
            </Col>
          }
      </Fragment>
    
    
  )
}
)
