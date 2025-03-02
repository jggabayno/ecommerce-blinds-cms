import Login from './components/Login'
import Dashboard from './components/Dashboard'
import Brands from './components/Brands'
import Products from './components/Products'

import ProductColors from './components/Colors'
import ProductSizes from './components/Sizes'
import Inventory from './components/Inventory'
import Orders from './components/Orders'
import DeliverySchedules from './components/DeliverySchedules'
import Notifications from './components/Notifications'
import AccountsReceivable from './components/AccountsReceivable'
import Payments from './components/Payments'
import Users from './components/Users'
import Profile from './components/Profile'
import NotFound from './components/NotFound'

export default function useRoutes({auth, pathname}) {

    const isStaff = auth?.loggedData?.user?.user_type_id === 2

    const notFoundRoute = { path: "*", element: <NotFound/> }

    const publicRoute = [
        { path: '/', element: <Login/>},
        notFoundRoute
    ]

    const privateAllRoutes = [
        {slug: 'Dashboard', path: ['/','/dashboard'].includes(pathname) && pathname, element: <Dashboard /> },
        {slug: 'Orders', path: '/orders', element: <Orders /> },
        {slug: 'Orders', path: '/orders/:order_no', element: <Orders /> },
        {slug: 'Delivery Schedules', path: '/delivery-schedules', element: <DeliverySchedules /> },
        {slug: 'Payments', path: '/payments', element: <Payments /> },
        {slug: 'Accounts Receivable', path: '/accounts-receivable', element: <AccountsReceivable /> },
        {slug: 'Notifications', path: '/notifications', element: <Notifications /> },
        {slug: 'Profile', path: '/account/profile', element: <Profile /> },
        notFoundRoute
    ]

    const adminRoutes = [
        {slug: 'Brands', path: '/brands', element: <Brands /> },
        {slug: 'Products', path: '/products', element: <Products /> },
        {slug: 'Product Colors', path: '/colors', element: <ProductColors /> },
        {slug: 'Inventory', path: '/inventory', element: <Inventory /> },
        {slug: 'ProductSizes', path: '/sizes', element: <ProductSizes /> },
        {slug: 'Users', path: '/users', element: <Users /> },
    ]

    const staffRoutes = []

    const routesWithPermission = isStaff ? staffRoutes : adminRoutes
    
    const routes = auth.isLoggedIn ? [...routesWithPermission, ...privateAllRoutes] : publicRoute

    return routes
}