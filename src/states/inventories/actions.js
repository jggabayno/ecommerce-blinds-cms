import { 
    GET_INVENTORY_INFO_LOADING, GET_INVENTORY_INFO_SUCCESS, GET_INVENTORY_INFO_FAILURE,
    ADD_INVENTORY_INFO_LOADING, ADD_INVENTORY_INFO_SUCCESS, ADD_INVENTORY_INFO_FAILURE
 } from './types'

import {fetchBrands} from '../brands/actions'

const getInventoryInfo = async(color_id) => {
    const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).get(`inventories/${color_id}`)
    return await response.data
}

export const fetchInventory = (color_id)  => {
    return async dispatch => {
            dispatch(fetchInventoryInfoLoading());
        try {
            const product = await getInventoryInfo(color_id);
            dispatch(fetchInventoryInfoSuccess(product));
        } catch{
            dispatch(fetchInventoryInfoFailure());
        }
    }
}

export const fetchInventoryInfoLoading = () => ({type: GET_INVENTORY_INFO_LOADING})
export const fetchInventoryInfoSuccess = (payload) => ({type: GET_INVENTORY_INFO_SUCCESS, payload })
export const fetchInventoryInfoFailure = () => ({type: GET_INVENTORY_INFO_FAILURE})

// CREATE
export const addInventory = (inventory, { message, form, setStock }) => {
    return async dispatch => {
        dispatch(addInventoryInfoLoading());

        try {
            
            const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).post('inventories', inventory)
            const data = await response.data
 
            Promise.all([
                dispatch(addInventoryInfoSuccess(data)),
                form.resetFields(),
                setStock(0),
                dispatch(fetchBrands(true))
            ])

        } catch (error) {

            dispatch(addInventoryInfoFailure());

        }
    }
}

export const addInventoryInfoLoading = () => ({type: ADD_INVENTORY_INFO_LOADING})
export const addInventoryInfoSuccess = (payload) => ({type: ADD_INVENTORY_INFO_SUCCESS, payload})
export const addInventoryInfoFailure = () => ({type: ADD_INVENTORY_INFO_FAILURE})