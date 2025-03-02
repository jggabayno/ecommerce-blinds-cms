import {useState, useEffect, useRef, useCallback} from 'react'

import { fetchAccountsReceivable } from '../../states/accountsReceivable/actions'
import './index.scss'
import moment from 'moment';
import { CgSoftwareDownload } from "react-icons/cg";
import Button from '../shared/Button'
import Table from '../shared/Table'
import Search from '../shared/Search'
// import { CSVLink } from "react-csv";
import NoPhoto from '../../assets/images/no_photo.png'
import { useNavigate } from 'react-router-dom';
import RangePicker from '../shared/RangePicker'

import { useReactToPrint } from 'react-to-print'
import PrintComponent from '../shared/PrintComponent';
import { PrinterOutlined } from '@ant-design/icons';
import AntdTable from 'antd/lib/table'

export default function AccountsReceivable(props) {

  const [rangeDate, setRangeDate] = useState()
  const [dateFrom, dateTo] = rangeDate || [moment().startOf('month').format("YYYY-MM-DD"), moment().endOf('month').format("YYYY-MM-DD")]
  const onChangeDate = (ymd) => setRangeDate(ymd?.map(date => moment(date).format('YYYY-MM-DD')))


  const navigate = useNavigate()
  const [searchKey, setSearchKey] = useState('')
  const isSearching = searchKey.length >= 1
 
  const [accReceivable,setAccReceivable] = useState({
    isLoading: false,
    data: []
  })

  const {isLoading,data} = accReceivable

  useEffect(() => {
    fetchAccountsReceivable(setAccReceivable, dateFrom, dateTo)
  }, [dateFrom, dateTo])

  const columns = [
      {
        title: 'Consumer',
        dataIndex: 'consumer_photo',
        render: (photo,record) => {
          const src = photo ? (process.env.REACT_APP_API_USER_PHOTO + photo) 
          : NoPhoto
          return <div className='consumer-row'>
              <img src={src } width='40' height='40' alt='brand'/>
              <div>
                <span className='consumer-row-name'>{record?.consumer_name}</span>
                <span>{record?.consumer_mobile_number}</span>
              </div>
          </div>
        }
      },
      {
        title: 'Total Amount',
        dataIndex: 'total_amount',
        sorter: (a, b) => a.total_amount.localeCompare(b.total_amount)
      },
      {
        title: 'Total Balance',
        dataIndex: 'total_balance',
        sorter: (a, b) => a.total_balance.localeCompare(b.total_balance)
      },
      {
        title: 'Total Amount Paid',
        dataIndex: 'total_amount_paid',
        sorter: (a, b) => a.total_amount_paid.localeCompare(b.total_amount_paid)
      },
     {
        title: 'Date of Last Payment',
        dataIndex: 'date_of_last_payment',
        sorter: (a, b) => a.date_of_last_payment.localeCompare(b.date_of_last_payment)
      },
      {
        title: 'Action',
        dataIndex: 'date_of_last_payment',
        render: (_,record) => {
          return <Button onClick={() => navigate(`/orders/${record?.order_no}`)}>View Order</Button>
        }
      },
  ]
  
  function dataSource() {
 
    const removedNoBalance = data.filter(row => row.total_price !== row.payments?.map(row => row.amount).reduce((a,c) => a + c,0))

    const constructedData = removedNoBalance.map(row => ({
      id: row?.id,
      order_no: row?.order_no,
      consumer_photo: row?.consumer?.photo,
      consumer_name: `${row?.consumer?.first_name} ${row?.consumer?.last_name}`,
      consumer_mobile_number: `${row?.consumer?.mobile_number}`,
      total_amount: row.total_price?.toLocaleString(),
      total_balance: row?.payments?.map(row => row?.balance).reduce((a,c) => a + c,0)?.toLocaleString(),
      total_amount_paid: row?.payments?.map(row => row?.amount).reduce((a,c) => a + c,0)?.toLocaleString(),
      date_of_last_payment: moment(row?.payments?.[0]?.created_at).format('LL hh:mm A')
    }))
  
    function processData(data) {
      const toTrimStringLower = (value) => value.trim().toString().toLowerCase()
      return searchKey ? 
      data.filter((row) => toTrimStringLower(row.consumer_name)
      .includes(toTrimStringLower(searchKey))) 
      : data
    }
    return processData(constructedData)
  }
 

  // function csv(){

  //   const hasData = dataSource().length
  //   const header = [[`Start Date:${dateFrom}`, `End Date:${dateTo}`, '', '']]

  //   const body = hasData ?
  //   [[['Consumer Name', 'Consumer Mobile Number', 'Order No', 'Total Amount', 'Total Amount Paid', 'Total Balance', 'Date of Last Payment']], ...dataSource().map(({ 
  //     consumer_name,
  //     consumer_mobile_number, 
  //     order_no,
  //     total_amount,
  //     total_amount_paid,
  //     total_balance,
  //     date_of_last_payment}) => 
  //   Object.values({
  //     consumer_name,
  //     consumer_mobile_number,
  //     order_no,
  //     total_amount,
  //     total_amount_paid,
  //     total_balance, date_of_last_payment: moment(date_of_last_payment).format('LLLL')}))]
  //   : [[ '','No Data Available', '' ]]

  //   return {
  //     filename: `accounts-receivable-${moment().format('LL').toLocaleLowerCase()}.csv`,
  //     data: [header, ...body]
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
    <main className='accounts-receivable'>
         <PrintComponent {...props} ref={componentRef}>
    <h1 className='print-view-content-title'>Accounts Receivable</h1>
    <div className='print-view-content-range-date'>
    {`Start Date: ${dateFrom ? dateFrom : 'None'} - End Date: ${dateTo ? dateTo : 'None'}`}
    </div>
    <AntdTable
      className='print-view-content-table'
      columns={
        [
          {
            title: 'Consumer',
            dataIndex: 'consumer_photo',
            render: (photo,record) => {
              const src = photo ? (process.env.REACT_APP_API_USER_PHOTO + photo) 
              : NoPhoto
              return <div className='consumer-row'>
                  <img src={src } width='40' height='40' alt='brand'/>
                  <div>
                    <span className='consumer-row-name'>{record?.consumer_name}</span>
                    <span>{record?.consumer_mobile_number}</span>
                  </div>
              </div>
            }
          },
          {
            title: 'Total Amount',
            dataIndex: 'total_amount',
          },
          {
            title: 'Total Balance',
            dataIndex: 'total_balance',
          },
          {
            title: 'Total Amount Paid',
            dataIndex: 'total_amount_paid',
          },
         {
            title: 'Date of Last Payment',
            dataIndex: 'date_of_last_payment',
          }
      ]
      }
      dataSource={dataSource()}
      pagination={false}
    />
    
    </PrintComponent>
        <h1 className='title'>Accounts Receivable</h1>
        <Button className='btn-print' type='primary' loading={isPrintLoading} onClick={handlePrint}><PrinterOutlined /> Print Report</Button>

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
        <Table attributes={{ dataSource, isLoading: isLoading, isSearching, columns}} className='accounts-receivable-table'/>
    </main>
  )
}