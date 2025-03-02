import React, { useState, useEffect } from "react"; 
import Drawer from 'antd/lib/drawer'
import Table from "antd/lib/table";
import Form from 'antd/lib/form'
import Input from '../shared/Input'
import Button from '../shared/Button'
import Radio from 'antd/lib/radio'
import message from 'antd/lib/message'
import Skeleton from "antd/lib/skeleton";
import './index.scss'

import {fetchInventory, addInventory} from '../../states/inventories/actions'
import { useSelector, useDispatch } from 'react-redux';
import moment from "moment";
import { CSVLink } from "react-csv";
import { CgSoftwareDownload } from "react-icons/cg";

export default function Manage(props) {

  const {isLoading: inventoryLoading, data: inventories} = useSelector(state => state.inventories)
  const {history, stocks } = inventories
  const dispatch = useDispatch()

  useEffect(() => {
    if (props.drawerState.selectedData.id) dispatch(fetchInventory(props.drawerState.selectedData.id))
  },[dispatch,props.drawerState.selectedData.id])

  function typeIdToName(type) {
    if(type === 0) return 'Deduct Manually'
    if(type === 1) return 'Added Manually'
    if(type === 2) return 'Reserved on order submitted'
    if(type === 3) return 'Committed on order for delivery'
  }

  const historyColumn = [
    {
      title: "Stock",
      dataIndex: "quantity",
      render: (quantity) => Number(quantity)?.toLocaleString() 
    },
    {
      title: "Type",
      dataIndex: "type",
      render: (value) => typeIdToName(value)
    },
    {
      title: "Remarks",
      dataIndex: "remarks",
    },
      {
      title: "Date Created",
      dataIndex: "date_created",
      render:(value) => moment(value).format('LLLL')
    }
  ];

  const [form] = Form.useForm();

  const [stock,setStock] = useState(0)

  const changeStock = (e) => setStock(e)
  const[operator,setOperator] = useState('+')

  function changeOperator(e) {
    setOperator(e.target.value)
    form.setFieldsValue({stock: 0})
  }

  useEffect(() => {
    if (operator) {
      form.setFieldsValue({
        remarks: operator === '+' ? `add ${stock || 0}` : `deduct ${stock || 0}`,      
      })
    }
  }, [operator,stock])

  function currentQty() {
    let qty = stocks

    if (operator === '+') {
    qty = (qty + Number(stock))
    }

    if (operator === '-') {
    qty = (qty - Number(stock))
    }

    return qty?.toLocaleString()
  }
 
  const  hasEmptyStock = !Number(stock)

   async function onSubmit(values) {    
      const params = {...values, color_id: props.drawerState.selectedData.id, type: operator === '+' ? 1 : 0 }
      dispatch(addInventory(params, {form, message, setStock}))
    }
  
  const title = `${props.drawerState.selectedData?.product?.name} - ${props.drawerState?.selectedData?.name}`


  function csv(){
    const hasData = inventories.history?.length
    const header = ['Product: ', title]
   
    const body = hasData ?
    inventories.history.map(({quantity, type, remarks, date_created}) => 
    Object.values({quantity: Number(quantity).toLocaleString(), type: typeIdToName(type), remarks, date_created: moment(date_created).format('LLLL') }))
    : [[ '','No Data Available', '' ]]

    return {
      filename: `${title}-inventory-history-${moment().format('LL')}.csv`,
      data: [header,['', '', '', ''],['Stock', 'Type', 'Remarks', 'Date Created'], ...body]
    }
  }

  return (
   <Drawer
      title={`${title}`}
      onClose={() => {
        setStock(0)
        form.resetFields()
        props.setDrawerState({isVisible: false, selectedData: {}})
      }}
      visible={props.drawerState.isVisible}
      bodyStyle={{ paddingBottom: 80 }}
      width={700}
      closeIcon={false}
      forceRender={true}
      getContainer={false}
   >
     {inventoryLoading ?<><Skeleton/><Skeleton/><Skeleton/><Skeleton/></> :
    <Form 
        form={form}
        id='stock'
        onFinish={onSubmit}
        autoComplete="off"
        layout='vertical'
        requiredMark={false}        
    >
        <Form.Item>
        - Select whether you want to deduct or add your current inventory.
        </Form.Item>

        <Form.Item label="Available Stocks">
        {currentQty()}
        </Form.Item>

        <Form.Item>
          <Radio.Group buttonStyle="solid" value={operator} onChange={changeOperator}>
            <Radio.Button value="-">- Deduct to Inventory</Radio.Button>
            <Radio.Button value="+">+ Add to Inventory</Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="Stock" colon={false}  name="quantity">
          <Input
            type="number"
            onChange={changeStock}
            min={1}
           />
        </Form.Item>

        <Form.Item
          name="remarks"
          label="Remarks"
          initialValue='add'
          rules={[{ required: true, message: 'Remarks is Required' }]}
        >
          <Input
            type='textarea'
            className="indicate"
            placeholder="Indicate PO  Number/ Adjustment/ Returns etc."
            autosize={{ minRows: 3, maxRows: 5 }}
          />
        </Form.Item> 

        <Form.Item>
          <div className="title-export">
          <h2>Inventory History</h2>
          <Button size='sm'>
          <CSVLink {...csv()}><CgSoftwareDownload/>Export</CSVLink>
         </Button>
          </div>
            
            <Table
            pagination={{ pageSize: 5 }}
            columns={historyColumn}
            dataSource={history}
            rowKey="id"
            size="small"
            />
        </Form.Item>

        <Form.Item className="inventory-drawer-actions">
          <Button htmlType='submit' type="primary" loading={inventoryLoading} disabled={hasEmptyStock}>Save Changes</Button>
          <Button onClick={() => props.setDrawerState({isVisible: false, selectedData: {}})}  type='ghost'> Cancel </Button>
        </Form.Item>
    </Form>}
   </Drawer>
  )
}

 
