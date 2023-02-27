
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

const pageTitle = 'ادارة المحافظات';

const  MngCities = ()=> {
    const navigate = useNavigate();
    const [addCityForm] = Form.useForm()
    const [editCityForm] = Form.useForm()

    const [addCityVisible, setAddCityVisible] = useState(false);
    const [editCityVisible, setEditCityVisible] = useState(false);
    
    const [addLoading, setAddLoading] = useState(false);
    const [selectedCity, setSelectedCity] = useState(null)
    const [infoFormCity, setCityFormCity] = useState(null)
    const [cities, setCities] = useState([]);
    const [totalCount, setTotalCount] = useState(null);
    const [certificates, setcertificates] = useState([])
    const [scintificTitles, setscintificTitles] = useState([])
   

    const localUserType = getLocal(appIdentifier)?.user?.user_type || null 

    const handleTableChange = (pagination, filters, sorter) => {
        const{current,pageSize} = pagination 
        getCities(current,pageSize)
      };


      const onAddClose = () => {
        setAddCityVisible(false);
        setSelectedCity(null)
        addCityForm.resetFields()
        
      };

      const onEditClose = () => {
        setEditCityVisible(false);
        setSelectedCity(null)
        editCityForm.resetFields()
        
      };

   
   

      const getCities = (current=1,pageSize=25)=>{
        setAddLoading(true)
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
          };
          
          fetch(`https://haitham-chamber-of-commerce.herokuapp.com/api/cities?sort[0]=id:desc`, requestOptions)
            .then(response => response.json())
            .then(result => {
                setAddLoading(false);
                setCities(result?.data);
                setTotalCount(result?.meta?.pagination?.total)
            })
            .catch(error => console.log('error', error));
      }





      const addCity = (data)=>{
        setAddLoading(true)
        console.log('data isss', data)
        addDataWithToken(`cities`,data,
        (err,result)=>{
          setAddLoading(false);
          const {error} = result
          if(err){
            message?.error('خطأ في الشبكة')
          }else{
           if(!error){
            message?.success('تم اضافة المدينة بنجاح');
            getCities();
            addCityForm?.resetFields();
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
                deleteDataWithToken(`cities/${id}`,(err, result)=>{

                    const {error} = result
                    if(err){
                        message?.error('خطأ في الشبكة')
                    }else{
                        if(!error){
                            message?.success('تم حذف المدينة بنجاح');
                            getCities();
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
            setSelectedCity(data)
            editCityForm.setFieldsValue(data)
            setEditCityVisible(true)
            editCityForm.setFieldsValue({city:data?.city?.id})
        }

        const editCity = (data)=>{
         
            setAddLoading(true);
            editDataWithToken(`cities/${selectedCity?.id}`,data,(err, result)=>{
                const {error} = result
                if(err){
                    message?.error('خطأ في الشبكة')
                }else{
                    if(!error){
                        message?.success('تم تعديل المدينة بنجاح');
                        getCities();
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
       getCities();
    
      }, [])
      
    
    
    return(
        <Layout className='mainContainer'>

            <Drawer
                    title="اضافة مدينة"
                    placement="left"
                    closable={false}
                    onClose={onAddClose}
                    visible={addCityVisible}
                    width={450}
                >
                <Form 
                    form={addCityForm} 
                    onFinish={addCity}
                    onValuesChange={(changedValues,allValues)=>{
                        setCityFormCity(allValues);
                    }}
                    layout='inline'
                >

                    

                    <Form.Item  
                        className='myFormItem' 
                        name="name" 
                        label= 'اسم المدينة'
                        rules={[
                            {
                              required: true,
                              message: `يرجى كتابة اسم المدينة`,
                            }
                          ]}
                        >
                             <Input size="large" placeholder={'اسم المدينة'} style={{minWidth:300}}  />
                    </Form.Item>

                    

                    
                    <Col md={24} style={{marginBottom:20}}  />
                    
                    
                    <Button  style={{backgroundColor:Colors.primary, borderWidth:0, marginRight:12}}  type="primary"  icon={<SendOutlined />} onClick={()=>{addCityForm.submit()}} loading={false} >
                          اضافة مدينة
                    </Button>
                    
                </Form>

            </Drawer>

            <Drawer
                    title="تعديل مدينة"
                    placement="left"
                    closable={false}
                    onClose={onEditClose}
                    visible={editCityVisible}
                    width={450}
                >
                <Form 
                    form={editCityForm} 
                    onFinish={editCity}
                    onValuesChange={(changedValues,allValues)=>{
                        setCityFormCity(allValues);
                    }}
                    layout='inline'
                >

                    <Form.Item  
                        className='myFormItem' 
                        name="name" 
                        label= 'اسم المدينة'
                        rules={[
                            {
                              required: true,
                              message: `يرجى كتابة اسم المدينة`,
                            }
                          ]}
                        >
                             <Input size="large" placeholder={'اسم المدينة'} style={{minWidth:300}}  />
                    </Form.Item>


                    
                    

                    
                    <Col md={24} style={{marginBottom:20}}  />
                    
                    
                    <Button  style={{backgroundColor:Colors.primary, borderWidth:0, marginRight:12}}  type="primary"  icon={<SendOutlined />} onClick={()=>{editCityForm.submit()}} loading={false} >
                          تعديل
                    </Button>
                    
                </Form>

            </Drawer>
        
            <AdminHeader title={pageTitle}/>
            <Layout>
            
            <GlobalSider currentPage={'cities'} currentSub={'sub1'} />
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
      
                        <Button onClick={()=> setAddCityVisible(true) } style={{backgroundColor:Colors.primary, borderWidth:0}} type="primary" shape="round" icon={<PlusOutlined />} size={20}>
                            اضافة  مدينة
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

                    

                        <Column title="الاسم"  width="300px" key="name" fixed="left" dataIndex="name" />

                        

                        
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

export default MngCities




