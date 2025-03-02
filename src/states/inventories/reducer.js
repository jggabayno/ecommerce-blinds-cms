import { 
    GET_INVENTORY_INFO_LOADING, GET_INVENTORY_INFO_SUCCESS, GET_INVENTORY_INFO_FAILURE,
    ADD_INVENTORY_INFO_LOADING, ADD_INVENTORY_INFO_SUCCESS, ADD_INVENTORY_INFO_FAILURE
 } from './types'

const initialState = {
    hasError: false,
    isLoading: false,
    data: []
}

export default function submissionsReducer(state = initialState, action) {
   switch(action.type) {
        case GET_INVENTORY_INFO_LOADING:
            return {...state, isLoading: true, hasError: false};
        case GET_INVENTORY_INFO_FAILURE:
            return {...state, isLoading: false, hasError: true};
        case GET_INVENTORY_INFO_SUCCESS:
        return {...state, data: action.payload, isLoading: false, hasError: false};
        case ADD_INVENTORY_INFO_LOADING:
            return {...state, isLoading: true, hasError: false};
        case ADD_INVENTORY_INFO_FAILURE:
            return {...state, isLoading: false, hasError: true};
        case ADD_INVENTORY_INFO_SUCCESS:
                return {...state, data: action.payload, isLoading: false, hasError: false};
        default:
            return state;
   }
}