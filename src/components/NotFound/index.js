import React from 'react'
import './index.scss'
import { useNavigate } from 'react-router-dom'
import Result from 'antd/lib/result';
import Button from 'antd/lib/button';

export default function NotFound() {
    const navigate = useNavigate()

    function onGoBack(){
        navigate(-1)
    }

  return (
    <main className='not-found'>
        <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={<Button type="primary" onClick={onGoBack}>Go Back</Button>}
        />
    </main>
  )
}
