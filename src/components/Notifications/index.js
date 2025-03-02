import './index.scss'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {fetchNotifications} from '../../states/notifications/actions'

import List from 'antd/lib/list'
import Avatar from 'antd/lib/avatar'
import { useNavigate } from 'react-router-dom'

export default function Notifications(){

  const navigate = useNavigate()

    const dispatch = useDispatch()
    useEffect(() => {dispatch(fetchNotifications())},[dispatch])
    const {isLoading, data: notifications} = useSelector(state => state.notifications)
    
    return (
        <main className="notifications">
            <h1 className='title'>Notifications</h1>
            <List
            loading={isLoading}
    itemLayout="horizontal"
    dataSource={notifications}
    renderItem={notification => (
      <List.Item onClick={() => navigate(`/orders/${notification?.physical_number}`)}>
        <List.Item.Meta
          avatar={<div className='ordered-product-avatars-container'>
              {notification?.orders?.order_items_get_images?.slice(0,4)?.map(row => ( <Avatar shape='square' key={row.id} src={process.env.REACT_APP_API_PRODUCT_COLOR_PHOTO + row?.color_image?.photo} />))}
          </div>}
          title={<a href="https://ant.design">{notification.title}</a>}
          description={notification.content}
        />
      </List.Item>
    )}
  />
        </main>
    )
}