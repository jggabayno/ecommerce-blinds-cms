import {useState, useEffect, useRef, useCallback} from 'react'
import { useSelector, useDispatch } from 'react-redux';
import {fetchProductsWithDateFilter, addProduct, updateProduct, deleteProduct} from '../../states/products/actions'
import imageUpload from '../../states/imageupload/actions';
import './index.scss'
import moment from 'moment';
import { CgSoftwareDownload } from "react-icons/cg";

import Form from 'antd/lib/form'
import message from 'antd/lib/message'
import Popconfirm from 'antd/lib/popconfirm'

import FormModal from './FormModal'
import Button from '../shared/Button'
import Table from '../shared/Table'
import Search from '../shared/Search'
import Space from 'antd/lib/space'
// import { CSVLink } from "react-csv";
import NoPhoto from '../../assets/images/no_photo.png'
import RangePicker from '../shared/RangePicker'

import { useReactToPrint } from 'react-to-print'
import PrintComponent from '../shared/PrintComponent';
import { PrinterOutlined } from '@ant-design/icons';
import AntdTable from 'antd/lib/table'

export default function Products(props) {

  const [rangeDate, setRangeDate] = useState()
  const [dateFrom, dateTo] = rangeDate || ['','']
  const onChangeDate = (ymd) => setRangeDate(ymd?.map(date => moment(date).format('YYYY-MM-DD')))



  const [searchKey, setSearchKey] = useState('')
  const isSearching = searchKey.length >= 1
  const [config, setConfig] = useState([false, null, null])
  const [isVisible, actionType, selectedProduct] = config
  const [image, setImage] = useState([null, null]);
  const [, imageUrl] = image;

  const [form] = Form.useForm();
  const dispatch = useDispatch()
  const {isLoading, data: products} = useSelector((state) => state.products)
 
  useEffect(() => {
    if (selectedProduct && actionType === 'edit') setImage((prev) => [prev[0], selectedProduct.photo])
  }, [selectedProduct, actionType])

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

  useEffect(() => {dispatch(fetchProductsWithDateFilter({dateFrom, dateTo}))}, [dispatch, dateFrom, dateTo]);

  const columns = [
      {
        title: 'Photo',
        dataIndex: 'photo',
        render: (photo) => {
          const src = photo ? (process.env.REACT_APP_API_PRODUCT_PHOTO + photo) 
          : NoPhoto
          return <img src={src } width='40' height='40' alt='product'/>
        }
      },
      {
        title: 'Name',
        dataIndex: 'name',
        sorter: (a, b) => a.name.localeCompare(b.name)
      },
      {
        title: 'Description',
        dataIndex: 'description',
        sorter: (a, b) => a.description.localeCompare(b.description)
      },
      {
        title: 'Date Created',
        dataIndex: 'created_at',
        sorter: (a, b) => a.created_at.localeCompare(b.created_at),
        render: (created_at) => moment(created_at).format('LL')
      },        
      {
        title: 'Actions',
        render: (_,row) => {
  
        const product = products.find((product) => product.id === row.id)

        return (
        <Space size="middle">
          <div onClick={onEdit(product)}>Edit</div>          
          <Popconfirm
            title={`Are you sure to delete ${product.name}?`}
            onConfirm={confirmDelete(product)}
            okText="Yes"
            cancelText="No"
          >
          Delete
          </Popconfirm>      
        </Space>
          )
        }
      }
  ]
  
  function dataSource() {
    function  processData(products) {
      const toTrimStringLower = (value) => value.trim().toString().toLowerCase()
      return searchKey ? 
      products.filter((product) => toTrimStringLower(product.name)
      .includes(toTrimStringLower(searchKey))) 
      : products
    }
    return processData(products)
  }
    
  // function csv(){
  //   const hasData = dataSource().length
  //   const header = [[`Start Date:${dateFrom}`, `End Date:${dateTo}`, '', '']]

  //   const body = hasData ?
  //   [['Name', 'Description', 'Date Created'], ...dataSource().map(({name, description, created_at}) => 
  //   Object.values({name, description, created_at: moment(created_at).format('LLLL')}))]
  //   : [[ '','No Data Available', '' ]]

  //   return {
  //     filename: `products-${moment().format('LL').toLocaleLowerCase()}.csv`,
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

   const onEdit = (product) => () => {
    form.setFieldsValue(product)
    setConfig([true, 'edit', product])
  }

  const verbsOptions = { message, form, setConfig, setImage}

  const confirmDelete = (product) => () => dispatch(deleteProduct(product, verbsOptions))
 
  const onSubmit = async (product) => { 
 
    const getImage = async (photo) => photo ? await imageUpload({ destination: 'product', photo }) : imageUrl

    if (actionType === 'add') {
      const photo = await getImage(imageUrl)
      dispatch(addProduct({...product, photo}, verbsOptions))
    }
    if (actionType === 'edit') {
      const photo = await getImage(imageUrl?.includes('base64') ? imageUrl : '')

      dispatch(updateProduct({ ...product, id: selectedProduct.id, photo}, verbsOptions))
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
    <main className='products'>
          <PrintComponent {...props} ref={componentRef}>
    <h1 className='print-view-content-title'>Products</h1>
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
            const src = photo ? (process.env.REACT_APP_API_PRODUCT_PHOTO + photo) 
            : NoPhoto
            return <img src={src } width='40' height='40' alt='product'/>
          }
        },
        {
          title: 'Name',
          dataIndex: 'name',
        },
        {
          title: 'Description',
          dataIndex: 'description',
        },
        {
          title: 'Date Created',
          dataIndex: 'created_at',
          render: (created_at) => moment(created_at).format('LL')
        }
    ]
    }
    dataSource={dataSource()}
    pagination={false}
    />
    
    </PrintComponent>
       
        <h1 className='title'>Products</h1>
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
        <Button className='btn-add-product' type='primary' onClick={openModal}>Add Product</Button>
        <Table attributes={{ dataSource, isLoading: isLoading, isSearching, columns}} className='products-table'/>
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