import {GET_DASHBOARD_INFO_LOADING, GET_DASHBOARD_INFO_SUCCESS, GET_DASHBOARD_INFO_FAILURE } from './types'

const getDashboardInfo = async(dateFrom = '', dateTo = '', year = '') => {

    const params = `?start_date=${dateFrom}&end_date=${dateTo}&year=${year}`

    const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).get(`dashboard${params}`)
    return await response.data
}

export const fetchDashboard = ({dateFrom, dateTo, year})  => {
    return async dispatch => {
            dispatch(fetchDashboardInfoLoading());
        try {
            const dashboard = await getDashboardInfo(dateFrom, dateTo, year);
            dispatch(fetchDashboardInfoSuccess(dashboard));
        } catch{
            dispatch(fetchDashboardInfoFailure());
        }
    }
}

export const fetchDashboardInfoLoading = () => ({type: GET_DASHBOARD_INFO_LOADING})
export const fetchDashboardInfoSuccess = (payload) => ({type: GET_DASHBOARD_INFO_SUCCESS, payload })
export const fetchDashboardInfoFailure = () => ({type: GET_DASHBOARD_INFO_FAILURE})