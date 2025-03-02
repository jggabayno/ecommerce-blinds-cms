import { GET_PAYMENTS_INFO_LOADING, GET_PAYMENTS_INFO_SUCCESS, GET_PAYMENTS_INFO_FAILURE } from './types'
 



const getPaymentInfoWithDateFilter = async(dateFrom = '', dateTo = '') => {

    const params = `?start_date=${dateFrom}&end_date=${dateTo}`

    const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).get(`paymentsWithDateFilter${params}`)
    return await response.data
}

export const fetchPaymentsWithDateFilter = ({dateFrom, dateTo})  => {
    return async dispatch => {
            dispatch(fetchPaymentsInfoLoading());
        try {
            const brand = await getPaymentInfoWithDateFilter(dateFrom, dateTo);
            dispatch(fetchPaymentsInfoSuccess(brand));
        } catch{
            dispatch(fetchPaymentsInfoFailure());
        }
    }
}

const getPaymentsInfo = async() => {
    const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).get('payments')
    return await response.data
}

export const fetchPayments = ()  => {
    return async dispatch => {
            dispatch(fetchPaymentsInfoLoading());
        try {
            const product = await getPaymentsInfo();
            dispatch(fetchPaymentsInfoSuccess(product));
        } catch{
            dispatch(fetchPaymentsInfoFailure());
        }
    }
}

export const fetchPaymentsInfoLoading = () => ({type: GET_PAYMENTS_INFO_LOADING})
export const fetchPaymentsInfoSuccess = (payload) => ({type: GET_PAYMENTS_INFO_SUCCESS, payload })
export const fetchPaymentsInfoFailure = () => ({type: GET_PAYMENTS_INFO_FAILURE})