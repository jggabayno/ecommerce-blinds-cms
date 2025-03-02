import { combineReducers } from 'redux'

import auth from './states/auth/reducer'
import profile from './states/profile/reducer'
import brands from './states/brands/reducer'
import productSizes from './states/productSizes/reducer'
import productColors from './states/productColors/reducer'
import inventories from './states/inventories/reducer'
import products from './states/products/reducer'
import orders from './states/orders/reducer'
import orderStatuses from './states/orderStatuses/reducer'
import notifications from './states/notifications/reducer'
import dashboard from './states/dashboard/reducer'
import payments from './states/payments/reducer'

import cart from './states/cart/reducer'
import users from './states/users/reducer'

const reducers = combineReducers({auth, profile, brands, productColors, cart,
    productSizes, inventories, products, orders, orderStatuses, notifications,
    dashboard, payments, users

})

export default reducers