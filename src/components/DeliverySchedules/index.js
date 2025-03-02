import {useEffect} from 'react'
import {useSelector, useDispatch } from 'react-redux';
import {getOrders} from '../../states/orders/actions'

import Calendar from 'antd/lib/calendar'
import moment from 'moment';
import {Link} from 'react-router-dom'

export default function DeliverySchedules() {
 
  const dispatch = useDispatch()
  const {isLoading, data: orders} = useSelector((state) => state.orders)
  useEffect(() => {dispatch(getOrders())}, [dispatch])
  

  const ordersWithDeliveryDate = orders.filter(order => order.delivery_date)

  // CALENDAR DEFAULT CONFIGURATIONS

  function getDateData(value, data) {
 
     const matched = (row, value) => moment(row.delivery_date).format('MM/DD/YYYY').includes(moment(value).format('MM/DD/YYYY'))

     const hasOrderDeliveryDate = data.some(row => matched(row, value))
     const filteredOrder = data.filter(row => matched(row, value))
 
     if (hasOrderDeliveryDate) return filteredOrder
     return []
  }
  
  function dateCellRender(value) {
 
    const deliveryOrdersByDate = getDateData(value, ordersWithDeliveryDate);

    return (
      <ul className="events">
        {deliveryOrdersByDate.map(order => (
            <li key={order.id}>
            <Link to={`/orders/${order.order_no}`}>{order.order_no}</Link>
          </li>
        ))}
      </ul>
    );
  }
  
  function getMonthData(value, data) {
 
    const matched = (row, value) => moment(row.delivery_date).format('MM').includes(moment(value).format('MM'))

    const hasOrderDeliveryDate = data.some(row => matched(row, value))
    const filteredOrder = data.filter(row => matched(row, value))

    if (hasOrderDeliveryDate) {
      return filteredOrder
    }

  }
  
  function monthCellRender(value) {

    const deliveryOrdersByMonth = getMonthData(value, ordersWithDeliveryDate);
 
    return deliveryOrdersByMonth ? (
      <div className="notes-month">
        <section>
          {deliveryOrdersByMonth.map(order => {
            
            return(
              <li key={order.id}>
              <Link to={`/orders/${order.order_no}`}>{order.order_no}</Link>
            </li>
            )
          })}
        </section>
      </div>
    ) : null;
  }

  // END CALENDAR ...
  
  return (
    <main className='delivery-schedules'>
        <h1 className='title'>Delivery Schedules</h1>
        <Calendar dateCellRender={dateCellRender} monthCellRender={monthCellRender} />
    </main>
  )
}