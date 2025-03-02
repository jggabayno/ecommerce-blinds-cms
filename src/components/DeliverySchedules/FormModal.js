import Form from 'antd/lib/form'
import Input from '../shared/Input'
import FormModal from '../shared/FormModal'
import ImageUpload from '../shared/ImageUpload'

export default function FormModalBrand(props) {

    return (
      <FormModal {...props} formId='form-brand' modalTitle='Brand'>

        <ImageUpload
        FormItem={Form.Item}
        imageUrl={props.imageUrl}
        uploadImage={props.uploadImage}
        actionType={props.actionType}
        ENV_IMG_URL={process.env.REACT_APP_API_BRAND_PHOTO}
        />

        <Form.Item
        name="name"
        label="Brand Name"
        rules={[{ required: true, message: 'Brand Name is Required' }]}
        >
        <Input/>
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