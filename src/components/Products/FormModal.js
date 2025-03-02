import Form from 'antd/lib/form'
import Input from '../shared/Input'
import FormModal from '../shared/FormModal'
import ImageUpload from '../shared/ImageUpload'
import helpers from '../../services/helpers'

export default function FormModalBrand(props) {

    return (
      <FormModal {...props} formId='form-product' modalTitle='Product'>

        <ImageUpload
        FormItem={Form.Item}
        imageUrl={props.imageUrl}
        uploadImage={props.uploadImage}
        actionType={props.actionType}
        ENV_IMG_URL={process.env.REACT_APP_API_BRAND_PHOTO}
        />

        <Form.Item
        name="name"
        label="Name"
        rules={[{ required: true, message: 'Name is Required' }]}
        >
        <Input/>
        </Form.Item>
        
        <Form.Item
        name="price_per_square_feet"
        label="Price per Squareft"
        rules={[{ required: true, message: 'Price per Squareft is Required' }]}
        >
        <Input onKeyPress={helpers.onPreventNumberOnly}/>
        </Form.Item>

        <Form.Item
        name="description"
        label="Description"
        rules={[{ required: true, message: 'Description is Required' }]}
        >
        <Input type='textarea' showCount maxLength={100}/>
        </Form.Item>
 
      </FormModal>
    )
}