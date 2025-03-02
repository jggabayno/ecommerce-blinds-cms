import { GET_PAYMENTS_INFO_LOADING, GET_PAYMENTS_INFO_SUCCESS, GET_PAYMENTS_INFO_FAILURE } from './types'

const initialState = {
    hasError: false,
    isLoading: false,
    data: []
}

export default function submissionsReducer(state = initialState, action) {
   switch(action.type) {
        case GET_PAYMENTS_INFO_LOADING:
            return {...state, isLoading: true, hasError: false};
        case GET_PAYMENTS_INFO_FAILURE:
            return {...state, isLoading: false, hasError: true};
        case GET_PAYMENTS_INFO_SUCCESS:
            return {...state, data: action.payload, isLoading: false, hasError: false};
        default:
            return state;
   }
}