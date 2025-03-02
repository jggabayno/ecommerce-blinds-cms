import { 
    GET_NOTIFICATIONS_INFO_LOADING, GET_NOTIFICATIONS_INFO_SUCCESS, GET_NOTIFICATIONS_INFO_FAILURE,
    UPDATE_NOTIFICATION_INFO_LOADING, UPDATE_NOTIFICATION_INFO_SUCCESS, UPDATE_NOTIFICATION_INFO_FAILURE,
    // DELETE_BRAND_INFO_LOADING, DELETE_BRAND_INFO_SUCCESS, DELETE_BRAND_INFO_FAILURE
 } from './types'

const getNotificationsInfo = async() => {
    const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).get('notifications')
    return await response.data
}

export const fetchNotifications = ()  => {
    return async dispatch => {
            dispatch(fetchNotificationsInfoLoading());
        try {
            const notifications = await getNotificationsInfo();
            dispatch(fetchNotificationsInfoSuccess(notifications));
        } catch{
            dispatch(fetchNotificationsInfoFailure());
        }
    }
}

export const fetchNotificationsInfoLoading = () => ({type: GET_NOTIFICATIONS_INFO_LOADING})
export const fetchNotificationsInfoSuccess = (payload) => ({type: GET_NOTIFICATIONS_INFO_SUCCESS, payload })
export const fetchNotificationsInfoFailure = () => ({type: GET_NOTIFICATIONS_INFO_FAILURE})

// UPDATE
export const updateNotification = (notification) => {
    return async dispatch => {
        dispatch(updateNotificationInfoLoading());
         try {
            const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).update(`notifications/${notification.id}`, notification)
            const data = await response.data
            dispatch(updateNotificationInfoSuccess(data))
        } catch (error) {
            
            dispatch(updateNotificationInfoFailure());

        }
    }
}

export const updateNotificationInfoLoading = () => ({type: UPDATE_NOTIFICATION_INFO_LOADING})
export const updateNotificationInfoSuccess = (payload) => ({type: UPDATE_NOTIFICATION_INFO_SUCCESS, payload})
export const updateNotificationInfoFailure = () => ({type: UPDATE_NOTIFICATION_INFO_FAILURE})

// // DELETE
// export const deleteBrand = (brand,{ message, form, setConfig })  => {
//     return async dispatch => {
//         dispatch(deleteBrandInfoLoading());
//         try {
            
//             await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).drop(`brands/${brand.id}`)
 
//             Promise.all([
//                 dispatch(deleteBrandInfoSuccess(brand.id)),
//                 message.warning(`Brand ${brand.name} deleted successfully!`),
//                 form.resetFields(),
//                 setConfig([false, null, null])
//             ])
            

//         } catch (error) {
//             dispatch(deleteBrandInfoFailure());
//         }
//     }
// }

// export const deleteBrandInfoLoading = () => ({type: DELETE_BRAND_INFO_LOADING})
// export const deleteBrandInfoSuccess = (payload) => ({type: DELETE_BRAND_INFO_SUCCESS, payload})
// export const deleteBrandInfoFailure = () => ({type: DELETE_BRAND_INFO_FAILURE})