
export const fetchAccountsReceivable = async(setAccReceivable, dateFrom = '', dateTo = '') => {
    
    setAccReceivable({isLoading: true,data: []})

    const params = `?start_date=${dateFrom}&end_date=${dateTo}`

    try {
        const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).get(`accountsReceivableWithDateFilter${params}`)
        const data = await response.data
        if (data) setAccReceivable({isLoading: false, data})
    } catch(error) {
        setAccReceivable({isLoading: false,data: []})
    }
}