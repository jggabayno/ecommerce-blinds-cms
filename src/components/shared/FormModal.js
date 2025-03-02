import Form from 'antd/lib/form'
import Modal from 'antd/lib/modal'
import Button from '../shared/Button'
import Descriptions from 'antd/lib/descriptions'

export default function FormModal(props){
    const {children, modalTitle, actionType, formId, form, isVisible, closeModal, isLoading, onSubmit, modalWidth = 800 } = props
    
    const title = `${actionType === 'edit' ? 'Edit' : actionType === 'delete' ? 'Delete' : actionType === 'view' ? 'View' :  'Add' } ${modalTitle}`

    return (
        <Modal
            visible={isVisible}
            title={title}
            maskClosable={false}
            onCancel={closeModal}
            width={modalWidth}
            closable
            footer={actionType === 'view' ? false : [
            <Button key={1} type='ghost' onClick={closeModal}>Cancel</Button>,
            <Button key={2} form={formId} type='primary' htmlType='submit' loading={isLoading}>Submit</Button>
            ]}
            forceRender
            getContainer={false}
        >
            {actionType !== 'view' &&  <Form
            form={form}
            id={formId}
            onFinish={onSubmit}
            autoComplete="off"
            layout='vertical'
            requiredMark={false}
        > {children}</Form>}

            {actionType === 'view' &&
            <Descriptions title={false} column={2} className='detail-descriptions'>
            <Descriptions.Item label="Brand">{props.selectedProduct.brand.name}</Descriptions.Item>
            <Descriptions.Item label="Name" >{props.selectedProduct.product.name}</Descriptions.Item>
            <Descriptions.Item label="Color" >{props.selectedProduct.name}</Descriptions.Item>
            <Descriptions.Item label="Price Per Squarefeet" >{props.selectedProduct.product.price_per_square_feet}</Descriptions.Item>
            </Descriptions>}
       
        </Modal>
    )
}
