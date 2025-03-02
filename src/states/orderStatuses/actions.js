import { GET_ORDER_STATUSES_INFO_LOADING, GET_ORDER_STATUSES_INFO_SUCCESS, GET_ORDER_STATUSES_INFO_FAILURE } from './types'
 

const getOrderStatusInfo = async() => {
    const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).get('orderstatus')
    return await response.data
}

export const fetchOrderStatuses = ()  => {
    return async dispatch => {
            dispatch(fetchOrderStatusesInfoLoading());
        try {
            const product = await getOrderStatusInfo();
            dispatch(fetchOrderStatusesInfoSuccess(product));
        } catch{
            dispatch(fetchOrderStatusesInfoFailure());
        }
    }
}

export const fetchOrderStatusesInfoLoading = () => ({type: GET_ORDER_STATUSES_INFO_LOADING})
export const fetchOrderStatusesInfoSuccess = (payload) => ({type: GET_ORDER_STATUSES_INFO_SUCCESS, payload })
export const fetchOrderStatusesInfoFailure = () => ({type: GET_ORDER_STATUSES_INFO_FAILURE})