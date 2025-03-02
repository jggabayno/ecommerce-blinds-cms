import {GET_CART_INFO_LOADING, GET_CART_INFO_SUCCESS, GET_CART_INFO_FAILURE} from './types'
 
const getCartInfo = async() => {
    const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).get('cart')
    return await response.data
}

export const fetchCart = ()  => {
    return async dispatch => {
            dispatch(fetchCartInfoLoading());
        try {
            const cart = await getCartInfo();
            dispatch(fetchCartInfoSuccess(cart));
        } catch{
            dispatch(fetchCartInfoFailure());
        }
    }
}

export const fetchCartInfoLoading = () => ({type: GET_CART_INFO_LOADING})
export const fetchCartInfoSuccess = (payload) => ({type: GET_CART_INFO_SUCCESS, payload})
export const fetchCartInfoFailure = () => ({type: GET_CART_INFO_FAILURE})