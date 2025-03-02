import { GET_PROFILE_INFO_LOADING, GET_PROFILE_INFO_SUCCESS, GET_PROFILE_INFO_FAILURE,
    UPDATE_PROFILE_INFO_LOADING, UPDATE_PROFILE_INFO_SUCCESS, UPDATE_PROFILE_INFO_FAILURE,
} from './types'

const getProfileInfo = async() => {
    const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).get('profile')
    return await response.data
}

export const fetchProfile = ()  => {
    return async dispatch => {
            dispatch(fetchProfileInfoLoading());
        try {
            const profile = await getProfileInfo();
            dispatch(fetchProfileInfoSuccess(profile));
        } catch{
            dispatch(fetchProfileInfoFailure());
        }
    }
}

export const fetchProfileInfoLoading = () => ({type: GET_PROFILE_INFO_LOADING})
export const fetchProfileInfoSuccess = (payload) => ({type: GET_PROFILE_INFO_SUCCESS, payload})
export const fetchProfileInfoFailure = () => ({type: GET_PROFILE_INFO_FAILURE})


// UPDATE
export const updateProfile = (user, message) => {
    return async dispatch => {
        dispatch(updateProfileInfoLoading());
         try {
            const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).update(`profile/${user.id}`, user)
            const data = await response.data
            
            if (data) {
                message.info(`Profile updated successfully!`)
                dispatch(updateProfileInfoSuccess(data))
            }
            
        } catch (error) {
            
            dispatch(updateProfileInfoFailure());

        }
    }
}

export const updateProfileInfoLoading = () => ({type: UPDATE_PROFILE_INFO_LOADING})
export const updateProfileInfoSuccess = (payload) => ({type: UPDATE_PROFILE_INFO_SUCCESS, payload})
export const updateProfileInfoFailure = () => ({type: UPDATE_PROFILE_INFO_FAILURE})
