import { Col, Form, Layout, Row, Input, Button, message } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import { Fragment, useContext, useEffect, useState } from 'react'
import Helmet from 'react-helmet'
import Colors from '../../assets/themes/colors'
import GlobalHeader from '../../components/GlobalHeader'
import './style.css'
import { useLocation, useNavigate } from "react-router-dom";
import mainImage from '../../assets/images/back.png'
import GlobalFooter from '../../components/GlobalFooter'
import { TitleUnder } from '../../components/objects'
import { addData, appIdentifier, appName, saveLocal } from '../../globalFunctions/api'
import { GlobalContext } from '../../contexts/GlobalContext'

export const Login = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  const navigate = useNavigate()
  const width = window.innerWidth
  const [loginForm] = Form.useForm();
  const [loginFormInfo, setLoginFormInfo] = useState([]);
  const [addLoading, setAddLoading] = useState(false)
  const [addError, setAddError] = useState(false)
  const [errors, setErrors] = useState(null)
  const {loggedIn,setLoggedIn} = useContext(GlobalContext)
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem(appIdentifier))||null ;
    
    if (userData?.jwt) {
      navigate('/mnghome');
    }else {
      // setLoggedIn(false);
      // setLoading(false);
    }
  
   
  }, [])





  const login = (data)=>{
    setAddLoading(true)
    addData(`auth/local`,data,
    (err,result)=>{
      setAddLoading(false);
      const {error} = result || {}
      if(err){
        message?.error('خطأ في الشبكة')
      }else{
       if(!error){
        message?.success('تم تسجيل الدخول بنجاح')
        setLoggedIn(true)
        saveLocal(appIdentifier, result);
        navigate('/mnghome',{replace:true})
       }else{
         message?.error(error?.message)
       }
       
      }
     
      
    }) 
  }





  return (
    <Fragment>
       <Helmet>
            <meta charSet="utf-8" />
            <title>  تسجيل الدخول || {appName}  </title>
            {/* <link rel="canonical" href="http://mysite.com/example" /> */}
        </Helmet>
      <Layout >
       
        <Content className='mainContainer'>
          <Col md={24} style={{ paddingBottom:20}} >
              <TitleUnder title="تسجيل الدخول"/>
          </Col>

          <Col md={{span:22,offset:1}} xs={{span:24, offset:0}} style={{overflow:'hidden',  boxShadow: '0px 5px 12px 0px rgba(0,0,0,0.12)', backgroundColor:Colors.clear}} >
            <Row>
              <Col md={12} sm={24} xs={24} style={{padding:60}}>
                <h1 style={{fontSize:28,color:Colors.blueText2}}>اهلا و سهلا بكم  </h1>
                <h1 style={{fontSize:28,color:Colors.blueText2}}>في لوحة ادارة {appName} </h1>
                <h1 style={{color:Colors.grayText,marginBottom:50}}>يرجى ملئ معلومات الدخول</h1>

                <Form 
                form={loginForm} 
                onFinish={login}
                layout={"vertical"}
                // labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}
                scrollToFirstError
                
                onValuesChange={(changedValues,allValues)=>{
                  setLoginFormInfo(allValues)
                }}
                >

                <Form.Item
                    className="myFormItem"
                    hasFeedback
                    label="اسم المستخدم"
                    name="identifier"
                    rules={[
                        {
                        required: true,
                        message: 'يرجى كتابة اسم المستخدم ',
                        },
                        {
                        pattern:'^[a-z,A-Z,0-9]+$',
                        message: 'يسمح بكتابة كلمات انكليزية  فقط',
                        }

                    ]}
                    >
                        <Input style={{minWidth:300}} size="large" placeholder=" اسم المستخدم "  />
                    </Form.Item>

                    <Form.Item
                    className="myFormItem"
                    hasFeedback
                    label="كلمة المرور"
                    name="password"
                    rules={[
                        {
                        required: true,
                        message: 'يرجى كتابة كلمة المرور ',
                        },
                        {
                        pattern:'^[a-z,A-Z,0-9,_,-,@]+$',
                        message: 'يسمح بكتابة كلمات انكليزية  فقط',
                        }

                    ]}
                    >
                        <Input.Password style={{minWidth:300}} size="large" placeholder="كلمة المرور"  />
                    </Form.Item>

                    <Col
                      md={24}
                      sm={24}
                      style={{
                       paddingTop:40,
                       paddingRight:10
                      }}
                    >
                      <Button loading={addLoading} type="primary" htmlType="submit" className='loginButton' style={{borderWidth:0,fontSize:16,fontWeight:'bold', minWidth:300}}>
                        تسجيل الدخول
                      </Button>
                      

                      </Col>


                </Form>
              </Col>

              <Col md={12} sm={24} xs={24} style={{minHeight:'70vh', alignItems:'center', justifyContent:'center',display:'flex'}}>
                <img src={mainImage} style={{height:'80%',width:'80%'}} />
              </Col>
            </Row>
            
          </Col>
          
          
          
          
        </Content>
        {/* <GlobalFooter/> */}
      </Layout>
      
    </Fragment>
   
  )
}
