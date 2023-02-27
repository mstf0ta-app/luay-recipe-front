import { Col,Row } from 'antd'
import React from 'react'
import { MdLocalPolice } from "react-icons/md";
import { FaFireExtinguisher } from "react-icons/fa";
import { TbAmbulance } from "react-icons/tb";
import { GiElectric } from "react-icons/gi";


export default function ServicesGrid() {
  return (
    <Row  align="middle" justify='space-around' style={{paddingLeft:16, paddingRight:16}}  >

        <GridItem title={'شرطة النجدة'} phone='104' icon={<MdLocalPolice style={{color:'#63d9bc',fontSize: 40}}/>} />
        <GridItem title='الدفاع المدني' phone='115' icon={<FaFireExtinguisher style={{color:'#63d9bc',fontSize: 40}}/>} />
        <GridItem title=' الاسعاف' phone='122' icon={<TbAmbulance style={{color:'#63d9bc',fontSize: 40}}/>} />
        <GridItem title='طوارئ الكهرباء' phone='121' icon={<GiElectric style={{color:'#63d9bc',fontSize: 40}}/>} />
      
    </Row>
  )
}





const GridItem = (props)=> {

    const {title,phone,icon} = props || ''
  return (
    <Col span={5}  >
        <div className='gridItemContainer'>
            <div className='gridIconContainer' >
               {icon}
            </div>

            <div className='gridText' >
                    {title}
            </div>

            <div className='gridPhone' >
                   {phone}
            </div>


        </div>
    </Col>
  )
}
