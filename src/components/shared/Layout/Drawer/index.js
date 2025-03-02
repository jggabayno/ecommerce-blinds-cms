import { Drawer as AntdDrawer } from 'antd'
import { CgArrowRight } from "react-icons/cg"
import './index.scss'

export default function Drawer(){
  return (
    <AntdDrawer
    placement='top'
    // closable={false}
    closeIcon={<CgArrowRight/>}
    // onClose={this.onClose}
    visible={true}
    key='drawer'
    className='drawer'
  >
    <p>Some contents...</p>
    <p>Some contents...</p>
    <p>Some contents...</p>
  </AntdDrawer>
  )
}