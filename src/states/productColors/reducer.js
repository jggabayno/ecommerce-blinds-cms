import { 
    GET_PRODUCT_COLORS_INFO_LOADING, GET_PRODUCT_COLORS_INFO_SUCCESS, GET_PRODUCT_COLORS_INFO_FAILURE,
    ADD_PRODUCT_COLOR_INFO_LOADING, ADD_PRODUCT_COLOR_INFO_SUCCESS, ADD_PRODUCT_COLOR_INFO_FAILURE,
    UPDATE_PRODUCT_COLOR_INFO_LOADING, UPDATE_PRODUCT_COLOR_INFO_SUCCESS, UPDATE_PRODUCT_COLOR_INFO_FAILURE,
    DELETE_PRODUCT_COLOR_INFO_LOADING, DELETE_PRODUCT_COLOR_INFO_SUCCESS, DELETE_PRODUCT_COLOR_INFO_FAILURE
 } from './types'

const initialState = {
    hasError: false,
    isLoading: false,
    data: []
}

export default function submissionsReducer(state = initialState, action) {
   switch(action.type) {
        case GET_PRODUCT_COLORS_INFO_LOADING:
            return {...state, isLoading: true, hasError: false};
        case GET_PRODUCT_COLORS_INFO_FAILURE:
            return {...state, isLoading: false, hasError: true};
        case GET_PRODUCT_COLORS_INFO_SUCCESS:
        return {...state, data: action.payload, isLoading: false, hasError: false};
        case ADD_PRODUCT_COLOR_INFO_LOADING:
            return {...state, isLoading: true, hasError: false};
        case ADD_PRODUCT_COLOR_INFO_FAILURE:
            return {...state, isLoading: false, hasError: true};
        case ADD_PRODUCT_COLOR_INFO_SUCCESS:
                return {...state, data: [action.payload, ...state.data], isLoading: false, hasError: false};
        case UPDATE_PRODUCT_COLOR_INFO_LOADING:
            return {...state, isLoading: true, hasError: false};
        case UPDATE_PRODUCT_COLOR_INFO_FAILURE:
            return {...state, isLoading: false, hasError: true};
        case UPDATE_PRODUCT_COLOR_INFO_SUCCESS:
            return {...state, data: [action.payload, ...state.data.filter((productColor) => productColor.id !== action.payload.id)], isLoading: false, hasError: false};     
        case DELETE_PRODUCT_COLOR_INFO_LOADING:
            return {...state, isLoading: true, hasError: false};
        case DELETE_PRODUCT_COLOR_INFO_FAILURE:
            return {...state, isLoading: false, hasError: true};
        case DELETE_PRODUCT_COLOR_INFO_SUCCESS:
            return {...state, data: state.data.filter((productColor) => productColor.id !== action.payload), isLoading: false, hasError: false};
        default:
            return state;
   }
}