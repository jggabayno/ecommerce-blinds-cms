import {getOrders} from '../orders/actions'


// CREATE
export const createOrderCancellation = async (oc, { message, form, dispatch }) => {
        
    try {
       const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).update(`order-cancellations`, oc)
       await response.data
       Promise.all([
           dispatch(getOrders()),
           message.info(`Order Cancelled successfully!`),
           form.resetFields(),
       ])

   } catch (error) {


   }

}

// UPDATE
export const updateOrderCancellation = async (oc, { message, form, dispatch }) => {
        
         try {
            const response = await (await import('../../services/request')).default(process.env.REACT_APP_API_URL).update(`order-cancellations/${oc.id}`, oc)
            await response.data
            Promise.all([
                dispatch(getOrders()),
                message.info(`Order Cancellation updated successfully!`),
                form.resetFields(),
            ])

        } catch (error) {
 

        }
   
}