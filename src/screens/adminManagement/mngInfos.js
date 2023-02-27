
import React, { Fragment, useEffect,useState } from 'react';
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

const pageTitle = 'ادارة الشركات';

const  MngInfos = ()=> {
    const navigate = useNavigate();
    const [addInfoForm] = Form.useForm()
    const [editInfoForm] = Form.useForm()

    const [addInfoVisible, setAddInfoVisible] = useState(false);
    const [editInfoVisible, setEditInfoVisible] = useState(false);
    
    const [addLoading, setAddLoading] = useState(false);
    const [selectedInfo, setSelectedInfo] = useState(null)
    const [infoFormInfo, setInfoFormInfo] = useState(null)
    const [infos, setInfos] = useState([]);
    const [totalCount, setTotalCount] = useState(null);
    const [cities, setcities] = useState([])
    const [activities, setactivities] = useState([])
    const [types, settypes] = useState([])


    const handleTableChange = (pagination, filters, sorter) => {
        const{current,pageSize} = pagination 
        getInfos(current,pageSize)
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

   
   

      const getInfos = (current=1,pageSize=25)=>{
        setAddLoading(true)
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
          };
          
          fetch(`https://haitham-chamber-of-commerce.herokuapp.com/api/infos?populate=*&sort[0]=id:desc`, requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log('info data', result?.data)
                setAddLoading(false);
                setInfos(result?.data);
                setTotalCount(result?.meta?.pagination?.total)
            })
            .catch(error => console.log('error', error));
      }


      const getCities = ()=>{

        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
          };
          
          fetch(`https://haitham-chamber-of-commerce.herokuapp.com/api/cities`, requestOptions)
            .then(response => response.json())
            .then(result => {
                setcities(result?.data);
            })
            .catch(error => console.log('error', error));
      }

      const getActivities = ()=>{

        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
          };
          
          fetch(`https://haitham-chamber-of-commerce.herokuapp.com/api/activities`, requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log('activities', result?.data)
                setactivities(result?.data);
            })
            .catch(error => console.log('error', error));
      }

      const getTypes = ()=>{

        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
          };
          
          fetch(`https://haitham-chamber-of-commerce.herokuapp.com/api/company-types`, requestOptions)
            .then(response => response.json())
            .then(result => {
                settypes(result?.data);
            })
            .catch(error => console.log('error', error));
      }


      const addInfo = (data)=>{
       

        setAddLoading(true)
        
        let newContributer = [];
        
        data?.contributer.map(element => {
            newContributer.push( {__component: 'contributer-name.contributer-name',name:element})
        });

        data.contributer = newContributer;
       
        console.log('data isss', data)
        addDataWithToken(`infos`,data,
        (err,result)=>{
          setAddLoading(false);
          const {error} = result
          if(err){
            message?.error('خطأ في الشبكة')
          }else{
           if(!error){
            message?.success('تم اضافة الشركة بنجاح');
            getInfos();
            addInfoForm?.resetFields();
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
                deleteDataWithToken(`infos/${id}`,(err, result)=>{

                    const {error} = result
                    if(err){
                        message?.error('خطأ في الشبكة')
                    }else{
                        if(!error){
                            message?.success('تم حذف الشركة بنجاح');
                            getInfos();
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
            editDataWithToken(`infos/${selectedInfo?.id}`,data,(err, result)=>{
                const {error} = result
                if(err){
                    message?.error('خطأ في الشبكة')
                }else{
                    if(!error){
                        message?.success('تم تعديل الشركة بنجاح');
                        getInfos();
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
       getInfos();
       getCities();
       getActivities();
       getTypes();

      }, [])
      
    
    
    return(
        <Layout className='mainContainer'>

            <Drawer
                    title="اضافة شركة"
                    placement="left"
                    closable={false}
                    onClose={onAddClose}
                    visible={addInfoVisible}
                    width={'80vw'}
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
                        label= 'اسم الشركة'
                        rules={[
                            {
                              required: true,
                              message: `يرجى ادخال اسم الشركة`,
                            }
                          ]}
                        >
                             <Input size="large" placeholder='اسم الشركة' style={{minWidth:300}}  />
                    </Form.Item>

                    <Form.Item    
                        className='myFormItem'
                        name="activities" 
                        rules={[{ required: true, message: 'يرجى اختيار النشاط ' }]}
                        label="النشاط"
                        
                    >
                        <Select mode='multiple'  size="large"  placeholder="النشاط" style={{minWidth:300}}>
                            {
                                activities?.map(({name,id},index) => {
                                    return(<Option value={id} key={id} >{name}</Option>)
                                })
                            }
                        </Select>
                    </Form.Item>

                    <Form.Item    
                        className='myFormItem'
                        name="company_type" 
                        rules={[{ required: true, message: 'يرجى اختيار نوع الشركة ' }]}
                        label="نوع الشركة"
                    >
                        <Select  size="large"  placeholder="نوع الشركة" style={{minWidth:300}}>
                            {
                                types?.map(({name,id},index) => {
                                    return(<Option value={id} key={id} >{name}</Option>)
                                })
                            }
                        </Select>
                    </Form.Item>


                    <Form.Item    
                        className='myFormItem'
                        name="contributer" 
                        rules={[{ required: true, message: 'يرجى كتابة مساهم  ' }]}
                        label="المساهمين"
                    >
                        <Select mode='tags' tokenSeparators={[',']}  size="large"  placeholder="المساهمين" style={{minWidth:300}}>
                            
                        </Select>
                    </Form.Item>

                    

                    <Form.Item  
                        className='myFormItem' 
                        name="bookNumber" 
                        label= 'رقم كتاب الاتحاد'
                        rules={[
                            {
                              required: true,
                              message: `يرجى كتابة رقم كتاب الاتحاد `,
                            },
                            
                          ]}
                        >
                             <Input  size="large" placeholder='رقم كتاب الاتحاد' style={{minWidth:300}}  />
                    </Form.Item>

                    <Form.Item
                        className='myFormItem' 
                        label={'تاريخ كتاب الاتحاد'}
                        name={'bookDate'}
                        rules={[{ required: true, message: 'يرجى اختيار تاريخ كتاب الاتحاد' }]}
                    >
                        <DatePicker  size="large"  style={{minWidth: 300}}   />
                    </Form.Item>


                    <Form.Item  
                        className='myFormItem' 
                        name="roomBook" 
                        label= 'رقم كتاب الغرفة'
                        rules={[
                            {
                              required: true,
                              message: `يرجى كتابة رقم كتاب الغرفة `,
                            },
                            
                          ]}
                        >
                             <Input  size="large" placeholder='رقم كتاب الغرفة' style={{minWidth:300}}  />
                    </Form.Item>


                    <Form.Item
                        className='myFormItem' 
                        label={'تاريخ كتاب الغرفة'}
                        name={'roomDate'}
                        rules={[{ required: true, message: 'يرجى اختيار تاريخ كتاب الغرفة' }]}
                    >
                        <DatePicker  size="large"  style={{minWidth: 300}}   />
                    </Form.Item>

                    

                    <Form.Item    
                        className='myFormItem'
                        name="city" 
                        rules={[{ required: true, message: 'يرجى اختيار المحافظة ' }]}
                        label="المحافظة"
                    >
                        <Select size="large"  placeholder="المحافظة" style={{minWidth:300}}>
                            {
                                cities?.map(({id,name},index) => {
                                    return(<Option value={id} key={id} >{name}</Option>)
                                })
                            }
                        </Select>
                    </Form.Item>
                    
                    <Col md={24}/>

                    <Form.Item
                        valuePropName="checked" 
                        className="myFormItem"
                        label="مؤسسة ؟"
                        name={'isOrganization'}
                        rules={[
                            {
                            required: false,
                            message: 'يرجى اختيار الحالة ',
                            },
                            
                        ]}
                    >
                        <Switch  checkedChildren="نعم" unCheckedChildren="كلا"    />
                    </Form.Item>
                    {
                        addInfoForm?.getFieldValue('isOrganization')&&
                        <Fragment>
                        <Space>
                            <Form.Item  
                                className='myFormItem' 
                                name="creationBookNumber" 
                                label= 'رقم كتاب التأسيس'
                                rules={[
                                    {
                                    required: true,
                                    message: `يرجى كتابة رقم كتاب التأسيس `,
                                    },
                                    
                                ]}
                                >
                                    <Input  size="large" placeholder='رقم كتاب التأسيس' style={{minWidth:300}}  />
                            </Form.Item>


                            <Form.Item
                                className='myFormItem' 
                                label={'تاريخ كتاب التأسيس'}
                                name={'creationBookDate'}
                                rules={[{ required: true, message: 'يرجى اختيار تاريخ كتاب التأسيس' }]}
                            >
                                <DatePicker  size="large"  style={{minWidth: 300}}   />
                            </Form.Item>


                           
                            
                        </Space>
                        <Col span={24}/>
                        </Fragment>
                    }

                        
                            <Form.Item
                                valuePropName="checked" 
                                className="myFormItem"
                                label="محمية ؟"
                                name={'isSecure'}
                                rules={[
                                    {
                                    required: false,
                                    message: 'يرجى اختيار الحالة ',
                                    },
                                    
                                ]}
                            >
                                <Switch  checkedChildren="نعم" unCheckedChildren="كلا"    />
                            </Form.Item>

                            {
                                addInfoForm?.getFieldValue('isSecure')&&
                                <Fragment>
                                <Space>
                                    <Form.Item  
                                        className='myFormItem' 
                                        name="secureBookNumber" 
                                        label= 'رقم كتاب الحماية'
                                        rules={[
                                            {
                                            required: true,
                                            message: `يرجى كتابة رقم كتاب الحماية `,
                                            },
                                            
                                        ]}
                                        >
                                            <Input  size="large" placeholder='رقم كتاب الحماية' style={{minWidth:300}}  />
                                    </Form.Item>


                                    <Form.Item
                                        className='myFormItem' 
                                        label={'تاريخ كتاب الحماية'}
                                        name={'secureBookDate'}
                                        rules={[{ required: true, message: 'يرجى اختيار تاريخ كتاب الحماية' }]}
                                    >
                                        <DatePicker  size="large"  style={{minWidth: 300}}   />
                                    </Form.Item>


                                
                                    
                                </Space>
                                <Col span={24}/>
                                </Fragment>
                            }



                    
                           
                            <Form.Item
                                valuePropName="checked" 
                                className="myFormItem"
                                label="مشطوبة ؟"
                                name={'isCancelled'}
                                rules={[
                                    {
                                    required: false,
                                    message: 'يرجى اختيار الحالة ',
                                    },
                                    
                                ]}
                            >
                                <Switch  checkedChildren="نعم" unCheckedChildren="كلا"    />
                            </Form.Item>

                            {
                                addInfoForm?.getFieldValue('isCancelled')&&
                                <Fragment>
                                <Space>
                                    <Form.Item  
                                        className='myFormItem' 
                                        name="cancelBookNumber" 
                                        label= 'رقم كتاب الشطب'
                                        rules={[
                                            {
                                            required: true,
                                            message: `يرجى كتابة رقم كتاب الشطب `,
                                            },
                                            
                                        ]}
                                        >
                                            <Input  size="large" placeholder='رقم كتاب الشطب' style={{minWidth:300}}  />
                                    </Form.Item>


                                    <Form.Item
                                        className='myFormItem' 
                                        label={'تاريخ كتاب الحماية'}
                                        name={'cancelBookDate'}
                                        rules={[{ required: true, message: 'يرجى اختيار تاريخ كتاب الشطب' }]}
                                    >
                                        <DatePicker  size="large"  style={{minWidth: 300}}   />
                                    </Form.Item>


                                
                                    
                                </Space>
                                <Col span={24}/>
                                </Fragment>
                            }

                            

                            <Form.Item    
                                className='myFormItem'
                                name="registerationType" 
                                rules={[{ required: true, message: 'يرجى اختيار نوع التقديم ' }]}
                                label="نوع التقديم"
                                
                            >
                                <Select   size="large"  placeholder="نوع التقديم" style={{minWidth:300}}>
                                    {
                                        [{name:'papeer',title:'ورقي'},{name:'web',title:'الكتروني'}]?.map(({name,title},index) => {
                                            return(<Option value={name} key={name} >{title}</Option>)
                                        })
                                    }
                                </Select>
                            </Form.Item>

                    
                    <Col md={24} style={{marginBottom:20}}  />
                    
                    
                    <Button  style={{backgroundColor:Colors.primary, borderWidth:0, marginRight:12}}  type="primary"  icon={<SendOutlined />} onClick={()=>{addInfoForm.submit()}} loading={false} >
                          اضافة شركة
                    </Button>
                    
                </Form>

            </Drawer>

            <Drawer
                    title="تعديل شركة"
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
                        name="type" 
                        rules={[{ required: true, message: 'يرجى اختيار النوع ' }]}
                        label="النوع"
                    >
                        <Select size="large"  placeholder="النوع" style={{minWidth:300}}>
                            {
                                userTypes?.map(({value,title},index) => {
                                    return(<Option value={value} key={value} >{title}</Option>)
                                })
                            }
                        </Select>
                    </Form.Item>

                    <Form.Item  
                        className='myFormItem' 
                        name="name" 
                        label= { addInfoForm?.getFieldValue('type') == 'individual' ?"الاسم الرباعي":'اسم المؤسسة'}
                        rules={[
                            {
                              required: true,
                              message: `يرجى كتابة ${ addInfoForm?.getFieldValue('type') == 'individual' ?"الاسم الرباعي":'اسم المؤسسة'}`,
                            }
                          ]}
                        >
                             <Input size="large" placeholder={ addInfoForm?.getFieldValue('type') == 'individual' ?"الاسم الرباعي":'اسم المؤسسة'} style={{minWidth:300}}  />
                    </Form.Item>

                    <Form.Item  
                        className='myFormItem' 
                        name="phone" 
                        label= 'شركة الهاتف'
                        rules={[
                            {
                              required: true,
                              message: `يرجى كتابة شركة الهاتف`,
                            },
                            
                          ]}
                        >
                             <Input  size="large" placeholder='شركة الهاتف' style={{minWidth:300}}  />
                    </Form.Item>

                    {
                        addInfoForm?.getFieldValue('type') == 'individual' &&
                        <Form.Item    
                            className='myFormItem'
                            name="gender" 
                            rules={[{ required: true, message: 'يرجى اختيار الجنس ' }]}
                            label="الجنس"
                        >
                            <Select size="large"  placeholder="الجنس" style={{minWidth:300}}>
                                <Option value={'M'} key={'M'} >ذكر</Option>
                                <Option value={'F'} key={'F'} >انثى</Option>
                            </Select>
                        </Form.Item>

                    }

                    <Form.Item    
                        className='myFormItem'
                        name="city" 
                        rules={[{ required: true, message: 'يرجى اختيار المحافظة ' }]}
                        label="المحافظة"
                    >
                        <Select size="large"  placeholder="المحافظة" style={{minWidth:300}}>
                            {
                                cities?.map(({id,name},index) => {
                                    return(<Option value={id} key={id} >{name}</Option>)
                                })
                            }
                        </Select>
                    </Form.Item>

                    {
                        addInfoForm?.getFieldValue('type') == 'company' &&
                        <Form.Item  
                            className='myFormItem' 
                            name="field" 
                            label= 'مجال العمل'
                            >
                                <Input  size="large" placeholder='مجال العمل' style={{minWidth:300}}  />
                        </Form.Item>

                    
                    }

                    {
                        addInfoForm?.getFieldValue('type') == 'company' &&
                        <Form.Item  
                            className='myFormItem' 
                            name="description" 
                            label= 'وصف عن الشركة'
                            
                            >
                                <Input.TextArea  size="large" placeholder='وصف عن الشركة' style={{minWidth:300}}  />
                        </Form.Item>

                    
                    }
                    

                    
                    <Col md={24} style={{marginBottom:20}}  />
                    
                    
                    <Button  style={{backgroundColor:Colors.primary, borderWidth:0, marginRight:12}}  type="primary"  icon={<SendOutlined />} onClick={()=>{editInfoForm.submit()}} loading={false} >
                          تعديل
                    </Button>
                    
                </Form>

            </Drawer>
        
            <AdminHeader title={pageTitle}/>
            <Layout>
            
            <GlobalSider currentPage={'infos'} currentSub={'sub1'} />
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
                            اضافة  شركة
                        </Button>
                    }
                   
                   </Col>

                    <Col md={24} style={{marginTop:24}}>

                    <Table 
                        dataSource={infos}
                        pagination={{ position: ['bottomCenter'],total:totalCount}}
                        onChange={handleTableChange}
                        loading={addLoading}
                        scroll={{ x: '100%'}}
                    >

                    

                        <Column title="الاسم"  width="300px" key="name" fixed="left" dataIndex="name" />

                        
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

                        <Column title="النوع"  width="200px" key="company_type" 
                            render={(text, record) => (
                                <Space>
                                    {record?.company_type?.name} 
                                </Space>
                                
                            )}
                        /> 

                        <Column title="المساهمين"  width="200px" key="contributer" 
                            render={(text, record) => (
                                <Space>
                                   {
                                    record?.contributer?.map(element => {
                                        return(<Tag >{element?.name}</Tag>)
                                    })
                                   }
                                </Space>
                                
                            )}
                        /> 

                        <Column title="رقم كتاب الاتحاد"  width="300px" key="bookNumber"  dataIndex="bookNumber" />
                       

                        <Column title="تاريخ كتاب الاتحاد"  width="200px" key="bookDate" 
                            render={(text, record) => (
                                <Space>
                                    { moment(record?.bookDate)?.format(dateFormat) } 
                                </Space>
                                
                            )}
                        /> 

                        <Column title="رقم كتاب الغرفة"  width="300px" key="roomBook"  dataIndex="roomBook" />
                       

                        <Column title="تاريخ كتاب الغرفة"  width="200px" key="roomDate" 
                            render={(text, record) => (
                                <Space>
                                    { moment(record?.roomDate)?.format(dateFormat) } 
                                </Space>
                                
                            )}
                        />

                        <Column title="مؤسسة ؟"  width="200px" key="isOrganization" 
                            render={(text, record) => (
                                <Space>
                                    {record?.isOrganization? <Tag color={'green'}>مؤسسة</Tag> : <Tag color={'red'} >غير مؤسسة</Tag> }
                                </Space>
                                
                            )}
                        /> 

                        <Column title="رقم كتاب التأسيس"  width="300px" key="creationBookNumber"  dataIndex="creationBookNumber" />
                       

                        <Column title="تاريخ كتاب التأسيس"  width="200px" key="creationBookDate" 
                            render={(text, record) => (
                                <Space>
                                    { moment(record?.creationBookDate)?.format(dateFormat) } 
                                </Space>
                                
                            )}
                        />


                        <Column title="محمية ؟"  width="200px" key="isSecure" 
                            render={(text, record) => (
                                <Space>
                                    {record?.isSecure? <Tag color={'green'}>محمية</Tag> : <Tag color={'red'} >غير محمية</Tag> }
                                </Space>
                                
                            )}
                        /> 

                        <Column title="رقم كتاب الحماية"  width="300px" key="secureBookNumber"  dataIndex="secureBookNumber" />
                       

                        <Column title="تاريخ كتاب الحماية"  width="200px" key="secureBookDate" 
                            render={(text, record) => (
                                <Space>
                                    { moment(record?.secureBookDate)?.format(dateFormat) } 
                                </Space>
                                
                            )}
                        />

                        <Column title="مشطوبة ؟"  width="200px" key="isCancelled" 
                            render={(text, record) => (
                                <Space>
                                    {record?.isCancelled? <Tag color={'green'}>مشطوبة</Tag> : <Tag color={'red'} >غير مشطوبة</Tag> }
                                </Space>
                                
                            )}
                        /> 

                        <Column title="رقم كتاب الشطب"  width="300px" key="cancelBookNumber"  dataIndex="cancelBookNumber" />
                       

                        <Column title="تاريخ كتاب الشطب"  width="200px" key="cancelBookDate" 
                            render={(text, record) => (
                                <Space>
                                    { moment(record?.cancelBookDate)?.format(dateFormat) } 
                                </Space>
                                
                            )}
                        />






                       
                        
                        {
          
                            <Column title="العمليات"  width="250px" key="status" 
                                fixed='right'
                                render={(text, record) => (
                                    <Space>
                                    {/* <Button onClick={()=> prepareEdit({id:record?.id,...record}) } style={{backgroundColor:Colors.primary, borderWidth:0,marginLeft:20}} type="primary" shape="round" icon={<EditOutlined />} size={20}>
                                        تعديل
                                    </Button> */}

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

export default MngInfos




