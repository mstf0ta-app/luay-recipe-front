import { Layout, Menu,} from 'antd';
import React from 'react'
import { useNavigate } from 'react-router-dom';
import { HomeFilled,BankOutlined} from '@ant-design/icons';
import Colors from '../assets/themes/colors';
import { appIdentifier, getLocal } from '../globalFunctions/api';
import { GiModernCity } from "react-icons/gi";
import { MdPointOfSale,MdLocationCity } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { CgList } from "react-icons/cg";
import { GiRotaryPhone} from "react-icons/gi";
import { RiAdminLine} from "react-icons/ri";

const {  Sider } = Layout;
const { SubMenu } = Menu;


function GlobalSider(props) {
    const {currentPage, currentSub} = props
    const navigate = useNavigate();

    const localUserType = getLocal(appIdentifier)?.user?.user_type || null 


  return (
    <Sider
    theme='light'
    breakpoint="lg"
    width={240}
    style={{marginTop:75}}
    collapsedWidth="0"
    onBreakpoint={broken => {
        console.log(broken);
    }}
    onCollapse={(collapsed, type) => {
        console.log(collapsed, type);
    }}
    
    
>


    <Menu mode="inline" 
       
        defaultSelectedKeys={[currentPage]}  
        defaultOpenKeys={[currentSub]}
        onSelect={({item, key, keyPath, selectedKeys, domEvent} )=>{console.log('key is',key)}} >

        <Menu.Item key="mnghome"  style={{marginTop:0,}} onClick={()=> navigate('/mnghome')} icon={<HomeFilled />} >
        الرئيسية
        </Menu.Item>

        <Menu.Item key="clients"  style={{marginTop:0,}} onClick={()=> navigate('/clients')} icon={<FaUsers style={{fontSize:18}} />} >
            ادارة الزبائن 
        </Menu.Item>

        <Menu.Item key="sales"  style={{marginTop:0,}} onClick={()=> navigate('/sales')} icon={<MdPointOfSale style={{fontSize:18}} />} >
            ادارة المبيعات 
        </Menu.Item>

        
        <Menu.Item key="admins"  style={{marginTop:0,}} onClick={()=> navigate('/admins')} icon={<RiAdminLine style={{fontSize:18}} />} >
            ادارة المدراء
        </Menu.Item>

        

    
    </Menu>


</Sider>
  )
}

export default GlobalSider