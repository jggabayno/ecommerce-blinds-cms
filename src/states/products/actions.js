import { 
    GET_PRODUCT_INFO_LOADING, GET_PRODUCT_INFO_SUCCESS, GET_PRODUCT_INFO_FAILURE,
    ADD_PRODUCT_INFO_LOADING, ADD_PRODUCT_INFO_SUCCESS, ADD_PRODUCT_INFO_FAILURE,
    UPDATE_PRODUCT_INFO_LOADING, UPDATE_PRODUCT_INFO_SUCCESS, UPDATE_PRODUCT_INFO_FAILURE,
    DELETE_PRODUCT_INFO_LOADING, DELETE_PRODUCT_INFO_SUCCESS, DELETE_PRODUCT_INFO_FAILURE,
 } from './types'

// GET

const getProductInfoWithDateFilter = async(dateFrom = '', dateTo = '') => {

    const params = `?start_date=${dateFrom}&end_date=${dateTo}`

    const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).get(`productsWithDateFilter${params}`)
    return await response.data
}

export const fetchProductsWithDateFilter = ({dateFrom, dateTo})  => {
    return async dispatch => {
            dispatch(fetchProductInfoLoading());
        try {
            const brand = await getProductInfoWithDateFilter(dateFrom, dateTo);
            dispatch(fetchProductInfoSuccess(brand));
        } catch{
            dispatch(fetchProductInfoFailure());
        }
    }
}



const getProductInfo = async() => {
    const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).get('productswithcolors')
    return await response.data
}

export const fetchProducts = ()  => {
    return async dispatch => {
            dispatch(fetchProductInfoLoading());
        try {
            const product = await getProductInfo();
            dispatch(fetchProductInfoSuccess(product));
        } catch{
            dispatch(fetchProductInfoFailure());
        }
    }
}

export const fetchProductInfoLoading = () => ({type: GET_PRODUCT_INFO_LOADING})
export const fetchProductInfoSuccess = (ProductInfo) => ({type: GET_PRODUCT_INFO_SUCCESS, payload: ProductInfo})
export const fetchProductInfoFailure = () => ({type: GET_PRODUCT_INFO_FAILURE})

// CREATE
export const addProduct = (product, { message, form, setConfig }) => {
    return async dispatch => {
        dispatch(addProductInfoLoading());

        try {
            
            const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).post('products', product)
            const data = await response.data
 
            Promise.all([
                dispatch(addProductInfoSuccess(data)),
                message.success(`${data.name} Product created successfully!`),
                form.resetFields(),
                setConfig([false, null, null])
            ])

        } catch (error) {

            dispatch(addProductInfoFailure());

        }
    }
}

export const addProductInfoLoading = () => ({type: ADD_PRODUCT_INFO_LOADING})
export const addProductInfoSuccess = (payload) => ({type: ADD_PRODUCT_INFO_SUCCESS, payload})
export const addProductInfoFailure = () => ({type: ADD_PRODUCT_INFO_FAILURE})

// UPDATE
export const updateProduct = (product, { message, form, setConfig }) => {
    return async dispatch => {
        dispatch(updateProductInfoLoading());
         try {
            const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).update(`products/${product.id}`, product)
            const data = await response.data
            Promise.all([
                dispatch(updateProductInfoSuccess(data)),
                message.info(`Product ${product.name} updated successfully!`),
                form.resetFields(),
                setConfig([false, null, null])
            ])

        } catch (error) {
            
            dispatch(updateProductInfoFailure());

        }
    }
}

export const updateProductInfoLoading = () => ({type: UPDATE_PRODUCT_INFO_LOADING})
export const updateProductInfoSuccess = (payload) => ({type: UPDATE_PRODUCT_INFO_SUCCESS, payload})
export const updateProductInfoFailure = () => ({type: UPDATE_PRODUCT_INFO_FAILURE})

// DELETE
export const deleteProduct = (product,{ message, form, setConfig })  => {
    return async dispatch => {
        dispatch(deleteProductInfoLoading());
        try {
            
            await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).drop(`products/${product.id}`)
 
            Promise.all([
                dispatch(deleteProductInfoSuccess(product.id)),
                message.warning(`Product ${product.name} deleted successfully!`),
                form.resetFields(),
                setConfig([false, null, null])
            ])
            

        } catch (error) {
            dispatch(deleteProductInfoFailure());
        }
    }
}

export const deleteProductInfoLoading = () => ({type: DELETE_PRODUCT_INFO_LOADING})
export const deleteProductInfoSuccess = (payload) => ({type: DELETE_PRODUCT_INFO_SUCCESS, payload})
export const deleteProductInfoFailure = () => ({type: DELETE_PRODUCT_INFO_FAILURE})