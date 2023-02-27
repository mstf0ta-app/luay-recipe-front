
import React, { Fragment, useEffect,useState } from 'react';
import { Layout, Breadcrumb,Row, Col, Button, Table, Tag, Drawer, Form, Select, Input, Space, message, Modal, Switch, DatePicker, Divider, AutoComplete, Spin,Card,Statistic } from 'antd';
import { EditOutlined, SendOutlined, DeleteOutlined,PlusOutlined,ExclamationCircleOutlined } from '@ant-design/icons';
import './style.scss'
import { useNavigate, useParams } from "react-router-dom";
import Colors from '../../assets/themes/colors';
import GlobalSider from '../../components/GlobalSider';
import { addDataWithToken, addDataWithTokenAdmin, appIdentifier, dateFormat, deleteDataWithToken, editDataWithToken, getDataWithToken, getLocal, globalUrl, userTypes } from '../../globalFunctions/api';
import GlobalHeader from '../../components/GlobalHeader';
import moment from 'moment';
import AdminHeader from '../../components/AdminHeader';
import {BsCart4} from 'react-icons/bs'
import { MdPayments } from 'react-icons/md';
import { GiTakeMyMoney } from 'react-icons/gi';
import { FaRegMoneyBillAlt } from 'react-icons/fa';
const {Content} = Layout;
const { Column, ColumnGroup } = Table;
const { Option } = Select;
const {confirm} = Modal

const pageTitle = 'ادارة المبيعات';

const  MngSales = ()=> {
    const navigate = useNavigate();
    const params = useParams();
    console.log('param isss', params)
    const [addInfoForm] = Form.useForm()
    const [editInfoForm] = Form.useForm()

    const [addPaymentForm] = Form.useForm()
    


    const [addInfoVisible, setAddInfoVisible] = useState(false);
    const [editInfoVisible, setEditInfoVisible] = useState(false);
    const [paymentsModalVisible, setpaymentsModalVisible] = useState(false);
    
    const [addLoading, setAddLoading] = useState(false);
    const [singleAddLoading, setsingleAddLoading] = useState(false);
    const [selectedInfo, setSelectedInfo] = useState(null)
    const [infoFormInfo, setInfoFormInfo] = useState(null)
    const [sales, setSales] = useState([]);
    const [singleSale, setsingleSale] = useState([]);
    const [totalCount, setTotalCount] = useState(null);
    const [clients, setClients] = useState([]);

    const localUserType = getLocal(appIdentifier)?.user?.user_type || null 

    const handleTableChange = (pagination, filters, sorter) => {
        const{current,pageSize} = pagination 
        getSales(current,pageSize)
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

   
   

      const getSales = (current=1,pageSize=25)=>{
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
          
          let url = params?.id ? `${globalUrl}sales?populate=*&filters[client][id][$eq]=${params?.id}` : `${globalUrl}sales?populate=*`

          fetch(url, requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log('result',result)
                setAddLoading(false);
                setSales(result?.data);
                setTotalCount(result?.meta?.pagination?.total)
                
            })
            .then(()=>console.log(sales))
            .catch(error => console.log('error', error));
      }


      const getSingleSale = (saleId)=>{
        console.log('id -s +++' ,saleId )
        setsingleAddLoading(true)
        const token = getLocal(appIdentifier)?.jwt ; 
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}` );
        myHeaders.append("Content-Type", "application/json");

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
          };
          
          let url = `${globalUrl}sales/${saleId}?populate=*` 

          fetch(url, requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log('single sale',result)
                setsingleAddLoading(false);
                setsingleSale(result?.data);
            })
            .then(()=>console.log(sales))
            .catch(error => console.log('error', error));
      }


      const findClient = (name='',current=1,pageSize=10000)=>{
        
       
        if(name){
            const token = getLocal(appIdentifier)?.jwt ; 
            var myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${token}` );
            myHeaders.append("Content-Type", "application/json");
    
            var requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
              };
              
              fetch(`${globalUrl}clients?populate=*&filters[name][$contains]=${name}`, requestOptions)
                .then(response => response.json())
                .then(result => {
                    console.log('result',result)
                    setAddLoading(false);
                    let baseArr = []
                    result?.data?.map(element => {
                        baseArr.push({label:element?.name,value:element?.id})
                    });
                    setClients(baseArr); 
                    
                })
                .catch(error => console.log('error', error));
        }else{
            setClients([])
        }
        
      }






      const addInfo = (data)=>{
        setAddLoading(true)
       
        console.log('data isss', data)
        
        addDataWithToken(`sales`,data,
        (err,result)=>{
          setAddLoading(false);
          const {error} = result
          if(err){
            message?.error('خطأ في الشبكة')
          }else{
           if(!error){
            message?.success('تم اضافة البيع بنجاح');
            getSales();
            addInfoForm?.resetFields();
            onAddClose()
           }else{
            console.log(error)
             message?.error(error?.message)
           }
           
          }
        }) 
      }


      const addSinglePayment = (data)=>{
        setsingleAddLoading(true)
        let newData = {...data,sale:singleSale?.id}
        console.log('data isss', data)
        
        addDataWithToken(`payments`,newData,

        (err,result)=>{
            setsingleAddLoading(false);
          const {error} = result
          if(err){
            message?.error('خطأ في الشبكة')
          }else{
           if(!error){
            message?.success('تم اضافة البيع بنجاح');
            getSingleSale(singleSale?.id);
            addPaymentForm?.resetFields();

           }else{
            console.log(error)
             message?.error(error?.message)
           }
           
          }
        }) 
      }

      function showDeleteConfirm(A_field_name,id) {
        confirm({
            title: `  هل انت متأكد انك تريد حذف المشتريات  ( ${A_field_name} )  `,
            icon: <ExclamationCircleOutlined style={{color:'red'}} />,
            content: 'ملاحظة : البيانات المحذوفة لا يمكن استعادتها لاحقا',
            okText: 'نعم',
            okType: 'danger',
            cancelText: 'الغاء',
            width:480,
            style:{textAlign:'right'},
            onOk() {
                setAddLoading(true);
                deleteDataWithToken(`sales/${id}`,(err, result)=>{

                    const {error} = result
                    if(err){
                        message?.error('خطأ في الشبكة')
                    }else{
                        if(!error){
                            message?.success('تم حذف البيع بنجاح');
                            getSales();
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
        
        
        function showDeletePaymentConfirm(A_field_name,id) {
            confirm({
                title: `  هل انت متأكد انك تريد حذف القسط ؟  ( ${A_field_name} )  `,
                icon: <ExclamationCircleOutlined style={{color:'red'}} />,
                content: 'ملاحظة : البيانات المحذوفة لا يمكن استعادتها لاحقا',
                okText: 'نعم',
                okType: 'danger',
                cancelText: 'الغاء',
                width:480,
                style:{textAlign:'right'},
                onOk() {
                    setsingleAddLoading(true);
                    deleteDataWithToken(`payments/${id}`,(err, result)=>{
    
                        const {error} = result
                        if(err){
                            message?.error('خطأ في الشبكة')
                        }else{
                            if(!error){
                                message?.success('تم حذف القسط بنجاح');
                                getSingleSale(singleSale?.id);
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


            editInfoForm.setFieldsValue({city:data?.city?.id,client:{label:data?.client?.name, value:data?.client?.id},date:moment(data?.date)})
        }

        const preparePayments = (id)=>{
            getSingleSale(id);
            // editInfoForm.setFieldsValue(data)
            setpaymentsModalVisible(true);
        }

        const onPaymentsClose = () => {
            setpaymentsModalVisible(false);
            setsingleSale([]);
            // setSelectedInfo(null)
            addPaymentForm.resetFields()
            
          };



        const editInfo = (data)=>{
         
            setAddLoading(true);
            editDataWithToken(`sales/${selectedInfo?.id}`,data,(err, result)=>{
                const {error} = result
                if(err){
                    message?.error('خطأ في الشبكة')
                }else{
                    if(!error){
                        message?.success('تم تعديل البيع بنجاح');
                        getSales();
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
       getSales();
     
      }, [])
      

      const onSearch = (searchVal)=>{
        findClient(searchVal)


      }

      const sumOfArray = (array)=>{

        var result = 0 

        array?.map(element => {
            result+=parseFloat(element?.value)
           
        });
        return result

      }



    
    
    return(
        <Layout className='mainContainer'>

            <Drawer
                    title="اضافة بيع"
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
                        name="client" 
                        label= 'اسم الزبون '
                        rules={[
                            {
                              required: true,
                              message: `يرجى اختيار اسم الزبون`,
                            }
                          ]}
                        >

                             <Select 
                                showSearch 
                                allowClear 
                                options={clients} 
                                onSearch={(val)=>onSearch(val)}
                                showArrow={false} 
                                onClear={()=>setClients([])}
                                size="large" 
                                placeholder={'اسم الزبون '} 
                                filterOption={false}
                                style={{minWidth:300}}  /> 
                    </Form.Item>

                    <Form.Item  
                        className='myFormItem' 
                        name="device" 
                        label= 'اسم الجهاز المباع'
                        >
                             <Input.TextArea  size="large" placeholder={'اسم الجهاز المباع'} style={{minWidth:300}}  />
                    </Form.Item>

                    <Form.Item  
                        className='myFormItem' 
                        name="date" 
                        label= 'تاريخ الشراء'
                        
                        >
                             <DatePicker size="large" placeholder={'تاريخ الشراء'} style={{minWidth:300}}  />
                    </Form.Item>
                    <Form.Item  
                        className='myFormItem' 
                        name="total_price" 
                        label= 'السعر الكلي'
                        >
                             <Input type='number' size="large" placeholder={'السعر الكلي'} style={{minWidth:300}}  />
                    </Form.Item>

                    <Form.Item  
                        className='myFormItem' 
                        name="payment_portion_value" 
                        label= 'قيمة القسط الشهري'
                        >
                             <Input type='number' size="large" placeholder={'قيمة القسط الشهري'} style={{minWidth:300}}  />
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
                          اضافة بيع
                    </Button>
                    
                </Form>

            </Drawer>

            <Drawer
                    title="تعديل بيع"
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
                        name="client" 
                        label= 'اسم الزبون '
                        rules={[
                            {
                              required: true,
                              message: `يرجى اختيار اسم الزبون`,
                            }
                          ]}
                        >

                             <Select 
                                showSearch 
                                allowClear 
                                options={clients} 
                                onSearch={(val)=>onSearch(val)}
                                showArrow={false} 
                                onClear={()=>setClients([])}
                                size="large" 
                                placeholder={'اسم الزبون '} 
                                filterOption={false}
                                style={{minWidth:300}}  /> 
                    </Form.Item>

                    <Form.Item  
                        className='myFormItem' 
                        name="device" 
                        label= 'اسم الجهاز المباع'
                        >
                             <Input.TextArea  size="large" placeholder={'اسم الجهاز المباع'} style={{minWidth:300}}  />
                    </Form.Item>

                    <Form.Item  
                        className='myFormItem' 
                        name="date" 
                        label= 'تاريخ الشراء'
                        
                        >
                             <DatePicker size="large" placeholder={'تاريخ الشراء'} style={{minWidth:300}}  />
                    </Form.Item>
                    <Form.Item  
                        className='myFormItem' 
                        name="total_price" 
                        label= 'السعر الكلي'
                        >
                             <Input type='number' size="large" placeholder={'السعر الكلي'} style={{minWidth:300}}  />
                    </Form.Item>

                    <Form.Item  
                        className='myFormItem' 
                        name="payment_portion_value" 
                        label= 'قيمة القسط الشهري'
                        >
                             <Input type='number' size="large" placeholder={'قيمة القسط الشهري'} style={{minWidth:300}}  />
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
            
            <GlobalSider currentPage={'sales'} currentSub={'sub1'} />
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
                
                {
                    params?.id ?
                    <Fragment>
                         <Breadcrumb.Item onClick={()=>navigate('/sales')}  style={{cursor: 'pointer'}} >{pageTitle}</Breadcrumb.Item>
                        <Breadcrumb.Item>مشتريات - {sales?.[0]?.client?.name}</Breadcrumb.Item>
                        
                    </Fragment>
                    :
                    <Fragment>
                       <Breadcrumb.Item>{pageTitle}</Breadcrumb.Item>
                
                    </Fragment>
                }
                
                
                
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
                        !params?.id &&
                        <Button onClick={()=> setAddInfoVisible(true) } style={{backgroundColor:Colors.primary, borderWidth:0}} type="primary" shape="round" icon={<PlusOutlined />} size={20}>
                            اضافة  بيع
                        </Button>
                    }
                   
                   </Col>

                    <Col md={24} style={{marginTop:24}}>

                    <Table 
                        dataSource={sales}
                        pagination={{ position: ['bottomCenter'],total:totalCount}}
                        onChange={handleTableChange}
                        loading={addLoading}
                        scroll={{ x: '100%'}}
                    >

                    

                        <Column title="اسم الزبون"  width="200px" key="name" fixed="left"  
                            render={(record)=><Space>
                            {record?.client?.name}
                        </Space>} />
                        <Column title="تفاصيل الجهاز"  width="200px" key="device" dataIndex="device" />
                        <Column title="السعر الكلي الجهاز"  width="200px" key="total_price" dataIndex="total_price" />
                        <Column title="قيمة القسط"  width="200px" key="payment_portion_value" dataIndex="payment_portion_value" />
                        <Column title="تاريخ الشراء"  width="200px" key="date" dataIndex="date" />
                        <Column title="رقم هاتف الزبون"  width="200px" key="phone" 
                            render={(record)=><Space>
                            {record?.client?.phone}
                        </Space>} />
                        
                       
                        <Column title="الملاحظات"  width="300px" key="comment" dataIndex="comment" />
                        {
          
                            <Column title="العمليات"  width="380px" key="status" 
                                fixed='right'
                                render={(text, record) => (
                                    <Space>
                                    
                                    <Button onClick={()=> preparePayments(record?.id) } style={{backgroundColor:'#34a0a4', borderWidth:0,marginLeft:20}} type="primary"  icon={<FaRegMoneyBillAlt style={{marginLeft:12}} />} size={20}>
                                     المدفوعات
                                    </Button>

                                    <Button onClick={()=> prepareEdit({id:record?.id,...record}) } style={{backgroundColor:Colors.primary, borderWidth:0,marginLeft:20}} type="primary" shape="round" icon={<EditOutlined />} size={20}>
                                        تعديل
                                    </Button>

                                    <Button onClick={()=> showDeleteConfirm(`${record?.client?.name} - ${record?.device}`, record?.id) } style={{backgroundColor:Colors.red, borderWidth:0}} type="primary" shape="round" icon={<DeleteOutlined />} size={20}>
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

            <Modal  width={'80%'} footer={null} title="قائمة الاقساط المدفوعة" visible={paymentsModalVisible}  onCancel={onPaymentsClose}>
                
                <Row gutter={16}>
                    <Col span={8}  >
                        <Card bordered={true}>
                            <Statistic
                            title="المبلغ الكلي"
                            value={singleSale?.total_price}
                            
                           
                            
                            />
                        </Card>
                    </Col>

                    <Col span={8}  >
                        <Card bordered={true}>
                            <Statistic
                            title="المبلغ المسدد"
                            value={sumOfArray(singleSale?.payments)}
                            
                            valueStyle={{
                                color: '#3f8600',
                            }}
                            
                            />
                        </Card>
                    </Col>

                    <Col span={8}  >
                        <Card bordered={true}>
                            <Statistic
                            title="المبلغ المتبقي"
                            value={parseFloat(singleSale?.total_price)-parseFloat(sumOfArray(singleSale?.payments))}
                            
                            valueStyle={{
                                color: 'red',
                            }}
                            
                            />
                        </Card>
                    </Col>

                </Row>
                
                <Col md={24} >

                    <Form 
                        form={addPaymentForm} 
                        onFinish={addSinglePayment}
                        onValuesChange={(changedValues,allValues)=>{
                            setInfoFormInfo(allValues);
                        }}
                        layout='inline'
                        style={{backgroundColor:"#f2f2f2",padding:10, marginBottom:8}}
                    >

                        <Form.Item  
                            className='myFormItem' 
                            name="value" 
                            label= 'مبلغ القسط'
                            rules={[
                                {
                                  required: true,
                                  message: `يرجى كتابة مبلغ القسط`,
                                }
                              ]}
                            >
                                <Input type="number"  size="large" placeholder={'مبلغ القسط'} style={{minWidth:300}}  />
                        </Form.Item>

                        <Form.Item  
                        className='myFormItem' 
                        name="date" 
                        label= 'التاريخ'
                        rules={[
                                {
                                  required: true,
                                  message: `يرجى كتابة التاريخ`,
                                }
                              ]}
                           
                        >
                             <DatePicker size="large" placeholder={'التاريخ'} style={{minWidth:300}}  />
                        </Form.Item>
                        <Form.Item 
                            className='myFormItem' 
                            
                            label= '.'
                        >
                            <Button  style={{backgroundColor:Colors.primary, borderWidth:0, marginRight:12}}  type="primary"  icon={<SendOutlined />} onClick={()=>{addPaymentForm.submit()}} loading={false} >
                            اضافة القسط
                            </Button>
                        </Form.Item>
                        
                        
                    </Form>
                </Col>
                
                <Table 
                        dataSource={singleSale?.payments}
                        pagination={{ position: ['bottomCenter'],total:singleSale?.payments?.length}}
                        // onChange={handleTableChange}
                        loading={singleAddLoading}
                        scroll={{ x: '100%'}}
                >

                    <Column title="المبلغ المدفوع"  width="200px" key="value" dataIndex="value" />
                    <Column title="تاريخ الدفع"  width="200px" key="date" dataIndex="date" />

                    <Column title="العمليات"  width="380px" key="status" 
                                fixed='right'
                                render={(text, record) => (
                                    <Space>
                                    
                                  

                                    <Button onClick={()=> showDeletePaymentConfirm(`${record?.value}`, record?.id) } style={{backgroundColor:Colors.red, borderWidth:0}} type="primary" shape="round" icon={<DeleteOutlined />} size={20}>
                                        حذف
                                    </Button>
                                    </Space>
                                    
                                )}
                            />


                </Table>
            </Modal>
        </Layout>
    )
}

export default MngSales




