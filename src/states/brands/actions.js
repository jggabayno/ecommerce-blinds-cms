import { 
    GET_BRAND_INFO_LOADING, GET_BRAND_INFO_SUCCESS, GET_BRAND_INFO_FAILURE,
    ADD_BRAND_INFO_LOADING, ADD_BRAND_INFO_SUCCESS, ADD_BRAND_INFO_FAILURE,
    UPDATE_BRAND_INFO_LOADING, UPDATE_BRAND_INFO_SUCCESS, UPDATE_BRAND_INFO_FAILURE,
    DELETE_BRAND_INFO_LOADING, DELETE_BRAND_INFO_SUCCESS, DELETE_BRAND_INFO_FAILURE
 } from './types'


const getBrandInfo = async(isWithAll) => {

    const endpoint = isWithAll ? `brandsWithAll` : `brands`

    const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).get(endpoint)
    return await response.data
}

export const fetchBrands = (isWithAll = false)  => {
    return async dispatch => {
            dispatch(fetchbrandInfoLoading());
        try {
            const brand = await getBrandInfo(isWithAll);
            dispatch(fetchbrandInfoSuccess(brand));
        } catch{
            dispatch(fetchbrandInfoFailure());
        }
    }
}

const getBrandInfoWithDateFilter = async(dateFrom = '', dateTo = '') => {

    const params = `?start_date=${dateFrom}&end_date=${dateTo}`

    const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).get(`brandsWithDateFilter${params}`)
    return await response.data
}

export const fetchBrandsWithDateFilter = ({dateFrom, dateTo})  => {
    return async dispatch => {
            dispatch(fetchbrandInfoLoading());
        try {
            const brand = await getBrandInfoWithDateFilter(dateFrom, dateTo);
            dispatch(fetchbrandInfoSuccess(brand));
        } catch{
            dispatch(fetchbrandInfoFailure());
        }
    }
}



export const fetchbrandInfoLoading = () => ({type: GET_BRAND_INFO_LOADING})
export const fetchbrandInfoSuccess = (payload) => ({type: GET_BRAND_INFO_SUCCESS, payload })
export const fetchbrandInfoFailure = () => ({type: GET_BRAND_INFO_FAILURE})

// CREATE
export const addBrand = (brand, { message, form, setConfig }) => {
    return async dispatch => {
        dispatch(addBrandInfoLoading());

        try {
            
            const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).post('brands', brand)
            const data = await response.data
 
            Promise.all([
                dispatch(addBrandInfoSuccess(data)),
                message.success(`${data.name} Brand created successfully!`),
                form.resetFields(),
                setConfig([false, null, null])
            ])

        } catch (error) {

            dispatch(addBrandInfoFailure());

        }
    }
}

export const addBrandInfoLoading = () => ({type: ADD_BRAND_INFO_LOADING})
export const addBrandInfoSuccess = (payload) => ({type: ADD_BRAND_INFO_SUCCESS, payload})
export const addBrandInfoFailure = () => ({type: ADD_BRAND_INFO_FAILURE})

// UPDATE
export const updateBrand = (brand, { message, form, setConfig }) => {
    return async dispatch => {
        dispatch(updateBrandInfoLoading());
         try {
            const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).update(`brands/${brand.id}`, brand)
            const data = await response.data
            Promise.all([
                dispatch(updateBrandInfoSuccess(data)),
                message.info(`Brand ${brand.name} updated successfully!`),
                form.resetFields(),
                setConfig([false, null, null])
            ])

        } catch (error) {
            
            dispatch(updateBrandInfoFailure());

        }
    }
}

export const updateBrandInfoLoading = () => ({type: UPDATE_BRAND_INFO_LOADING})
export const updateBrandInfoSuccess = (payload) => ({type: UPDATE_BRAND_INFO_SUCCESS, payload})
export const updateBrandInfoFailure = () => ({type: UPDATE_BRAND_INFO_FAILURE})

// DELETE
export const deleteBrand = (brand,{ message, form, setConfig })  => {
    return async dispatch => {
        dispatch(deleteBrandInfoLoading());
        try {
            
            await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).drop(`brands/${brand.id}`)
 
            Promise.all([
                dispatch(deleteBrandInfoSuccess(brand.id)),
                message.warning(`Brand ${brand.name} deleted successfully!`),
                form.resetFields(),
                setConfig([false, null, null])
            ])
            

        } catch (error) {
            dispatch(deleteBrandInfoFailure());
        }
    }
}

export const deleteBrandInfoLoading = () => ({type: DELETE_BRAND_INFO_LOADING})
export const deleteBrandInfoSuccess = (payload) => ({type: DELETE_BRAND_INFO_SUCCESS, payload})
export const deleteBrandInfoFailure = () => ({type: DELETE_BRAND_INFO_FAILURE})