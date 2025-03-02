import {useState, useEffect, useRef, useCallback} from 'react'
import { useSelector, useDispatch } from 'react-redux';
import {fetchPayments, fetchPaymentsWithDateFilter} from '../../states/payments/actions'

import './index.scss'
import moment from 'moment';
import { CgSoftwareDownload } from "react-icons/cg";
import Descriptions from 'antd/lib/descriptions'
import Image from 'antd/lib/image'
import GcashImage from '../../assets/images/gcash.png'
import BPIImage from '../../assets/images/bpi.png'

import Button from '../shared/Button'
import Table from '../shared/Table'
import Search from '../shared/Search'
import Space from 'antd/lib/space'
import { CSVLink } from "react-csv";
import NoPhoto from '../../assets/images/no_photo.png'
import RangePicker from '../shared/RangePicker'
import CSelect from '../shared/Select'
import Select from 'antd/lib/select'

import { useReactToPrint } from 'react-to-print'
import PrintComponent from '../shared/PrintComponent';
import { PrinterOutlined } from '@ant-design/icons';
import AntdTable from 'antd/lib/table'

export default function Payments(props) {

  const [rangeDate, setRangeDate] = useState()
  const [dateFrom, dateTo] = rangeDate || [moment().startOf('month').format("YYYY-MM-DD"), moment().endOf('month').format("YYYY-MM-DD")]
  const onChangeDate = (ymd) => setRangeDate(ymd?.map(date => moment(date).format('YYYY-MM-DD')))


  const [searchKey, setSearchKey] = useState('')
  const isSearching = searchKey.length >= 1

  const [selectedStatus,setSelectedStatus] = useState(1)
  const selectedStatusRef = selectedStatus === 1 ? [5,6] : [7]

  const dispatch = useDispatch()
  const {isLoading, data: payments} = useSelector((state) => state.payments)
  useEffect(() => {dispatch(fetchPaymentsWithDateFilter({dateFrom,dateTo}))}, [dispatch, dateFrom, dateTo, selectedStatus])

  
  const columns = [
    {
      title: 'Name',
      dataIndex: 'order',
      render: (order) => `${order?.consumer?.first_name} ${order?.consumer?.last_name}`,
      width: 200,
    },
      {
        title: 'Order Number',
        dataIndex: 'order',
        render: (order) => order?.order_no,
        width: 200,
      },
      {
        title: 'Date',
        dataIndex: 'created_at',
        sorter: (a, b) => a.created_at.localeCompare(b.created_at),
        render: (created_at) => moment(created_at).format('LL hh:mm A'),
        width: 200,
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
              <Descriptions column={5} colon={false} layout='vertical'>
    
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
              <Descriptions column={5} colon={false} layout='vertical'>
    
              <Descriptions.Item className='mode-of-payment-name'>
                <Image preview={false} src={GcashImage} width={100} alt='product'/>
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
              <Descriptions column={5} layout='vertical'>
    
              <Descriptions.Item className='mode-of-payment-name'>
              <Image preview={false} src={BPIImage} width={100} alt='product'/>
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
        title: 'Balance',
        dataIndex: 'balance',
        render: (balance) => <>&#8369; {balance.toLocaleString()}</>,
      },
      {
        title: 'Amount',
        dataIndex: 'amount',
        render: (amount) => <>&#8369; {amount.toLocaleString()}</>,
      }
  ]
    
  function dataSource() {
    function processData(payments) {
      const toTrimStringLower = (value) => value.trim().toString().toLowerCase()
      return searchKey ? 
      payments.filter((payment) => [toTrimStringLower(`${payment?.order?.consumer?.first_name} ${payment?.order?.consumer?.last_name}`), toTrimStringLower(payment?.order?.order_no)]
      .includes(toTrimStringLower(searchKey))) 
      : payments
    }
     return processData(payments)?.filter(row => selectedStatusRef?.includes(row.order?.order_status_id))?.sort((a,c) => moment(c.created_at) - moment(a.created_at))
   
  }

  // function csv(){

  //   function modeOfPaymentDetail(mode_of_payment){
  //     const details = JSON.parse(mode_of_payment?.details)
  //     const isCash = mode_of_payment?.name === 'Cash'
  //     const isGCash = mode_of_payment?.name === 'Gcash'
  //     const isBPI = mode_of_payment?.name === 'BPI'

  //     if (isCash) {

  //       return `${mode_of_payment?.name}, Payer Name: ${details?.payer_name}`
  //     }
  //     if (isGCash) {

  //       return `${mode_of_payment?.name}, Reference No: ${details?.reference_no}, 
  //       Receiver: ${details?.receiver_number}, Sender Number: ${details?.sender_number}
  //       `
  //     }
  //     if (isBPI) {

  //       return `${mode_of_payment?.name}, Reference No: ${details?.reference_no},
  //       Account Name: ${details?.account_name}, Account No: ${details?.account_no},
  //       Bank Name: ${details?.bank}, Address: ${details?.address},
  //       Receiver: ${details?.receiver_number}, Sender Number: ${details?.sender_number}
  //       `
  //     }
  //   }

  //   const hasData = dataSource().length
  //   const header = [[`Start Date:${dateFrom}`, `End Date:${dateTo}`, `Status: ${selectedStatus === 1 ? 'Delivered/Completed' : 'Cancelled'}`, '']]

  //   const body = hasData ?
  //   dataSource().map(({created_at, mode_of_payment, order, balance, amount}) => 
  //   Object.values({name:`${order?.consumer?.first_name} ${order?.consumer?.last_name}`,order: order?.order_no, created_at: moment(created_at).format('LLLL'), mode_of_payment:modeOfPaymentDetail(mode_of_payment), balance: balance.toLocaleString(), amount: amount.toLocaleString() }))
  //   : [[ '','No Data Available', '' ]]

  //   return {
  //     filename: `payments-${moment().format('LL').toLocaleLowerCase()}.csv`,
  //     data: [header, ['Total Payment: ', dataSource().map(payment => payment.amount).reduce((a,c) => a + c,0)?.toLocaleString(), ''], ['Name','Order Number','Date', 'Mode of Payment Detail', 'Balance', 'Amount'], ...body]
  //   }
  // }

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
    <main className='payments'>
         <PrintComponent {...props} ref={componentRef}>
    <h1 className='print-view-content-title'>Payments</h1>
    <div className='print-view-content-range-date'>
    {`Start Date: ${dateFrom ? dateFrom : 'None'} - End Date: ${dateTo ? dateTo : 'None'}`}
    </div>
    <div className='print-view-content-status'>
    { `Status: ${selectedStatus === 1 ? 'Delivered/Completed' : 'Cancelled'}`}
    </div>
   
    <AntdTable
      className='print-view-content-table'
      columns={
        [
          {
            title: 'Name',
            dataIndex: 'order',
            render: (order) => `${order?.consumer?.first_name} ${order?.consumer?.last_name}`,
            // width: 200,
          },
            {
              title: 'Order Number',
              dataIndex: 'order',
              render: (order) => order?.order_no,
              // width: 200,
            },
            {
              title: 'Date',
              dataIndex: 'created_at',
              render: (created_at) => moment(created_at).format('LL hh:mm A'),
              // width: 200,
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
                    <Descriptions column={5} colon={false} layout='vertical'>
          
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
                    <Descriptions column={5} colon={false} layout='vertical'>
          
                    <Descriptions.Item className='mode-of-payment-name'>
                      <Image preview={false} src={GcashImage} width={50} alt='product'/>
                    </Descriptions.Item>
      
                    <Descriptions.Item label="Receipt Screenshot">
                    <Image src={process.env.REACT_APP_API_PAYMENT_PHOTO + details?.photo} width={20} alt='product'/>
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
                    <Descriptions column={5} layout='vertical'>
          
                    <Descriptions.Item className='mode-of-payment-name'>
                    <Image preview={false} src={BPIImage} width={100} alt='product'/>
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
              title: 'Balance',
              dataIndex: 'balance',
              render: (balance) => <>&#8369; {balance.toLocaleString()}</>,
            },
            {
              title: 'Amount',
              dataIndex: 'amount',
              render: (amount) => <>&#8369; {amount.toLocaleString()}</>,
            }
        ]
      }
      dataSource={dataSource()}
      pagination={false}
    />
    
    </PrintComponent>
        <h1 className='title'>Payments</h1>
        <Button className='btn-print' type='primary' loading={isPrintLoading} onClick={handlePrint}><PrinterOutlined /> Print Report</Button>
{/* 
         <Button className='btn-export'>
          <CSVLink {...csv()}><CgSoftwareDownload/>Export</CSVLink>
         </Button> */}
        <Search onSearch={onSearch} placeholder='Search Name Or Order Number'/>

    <CSelect className='status' style={{width: '100%'}} value={selectedStatus} placeholder="Please select status" onChange={(e) => setSelectedStatus(Number(e))}>
    <Select.Option value={1}>Delivered/Completed</Select.Option>
    <Select.Option value={0}>Cancelled</Select.Option>
    </CSelect>
        <RangePicker
            onChange={onChangeDate}
            disabled={isLoading}
            value={[dateFrom, dateTo]?.map(date => moment(date))}
            className='range-date'
            format='MM/DD/YYYY'
            allowEmpty={true}
            />
        <Table 
         rowClassName={(record) => record.order?.order_status_id === 7 ? 'table-cancelled' :  ''}
        attributes={{ dataSource, isLoading: isLoading, isSearching, columns}}
        className='payments-table'
        footer={() => {
          if (isLoading) return <></>
          if (!isLoading) {
        
            return (
              <div className='total-payments'>
                <span>Total Payments: </span>
                <span>&#8369; { dataSource().map(payment => payment.amount).reduce((a,c) => a + c,0)?.toLocaleString()}</span>
              </div>
            )
          }
        
        }}
        />
    </main>
  )
}