import { useState, useEffect } from 'react'
import { useSelector, useDispatch} from 'react-redux'
import { fetchProfile, updateProfile} from '../../states/profile/actions'
import './index.scss'
import Form from 'antd/lib/form';
import message from 'antd/lib/message';
import Title from 'antd/lib/typography/Title'
import Button from '../shared/Button'
import Input from '../shared/Input'
import DatePicker from 'antd/lib/date-picker'
import Radio from 'antd/lib/radio'
import moment from 'moment'
import imageUpload from '../../states/imageupload/actions';
import ImageUpload from '../shared/ImageUpload'
import Dropdown from 'antd/lib/dropdown'
import Menu from 'antd/lib/menu'
import './index.scss'
import { useNavigate } from "react-router-dom"

export default function Profile(){

  const navigate = useNavigate()

  const [form] = Form.useForm()
    const dispatch = useDispatch()

  async function onSubmit(user) {
    user.email = user.email.trim() 
    user.birth_date = moment(user.birth_date).format('YYYY/MM/DD')

    const getImage = async (photo) => photo ? await imageUpload({ destination: 'user', photo }) : imageUrl

    const photo = await getImage(imageUrl?.includes('base64') ? imageUrl : '')

    dispatch(updateProfile({ ...user, id: profile.id, photo}, message))
  }
  
  const {isLoading, data: profile} = useSelector(state => state.profile)
 
  useEffect(() => {
      dispatch(fetchProfile())
  }, [dispatch])

  useEffect(() => {
      form.setFieldsValue({
        ...profile,
        birth_date: profile?.birth_date ? moment(profile?.birth_date) : ''
      })
  }, [form, profile])

  const [image, setImage] = useState([null, null]);
  const [, imageUrl] = image;

  useEffect(() => {
    if (profile) setImage((prev) => [prev[0], profile.photo])
  }, [profile])

  const uploadImage = (info) => {
    function getBase64(img, callback) {
      const reader = new FileReader();
      reader.addEventListener('load', () => callback(reader.result));
      reader.readAsDataURL(img);
    }

    if (info) {
      getBase64(info.file, (imageUrl) => (
        setImage([info.file, imageUrl]))
      );
    }
  }

  return (
    <main className='my-acc'>
{/* 
      <div className='profile-navigation'>
        <nav>
        <Dropdown
            overlay={(
              <Menu>
                <Menu.Item key='profile' onClick={() => navigate('/account/profile')}>Profile</Menu.Item>
                <Menu.Item key='change-password' onClick={() => navigate('/account/password')}>Change Password</Menu.Item>
            </Menu>
            )}
            trigger={['click']}
            destroyPopupOnHide={true}
            visible={true}
            
          >
          <div>
          My Account
          </div>
        </Dropdown>
        </nav>
      </div> */}

  <Form form={form} onFinish={onSubmit} hideRequiredMark scrollToFirstError colon={false}>
  <Title level={3} className='my-acc-title'> My Profile</Title>

  <ImageUpload
    FormItem={Form.Item}
    imageUrl={imageUrl}
    uploadImage={uploadImage}
    actionType={'edit'}
    ENV_IMG_URL={process.env.REACT_APP_API_USER_PHOTO}
    />

  <Form.Item
  label='Username'
  name="user_name"
  rules={[{ required: true, message: "User Name Required" }]}
  >
  <Input placeholder="User Name" />
  </Form.Item>

  <Form.Item
  label='First Name'
  name="first_name"
  rules={[{ required: true, message: "First Name Required" }]}
  >
  <Input placeholder="First Name" />
  </Form.Item>

  <Form.Item
  label='Last Name'
  name="last_name"
  rules={[{ required: true, message: "Last Name Required" }]}
  >
  <Input placeholder="Last Name" />
  </Form.Item>


  <Form.Item
  label='Address'
  name="address"
  rules={[{ required: true, message: "Address Required" }]}
  >
  <Input placeholder="Address" />
  </Form.Item>

  <Form.Item
  label='Mobile Number'
  name="mobile_number"
  rules={[{ required: true, message: "Mobile Number Required" }]}
  >
  <Input placeholder="Mobile Number" />
  </Form.Item>


  <Form.Item
  label='Email'
  name="email"
  rules={[{ required: true, message: "Email Required" }]}
  >
  <Input placeholder="Email" />
  </Form.Item>

  <Form.Item label='Gender' name="gender"
  rules={[{ required: true, message: "Gender Required" }]}
  >
  <Radio.Group>
  <Radio value={1}>Male</Radio>
  <Radio value={2}>Female</Radio>
  <Radio value={3}>Other</Radio>
  </Radio.Group>
  </Form.Item>

  <Form.Item label="Date of Birth" name="birth_date"
  rules={[{ required: true, message: "Date of Birth is Required" }]}
  >
  <DatePicker/>
  </Form.Item>

  <Form.Item>
  <Button className='btn-login' htmlType="submit" type='primary' loading={isLoading}>Save</Button>
  </Form.Item>

  </Form>












        {/* {isLoading  ? 'loading...' : 
    <Descriptions title="My Profile" layout="vertical">
        <Descriptions.Item label="Name">{profile.name}</Descriptions.Item>
        <Descriptions.Item label="Mobile Number">{profile.mobile_number}</Descriptions.Item>
        <Descriptions.Item label="Email">{profile.email}</Descriptions.Item>
        <Descriptions.Item label="Address" span={2}>{profile.address}</Descriptions.Item>
    </Descriptions>
        } */}
        
    </main>
  )
}