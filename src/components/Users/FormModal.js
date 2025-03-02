import Form from 'antd/lib/form'
import Input from '../shared/Input'
import FormModal from '../shared/FormModal'
import Select from 'antd/lib/select'
import CSelect from '../shared/Select'

export default function FormModalBrand(props) {

    return (
      <FormModal {...props} formId='form-user' modalTitle='Staff'>

    <Form.Item name="user_type_id" label="User Type"
    rules={[{ required: true, message: "User Type is Required" }]}
    initialValue={3}
    >
    <CSelect
    placeholder="Select User Type"
    allowClear
    disabled={true}
    >
    <Select.Option key={2} value={2}>
    Customer
    </Select.Option>
    <Select.Option key={3} value={3}>
    Staff
    </Select.Option>
    </CSelect>
    </Form.Item>

    <Form.Item
    name="first_name"
    label="First Name"
    rules={[
    {
    required: true,
    message: 'First Name is Required',
    },
    ]}
    >
    <Input/>

    </Form.Item>

        <Form.Item
        name="last_name"
        label="Last Name"
        rules={[
        {
        required: true,
        message: 'Last Name is Required',
        },
        ]}
        >
        <Input/>
        </Form.Item>

        <Form.Item
        name="mobile_number"
        label="Mobile Number"
        rules={[
        {
        required: true,
        message: 'Mobile Number is Required',
        },
        ]}
        >
        <Input/>
        </Form.Item>

        <Form.Item
        name="email"
        label="E-mail"
        rules={[
        {
        type: 'email',
        message: 'The input is not valid E-mail!',
        },
        {
        required: true,
        message: 'Please input your E-mail!',
        },
        ]}
        >
        <Input />
        </Form.Item>

        <Form.Item
        name="password"
        label="Password"
        rules={[
        {
        required: true,
        message: 'Please input your password!',
        },
        ]}
        hasFeedback
        >
        <Input type='password'/>
        </Form.Item>

        <Form.Item
        name="confirm"
        label="Confirm Password"
        dependencies={['password']}
        hasFeedback
        rules={[
        {
        required: true,
        message: 'Please confirm your password!',
        },
        ({ getFieldValue }) => ({
        validator(_, value) {
        if (!value || getFieldValue('password') === value) {
        return Promise.resolve();
        }

        return Promise.reject(new Error('The two passwords that you entered do not match!'));
        },
        }),
        ]}
        >
        <Input type='password'/>
        </Form.Item>
 
      </FormModal>
    )
}