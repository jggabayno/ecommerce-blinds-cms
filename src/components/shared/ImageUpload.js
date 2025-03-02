import React from 'react'
import Upload from 'antd/lib/upload'
import NoPhoto from '../../assets/images/no_photo.png'

export default function ImageUpload(props) {

    const {FormItem, actionType, imageUrl, uploadImage } = props
    
    const imageUrlFormatted = (
        (actionType === 'edit')
        ?
        (imageUrl ?  (imageUrl.includes('base64') ? imageUrl : (props.ENV_IMG_URL + imageUrl )) : (imageUrl || NoPhoto) )
        :
        (imageUrl ||  NoPhoto))

    return (
        <FormItem className='image-upload-form-item'>
        <Upload
        name="upload"
        listType="picture-card"
        showUploadList={false}
        beforeUpload={() => false}
        accept='image/*'
        onChange={uploadImage}
        >
        <img src={imageUrlFormatted} alt='logo beeline'/>
        </Upload>
        <span className='upload-action-text'>{actionType === 'edit' ? 'Change' : 'Upload'} Photo</span>
        </FormItem>
    )
}
