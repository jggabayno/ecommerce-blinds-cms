import {useEffect} from 'react'
import {useSelector, useDispatch } from 'react-redux';

import './index.scss'
import Menu from '../../Menu'
import {getOrders} from '../../../../states/orders/actions'
import moment from 'moment';

export default function Sider({routes, auth}){
  
  const dispatch = useDispatch()
  const {data: orders} = useSelector((state) => state.orders)
  useEffect(() => {dispatch(getOrders())}, [dispatch])
 
  const deliveryScheduleCount = orders
  .filter(date => moment(date.delivery_date).format('MM/DD/YYYY') === moment().format('MM/DD/YYYY'))
  .filter(order => ![5,6,7].includes(order.order_status_id))?.length
 
  return (
    <aside>
      <Menu routes={routes} auth={auth} deliveryScheduleCount={deliveryScheduleCount}/>
    </aside>
  )
}