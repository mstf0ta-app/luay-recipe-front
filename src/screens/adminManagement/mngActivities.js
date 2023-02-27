
import React, { useEffect,useState } from 'react';
import { Layout, Breadcrumb,Row, Col, Button, Table, Tag, Drawer, Form, Select, Input, Space, message, Modal, Switch, DatePicker, Divider } from 'antd';
import { EditOutlined, SendOutlined, DeleteOutlined,PlusOutlined,ExclamationCircleOutlined } from '@ant-design/icons';
import './style.scss'
import { useNavigate } from "react-router-dom";
import Colors from '../../assets/themes/colors';
import GlobalSider from '../../components/GlobalSider';
import { addDataWithToken, appIdentifier, dateFormat, deleteDataWithToken, editDataWithToken, getDataWithToken, getLocal, userTypes } from '../../globalFunctions/api';
import GlobalHeader from '../../components/GlobalHeader';
import moment from 'moment';
import AdminHeader from '../../components/AdminHeader';
const {Content} = Layout;
const { Column, ColumnGroup } = Table;
const { Option } = Select;
const {confirm} = Modal

const pageTitle = 'ادارة نشاطات الشركات';

const  MngActivities = ()=> {
    const navigate = useNavigate();
    const [addCompanyTypeForm] = Form.useForm()
    const [editCompanyTypeForm] = Form.useForm()

    const [addCompanyTypeVisible, setAddCompanyTypeVisible] = useState(false);
    const [editCompanyTypeVisible, setEditCompanyTypeVisible] = useState(false);
    
    const [addLoading, setAddLoading] = useState(false);
    const [selectedCompanyType, setSelectedCompanyType] = useState(null)
    const [infoFormCompanyType, setCompanyTypeFormCompanyType] = useState(null)
    const [cities, setCompanyTypes] = useState([]);
    const [totalCount, setTotalCount] = useState(null);
    const [certificates, setcertificates] = useState([])
    const [scintificTitles, setscintificTitles] = useState([])
   

    const localUserType = getLocal(appIdentifier)?.user?.user_type || null 

    const handleTableChange = (pagination, filters, sorter) => {
        const{current,pageSize} = pagination 
        getCompanyTypes(current,pageSize)
      };


      const onAddClose = () => {
        setAddCompanyTypeVisible(false);
        setSelectedCompanyType(null)
        addCompanyTypeForm.resetFields()
        
      };

      const onEditClose = () => {
        setEditCompanyTypeVisible(false);
        setSelectedCompanyType(null)
        editCompanyTypeForm.resetFields()
        
      };

   
   

      const getCompanyTypes = (current=1,pageSize=25)=>{
        setAddLoading(true)
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
          };
          
          fetch(`https://haitham-chamber-of-commerce.herokuapp.com/api/activities?sort[0]=id:desc`, requestOptions)
            .then(response => response.json())
            .then(result => {
                setAddLoading(false);
                setCompanyTypes(result?.data);
                setTotalCount(result?.meta?.pagination?.total)
            })
            .catch(error => console.log('error', error));
      }





      const addCompanyType = (data)=>{
        setAddLoading(true)
        console.log('data isss', data)
        addDataWithToken(`activities`,data,
        (err,result)=>{
          setAddLoading(false);
          const {error} = result
          if(err){
            message?.error('خطأ في الشبكة')
          }else{
           if(!error){
            message?.success('تم اضافة النشاط بنجاح');
            getCompanyTypes();
            addCompanyTypeForm?.resetFields();
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
                deleteDataWithToken(`activities/${id}`,(err, result)=>{

                    const {error} = result
                    if(err){
                        message?.error('خطأ في الشبكة')
                    }else{
                        if(!error){
                            message?.success('تم حذف النشاط بنجاح');
                            getCompanyTypes();
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
            setSelectedCompanyType(data)
            editCompanyTypeForm.setFieldsValue(data)
            setEditCompanyTypeVisible(true)
            editCompanyTypeForm.setFieldsValue({companyType:data?.companyType?.id})
        }

        const editCompanyType = (data)=>{
         
            setAddLoading(true);
            editDataWithToken(`activities/${selectedCompanyType?.id}`,data,(err, result)=>{
                const {error} = result
                if(err){
                    message?.error('خطأ في الشبكة')
                }else{
                    if(!error){
                        message?.success('تم تعديل النشاط بنجاح');
                        getCompanyTypes();
                    }else{
                        console.log(error)
                        message?.error(error?.message)
                    }
                
                }
            })
          }





      useEffect(() => {
       getCompanyTypes();
    
      }, [])
      
    
    
    return(
        <Layout className='mainContainer'>

            <Drawer
                    title="اضافة نشاط شركة"
                    placement="left"
                    closable={false}
                    onClose={onAddClose}
                    visible={addCompanyTypeVisible}
                    width={450}
                >
                <Form 
                    form={addCompanyTypeForm} 
                    onFinish={addCompanyType}
                    onValuesChange={(changedValues,allValues)=>{
                        setCompanyTypeFormCompanyType(allValues);
                    }}
                    layout='inline'
                >

                    

                    <Form.Item  
                        className='myFormItem' 
                        name="name" 
                        label= 'اسم النشاط'
                        rules={[
                            {
                              required: true,
                              message: `يرجى كتابة اسم النشاط`,
                            }
                          ]}
                        >
                             <Input size="large" placeholder={'اسم النشاط'} style={{minWidth:300}}  />
                    </Form.Item>

                    

                    
                    <Col md={24} style={{marginBottom:20}}  />
                    
                    
                    <Button  style={{backgroundColor:Colors.primary, borderWidth:0, marginRight:12}}  type="primary"  icon={<SendOutlined />} onClick={()=>{addCompanyTypeForm.submit()}} loading={false} >
                          اضافة نشاط شركة
                    </Button>
                    
                </Form>

            </Drawer>

            <Drawer
                    title="تعديل نشاط شركة"
                    placement="left"
                    closable={false}
                    onClose={onEditClose}
                    visible={editCompanyTypeVisible}
                    width={450}
                >
                <Form 
                    form={editCompanyTypeForm} 
                    onFinish={editCompanyType}
                    onValuesChange={(changedValues,allValues)=>{
                        setCompanyTypeFormCompanyType(allValues);
                    }}
                    layout='inline'
                >

                    <Form.Item  
                        className='myFormItem' 
                        name="name" 
                        label= 'اسم النشاط'
                        rules={[
                            {
                              required: true,
                              message: `يرجى كتابة اسم النشاط`,
                            }
                          ]}
                        >
                             <Input size="large" placeholder={'اسم النشاط'} style={{minWidth:300}}  />
                    </Form.Item>


                    
                    

                    
                    <Col md={24} style={{marginBottom:20}}  />
                    
                    
                    <Button  style={{backgroundColor:Colors.primary, borderWidth:0, marginRight:12}}  type="primary"  icon={<SendOutlined />} onClick={()=>{editCompanyTypeForm.submit()}} loading={false} >
                          تعديل
                    </Button>
                    
                </Form>

            </Drawer>
        
            <AdminHeader title={pageTitle}/>
            <Layout>
            
            <GlobalSider currentPage={'activities'} currentSub={'sub1'} />
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
      
                        <Button onClick={()=> setAddCompanyTypeVisible(true) } style={{backgroundColor:Colors.primary, borderWidth:0}} type="primary" shape="round" icon={<PlusOutlined />} size={20}>
                            اضافة  نشاط شركة
                        </Button>
                    }
                   
                   </Col>

                    <Col md={24} style={{marginTop:24}}>

                    <Table 
                        dataSource={cities}
                        pagination={{ position: ['bottomCenter'],total:totalCount}}
                        onChange={handleTableChange}
                        loading={addLoading}
                        scroll={{ x: '100%'}}
                    >

                    

                        <Column title="اسم نشاط الشركة"  width="300px" key="name" fixed="left" dataIndex="name" />

                        

                        
                        {
          
                            <Column title="العمليات"  width="250px" key="status" 
                                fixed='right'
                                render={(text, record) => (
                                    <Space>
                                    <Button onClick={()=> prepareEdit({id:record?.id,...record}) } style={{backgroundColor:Colors.primary, borderWidth:0,marginLeft:20}} type="primary" shape="round" icon={<EditOutlined />} size={20}>
                                        تعديل
                                    </Button>

                                    <Button onClick={()=> showDeleteConfirm(record?.name, record?.id) } style={{backgroundColor:Colors.red, borderWidth:0}} type="primary" shape="round" icon={<DeleteOutlined />} size={20}>
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

export default MngActivities




