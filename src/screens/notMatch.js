import { Button, Result } from 'antd'
import React from 'react'
import { useNavigate } from 'react-router-dom'

function NotMatch() {

    const navigate = useNavigate()
  return (
    <Result
    status="404"
    title="404"
    subTitle="نعتذر - هذه الصفحة غير متوفرة"
    extra={<Button onClick={()=> navigate(-1,) } type="primary">عودة للصفحة السابقة</Button>}
  />
  )
}

export default NotMatch