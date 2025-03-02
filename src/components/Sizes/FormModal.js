import { useEffect } from 'react'
import Form from 'antd/lib/form'
import Input from '../shared/Input'
import FormModal from '../shared/FormModal'

export default function FormModalProductSize(props) {
 
   useEffect(() => {
    if (props.actionType === 'edit') {
      const [width, height] =  props.form.getFieldValue('name').split('x')
      props.form.setFieldsValue({
        width: Number(width),
        height: Number(height)
      })
    }
 
   }, [props.actionType, props.form.getFieldValue('name')])


   function onChange() {
      props.form.setFieldsValue({name:`${props.form.getFieldValue('width')}x${props.form.getFieldValue('height')}` })
      props.form.setFieldsValue({multiplier: Number(props.form.getFieldValue('width')) * Number(props.form.getFieldValue('height')) })
   }


    return (
      <FormModal {...props} formId='form-product-sizes' modalTitle='Product Size'>

        <Form.Item
        name="name"
        label="Name"
        rules={[{ required: true, message: 'Size Name is Required' }]}
          >
        <Input disabled/>
        </Form.Item>

        <Form.Item
        name="multiplier"
        label="Multiplier"
        rules={[{ required: true, message: 'Multiplier is Required' }]}
         >
        <Input disabled/>
        </Form.Item>

     <Form.Item className='wxh'>
      <Form.Item
      name="width"
      label="Width"
      rules={[{ required: true, message: 'Width is Required' }]}
        >
      <Input 
        type='number'
        onChange={onChange}/>
      </Form.Item>
      X
      <Form.Item
      name="height"
      label="Height"
      rules={[{ required: true, message: 'Height is Required' }]}
       >
      <Input 
        type='number'
        onChange={onChange}
      />
      </Form.Item>
     </Form.Item>
 
      </FormModal>
    )
}