import Form from 'antd/lib/form'
import Input from '../shared/Input'
import FormModal from '../shared/FormModal'
import ImageUpload from '../shared/ImageUpload'
import CSelect from '../shared/Select'
import Select from 'antd/lib/select'

export default function FormModalBrand(props) {

    return (
      <FormModal {...props} formId='form-product-color' modalTitle='Product Color'>

        <ImageUpload
        FormItem={Form.Item}
        imageUrl={props.imageUrl}
        uploadImage={props.uploadImage}
        actionType={props.actionType}
        ENV_IMG_URL={process.env.REACT_APP_API_PRODUCT_COLOR_PHOTO}
        />

      <Form.Item
      name="name"
      label="Name"
      rules={[{ required: true, message: 'Name is Required' }]}
      >
      <Input/>
      </Form.Item>

      <Form.Item
      name="brand_id"
      label="Brand"
      rules={[{ required: true, message: 'Brand is Required' }]}
      >
      <CSelect style={{width: '100%'}} placeholder="Please select" disabled={props.actionType === 'edit'}>
      {props.brands.map((brand) => <Select.Option key={brand.id} value={brand.id}>{brand.name}</Select.Option>)}
      </CSelect>
      </Form.Item>

      <Form.Item
      name="product_id"
      label="Product"
      rules={[{ required: true, message: 'Product is Required' }]}
      >
      <CSelect style={{width: '100%'}} placeholder="Please select" disabled={props.actionType === 'edit'}>
      {props.products.map((brand) => <Select.Option key={brand.id} value={brand.id}>{brand.name}</Select.Option>)}
      </CSelect>
      </Form.Item>
 
      </FormModal>
    )
}