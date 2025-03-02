import {useState, useEffect, useRef, useCallback, forwardRef} from 'react'
import { useSelector, useDispatch } from 'react-redux';
import {fetchOrdersWithDateFilter,getOrders, updateOrder} from '../../states/orders/actions'
import {fetchOrderStatuses} from '../../states/orderStatuses/actions'
import './index.scss'
import moment from 'moment';
// import { CgSoftwareDownload } from "react-icons/cg";

import Button from '../shared/Button'
import Table from '../shared/Table'
import Search from '../shared/Search'
import Space from 'antd/lib/space'
import Avatar from 'antd/lib/avatar'
import List from 'antd/lib/list'
import Skeleton from 'antd/lib/skeleton'
import Card from 'antd/lib/card'
import Descriptions from 'antd/lib/descriptions'
import AntdTag from 'antd/lib/tag'
import Image from 'antd/lib/image'
import message from 'antd/lib/message'
import Form from 'antd/lib/form'
import Select from 'antd/lib/select'
import DatePicker from 'antd/lib/date-picker'
import CSelect from '../shared/Select'
import Input from '../shared/Input'
import GcashImage from '../../assets/images/gcash.png'
import BPIImage from '../../assets/images/bpi.png'
import InputTextArea from 'antd/lib/input/TextArea'

import { CSVLink } from "react-csv";
import {useNavigate, useParams} from 'react-router-dom'

import {updateOrderCancellation} from '../../states/orderCancellations/actions'
import RangePicker from '../shared/RangePicker'

import { useReactToPrint } from 'react-to-print'
import PrintComponent from '../shared/PrintComponent';
import { PrinterOutlined } from '@ant-design/icons';
import AntdTable from 'antd/lib/table'


function Tag({color,text}) {
  return <AntdTag className='status-tag' color={color}>{text}</AntdTag>
}

function Order({orderStates, params, ...props}) {

  const [form] = Form.useForm();
  const dispatch = useDispatch()

  const {isLoading, data: orders} = orderStates
  const order = orders?.find(order => order.order_no === params?.order_no)

  const latestOrderStatus = order?.order_status_histories?.slice(-1)?.pop()

  const {isLoading: isLoadingOrderStatuses, data: orderStatuses} = useSelector(state => state.orderStatuses)

  useEffect(() => dispatch(fetchOrderStatuses()),[])

  function paymentsColumns(isPrintView = false){
    return  (
      [
        {
          title: 'Date',
          dataIndex: 'created_at',
          sorter: (a, b) => a.created_at.localeCompare(b.created_at),
          render: (created_at) => moment(created_at).format('LL hh:mm A'),
          width: isPrintView ? 150 : 200,
        },
        {
          title: 'Mode of Payment',
          dataIndex: 'mode_of_payment',
          render: (mode_of_payment) => {
    
            const details = JSON.parse(mode_of_payment?.details)
            const isCash = mode_of_payment?.name === 'Cash'
            const isGCash = mode_of_payment?.name === 'Gcash'
            const isBPI = mode_of_payment?.name === 'BPI'
    
            if (isCash) {
              return (
                <Descriptions column={2} layout='horizontal'>
    
                  <Descriptions.Item className='mode-of-payment-name'>
                  {mode_of_payment?.name}
                  </Descriptions.Item>
    
                  <Descriptions.Item label="Name">
                    {details?.payer_name}
                  </Descriptions.Item>
                </Descriptions>
              )
    
            }
            if (isGCash) {
    
              return (
                <Descriptions column={2} colon={false} layout='horizontal'>
    
                <Descriptions.Item className='mode-of-payment-name'>
                  <Image preview={false} src={GcashImage} width={isPrintView ? 50 : 100} alt='product'/>
                </Descriptions.Item>
    
                <Descriptions.Item label="Receipt Screenshot">
                <Image src={process.env.REACT_APP_API_PAYMENT_PHOTO + details?.photo} width={40} alt='product'/>
                </Descriptions.Item>
    
                <Descriptions.Item label="Reference Number">
                  {details?.reference_no}
                </Descriptions.Item>
    
                <Descriptions.Item label="Receiver Number">
                  {details?.receiver_number}
                </Descriptions.Item>
    
                <Descriptions.Item label="Sender Number">
                  {details?.sender_number}
                </Descriptions.Item>
              </Descriptions>
              )
    
            }
            if (isBPI) {
                return (
                <Descriptions column={2} layout='horizontal'>
    
                <Descriptions.Item className='mode-of-payment-name' label='Bank'>
                <Image preview={false} src={BPIImage} width={isPrintView ? 50 : 100} alt='product'/>
                </Descriptions.Item>
                
                <Descriptions.Item label="Account Name">
                  {details?.account_name}
                </Descriptions.Item>
    
                <Descriptions.Item label="Account No">
                  {details?.account_no}
                </Descriptions.Item>
    
                <Descriptions.Item label="Bank">
                  {details?.bank}
                </Descriptions.Item>
    
                <Descriptions.Item label="Address">
                  {details?.address}
                </Descriptions.Item>
    
                <Descriptions.Item label="Receipt Screenshot">
                <Image src={process.env.REACT_APP_API_PAYMENT_PHOTO + details?.photo} width={40} alt='product'/>
                </Descriptions.Item>
    
                <Descriptions.Item label="Reference Number">
                  {details?.reference_no}
                </Descriptions.Item>
    
                <Descriptions.Item label="Receiver Number">
                  {details?.receiver_number}
                </Descriptions.Item>
    
                <Descriptions.Item label="Sender Number">
                  {details?.sender_number}
                </Descriptions.Item>
              </Descriptions>
              )
            }
    
          }
        },
        {
          title: 'Amount',
          dataIndex: 'amount',
          width: isPrintView ? 70 : 100,
          render: (amount) => <>&#8369; {amount.toLocaleString()}</>,
        },
        {
          title: 'Balance',
          dataIndex: 'order',
          width: isPrintView ? 70 : 100,
          render: (order, record) => {
            return  <>&#8369; {(record?.balance)?.toLocaleString()}</>
          }
        }
    ]
    
    )
  }
  function dataSource() {
    return order?.payments
  }

 
  function OrderList({order, isPrintMode = false}){
   
    return (
      <List
      className='order-list'
      loading={isLoading}
      itemLayout="horizontal"
      dataSource={order?.order_items}
      renderItem={orderItem => (
      <List.Item className='order-item'>
      <Skeleton avatar title={true} loading={isLoading} active>
      <List.Item.Meta 
      avatar={<Avatar size={isPrintMode ? 40 : 70} src={(process.env.REACT_APP_API_PRODUCT_COLOR_PHOTO + orderItem?.color?.photo)} shape='square' />}
      title={<>{orderItem?.product_name} {orderItem?.product?.brand?.name}</>}
      description={<div>
      <div>Variation: {`${orderItem?.color_name} ${orderItem?.size_name} ${orderItem?.ctrl === 'l' ? 'Left' : 'Right' }`} </div>
      <div>x{orderItem?.quantity}</div>
      </div>}
      />
      <div>&#8369; {orderItem?.unit_price?.toLocaleString()}</div>
      </Skeleton>
      </List.Item>
      )}
      />
    )
  }

  const isOrderProcessStatus = order?.order_status_id === 3
  const isOrderCompletedStatus = order?.order_status_id === 6
  const isOrderCancelledStatus = order?.order_status_id === 7
 
  const [monitorStatus, setMonitorStatus] = useState(order?.order_status_id)
  
  useEffect(() => {
    if (order?.order_status_id === 5) {
      form.setFieldsValue({
        order_status_id: order?.order_status_id,
        name: 'Cash',
        amount: order?.payments?.[0]?.balance,
        mode: {details: {
          payer_name: `${ order?.billings?.[0]?.user?.first_name} ${ order?.billings?.[0]?.user?.last_name}`,
          consumer_id: order?.billings?.[0]?.user?.id
        }
      }
      })
    } else {
      form.setFieldsValue({
        order_status_id: order?.order_status_id
      })
    }
  
  }, [order])

  const total = {
    amount: order?.payments?.map(payment => payment.order)?.[0]?.total_price,
    balance: order?.payments?.map(payment => payment.order)?.[0]?.total_price - order?.payments?.map(payment => payment.amount).reduce((a,c) => a + c,0),
    amount_paid:  order?.payments?.map(payment => payment.amount).reduce((a,c) => a + c,0),
  }

  const hasBalance = total.balance > 0


  // PRINT CONFIGURATIONS

  const componentRef = useRef(null);
  const onBeforeGetContentResolve = useRef(null)

  const [isPrintLoading,setIsPrintLoading] = useState(false);

  const handleOnBeforeGetContent = useCallback(() => {
    setIsPrintLoading(true);
    return new Promise((resolve) => {
      onBeforeGetContentResolve.current = resolve;
      setTimeout(() => {
        setIsPrintLoading(false);
        resolve();
      }, 2000)
    });
  }, [setIsPrintLoading])

  const reactToPrintContent = useCallback(() => {
    return componentRef.current;
  }, [componentRef.current])

  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
    onBeforeGetContent: handleOnBeforeGetContent,
    removeAfterPrint: true
  })

  // PRINT CONFIGURATIONS END

      const PrintComponent = forwardRef((props, ref) => {
        return (
        <div ref={ref} className='order-print-view'>
            <div className='order-print-view-header'>
              <div className='logo'></div>
              <section>
                <h1>(Business Name) Blinds</h1>
                <p>Address</p>
                <small>Email: test@example.com</small>
              </section>
            </div>
            <div className='order-print-view-content'>
            <Descriptions column={1} className='consumer-basic-info'>
                <Descriptions.Item label="Name">
                {`${order?.billings?.[0]?.user?.first_name} ${order?.billings?.[0]?.user?.last_name}`}
                </Descriptions.Item>
                <Descriptions.Item label="Mobile Number">
                {order?.billings?.[0]?.user?.mobile_number}
                </Descriptions.Item>
                <Descriptions.Item label="Delivery Address">
                {order?.billings?.[0]?.address}
                </Descriptions.Item>

                {/* <Descriptions.Item label="Order Number">
                  {order?.order_no}
                </Descriptions.Item> */}
             
            </Descriptions>

            <Card className='order-card'  title={`Order No: ${order?.order_no}`} extra={latestOrderStatus?.order_status?.name}>
            <OrderList order={order} isPrintMode={true} />
          </Card>

          <Table title={() => <h3>Payments</h3>} size='small' attributes={{ dataSource, isLoading: isLoading, isSearching: false, columns: paymentsColumns(true)}}
              pagination={false}
              className='payments-table'
              footer={() => {
                if (isLoading) return <></>
              return  (
                <Descriptions column={1} colon={false} className='total-descriptions'>
                  <Descriptions.Item label="Total Amount">
                  &#8369; {total.amount?.toLocaleString()}
                  </Descriptions.Item>
                  <Descriptions.Item label="Total Balance">
                  &#8369; {total.balance?.toLocaleString()}
                  </Descriptions.Item>
                  <Descriptions.Item label="Total Amount Paid" className='desc-item-highlight'>
                  &#8369; {total.amount_paid?.toLocaleString()}
                  </Descriptions.Item>
              </Descriptions>
              )
              }}
              /> 
{/* 
            <Card title='Payments'>
              <Table size='small' attributes={{ dataSource, isLoading: isLoading, isSearching: false, columns: paymentsColumns(true)}}
              pagination={false}
              className='payments-table'
              // footer={() => {
              //   if (isLoading) return <></>
              // return  (
              //   <Descriptions column={1} colon={false}>
              //     <Descriptions.Item label="Total Amount">
              //     &#8369; {total.amount?.toLocaleString()}
              //     </Descriptions.Item>
              //     <Descriptions.Item label="Total Balance">
              //     &#8369; {total.balance?.toLocaleString()}
              //     </Descriptions.Item>
              //     <Descriptions.Item label="Total Amount Paid" className='desc-item-highlight'>
              //     &#8369; {total.amount_paid?.toLocaleString()}
              //     </Descriptions.Item>
              // </Descriptions>
              // )
              // }}
              /> 
            </Card> */}
            </div>

        </div>
        )
      })
     
 
      useEffect(() => {
        form.setFieldsValue({
          status:  order?.order_cancellation?.status
        })
      }, [order?.order_cancellation])

       
  function onSubmit(values){

    if (isOrderCancelledStatus) {
      values.id = order.order_cancellation.id
      values.order_id = order.id
    
      updateOrderCancellation(values, { message, form, dispatch })
    } else {
      values.delivery_date = moment(values.delivery_date).format('YYYY-MM-DD')
      dispatch(updateOrder({id: order.id, ...values}))
     
    }
 
  }
 
   return (
      <main className='order'>
        <PrintComponent {...props} ref={componentRef}/>
        <div>
          <Card className='order-card'  title={`ORDER NO: ${order?.order_no}`} extra={latestOrderStatus?.order_status?.name}>
            <OrderList order={order} />
          </Card>

        <div className='remarks-delivery-address'>
          <Card title='Remarks'>{order?.message}</Card>
          <Card title='Delivery Address'>
          <div>{order?.billings?.[0]?.address}</div>
          <div>{`${order?.billings?.[0]?.user?.first_name} ${order?.billings?.[0]?.user?.last_name}`}</div>
          <div>{order?.billings?.[0]?.user?.mobile_number?.replace(0,'(+63) ')}</div>
          </Card>
          
        </div>

          <Card title={`Payments`} 
          // style={{background: order?.order_status_id === 7 ? '#fff1f0' : ''}}
          >
            <Table attributes={{ dataSource, isLoading: isLoading, isSearching: false, columns: paymentsColumns()}}
            pagination={false}
            className={`payments-table`} footer={() => {
              if (isLoading) return <></>
            return  (
              <Descriptions column={1} colon={false}>
                <Descriptions.Item label="Total Amount">
                &#8369; {total.amount?.toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label="Total Balance">
                &#8369; {total.balance?.toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label="Total Amount Paid" className='desc-item-highlight'>
                &#8369; {total.amount_paid?.toLocaleString()}
                </Descriptions.Item>
            </Descriptions>
            )
            }}/>
          </Card>
          {(!isOrderCompletedStatus && !isLoading) && 
          <Form
          layout="vertical" 
          form={form}
          name="order-form"
          className={`order-form ${hasBalance ? 'order-form-wb' : 'order-form-wob'}`}
          onFinish={onSubmit}
          colon={false}
          requiredMark={false}
          >
            {!isOrderCancelledStatus &&
          <Card title='Update Status'>

          {isOrderProcessStatus && <Form.Item name="delivery_date" label="Date of Delivery"
          rules={[{ required: true, message: "Date of Delivery is Required" }]}
          >
          <DatePicker disabledDate={(current) => current <= moment().subtract(1, 'days')}/>  
          </Form.Item>}


          <Form.Item name="order_status_id" label="Status"
          rules={[{ required: true, message: "Status is Required" }]}
          >
          <CSelect
          placeholder="Select Status"
          allowClear
          onSelect={(value) => setMonitorStatus(value)}
          >   
          {([3,4,5,6].includes(order.order_status_id) ? orderStatuses.filter(row => row.id != 7) : orderStatuses).map(status => (
          <Select.Option key={status.id} value={status.id} disabled={((status.id <= order?.order_status_id || isOrderCompletedStatus))}>{status.name}</Select.Option>
          ))}
          </CSelect>
          </Form.Item>

          {(monitorStatus && monitorStatus === 7) && 
           <Form.Item label='Reason' name='reason'
           
           >
           <InputTextArea />
           </Form.Item>
          
          }
          </Card>}

          {((order?.order_status_id === 5) && hasBalance && !isLoading) && 
          <Card title='Update Payment'>

          <Form.Item name={['mode', 'details', 'consumer_id']}
          hidden={true}
          >
          <Input />
          </Form.Item>

          <Form.Item name="name" label="Mode Of Payment"
          rules={[{ required: true, message: "Mode Of Payment is Required" }]}
          >
          <Input disabled/>
          </Form.Item>

          <Form.Item name="amount" label="Amount Balance To Pay"
          rules={[{ required: true, message: "Amount Balance To Pay is Required" }]}
          >
          <Input disabled/>
          </Form.Item>

          <Form.Item label='Consumer Name or Proxy' name={['mode', 'details', 'payer_name']}
          hidden={true}
          >
          <Input />
          </Form.Item>

          </Card>}

          {(isOrderCancelledStatus && (order?.order_cancellation?.hasOwnProperty('status') && order?.order_cancellation?.status === 1)) && 
         <Card>
               <Form.Item name="status" label="Cancelled Status"
          rules={[{ required: true, message: "Status is Required" }]}
          >
          <CSelect
          placeholder="Select Cancel Status"
          allowClear
          // onSelect={(value) => setMonitorStatus(value)}
          >
          {[
            {
              id: 1,
              name: 'Pending'
            },
            {
              id: 2,
              name: 'Approved'
            },
            {
              id: 3,
              name: 'Rejected'
            }
          ].map(status => (
          <Select.Option key={status.id} value={status.id} disabled={(status.id <= order?.order_cancellation?.status)}>{status.name}</Select.Option>
          ))}
          </CSelect>
          </Form.Item>

          

          <Form.Item name="reason" label="Reason"
          rules={[{ required: true, message: "Reason is Required" }]}
          >
          <InputTextArea/>
          </Form.Item>
         </Card>
        }

    {((order?.order_cancellation?.status === 1) || (![6,7].includes(order?.order_status_id))) && 
          <Button type='primary' htmlType='submit' 
          // disabled={monitorStatus === order?.order_status_id}
          >
           Submit
          </Button> 
}
          </Form>
          }
        </div>
        <Button className='btn-print' type='primary' loading={isPrintLoading} onClick={handlePrint}><PrinterOutlined /> Print Receipt</Button>
      </main>
  )
} 
 
function Orders({orderStates, onChangeDate, dateFrom, dateTo, ...props}) {

  const {isLoading, data: orders} = orderStates

  const navigate = useNavigate()

  const [searchKey, setSearchKey] = useState('')
  const isSearching = searchKey.length >= 1

  const columns = [
      {
        title: 'Order No.',
        dataIndex: 'order_no',
        sorter: (a, b) => a.order_no.localeCompare(b.order_no)
      },
      {
        title: 'Shipping Fee',
        dataIndex: 'shipping_fee',
        sorter: (a, b) => a.shipping_fee.localeCompare(b.shipping_fee),
        render: (shipping_fee) => <>&#8369; {shipping_fee?.toLocaleString()}</>
      },
      {
        title: 'Total',
        dataIndex: 'total_price',
        sorter: (a, b) => a.total_price.localeCompare(b.total_price),
        render: (total_price) => <>&#8369; {total_price?.toLocaleString()}</>
      },
      {
        title: 'Order Date',
        dataIndex: 'created_at',
        sorter: (a, b) => a.created_at.localeCompare(b.created_at),
        render: (created_at) => moment(created_at).format('LL hh:mm A')
      },    
      {
        title: 'Status',
        dataIndex: 'order_status_histories',
        render: (order_status_histories) => {
          
          const latestStatus = order_status_histories.slice(-1).pop()?.order_status
 
          function colorCode(status) {
              if(status === 1) return '#F3A638'
              if(status === 2) return '#4E4E4E'
              if(status === 3) return '#54B7D3'
              if(status === 4) return '#1D91CF'
              if(status === 5) return '#52c41a'
              if(status === 6) return '#237804'
              if(status === 7) return '#F33870'
              
            }
          
          return <Tag color={colorCode(latestStatus?.id)} text={latestStatus?.name}/>
        }
      },       
      {
        title: 'Actions',
        render: (_,row) => {
  
        const order = orders.find((order) => order.id === row.id)
     
        return (
        <Space size="middle">
          <div onClick={() => navigate(`/orders/${row?.order_no}`)}>View</div>          
        </Space>
          )
        }
      }
  ]
  
  function dataSource() {
    function  processData(orders) {
      const toTrimStringLower = (value) => value.trim().toString().toLowerCase()
      return searchKey ? 
      orders.filter((order) => toTrimStringLower(order.order_no)
      .includes(toTrimStringLower(searchKey))) 
      : orders
    }
    return processData(orders)
  }

  function csv(){
    const hasData = dataSource().length

    const header = [[`Start Date:${dateFrom}`, `End Date:${dateTo}`, '', '']]

    const body = hasData ?
    [['Order No', 'Shipping Fee', 'Total', 'Status', 'Order Date'], ...dataSource().map(({order_no, shipping_fee,total_price, order_status_histories, created_at}) => 
    {
      const latestStatus = order_status_histories.slice(-1).pop()?.order_status?.name
      return Object.values({order_no, shipping_fee,total_price, latestStatus, created_at: moment(created_at).format('LLLL')})
    })]
    : [[ '','No Data Available', '' ]]
   

    return {
      filename: `orders-${moment().format('LL').toLocaleLowerCase()}.csv`,
      data: [header, ...body]
    }
  }

  const onSearch = () => {
    return {
      search: (key) => setSearchKey(key),
      change: (event) => !event.currentTarget.value && setSearchKey('')
    }
  }


    // PRINT CONFIGURATIONS

    const componentRef = useRef(null);
    const onBeforeGetContentResolve = useRef(null)
  
    const [isPrintLoading,setIsPrintLoading] = useState(false);
  
    const handleOnBeforeGetContent = useCallback(() => {
      setIsPrintLoading(true);
      return new Promise((resolve) => {
        onBeforeGetContentResolve.current = resolve;
        setTimeout(() => {
          setIsPrintLoading(false);
          resolve();
        }, 2000)
      });
    }, [setIsPrintLoading])
  
    const reactToPrintContent = useCallback(() => {
      return componentRef.current;
    }, [componentRef.current])
  
    const handlePrint = useReactToPrint({
      content: reactToPrintContent,
      onBeforeGetContent: handleOnBeforeGetContent,
      removeAfterPrint: true
    })
  
    // PRINT CONFIGURATIONS END

  return (
    <main className='orders'>
          <PrintComponent {...props} ref={componentRef}>
    <h1 className='print-view-content-title'>Orders</h1>
    <div className='print-view-content-range-date'>
    {`Start Date: ${dateFrom ? dateFrom : 'None'} - End Date: ${dateTo ? dateTo : 'None'}`}
    </div>
    <AntdTable
      className='print-view-content-table'
      columns={
        [
          {
            title: 'Order No.',
            dataIndex: 'order_no',
          },
          {
            title: 'Shipping Fee',
            dataIndex: 'shipping_fee',
            render: (shipping_fee) => <>&#8369; {shipping_fee?.toLocaleString()}</>
          },
          {
            title: 'Total',
            dataIndex: 'total_price',
            render: (total_price) => <>&#8369; {total_price?.toLocaleString()}</>
          },
          {
            title: 'Order Date',
            dataIndex: 'created_at',
            render: (created_at) => moment(created_at).format('LL hh:mm A')
          },    
          {
            title: 'Status',
            dataIndex: 'order_status_histories',
            render: (order_status_histories) => {
              
              const latestStatus = order_status_histories.slice(-1).pop()?.order_status
     
              function colorCode(status) {
                  if(status === 1) return '#F3A638'
                  if(status === 2) return '#4E4E4E'
                  if(status === 3) return '#54B7D3'
                  if(status === 4) return '#1D91CF'
                  if(status === 5) return '#52c41a'
                  if(status === 6) return '#237804'
                  if(status === 7) return '#F33870'
                  
                }
              
              return <Tag color={colorCode(latestStatus?.id)} text={latestStatus?.name}/>
            }
          }
      ]
      }
      dataSource={dataSource()}
      pagination={false}
    />
    
    </PrintComponent>
        <h1 className='title'>Orders</h1>
        <Button className='btn-print' type='primary' loading={isPrintLoading} onClick={handlePrint}><PrinterOutlined />Print Report</Button>

         {/* <Button className='btn-export'>
          <CSVLink {...csv()}><CgSoftwareDownload/>Export</CSVLink>
         </Button> */}
        <Search onSearch={onSearch}/>
        <RangePicker
            onChange={onChangeDate}
            disabled={isLoading}
            value={[dateFrom, dateTo]?.map(date => moment(date))}
            className='range-date'
            format='MM/DD/YYYY'
            allowEmpty={true}
            />
        <Table attributes={{ dataSource, isLoading: isLoading, isSearching, columns}} className='orders-table'/>
    </main>
  )
}

export default function InitialPage () {

  const [rangeDate, setRangeDate] = useState()
  const [dateFrom, dateTo] = rangeDate || [moment().startOf('month').format("YYYY-MM-DD"), moment().endOf('month').format("YYYY-MM-DD")]
  const onChangeDate = (ymd) => setRangeDate(ymd?.map(date => moment(date).format('YYYY-MM-DD')))



  const params = useParams()
  const hasSelectedOrder =  params.hasOwnProperty('order_no')

  const dispatch = useDispatch()
  const orderStates = useSelector((state) => state.orders)
  useEffect(() => {
    if (hasSelectedOrder) {
      dispatch(getOrders())
    } else {
      dispatch(fetchOrdersWithDateFilter({dateFrom,dateTo}))
   
    }
  
  }, [dispatch, hasSelectedOrder, dateFrom, dateTo])

  const props = {
    orderStates,
    params,
    onChangeDate,
    dateFrom,
    dateTo
  }

  return hasSelectedOrder ? 
  <Order {...props}/> : <Orders {...props}/>
}