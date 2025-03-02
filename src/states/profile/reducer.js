import { GET_PROFILE_INFO_LOADING, GET_PROFILE_INFO_SUCCESS, GET_PROFILE_INFO_FAILURE,
    UPDATE_PROFILE_INFO_LOADING, UPDATE_PROFILE_INFO_SUCCESS, UPDATE_PROFILE_INFO_FAILURE,

} from './types'

const initialState = {
    hasError: false,
    isLoading: false,
    data: {}
}

export default function submissionsReducer(state = initialState, action) {
   switch(action.type) {
        case GET_PROFILE_INFO_LOADING:
            return {...state, isLoading: true, hasError: false};
        case GET_PROFILE_INFO_FAILURE:
            return {...state, isLoading: false, hasError: true};
        case GET_PROFILE_INFO_SUCCESS:
            return {...state,data: action.payload, isLoading: false, hasError: false};
        case UPDATE_PROFILE_INFO_LOADING:
            return {...state, isLoading: true, hasError: false};
        case UPDATE_PROFILE_INFO_FAILURE:
            return {...state, isLoading: false, hasError: true};
        case UPDATE_PROFILE_INFO_SUCCESS:
            return {...state, data: [action.payload, ...state.data.filter((profile) => profile.id !== action.payload.id)], isLoading: false, hasError: false};
        default:
            return state;
   }
}