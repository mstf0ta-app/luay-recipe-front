import { Col, Layout, Row } from 'antd'
import Colors from '../assets/themes/colors'

function GlobalFooter() {
  return (
    <Col md={24} xs={24}>
              <Row style={{backgroundColor:Colors.clear,height:80}} >
                <h1 style={{textAlign:'center',width:'100%',height:'100%',paddingTop:30,color:Colors.primary}}> برمجة و تطوير - مركز الحاسبة الالكترونية  </h1>
            
                {/* <img src={footerImage} alt="footerImage" style={{width:'100vw',opacity:0.1}} /> */}
              </Row>
    </Col>
  )
}

export default GlobalFooter