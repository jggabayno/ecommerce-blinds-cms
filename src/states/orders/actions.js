import { GET_ORDERS_INFO_LOADING, GET_ORDERS_INFO_SUCCESS, GET_ORDERS_INFO_FAILURE,
    UPDATE_ORDER_INFO_LOADING, UPDATE_ORDER_INFO_SUCCESS, UPDATE_ORDER_INFO_FAILURE
} from './types'


const getOrdersInfoWithDateFilter = async(dateFrom = '', dateTo = '') => {

    const params = `?start_date=${dateFrom}&end_date=${dateTo}`

    const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).get(`ordersWithDateFilter${params}`)
    return await response.data
}

export const fetchOrdersWithDateFilter = ({dateFrom, dateTo})  => {
    return async dispatch => {
            dispatch(fetchOrdersInfoLoading());
        try {
            const order = await getOrdersInfoWithDateFilter(dateFrom, dateTo);
            dispatch(fetchOrdersInfoSuccess(order));
        } catch{
            dispatch(fetchOrdersInfoFailure());
        }
    }
}

const getOrdersInfo = async() => {
    const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).get('orders')
    return await response.data
}

export const getOrders = ()  => {
    return async dispatch => {
            dispatch(fetchOrdersInfoLoading());
        try {
            const order = await getOrdersInfo();
            dispatch(fetchOrdersInfoSuccess(order));
           
        } catch{
            dispatch(fetchOrdersInfoFailure());
        }
    }
}

export const fetchOrdersInfoLoading = () => ({type: GET_ORDERS_INFO_LOADING})
export const fetchOrdersInfoSuccess = (payload) => ({type: GET_ORDERS_INFO_SUCCESS, payload})
export const fetchOrdersInfoFailure = () => ({type: GET_ORDERS_INFO_FAILURE})


// UPDATE
export const updateOrder = (order) => {

    return async dispatch => {
        dispatch(updateOrderInfoLoading());
         try {
            const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).update(`orders/${order.id}`, order)
            const data = await response.data
            dispatch(getOrders())
            dispatch(updateOrderInfoSuccess(data))

        } catch (error) {
            
            dispatch(updateOrderInfoFailure());

        }
    }
}

export const updateOrderInfoLoading = () => ({type: UPDATE_ORDER_INFO_LOADING})
export const updateOrderInfoSuccess = (payload) => ({type: UPDATE_ORDER_INFO_SUCCESS, payload})
export const updateOrderInfoFailure = () => ({type: UPDATE_ORDER_INFO_FAILURE})
