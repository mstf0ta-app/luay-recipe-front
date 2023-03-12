
import React, { useEffect,useState } from 'react';
import { Layout, Breadcrumb,Row, Col, Button, Table, Tag, Drawer, Form, Select, Input, Space, message, Modal, Switch, DatePicker, Divider } from 'antd';
import { EditOutlined, SendOutlined, DeleteOutlined,PlusOutlined,ExclamationCircleOutlined } from '@ant-design/icons';
import './style.scss'
import { useNavigate } from "react-router-dom";
import Colors from '../../assets/themes/colors';
import GlobalSider from '../../components/GlobalSider';
import { addDataWithToken, addDataWithTokenAdmin, appIdentifier, dateFormat, deleteDataWithToken, editDataWithToken, getDataWithToken, getLocal, globalUrl, userTypes } from '../../globalFunctions/api';
import GlobalHeader from '../../components/GlobalHeader';
import moment from 'moment';
import AdminHeader from '../../components/AdminHeader';
import {BsCart4} from 'react-icons/bs'
import Search from 'antd/lib/input/Search';
const {Content} = Layout;
const { Column, ColumnGroup } = Table;
const { Option } = Select;
const {confirm} = Modal

const pageTitle = 'ادارة الزبائن';

const  MngClients = ()=> {
    const navigate = useNavigate();
    const [addInfoForm] = Form.useForm()
    const [editInfoForm] = Form.useForm()

    const [addInfoVisible, setAddInfoVisible] = useState(false);
    const [editInfoVisible, setEditInfoVisible] = useState(false);
    
    const [addLoading, setAddLoading] = useState(false);
    const [selectedInfo, setSelectedInfo] = useState(null)
    const [infoFormInfo, setInfoFormInfo] = useState(null)
    const [clients, setClients] = useState([]);
    const [totalCount, setTotalCount] = useState(null);
    const [clientName, setclientName] = useState(null);


    const localUserType = getLocal(appIdentifier)?.user?.user_type || null 

    const handleTableChange = (pagination, filters, sorter) => {
        const{current,pageSize} = pagination 
        getClients(current,pageSize)
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

   
   

      const getClients = (current=1,pageSize=25)=>{
        setClients([]);
        setTotalCount(0);
        setAddLoading(true)
        const token = getLocal(appIdentifier)?.jwt ; 
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}` );
        myHeaders.append("Content-Type", "application/json");

        let serchUrl = clientName?.length>0 ?`&filters[name][$contains]=${clientName}`:''

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
          };
          
          fetch(`${globalUrl}clients?pagination[page]=${current}&pagination[pageSize]=${pageSize}${serchUrl}`, requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log('result',result)
                setAddLoading(false);
                setClients(result?.data);
                setTotalCount(result?.meta?.pagination?.total)
                
            })
            .then(()=>console.log(clients))
            .catch(error => console.log('error', error));
      }








      const addInfo = (data)=>{
        setAddLoading(true)
       
        console.log('data isss', data)
        
        addDataWithToken(`clients`,data,
        (err,result)=>{
          setAddLoading(false);
          const {error} = result
          if(err){
            message?.error('خطأ في الشبكة')
          }else{
           if(!error){
            message?.success('تم اضافة الزبون بنجاح');
            getClients();
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
                            message?.success('تم حذف الزبون بنجاح');
                            getClients();
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
            editDataWithToken(`clients/${selectedInfo?.id}`,data,(err, result)=>{
                const {error} = result
                if(err){
                    message?.error('خطأ في الشبكة')
                }else{
                    if(!error){
                        message?.success('تم تعديل الزبون بنجاح');
                        getClients();
                        onEditClose()
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
       getClients();
     
      }, [])
      

      useEffect(() => {
        getClients();
      
       }, [clientName])
      
    
    
    return(
        <Layout className='mainContainer'>

            <Drawer
                    title="اضافة زبون"
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
                        name="name" 
                        label= 'الاسم '
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
                        name="place" 
                        label= 'مكان او جهة المعرفة '
                        
                        >
                             <Input size="large" placeholder={'مكان او جهة المعرفة '} style={{minWidth:300}}  />
                    </Form.Item>

                    <Form.Item  
                        className='myFormItem' 
                        name="phone" 
                        label= 'رقم الهاتف'
                        
                        >
                             <Input size="large" placeholder={'مكان او جهة المعرفة '} style={{minWidth:300}}  />
                    </Form.Item>

                    <Form.Item  
                        className='myFormItem' 
                        name="comment" 
                        label= 'الملاحظات'
                        
                        >
                             <Input.TextArea size="large" placeholder={'الملاحظات'} style={{minWidth:300, minHeight:150}}  />
                    </Form.Item>



                    

                    

                    

                    
                    
                    <Col md={24} style={{marginBottom:20}}  />
                    
                    
                    <Button  style={{backgroundColor:Colors.primary, borderWidth:0, marginRight:12}}  type="primary"  icon={<SendOutlined />} onClick={()=>{addInfoForm.submit()}} loading={false} >
                          اضافة زبون
                    </Button>
                    
                </Form>

            </Drawer>

            <Drawer
                    title="تعديل زبون"
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
                        name="name" 
                        label= 'الاسم '
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
                        name="place" 
                        label= 'مكان او جهة المعرفة '
                        
                        >
                             <Input size="large" placeholder={'مكان او جهة المعرفة '} style={{minWidth:300}}  />
                    </Form.Item>

                    <Form.Item  
                        className='myFormItem' 
                        name="phone" 
                        label= 'رقم الهاتف'
                        
                        >
                             <Input size="large" placeholder={'مكان او جهة المعرفة '} style={{minWidth:300}}  />
                    </Form.Item>

                    <Form.Item  
                        className='myFormItem' 
                        name="comment" 
                        label= 'الملاحظات'
                        
                        >
                             <Input.TextArea size="large" placeholder={'الملاحظات'} style={{minWidth:300, minHeight:150}}  />
                    </Form.Item>

                    
                    <Col md={24} style={{marginBottom:20}}  />
                    
                    
                    <Button  style={{backgroundColor:Colors.primary, borderWidth:0, marginRight:12}}  type="primary"  icon={<SendOutlined />} onClick={()=>{editInfoForm.submit()}} loading={false} >
                          تعديل
                    </Button>
                    
                </Form>

            </Drawer>
        
            <AdminHeader title={pageTitle}/>
            <Layout>
            
            <GlobalSider currentPage={'clients'} currentSub={'sub1'} />
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
                    <Row justify='space-between' >
                        
                        <Button onClick={()=> setAddInfoVisible(true) } style={{backgroundColor:Colors.primary, borderWidth:0}} type="primary" shape="round" icon={<PlusOutlined />} size={20}>
                            اضافة  زبون
                        </Button>
                        <Search
                            loading={addLoading}
                            placeholder="input search text"
                            onChange={(txt)=> setclientName(txt.target.value)}
                            onSearch={(txt)=>console.log('heeerew',txt)}
                            style={{
                                width: '40%',
                            }}
                        />

                    </Row>
                    
                   
                   </Col>

                    <Col md={24} style={{marginTop:24}}>

                    <Table 
                        dataSource={clients}
                        pagination={{ position: ['bottomCenter'],total:totalCount}}
                        onChange={handleTableChange}
                        loading={addLoading}
                        scroll={{ x: '100%'}}
                    >

                    

                        <Column title="الاسم"  width="300px" key="name" fixed="left" dataIndex="name" />
                        <Column title="مكان المعرفة"  width="300px" key="place" dataIndex="place" />
                        <Column title="رقم الهاتف"  width="250px" key="phone" dataIndex="phone" />
                        <Column title="الملاحظات"  width="300px" key="comment" dataIndex="comment" />
                        {
          
                            <Column title="العمليات"  width="380px" key="status" 
                                fixed='right'
                                render={(text, record) => (
                                    <Space>
                                    
                                    <Button onClick={()=> navigate(`../user-orders/${record?.id}`) } style={{backgroundColor:Colors.orange, borderWidth:0,marginLeft:20}} type="primary"  icon={<BsCart4 style={{marginLeft:12}} />} size={20}>
                                     المشتريات
                                    </Button>

                                    
                                    <Button onClick={()=> prepareEdit({id:record?.id,...record}) } style={{backgroundColor:Colors.primary, borderWidth:0,marginLeft:20}} type="primary" shape="round" icon={<EditOutlined />} size={20}>
                                        تعديل
                                    </Button>

                                    <Button onClick={()=> showDeleteConfirm(record?.teacher_name, record?.id) } style={{backgroundColor:Colors.red, borderWidth:0}} type="primary" shape="round" icon={<DeleteOutlined />} size={20}>
                                        حذف
                                    </Button>
                                    </Space>
                                    
                                )}
                            />

                        } */}
                         
                
                    </Table>

                    </Col>
                   
                </Row>
                </Content>
            </Layout>
            </Layout>
        </Layout>
    )
}

export default MngClients




