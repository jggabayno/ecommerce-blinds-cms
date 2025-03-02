import Button from '../shared/Button'
import DatePicker from 'antd/lib/date-picker'
import RangePicker from '../shared/RangePicker'
import './index.scss'
import moment from 'moment';
import { CgSoftwareDownload } from "react-icons/cg";
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { CSVLink } from "react-csv";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Progress from 'antd/lib/progress'
import {fetchDashboard} from '../../states/dashboard/actions'

export default function Dashboard() {
    const [rangeDate, setRangeDate] = useState()
    const [dateFrom, dateTo] = rangeDate || [moment().startOf('month').format("YYYY-MM-DD"), moment().endOf('month').format("YYYY-MM-DD")]
    const onChangeDate = (ymd) => setRangeDate(ymd?.map(date => moment(date).format('YYYY-MM-DD')))

    const [year, setYear] = useState(moment('2022'))
    function onChangeMonthlySalesYearDate(date) {
        setYear(moment(date))
    }

    const {isLoading, data: dashboard} = useSelector((state) => state.dashboard)
    const dispatch =  useDispatch()
 
    useEffect(() => {dispatch(fetchDashboard({ dateFrom, dateTo, year: moment(year).format('YYYY')}))}, [dispatch, dateFrom, dateTo, year]);
    
    const renderLegend = (props) => {
    const { payload } = props;
    return (
    <div className='legend-container'>
    {
    payload.map((entry, index) => (
    <div key={`item-${index}`}>
    <div className='legend-theme' style={{backgroundColor:entry.color}}></div>
    <div style={{color:entry.color}}>{entry.value}</div>
    </div>
    ))
    }
    </div>
    );
    }

    function csv(){
 
        const dashboardTotals =  dashboard && [[
             dashboard?.total_orders?.toLocaleString(), dashboard?.total_products?.toLocaleString(), 
             dashboard?.total_sales?.toLocaleString(), dashboard?.total_revenue?.toLocaleString()
             ]]


         const header = [[`Start Date:${dateFrom}`, `End Date:${dateTo}`, '', '']]
         const body = [
         ['Total Orders', 'Total Product Variants', 'Total Sales', 'Total Revenue'],
         ...dashboardTotals,
            ['', '', '', ''],
            [`Monthly Orders vs Sales vs Revenue by ${moment(year).format('YYYY')}`, '', '', ''],
            ...monthlyCsvData,
            ['', '', '', ''],
            ['','','Order Statuses', '', ''],
            ['Status', 'Count', '', ''],
            ...dashboardOrderStatuses,
            ['', '', '', ''],
            ['Consumer with Order Vs Consumer', '','',''],
            ['Description','Percentage', '', ''],
            consumerVs,
            ['', '', '', ''],
            ['Top 3 Selling Products', '','',''],
            ['Product Name', 'Product Color Variant','Count','',''],
            ...topSellingProductsForCsv
         ] 
         // : [[ '','No Data Available', '' ]]
         return {
           filename: `dashboard-${moment().format('LL').toLocaleLowerCase()}.csv`,
           data: [header, ...body],
         }
     }
 
    const hasDashboardData = dashboard?.hasOwnProperty('total_orders')
    
    const monthlyCsvData = hasDashboardData ? [
        [dashboard?.monthly_sales_revenue_orders?.map(row => row.month)],
        [dashboard?.monthly_sales_revenue_orders?.map(row => row.sales)],
       [ dashboard?.monthly_sales_revenue_orders?.map(row => row.revenue)],
        [dashboard?.monthly_sales_revenue_orders?.map(row => row.orders)]
     ] : []

    const dashboardOrderStatuses = hasDashboardData ? dashboard?.order_statuses?.map(row => Object.values(row)) : []
    

    const consumerVs = hasDashboardData ? 
        [dashboard?.consumer_with_order?.description, dashboard?.consumer_with_order?.percentage, '', '']
    : []

    const topSellingProductsForCsv = hasDashboardData ? 
    dashboard?.top_selling_products?.map(row => Object.values(row)) : []
 
    return (
        <main className="dashboard">
            <h1 className='title'>Dashboard</h1>
            <Button className='btn-export'>
                <CSVLink {...csv()}><CgSoftwareDownload/>Export</CSVLink>
            </Button>
            <div className='display-date'>Date as of: {dateFrom || 'ALL'} - {dateTo || 'ALL'}</div>
            <RangePicker
            onChange={onChangeDate}
            disabled={isLoading}
            value={[dateFrom, dateTo]?.map(date => moment(date))}
            className='range-date'
            format='MM/DD/YYYY'
            allowEmpty={true}
            />

            <section className='total'>
                <div className='total-item'>
                <h3>{dashboard?.total_orders?.toLocaleString()}</h3>
                    <span>Total Orders</span>
                </div>
                <div className='total-item'>
                <h3>{dashboard?.total_products?.toLocaleString()}</h3>
                    <span>Total Product Variants</span>
                </div>
                <div className='total-item'>
                    <h3>&#8369; {dashboard?.total_sales?.toLocaleString()}</h3>
                    <span>Total Sales</span>
                </div>
                <div className='total-item'>
                    <h3>&#8369; {dashboard?.total_revenue?.toLocaleString()}</h3>
                    <span>Total Revenue</span>
                </div>
            </section>
         
            <section className='monthly-sales'>
               <div className='monthly-sales-tools'>
                    <h1>Monthly Orders vs Sales vs Revenue</h1>
                <DatePicker 
                onChange={onChangeMonthlySalesYearDate}
                value={moment(year)}
                disabled={isLoading}  
                picker="year"
                allowClear={false}
                />
 
               </div>
            <ResponsiveContainer width="100%" height="90%">
                    <LineChart
                    data={dashboard?.monthly_sales_revenue_orders}
                    >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                        dataKey="month"
                        minTickGap={1}
                        fontSize={12}
                        tickLine={0}
                    />
                    <YAxis
                      minTickGap={1}
                      fontSize={12}
                      tickLine={0}
                    />
                    <Tooltip />
                    <Legend content={renderLegend}  align="center" />
                    <Line dataKey="sales" type="monotone" strokeWidth={2} stroke="#82ca9d"/>
                    <Line dataKey="revenue" type="monotone" strokeWidth={2} stroke="#52c41a"/>
                    <Line dataKey="orders" type="monotone" strokeWidth={2} stroke="#1890ff"/>
                    </LineChart >
                </ResponsiveContainer>
            </section>
            <section className='order-statuses'>
                <h1>Order Statuses</h1>
                <div className='order-statuses-body'>
                    {dashboard?.order_statuses?.map((row, key) =>  {
                        const theme = ['#F3A638','#4E4E4E', '#fff000', '#1D91CF', '#52c41a', '#237804', '#F33870']
                        return (
                        <div key={row?.status}>
                            <span style={{color: theme[key]}}>{row?.status}</span>
                            <span className='count'>{row?.count}</span>
                        </div>
                        )
                    })}
                </div>
            </section>

            <section className='top-selling-products'>
                <h1>Top 3 Selling Products</h1>
                <div className='top-selling-products-body'>
                    {dashboard?.top_selling_products?.map((row, key) =>  {

                                return (
                        <div key={row?.status}>
                            <span  >{`${row?.product_name} (${row?.color_name})`}</span>
                            <span>{row?.qty_sold}</span>
                        </div>
                        )
                    })}
                </div>
            </section>

            
            <section className='consumer-with-order-vs'>
                <h1>Consumer with Order Vs Consumer</h1>
                <div className='consumer-with-order-vs-body'>
                    <Progress
                    type="circle"
                    strokeColor={{
                    '0%': '#9f45db',
                    '100%': '#6308a0',
                    }}
                    strokeWidth={9}
                    // strokeLinecap='square'
                    percent={(dashboard?.consumer_with_order?.percentage?.toFixed(0))}
                    />
                    <p>{dashboard?.consumer_with_order?.description}</p>
                </div>
            </section>




        </main>
    )
}