import { useNavigate} from 'react-router-dom'
import Menu from 'antd/lib/menu'
import Badge from 'antd/lib/badge'

import { ScheduleOutlined, BlockOutlined, BgColorsOutlined, AppstoreOutlined,
BuildOutlined, DashboardOutlined, ShoppingOutlined, BarsOutlined, ProjectOutlined,
MoneyCollectOutlined, UserOutlined } from '@ant-design/icons';

export default function CMenu(props) {

    const isAdmin = props.auth?.loggedData?.user?.user_type_id === 1
 
    const navigate = useNavigate()
    const selectKey = (e) => navigate(e.key)

    return (
        <Menu mode='inline' defaultSelectedKeys={['/']} onSelect={selectKey}>
        <Menu.Item key="/" icon={<DashboardOutlined/>}>
            Dashboard
        </Menu.Item>
        {isAdmin && 
        <Menu.SubMenu key="products-scope" icon={<ShoppingOutlined/>} title="Products">
            <Menu.Item key="/brands" icon={<BlockOutlined/>}>Brands</Menu.Item>
            <Menu.Item key="/products"  icon={<BarsOutlined/>}>Product List</Menu.Item>
            <Menu.Item key="/inventory"  icon={<BarsOutlined/>}>Inventory</Menu.Item>
            <Menu.SubMenu key="variants" icon={<ShoppingOutlined/>} title="Variants">
                <Menu.Item key="/sizes" icon={<BuildOutlined/>}>Sizes</Menu.Item>
                <Menu.Item key="/colors"  icon={<BarsOutlined/>}>Colors</Menu.Item>
            </Menu.SubMenu>
        </Menu.SubMenu>}
        <Menu.Item key="/orders" icon={<AppstoreOutlined/>}>
            Orders
        </Menu.Item>
        <Menu.Item key="/payments" icon={<MoneyCollectOutlined/>}>
            Payments
        </Menu.Item>
        <Menu.Item key="/accounts-receivable" icon={<MoneyCollectOutlined/>}>
            Accounts Receivable
        </Menu.Item>
        <Menu.Item key="/delivery-schedules" icon={
            props.deliveryScheduleCount ? <Badge size='small' count={props.deliveryScheduleCount}><ScheduleOutlined/></Badge> : <ScheduleOutlined/>
        }>
            Delivery Schedules
        </Menu.Item>
        {isAdmin && 
        <Menu.Item key="/users" icon={<UserOutlined/>}>
            Users
        </Menu.Item>}
        </Menu>
    )
}
