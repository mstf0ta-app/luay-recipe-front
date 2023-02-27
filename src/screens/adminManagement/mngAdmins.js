
import React, { useEffect,useState } from 'react';
import { Layout, Breadcrumb,Row, Col, Button, Table, Tag, Drawer, Form, Select, Input, Space, message, Modal, Switch, DatePicker, Divider } from 'antd';
import { EditOutlined, SendOutlined, DeleteOutlined,PlusOutlined,ExclamationCircleOutlined } from '@ant-design/icons';
import './style.scss'
import { useNavigate } from "react-router-dom";
import Colors from '../../assets/themes/colors';
import GlobalSider from '../../components/GlobalSider';
import { addDataWithToken, addDataWithTokenAdmin, appIdentifier, dateFormat, deleteDataWithToken, editDataWithToken, editDataWithTokenAdmins, getDataWithToken, getLocal, globalUrl, userTypes } from '../../globalFunctions/api';
import GlobalHeader from '../../components/GlobalHeader';
import moment from 'moment';
import AdminHeader from '../../components/AdminHeader';
const {Content} = Layout;
const { Column, ColumnGroup } = Table;
const { Option } = Select;
const {confirm} = Modal

const pageTitle = 'ادارة مدراء النظام';

const  MngAdmins = ()=> {
    const navigate = useNavigate();
    const [addInfoForm] = Form.useForm()
    const [editInfoForm] = Form.useForm()

    const [addInfoVisible, setAddInfoVisible] = useState(false);
    const [editInfoVisible, setEditInfoVisible] = useState(false);
    
    const [addLoading, setAddLoading] = useState(false);
    const [selectedInfo, setSelectedInfo] = useState(null)
    const [infoFormInfo, setInfoFormInfo] = useState(null)
    const [admins, setAdmins] = useState([]);
    const [totalCount, setTotalCount] = useState(null);


    const localUserType = getLocal(appIdentifier)?.user?.user_type || null 

    const handleTableChange = (pagination, filters, sorter) => {
        const{current,pageSize} = pagination 
        getAdmins(current,pageSize)
      };


      const onAddClose = () => {
        setAddInfoVisible(false);
        setSelectedInfo(null)
        addInfoForm.resetFields()
        
      };

      const onEditClose = () => {
        setEditInfoVisible(false);
        setSelectedInfo(null)
        editInfoForm.resetFields()
        
      };

   
   

      const getAdmins = (current=1,pageSize=25)=>{
        setAddLoading(true)
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
                console.log('result',result)
                setAddLoading(false);
                setAdmins(result);
                setTotalCount(result?.meta?.pagination?.total)
                
            })
            .then(()=>console.log(admins))
            .catch(error => console.log('error', error));
      }






      const addInfo = (data)=>{
        setAddLoading(true)
        let newData = {...data,role:1}
        console.log('newData isss', newData)
        addDataWithTokenAdmin(`users`,newData,
        (err,result)=>{
          setAddLoading(false);
          const {error} = result
          if(err){
            message?.error('خطأ في الشبكة')
          }else{
           if(!error){
            message?.success('تم اضافة المدير بنجاح');
            getAdmins();
            addInfoForm?.resetFields();
            onAddClose()
           }else{
            console.log(error)
             message?.error(error?.message)
           }
           
          }
        }) 
      }

      function showDeleteConfirm(A_field_name,id) {
        confirm({
            title: `  هل انت متأكد انك تريد حذف  ( ${A_field_name} )  `,
            icon: <ExclamationCircleOutlined style={{color:'red'}} />,
            content: 'ملاحظة : البيانات المحذوفة لا يمكن استعادتها لاحقا',
            okText: 'نعم',
            okType: 'danger',
            cancelText: 'الغاء',
            width:480,
            style:{textAlign:'right'},
            onOk() {
                setAddLoading(true);
                deleteDataWithToken(`users/${id}`,(err, result)=>{

                    const {error} = result
                    if(err){
                        message?.error('خطأ في الشبكة')
                    }else{
                        if(!error){
                            message?.success('تم حذف المدير بنجاح');
                            getAdmins();
                        }else{
                            console.log(error)
                            message?.error(error?.message)
                        }
                    
                    }
                })

            },
            onCancel() {
                console.log('Cancel');
            },
            });
        }   

        const prepareEdit = (data)=>{
            setSelectedInfo(data)
            editInfoForm.setFieldsValue(data)
            setEditInfoVisible(true)
            editInfoForm.setFieldsValue({city:data?.city?.id})
        }

        const editInfo = (data)=>{
         
            setAddLoading(true);
            editDataWithTokenAdmins(`users/${selectedInfo?.id}`,data,(err, result)=>{
                const {error} = result
                if(err){
                    message?.error('خطأ في الشبكة')
                }else{
                    if(!error){
                        message?.success('تم تعديل المدير بنجاح');
                        getAdmins();
                    }else{
                        console.log(error)
                        message?.error(error?.message)
                    }
                
                }
            })
          }

          const returnStatusTitle = (status)=>{
            var res = ''
            switch (status) {
                case 'individual':
                    res='شخصي'
                    break;
                case 'company':
                    res='شركة'
                    break;
                case 'government':
                    res='مؤسسة حكومية'
                    break;
                case 'rescue':
                    res='خدمات طوارئ'
                    break;
            
                default:
                    break;
            }
            return res
          }

          const returnGenderTitle = (gender)=>{
            var genderRes = ''
            switch (gender) {
                case 'M':
                    genderRes='ذكر'
                    break;
                case 'F':
                    genderRes='انثى'
                    break;
               
            
                default:
                    break;
            }
            return genderRes
          }



      useEffect(() => {
       getAdmins();
     
      }, [])
      
    
    
    return(
        <Layout className='mainContainer'>

            <Drawer
                    title="اضافة مدير"
                    placement="left"
                    closable={false}
                    onClose={onAddClose}
                    visible={addInfoVisible}
                    width={450}
                >
                <Form 
                    form={addInfoForm} 
                    onFinish={addInfo}
                    onValuesChange={(changedValues,allValues)=>{
                        setInfoFormInfo(allValues);
                    }}
                    layout='inline'
                >

                    <Form.Item  
                        className='myFormItem' 
                        name="fullName" 
                        label= 'الاسم الرباعي'
                        rules={[
                            {
                              required: true,
                              message: `يرجى كتابة الاسم الرباعي`,
                            }
                          ]}
                        >
                             <Input size="large" placeholder={'الاسم الرباعي'} style={{minWidth:300}}  />
                    </Form.Item>

                    <Form.Item  
                        className='myFormItem' 
                        name="username" 
                        label= 'اسم المستخدم'
                        rules={[
                            {
                              required: true,
                              message: `يرجى كتابة اسم المستخدم `,
                            },
                            {
                                pattern:'[a-zA-Z][a-zA-Z0-9]*',
                                message:'يسمح بكتابة عناصر اللغة الانكليزية فقط'
                            }
                          ]}
                        >
                             <Input size="large" placeholder={'اسم المستخدم'} style={{minWidth:300}}  />
                    </Form.Item>

                    <Form.Item  
                        className='myFormItem' 
                        name="email" 
                        label= 'البريد الالكتروني'
                        rules={[
                            {
                              required: true,
                              message: `يرجى كتابة البريد الالكتروني`,
                            },
                            {
                                type:'email',
                                message:'يرجى كتابة بريد الكتروني صحيح'
                            }
                          ]}
                        >
                             <Input size="large" placeholder={'البريد الالكتروني'} style={{minWidth:300}}  />
                    </Form.Item>

                    <Form.Item  
                        className='myFormItem' 
                        name="password" 
                        label= 'كلمة المرور'
                        rules={[
                            {
                              required: true,
                              message: `يرجى كتابة كلمة المرور`,
                            },
                            {
                                min:8,
                                message:'يرجى كتابة كلمة مرور لا تقل عن ٨ عناصر  '
                            }
                          ]}
                        >
                             <Input.Password size="large" placeholder={'كلمة المرور'} style={{minWidth:300}}  />
                    </Form.Item>


                    

                    
                    
                    <Col md={24} style={{marginBottom:20}}  />
                    
                    
                    <Button  style={{backgroundColor:Colors.primary, borderWidth:0, marginRight:12}}  type="primary"  icon={<SendOutlined />} onClick={()=>{addInfoForm.submit()}} loading={false} >
                          اضافة مدير
                    </Button>
                    
                </Form>

            </Drawer>

            <Drawer
                    title="تعديل مدير"
                    placement="left"
                    closable={false}
                    onClose={onEditClose}
                    visible={editInfoVisible}
                    width={450}
                >
                <Form 
                    form={editInfoForm} 
                    onFinish={editInfo}
                    onValuesChange={(changedValues,allValues)=>{
                        setInfoFormInfo(allValues);
                    }}
                    layout='inline'
                >

<Form.Item  
                        className='myFormItem' 
                        name="fullName" 
                        label= 'الاسم الرباعي'
                        rules={[
                            {
                              required: true,
                              message: `يرجى كتابة الاسم الرباعي`,
                            }
                          ]}
                        >
                             <Input size="large" placeholder={'الاسم الرباعي'} style={{minWidth:300}}  />
                    </Form.Item>

                    <Form.Item  
                        className='myFormItem' 
                        name="username" 
                        label= 'اسم المستخدم'
                        rules={[
                            {
                              required: true,
                              message: `يرجى كتابة اسم المستخدم `,
                            },
                            {
                                pattern:'[a-zA-Z][a-zA-Z0-9]*',
                                message:'يسمح بكتابة عناصر اللغة الانكليزية فقط'
                            }
                          ]}
                        >
                             <Input size="large" placeholder={'اسم المستخدم'} style={{minWidth:300}}  />
                    </Form.Item>

                    <Form.Item  
                        className='myFormItem' 
                        name="email" 
                        label= 'البريد الالكتروني'
                        rules={[
                            {
                              required: true,
                              message: `يرجى كتابة البريد الالكتروني`,
                            },
                            {
                                type:'email',
                                message:'يرجى كتابة بريد الكتروني صحيح'
                            }
                          ]}
                        >
                             <Input size="large" placeholder={'البريد الالكتروني'} style={{minWidth:300}}  />
                    </Form.Item>

                    <Form.Item  
                        className='myFormItem' 
                        name="password" 
                        label= 'كلمة المرور'
                        rules={[
                      
                            {
                                min:8,
                                message:'يرجى كتابة كلمة مرور لا تقل عن ٨ عناصر  '
                            }
                          ]}
                        >
                             <Input.Password size="large" placeholder={'كلمة المرور'} style={{minWidth:300}}  />
                    </Form.Item>
                    
                    <Form.Item label=" متوقف ؟" name="blocked" valuePropName="checked" >
                        <Switch  />
                    </Form.Item>

                    
                    <Col md={24} style={{marginBottom:20}}  />
                    
                    
                    <Button  style={{backgroundColor:Colors.primary, borderWidth:0, marginRight:12}}  type="primary"  icon={<SendOutlined />} onClick={()=>{editInfoForm.submit()}} loading={false} >
                          تعديل
                    </Button>
                    
                </Form>

            </Drawer>
        
            <AdminHeader title={pageTitle}/>
            <Layout>
            
            <GlobalSider currentPage={'admins'} currentSub={'sub1'} />
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
                <Breadcrumb.Item onClick={()=>navigate('/mnghome')}  style={{cursor: 'pointer'}} >الرئيسية</Breadcrumb.Item>
                <Breadcrumb.Item>{pageTitle}</Breadcrumb.Item>
                
                
                </Breadcrumb>
                <Content
                className="site-layout-background"
                style={{
                    padding: 24,
                    margin: 0,
                    minHeight: 280,
                }}
                >
                <Row  style={{padding:10}} >

                <Col md={24} >
                    {
      
                        <Button onClick={()=> setAddInfoVisible(true) } style={{backgroundColor:Colors.primary, borderWidth:0}} type="primary" shape="round" icon={<PlusOutlined />} size={20}>
                            اضافة  مدير
                        </Button>
                    }
                   
                   </Col>

                    <Col md={24} style={{marginTop:24}}>

                    <Table 
                        dataSource={admins}
                        pagination={{ position: ['bottomCenter'],total:totalCount}}
                        onChange={handleTableChange}
                        loading={addLoading}
                        scroll={{ x: '100%'}}
                    >

                    

                        <Column title="الاسم"  width="300px" key="fullName" fixed="left" dataIndex="fullName" />
                        <Column title="اسم المستخدم"  width=" 200px" key="username"  dataIndex="username" />  
                        <Column title="البريد الالكتروني"  width=" 200px" key="email"  dataIndex="email" />  

                        <Column title="متوقف"  width="200px" key="blocked" 
                            render={(text, record) => (
                                <Space>
                                  {record?.blocked? <Tag  color='red' > متوقف </Tag> : <Tag  color='green' > فعال </Tag> }
                                </Space>
                                
                            )}
                        />

                        
                        {
          
                            <Column title="العمليات"  width="250px" key="status" 
                                fixed='right'
                                render={(text, record) => (
                                    <Space>
                                    <Button onClick={()=> prepareEdit({id:record?.id,...record}) } style={{backgroundColor:Colors.primary, borderWidth:0,marginLeft:20}} type="primary" shape="round" icon={<EditOutlined />} size={20}>
                                        تعديل
                                    </Button>

                                    <Button onClick={()=> showDeleteConfirm(record?.teacher_name, record?.id) } style={{backgroundColor:Colors.red, borderWidth:0}} type="primary" shape="round" icon={<DeleteOutlined />} size={20}>
                                        حذف
                                    </Button>
                                    </Space>
                                    
                                )}
                            />

                        }
                         
                
                    </Table>

                    </Col>
                   
                </Row>
                </Content>
            </Layout>
            </Layout>
        </Layout>
    )
}

export default MngAdmins




