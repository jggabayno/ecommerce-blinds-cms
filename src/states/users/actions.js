import { 
    GET_USERS_INFO_LOADING, GET_USERS_INFO_SUCCESS, GET_USERS_INFO_FAILURE,
    ADD_USER_INFO_LOADING, ADD_USER_INFO_SUCCESS, ADD_USER_INFO_FAILURE,
    // UPDATE_USER_INFO_LOADING, UPDATE_USER_INFO_SUCCESS, UPDATE_USER_INFO_FAILURE,
    // DELETE_USER_INFO_LOADING, DELETE_USER_INFO_SUCCESS, DELETE_USER_INFO_FAILURE
 } from './types'

const getUserInfo = async(dateFrom = '', dateTo = '') => {

    const params = `?start_date=${dateFrom}&end_date=${dateTo}`

    const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).get(`users${params}`)
    return await response.data
}

export const fetchUsersWithDateFilter = ({dateFrom, dateTo})  => {
    return async dispatch => {
            dispatch(fetchUserInfoLoading());
        try {
            const user = await getUserInfo(dateFrom, dateTo);
            dispatch(fetchUserInfoSuccess(user));
        } catch{
            dispatch(fetchUserInfoFailure());
        }
    }
}



export const fetchUserInfoLoading = () => ({type: GET_USERS_INFO_LOADING})
export const fetchUserInfoSuccess = (payload) => ({type: GET_USERS_INFO_SUCCESS, payload })
export const fetchUserInfoFailure = () => ({type: GET_USERS_INFO_FAILURE})

// CREATE
export const addUser = (user, { message, form, setConfig }) => {
    return async dispatch => {
        dispatch(addUserInfoLoading());

        try {
            
            const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).post('users', user)
            const data = await response.data
          
            Promise.all([
                dispatch(addUserInfoSuccess(data)),
                message.success(`${data.first_name} User created successfully!`),
                form.resetFields(),
                setConfig([false, null, null])
            ])

        } catch (error) {
            const message =  error.response.data.message
 
            if(message.includes('users_mobile_number_unique')){

                form.setFields([{ name: 'mobile_number', errors: ['Mobile number already exist.']}])
        
              }

              if(message.includes('users_email_unique')){

                form.setFields([{ name: 'email', errors: ['Email address is already exist.']}])
        
              }

            dispatch(addUserInfoFailure());

        }
    }
}

export const addUserInfoLoading = () => ({type: ADD_USER_INFO_LOADING})
export const addUserInfoSuccess = (payload) => ({type: ADD_USER_INFO_SUCCESS, payload})
export const addUserInfoFailure = () => ({type: ADD_USER_INFO_FAILURE})

// // UPDATE
// export const updateBrand = (brand, { message, form, setConfig }) => {
//     return async dispatch => {
//         dispatch(updateBrandInfoLoading());
//          try {
//             const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).update(`brands/${brand.id}`, brand)
//             const data = await response.data
//             Promise.all([
//                 dispatch(updateBrandInfoSuccess(data)),
//                 message.info(`Brand ${brand.name} updated successfully!`),
//                 form.resetFields(),
//                 setConfig([false, null, null])
//             ])

//         } catch (error) {
            
//             dispatch(updateBrandInfoFailure());

//         }
//     }
// }

// export const updateBrandInfoLoading = () => ({type: UPDATE_BRAND_INFO_LOADING})
// export const updateBrandInfoSuccess = (payload) => ({type: UPDATE_BRAND_INFO_SUCCESS, payload})
// export const updateBrandInfoFailure = () => ({type: UPDATE_BRAND_INFO_FAILURE})

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