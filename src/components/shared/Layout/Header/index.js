import {useEffect} from 'react'
import {Link} from "react-router-dom"
import {useDispatch, useSelector} from 'react-redux'
import Dropdown from 'antd/lib/dropdown'
import Menu from 'antd/lib/menu'
import Badge from 'antd/lib/badge'
import './index.scss'
import { logout } from '../../../../states/auth/actions'
import { fetchNotifications, updateNotification } from '../../../../states/notifications/actions'
import { fetchProfile } from '../../../../states/profile/actions'

import { useNavigate } from "react-router-dom"
import { BiChevronDown } from "react-icons/bi";
import { IoIosNotificationsOutline } from "react-icons/io";
import { CgMenuRight } from "react-icons/cg";
import moment from 'moment';
import Avatar from 'antd/lib/avatar'

function UserDropdown(props){
  const {navigate, onLogout, name} = props

  return (
    <Dropdown
            overlay={(
              <Menu>
                <Menu.Item key='profile' onClick={() => navigate('/account/profile')}>My Account</Menu.Item>
                <Menu.Item key='logout' onClick={onLogout}>Logout</Menu.Item>
            </Menu>
            )}
            trigger={['click']}
          >
          <span onClick={e => e.preventDefault()} className='user-x-downicon'>
            <span>{name}</span>
            <BiChevronDown/>
          </span>
        </Dropdown>
  )
}

export default function Header({auth, screens}) {

    const dispatch = useDispatch()
    const navigate = useNavigate()
 
    const name = auth.isLoggedIn && (`${auth.loggedData?.user?.first_name} ${auth.loggedData?.user?.last_name}`)

    const onLogout = async() => dispatch(logout(navigate))

    const {isLoading, data: notifications} = useSelector(state => state.notifications)

    useEffect(() => {if(auth.isLoggedIn) dispatch(fetchNotifications())}, [dispatch, auth.isLoggedIn])
    
    const notificationsCount = notifications.length ? (auth.isLoggedIn ? notifications.filter(notification => notification.is_read === 0 && notification.is_seen === 0
      ).length : '') : ''

    function onReadNotification(notification){
      dispatch(updateNotification({id: notification.id, is_seen: true,is_read: true}))
      navigate(`/orders/${notification?.physical_number}`)
    }

    const profile = useSelector(state => state.profile)
    useEffect(() => {auth.isLoggedIn && dispatch(fetchProfile())},[dispatch, auth.isLoggedIn])
  

    return (
      <header>
        <Link to='/' className='logo'></Link>
        {!screens.xs && <nav>
            <Badge className="notif-badge" count={notificationsCount}>
          <Dropdown
          overlay={(
            <Menu>
              {notifications.sort((a,c) => a.created_at - c.created_at).slice(0,3).map(notification => (
                  <Menu.Item
                  key={notification.physical_number} 
                  style={notification.is_read ? {} : {background: '#f1f1f1'}}
                  onClick={() => onReadNotification(notification)}
                  className='header-menu-item-notif'
                  >
                    <div className='header-menu-item-notif-container'>
                      <h4>{notification?.title}</h4>
                      <p>{notification?.content}</p>
                      <span>{moment(notification?.created_at).fromNow()}</span>
                    </div>
                  </Menu.Item>
              ))}
              <Menu.Item key='all' onClick={() => navigate('/notifications')}>View All</Menu.Item>
          </Menu>
          )}
          // trigger={['click']}
        >
        <IoIosNotificationsOutline/>
      </Dropdown>
            </Badge>
      
            {auth.isLoggedIn && 
        <span className="user"><Avatar size={30} src={
          profile?.data?.photo ? 
          process.env.REACT_APP_API_USER_PHOTO + profile?.data?.photo : `https://ui-avatars.com/api/?name=${profile?.data?.user_name ? profile?.data?.user_name : profile?.data?.first_name}`
          } />
                   <UserDropdown navigate={navigate} onLogout={onLogout} name={profile?.data?.user_name ? profile?.data?.user_name : profile?.data?.first_name }/></span>
        } 
          
        </nav>}
        {screens.xs && <CgMenuRight className="menu"/>}
      </header> 
    )
}