import { 
    GET_PRODUCT_SIZE_INFO_LOADING, GET_PRODUCT_SIZE_INFO_SUCCESS, GET_PRODUCT_SIZE_INFO_FAILURE,
    ADD_PRODUCT_SIZE_INFO_LOADING, ADD_PRODUCT_SIZE_INFO_SUCCESS, ADD_PRODUCT_SIZE_INFO_FAILURE,
    UPDATE_PRODUCT_SIZE_INFO_LOADING, UPDATE_PRODUCT_SIZE_INFO_SUCCESS, UPDATE_PRODUCT_SIZE_INFO_FAILURE,
    DELETE_PRODUCT_SIZE_INFO_LOADING, DELETE_PRODUCT_SIZE_INFO_SUCCESS, DELETE_PRODUCT_SIZE_INFO_FAILURE
 } from './types'



 const getProductSizesInfoWithDateFilter = async(dateFrom = '', dateTo = '') => {

    const params = `?start_date=${dateFrom}&end_date=${dateTo}`

    const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).get(`productSizesWithDateFilter${params}`)
    return await response.data
}

export const fetchProductSizesWithDateFilter = ({dateFrom, dateTo})  => {
    return async dispatch => {
            dispatch(fetchProductSizeInfoLoading());
        try {
            const ps = await getProductSizesInfoWithDateFilter(dateFrom, dateTo);
            dispatch(fetchProductSizeInfoSuccess(ps));
        } catch{
            dispatch(fetchProductSizeInfoFailure());
        }
    }
}

const getProductSize = async() => {
    const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).get('product/sizes')
    return await response.data
}

export const fetchProductSizes = ()  => {
    return async dispatch => {
            dispatch(fetchProductSizeInfoLoading());
        try {
            const productSize = await getProductSize();
            dispatch(fetchProductSizeInfoSuccess(productSize));
        } catch{
            dispatch(fetchProductSizeInfoFailure());
        }
    }
}

export const fetchProductSizeInfoLoading = () => ({type: GET_PRODUCT_SIZE_INFO_LOADING})
export const fetchProductSizeInfoSuccess = (payload) => ({type: GET_PRODUCT_SIZE_INFO_SUCCESS, payload })
export const fetchProductSizeInfoFailure = () => ({type: GET_PRODUCT_SIZE_INFO_FAILURE})

// CREATE
export const addProductSize = (productSize, { message, form, setConfig }) => {
    return async dispatch => {
        dispatch(addProductSizeInfoLoading());

        try {
            
            const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).post('product/sizes', productSize)
            const data = await response.data
            
            Promise.all([
                dispatch(addProductSizeInfoSuccess(data)),
                message.success(`${data.name} size created successfully!`),
                form.resetFields(),
                setConfig([false, null, null])
            ])

        } catch (error) {
            message.error( error.response.data.errors.name.pop())
            dispatch(addProductSizeInfoFailure());
        }
    }
}

export const addProductSizeInfoLoading = () => ({type: ADD_PRODUCT_SIZE_INFO_LOADING})
export const addProductSizeInfoSuccess = (payload) => ({type: ADD_PRODUCT_SIZE_INFO_SUCCESS, payload})
export const addProductSizeInfoFailure = () => ({type: ADD_PRODUCT_SIZE_INFO_FAILURE})

// UPDATE
export const updateProductSize = (productSize, { message, form, setConfig }) => {
    return async dispatch => {
        dispatch(updateProductSizeInfoLoading());
        try {
            const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).update(`product/sizes/${productSize.id}`, productSize)
            const data = await response.data
            Promise.all([
                dispatch(updateProductSizeInfoSuccess(data)),
                message.info(`Product Size ${productSize.name} updated successfully!`),
                form.resetFields(),
                setConfig([false, null, null])
            ])

        } catch (error) {
            message.error( error.response.data.errors.name.pop())
            dispatch(updateProductSizeInfoFailure());

        }
    }
}

export const updateProductSizeInfoLoading = () => ({type: UPDATE_PRODUCT_SIZE_INFO_LOADING})
export const updateProductSizeInfoSuccess = (payload) => ({type: UPDATE_PRODUCT_SIZE_INFO_SUCCESS, payload})
export const updateProductSizeInfoFailure = () => ({type: UPDATE_PRODUCT_SIZE_INFO_FAILURE})

// DELETE
export const deleteProductSize = (productSize,{ message, form, setConfig })  => {
    return async dispatch => {
        // dispatch(deleteProductSizeInfoLoading());
        try {
            
            await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).drop(`product/sizes/${productSize.id}`)
 
            Promise.all([
                dispatch(deleteProductSizeInfoSuccess(productSize.id)),
                message.warning(`Size ${productSize.name} deleted successfully!`),
                form.resetFields(),
                setConfig([false, null, null])
            ])
            

        } catch (error) {
            dispatch(deleteProductSizeInfoFailure());
        }
    }
}

export const deleteProductSizeInfoLoading = () => ({type: DELETE_PRODUCT_SIZE_INFO_LOADING})
export const deleteProductSizeInfoSuccess = (payload) => ({type: DELETE_PRODUCT_SIZE_INFO_SUCCESS, payload})
export const deleteProductSizeInfoFailure = () => ({type: DELETE_PRODUCT_SIZE_INFO_FAILURE})