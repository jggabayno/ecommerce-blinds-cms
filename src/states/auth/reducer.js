import {LOGIN_LOADING, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT} from './types'

const initialState =  sessionStorage.getItem('USER') ?
    {
        isLoggingIn: false,
        isLoggedIn: true,
        isLoginRejected: false,
        loggedData: {
            user: JSON.parse(sessionStorage.getItem('USER')),
            token: sessionStorage.getItem('SESSION')
        }
    }
    : {
        isLoggingIn: false,
        isLoggedIn: false,
        isLoginRejected: false,
        loggedData: {}
    };

export default function authReducer(state = initialState, action){
   switch(action.type) {
        case LOGIN_LOADING:
            return {...state, isLoggingIn: true, isLoggedIn: false, isLoginRejected: false};
        case LOGIN_FAILURE:
            return {...state, isLoggingIn: false, isLoggedIn: false, isLoginRejected: true};
        case LOGIN_SUCCESS:
            return {...state, isLoggingIn: false, isLoggedIn: true, loggedData: action.payload};
        case LOGOUT:
            return {...state, isLoggingIn: false, isLoggedIn: false, loggedData: {} };
        default:
            return state;
   }
}

 