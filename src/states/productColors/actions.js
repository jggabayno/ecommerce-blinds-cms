import { 
    GET_PRODUCT_COLORS_INFO_LOADING, GET_PRODUCT_COLORS_INFO_SUCCESS, GET_PRODUCT_COLORS_INFO_FAILURE,
    ADD_PRODUCT_COLOR_INFO_LOADING, ADD_PRODUCT_COLOR_INFO_SUCCESS, ADD_PRODUCT_COLOR_INFO_FAILURE,
    UPDATE_PRODUCT_COLOR_INFO_LOADING, UPDATE_PRODUCT_COLOR_INFO_SUCCESS, UPDATE_PRODUCT_COLOR_INFO_FAILURE,
    DELETE_PRODUCT_COLOR_INFO_LOADING, DELETE_PRODUCT_COLOR_INFO_SUCCESS, DELETE_PRODUCT_COLOR_INFO_FAILURE
 } from './types'

 
// GET



const getProductColorsInfoWithDateFilter = async(dateFrom = '', dateTo = '') => {

    const params = `?start_date=${dateFrom}&end_date=${dateTo}`

    const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).get(`productColorsWithDateFilter${params}`)
    return await response.data
}

export const fetchProductColorsWithDateFilter = ({dateFrom, dateTo})  => {
    return async dispatch => {
            dispatch(fetchProductColorsInfoLoading());
        try {
            const pc = await getProductColorsInfoWithDateFilter(dateFrom, dateTo);
            dispatch(fetchProductColorsInfoSuccess(pc));
        } catch{
            dispatch(fetchProductColorsInfoFailure());
        }
    }
}


const getProductColorsInfo = async() => {
    const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).get('product/colors')
    return await response.data
}

export const fetchProductColors = ()  => {
    return async dispatch => {
            dispatch(fetchProductColorsInfoLoading());
        try {
            const product = await getProductColorsInfo();
            dispatch(fetchProductColorsInfoSuccess(product));
        } catch{
            dispatch(fetchProductColorsInfoFailure());
        }
    }
}

export const fetchProductColorsInfoLoading = () => ({type: GET_PRODUCT_COLORS_INFO_LOADING})
export const fetchProductColorsInfoSuccess = (payload) => ({type: GET_PRODUCT_COLORS_INFO_SUCCESS, payload })
export const fetchProductColorsInfoFailure = () => ({type: GET_PRODUCT_COLORS_INFO_FAILURE})



// CREATE
export const addProductColor = (productColor, { message, form, setConfig }) => {
    return async dispatch => {
        dispatch(addProductColorInfoLoading());

        try {
            
            const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).post('product/colors', productColor)
            const data = await response.data
            
            Promise.all([
                dispatch(addProductColorInfoSuccess(data)),
                message.success(`${data.name} Product Color created successfully!`),
                form.resetFields(),
                setConfig([false, null, null])
            ])

        } catch (error) {

            dispatch(addProductColorInfoFailure());

        }
    }
}

export const addProductColorInfoLoading = () => ({type: ADD_PRODUCT_COLOR_INFO_LOADING})
export const addProductColorInfoSuccess = (payload) => ({type: ADD_PRODUCT_COLOR_INFO_SUCCESS, payload})
export const addProductColorInfoFailure = () => ({type: ADD_PRODUCT_COLOR_INFO_FAILURE})

// UPDATE
export const updateProductColor = (productColor, { message, form, setConfig }) => {
    return async dispatch => {
        dispatch(updateProductInfoLoading());
        try {
            const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).update(`product/colors/${productColor.id}`, productColor)
            const data = await response.data

            Promise.all([
                dispatch(updateProductInfoSuccess(data)),
                message.info(`Product Color ${productColor.name} updated successfully!`),
                form.resetFields(),
                setConfig([false, null, null])
            ])

        } catch (error) {
            
            dispatch(updateProductInfoFailure());

        }
    }
}

export const updateProductInfoLoading = () => ({type: UPDATE_PRODUCT_COLOR_INFO_LOADING})
export const updateProductInfoSuccess = (payload) => ({type: UPDATE_PRODUCT_COLOR_INFO_SUCCESS, payload})
export const updateProductInfoFailure = () => ({type: UPDATE_PRODUCT_COLOR_INFO_FAILURE})

// DELETE
export const deleteProductColor = (productColor,{ message, form, setConfig })  => {
    return async dispatch => {
        dispatch(deleteProductColorInfoLoading());
        try {
            
            await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).drop(`product/colors/${productColor.id}`)
 
            Promise.all([
                dispatch(deleteProductColorInfoSuccess(productColor.id)),
                message.warning(`Product ${productColor.name} deleted successfully!`),
                form.resetFields(),
                setConfig([false, null, null])
            ])
            

        } catch (error) {
            dispatch(deleteProductColorInfoFailure());
        }
    }
}

export const deleteProductColorInfoLoading = () => ({type: DELETE_PRODUCT_COLOR_INFO_LOADING})
export const deleteProductColorInfoSuccess = (payload) => ({type: DELETE_PRODUCT_COLOR_INFO_SUCCESS, payload})
export const deleteProductColorInfoFailure = () => ({type: DELETE_PRODUCT_COLOR_INFO_FAILURE})