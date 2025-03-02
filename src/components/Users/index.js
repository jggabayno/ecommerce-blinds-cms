import {useState, useEffect, useRef, useCallback} from 'react'
import { useSelector, useDispatch } from 'react-redux';

import {addUser, fetchUsersWithDateFilter} from '../../states/users/actions'
import './index.scss'
import moment from 'moment';
// import { CgSoftwareDownload } from "react-icons/cg";

import Form from 'antd/lib/form'
import message from 'antd/lib/message'
// import Popconfirm from 'antd/lib/popconfirm'

import FormModal from './FormModal'
import Button from '../shared/Button'
import Table from '../shared/Table'
import Search from '../shared/Search'
// import Space from 'antd/lib/space'
// import { CSVLink } from "react-csv";
import NoPhoto from '../../assets/images/no_photo.png'
import RangePicker from '../shared/RangePicker'

import { useReactToPrint } from 'react-to-print'
import PrintComponent from '../shared/PrintComponent';
import { PrinterOutlined } from '@ant-design/icons';
import AntdTable from 'antd/lib/table'

export default function Users(props) {
  const [rangeDate, setRangeDate] = useState()
  const [dateFrom, dateTo] = rangeDate || ['','']
  const onChangeDate = (ymd) => setRangeDate(ymd?.map(date => moment(date).format('YYYY-MM-DD')))


  const [searchKey, setSearchKey] = useState('')
  const isSearching = searchKey.length >= 1
  const [config, setConfig] = useState([false, null, null])
  const [isVisible, actionType, selectedUser] = config
  const [image, setImage] = useState([null, null]);
  const [, imageUrl] = image;

  const [form] = Form.useForm();
  const dispatch = useDispatch()
  const {isLoading, data: users} = useSelector((state) => state.users)
  
  useEffect(() => {
    if (selectedUser && actionType === 'edit') setImage((prev) => [prev[0], selectedUser.photo])
  }, [selectedUser, actionType])

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

  useEffect(() => {dispatch(fetchUsersWithDateFilter({dateFrom, dateTo}))}, [dispatch, dateFrom, dateTo]);


  const columns = [
      {
        title: 'Photo',
        dataIndex: 'photo',
        render: (photo) => {
          const src = photo ? (process.env.REACT_APP_API_USER_PHOTO + photo) 
          : NoPhoto
          return <img src={src } width='40' height='40' alt='user'/>
        }
      },
      {
        title: 'Name',
        dataIndex: 'first_name',
        sorter: (a, b) => a.first_name.localeCompare(b.first_name),
        render: (_,{first_name, last_name}) => {
           
          return `${first_name} ${last_name}`
        }
      },
      {
        title: 'Role',
        dataIndex: 'user_type_id',
        render: (user_type_id) => user_type_id === 1 ? 'Admin' :  user_type_id === 2 ? 'Staff' : user_type_id === 3 ?  'Customer' : 'N/A'
      },
      {
        title: 'Mobile Number',
        dataIndex: 'mobile_number',
        sorter: (a, b) => a.mobile_number.localeCompare(b.mobile_number)
      },
      {
        title: 'Email',
        dataIndex: 'email',
        sorter: (a, b) => a.email.localeCompare(b.email)
      },
      {
        title: 'Birth Date',
        dataIndex: 'birth_date',
        render: (birth_date) => birth_date ? moment(birth_date).format('LL') : 'N/A'
      },
      {
        title: 'Gender',
        dataIndex: 'gender',
        render: (gender) => gender === 1 ? 'Male' :  gender === 2 ? 'Female' : 'N/A'
      },
      {
        title: 'Address',
        dataIndex: 'address',
        sorter: (a, b) => a.address.localeCompare(b.address),
        render: (address) => address ? address : 'N/A'
      },      
      {
        title: 'Date Created',
        dataIndex: 'created_at',
        sorter: (a, b) => a.created_at.localeCompare(b.created_at),
        render: (created_at) => moment(created_at).format('LLL')
      },        
      // {
      //   title: 'Actions',
      //   render: (_,row) => {
  
      //   const brand = brands.find((brand) => brand.id === row.id)

      //   return (
      //   <Space size="middle">
      //     <div onClick={onEdit(brand)}>Edit</div>          
      //     <Popconfirm
      //       title={`Are you sure to delete ${brand.name}?`}
      //       onConfirm={confirmDelete(brand)}
      //       okText="Yes"
      //       cancelText="No"
      //     >
      //     Delete
      //     </Popconfirm>      
      //   </Space>
      //     )
      //   }
      // }
  ]
  
  function dataSource() {
    function  processData(users) {
      const toTrimStringLower = (value) => value.trim().toString().toLowerCase()
      return searchKey ? 
      users.filter((user) => toTrimStringLower(`${user.first_name} ${user.last_name}`)
      .includes(toTrimStringLower(searchKey))) 
      : users
    }
    return processData(users)
  }

  // function csv(){
  //   const hasData = dataSource().length
 
  //   const header = [[`Start Date:${dateFrom}`, `End Date:${dateTo}`, '', '']]

  //   const body = hasData ?
  //   [['Name', 'Role', 'Mobile Number', 'Email', 'Birth Date', 'Gender', 'Address','Date Created'],...dataSource().map(({first_name, last_name, user_type_id,mobile_number,email, gender, birth_date, address, created_at}) => 
  //   Object.values({name:  `${first_name} ${last_name}`,
  //   user_type_id: user_type_id === 1 ? 'Admin' :  user_type_id === 2 ? 'Staff' : user_type_id === 3 ?  'Customer' : 'N/A'    ,
  //   mobile_number, email, birth_date: birth_date ? moment(birth_date).format('LL') : 'N/A', gender: gender === 1 ? 'Male' :  gender === 2 ? 'Female' : 'N/A'    , address,
  //   created_at: moment(created_at).format('LLL')}))]
  //   : [[ '','No Data Available', '' ]]


  //   return {
  //     filename: `users-${moment().format('LL').toLocaleLowerCase()}.csv`,
  //     data: [header, ...body]
  //   }
  // }

  const onSearch = () => {
    return {
      search: (key) => setSearchKey(key),
      change: (event) => !event.currentTarget.value && setSearchKey('')
    }
  }

  const openModal = () => {
    setConfig((prev) => [!prev[0], 'add', null])
    form.resetFields()
    setImage([null,null])
  }
  
  const closeModal = () => {
    setConfig([false, null, null])
    form.resetFields()
    setImage([null,null])
  }

  //  const onEdit = (brand) => () => {
  //   form.setFieldsValue(brand)
  //   setConfig([true, 'edit', brand])
  // }

  const verbsOptions = { message, form, setConfig, setImage}

  // const confirmDelete = (brand) => () => dispatch(deleteBrand(brand, verbsOptions))
 
  const onSubmit = async (brand) => { 
 
 
    if (actionType === 'add') {

      dispatch(addUser({...brand}, verbsOptions))
    }
    if (actionType === 'edit') {
   
      // dispatch(updateBrand({ ...brand, id: selectedBrand.id, photo}, verbsOptions))
    }
  }

    
     // PRINT CONFIGURATIONS

     const componentRef = useRef(null);
     const onBeforeGetContentResolve = useRef(null)
   
     const [isPrintLoading,setIsPrintLoading] = useState(false);
   
     const handleOnBeforeGetContent = useCallback(() => {
       setIsPrintLoading(true);
       return new Promise((resolve) => {
         onBeforeGetContentResolve.current = resolve;
         setTimeout(() => {
           setIsPrintLoading(false);
           resolve();
         }, 2000)
       });
     }, [setIsPrintLoading])
   
     const reactToPrintContent = useCallback(() => {
       return componentRef.current;
     }, [componentRef.current])
   
     const handlePrint = useReactToPrint({
       content: reactToPrintContent,
       onBeforeGetContent: handleOnBeforeGetContent,
       removeAfterPrint: true
     })
   
     // PRINT CONFIGURATIONS END

  return (
    <main className='users'>
        <h1 className='title'>Users</h1>
        <PrintComponent {...props} ref={componentRef}>
        <h1 className='print-view-content-title'>Users</h1>
        <div className='print-view-content-range-date'>
        {`Start Date: ${dateFrom ? dateFrom : 'None'} - End Date: ${dateTo ? dateTo : 'None'}`}
        </div>
        <AntdTable
        className='print-view-content-table'
        columns={
          [
            {
              title: 'Photo',
              dataIndex: 'photo',
              render: (photo) => {
                const src = photo ? (process.env.REACT_APP_API_USER_PHOTO + photo) 
                : NoPhoto
                return <img src={src } width='40' height='40' alt='user'/>
              }
            },
            {
              title: 'Name',
              dataIndex: 'first_name',
              render: (_,{first_name, last_name}) => {
                 
                return `${first_name} ${last_name}`
              }
            },
            {
              title: 'Role',
              dataIndex: 'user_type_id',
              render: (user_type_id) => user_type_id === 1 ? 'Admin' :  user_type_id === 2 ? 'Staff' : user_type_id === 3 ?  'Customer' : 'N/A'
            },
            {
              title: 'Mobile Number',
              dataIndex: 'mobile_number',
            },
            {
              title: 'Email',
              dataIndex: 'email',
            },
            {
              title: 'Birth Date',
              dataIndex: 'birth_date',
              render: (birth_date) => birth_date ? moment(birth_date).format('LL') : 'N/A'
            },
            {
              title: 'Gender',
              dataIndex: 'gender',
              render: (gender) => gender === 1 ? 'Male' :  gender === 2 ? 'Female' : 'N/A'
            },
            {
              title: 'Address',
              dataIndex: 'address',
              render: (address) => address ? address : 'N/A'
            },      
            {
              title: 'Date Created',
              dataIndex: 'created_at',
              sorter: (a, b) => a.created_at.localeCompare(b.created_at),
              render: (created_at) => moment(created_at).format('LLL')
            }
        ]
        }
        dataSource={dataSource()}
        pagination={false}
        />

        </PrintComponent>
        <Button className='btn-print' type='primary' loading={isPrintLoading} onClick={handlePrint}><PrinterOutlined /> Print Report</Button>

         {/* <Button className='btn-export'>
          <CSVLink {...csv()}><CgSoftwareDownload/>Export</CSVLink>
         </Button> */}
        <Search onSearch={onSearch}/>
        <RangePicker
            onChange={onChangeDate}
            disabled={isLoading}
            className='range-date'
            format='MM/DD/YYYY'
            allowEmpty={true}
            />

        <Button className='btn-add-user' type='primary' onClick={openModal}>Add Staff</Button>
        <Table attributes={{ dataSource, isLoading: isLoading, isSearching, columns}} className='brands-table'/>
        {isVisible && <FormModal
        isVisible={isVisible}
        actionType={actionType}
        closeModal={closeModal}
        setConfig={setConfig}
        isLoading={isLoading}
        form={form}
        onSubmit={onSubmit}
        imageUrl={imageUrl}
        uploadImage={uploadImage}
        modalWidth={500}
      />}
    </main>
  )
}