import { 
    GET_BRAND_INFO_LOADING, GET_BRAND_INFO_SUCCESS, GET_BRAND_INFO_FAILURE,
    ADD_BRAND_INFO_LOADING, ADD_BRAND_INFO_SUCCESS, ADD_BRAND_INFO_FAILURE,
    UPDATE_BRAND_INFO_LOADING, UPDATE_BRAND_INFO_SUCCESS, UPDATE_BRAND_INFO_FAILURE,
    DELETE_BRAND_INFO_LOADING, DELETE_BRAND_INFO_SUCCESS, DELETE_BRAND_INFO_FAILURE
 } from './types'

const initialState = {
    hasError: false,
    isLoading: false,
    data: []
}

export default function submissionsReducer(state = initialState, action) {
   switch(action.type) {
        case GET_BRAND_INFO_LOADING:
            return {...state, isLoading: true, hasError: false};
        case GET_BRAND_INFO_FAILURE:
            return {...state, isLoading: false, hasError: true};
        case GET_BRAND_INFO_SUCCESS:
        return {...state, data: action.payload, isLoading: false, hasError: false};
        case ADD_BRAND_INFO_LOADING:
            return {...state, isLoading: true, hasError: false};
        case ADD_BRAND_INFO_FAILURE:
            return {...state, isLoading: false, hasError: true};
        case ADD_BRAND_INFO_SUCCESS:
                return {...state, data: [action.payload, ...state.data], isLoading: false, hasError: false};
        case UPDATE_BRAND_INFO_LOADING:
            return {...state, isLoading: true, hasError: false};
        case UPDATE_BRAND_INFO_FAILURE:
            return {...state, isLoading: false, hasError: true};
        case UPDATE_BRAND_INFO_SUCCESS:
            return {...state, data: [action.payload, ...state.data.filter((brand) => brand.id !== action.payload.id)], isLoading: false, hasError: false};     
        case DELETE_BRAND_INFO_LOADING:
            return {...state, isLoading: true, hasError: false};
        case DELETE_BRAND_INFO_FAILURE:
            return {...state, isLoading: false, hasError: true};
        case DELETE_BRAND_INFO_SUCCESS:
            return {...state, data: state.data.filter((brand) => brand.id !== action.payload), isLoading: false, hasError: false};
        default:
            return state;
   }
}