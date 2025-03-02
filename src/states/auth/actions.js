import makeRequest from '../../services/request'
import { LOGIN_LOADING, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT} from './types'

const loginAndGetInfo = async (credentials) => {
    const response = await makeRequest(process.env.REACT_APP_API_URL).login('login/', {...credentials, user_type_id: 12})
    return await response.data   
}

export const login = (credentials, navigate, message) => {
    return async dispatch => {
        dispatch(loginLoading());
        try {
            const loginInfo = await loginAndGetInfo(credentials)
            dispatch(loginSuccess(loginInfo))
            sessionStorage.setItem('SESSION', loginInfo.token)
            sessionStorage.setItem('USER', JSON.stringify(loginInfo.user))
            message.success('You have successfully logged in')
            navigate('/')
        } catch{
            dispatch(loginFailure());
        }
    }
}

export const logout = (navigate) => {
    sessionStorage.removeItem('SESSION')
    sessionStorage.removeItem('USER')
    navigate('/')
    return ({type: LOGOUT})
}

export const loginLoading = () => ({type: LOGIN_LOADING})
export const loginSuccess = (payload) => ({ type: LOGIN_SUCCESS, payload})
export const loginFailure = () => ({type: LOGIN_FAILURE})