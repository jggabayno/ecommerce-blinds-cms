import {useState, useEffect, useRef, useCallback} from 'react'

import { useSelector, useDispatch } from 'react-redux';
import {fetchProductColorsWithDateFilter, addProductColor, updateProductColor, deleteProductColor} from '../../states/productColors/actions'
import {fetchBrands} from '../../states/brands/actions'
import {fetchProducts} from '../../states/products/actions'
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

export default function Colors(props) {

  const [rangeDate, setRangeDate] = useState()
  const [dateFrom, dateTo] = rangeDate || ['','']
  const onChangeDate = (ymd) => setRangeDate(ymd?.map(date => moment(date).format('YYYY-MM-DD')))


  const [searchKey, setSearchKey] = useState('')
  const isSearching = searchKey.length >= 1
  const [config, setConfig] = useState([false, null, null])
  const [isVisible, actionType, selectedProductColor] = config
  const [image, setImage] = useState([null, null]);
  const [, imageUrl] = image;

  const [form] = Form.useForm()
  const dispatch = useDispatch()

  const {isLoading: isLoadingProductColors, data: productColors} = useSelector((state) => state.productColors)
  const {data: brands} = useSelector((state) => state.brands)
  const {data: products} = useSelector((state) => state.products)

 
  useEffect(() => {
    if (selectedProductColor && actionType === 'edit') setImage((prev) => [prev[0], selectedProductColor.photo])
  }, [selectedProductColor, actionType])

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

  useEffect(() => {dispatch(fetchProductColorsWithDateFilter({dateFrom,dateTo}))}, [dispatch, dateFrom, dateTo])
  useEffect(() => {dispatch(fetchBrands())}, [dispatch])
  useEffect(() => {dispatch(fetchProducts())}, [dispatch])
  
  const columns = [
      {
        title: 'Photo',
        dataIndex: 'photo',
        render: (photo) => {
          const src = photo ? (process.env.REACT_APP_API_PRODUCT_COLOR_PHOTO + photo) 
          : NoPhoto
          return <img src={src} width='40' height='40' alt='brand'/>
        }
      },
      {
        title: 'Name',
        dataIndex: 'name',
        sorter: (a, b) => a.name.localeCompare(b.name),
        render: (value ) =>  <span className='color-name'>{value}</span>
      },
      {
        title: 'Brand',
        dataIndex: 'brand',
        sorter: (a, b) => a.name.localeCompare(b.name),
        render: (brand,record) => brand?.name
      },
      {
        title: 'Product',
        dataIndex: 'product',
        sorter: (a, b) => a.product.localeCompare(b.product),
        render: (product,record) => `${product?.name} | ${product?.price_per_square_feet}/sqft`
      },
      // {
      //   title: 'Added By',
      //   dataIndex: 'added_by',
      //   sorter: (a, b) => a.added_by?.first_name.localeCompare(b.added_by?.first_name),
      //   render: (added_by,record) => `${added_by?.first_name} ${added_by?.last_name}`
      // },
      {
        title: 'Date Created',
        dataIndex: 'created_at',
        sorter: (a, b) => a.created_at.localeCompare(b.created_at),
        render: (created_at) => moment(created_at).format('LL')
      },        
      {
        title: 'Actions',
        render: (_,row) => {
  
        const productColor = productColors.find((productColor) => productColor.id === row.id)

        return (
        <Space size="middle">
          <div onClick={onEdit(productColor)}>Edit</div>          
          <Popconfirm
            title={`Are you sure to delete ${productColor.name}?`}
            onConfirm={confirmDelete(productColor)}
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
    function  processData(productColors) {
      const toTrimStringLower = (value) => value.trim().toString().toLowerCase()
      return searchKey ? 
      productColors.filter((productColor) => toTrimStringLower(productColor.name)
      .includes(toTrimStringLower(searchKey))) 
      : productColors
    }
    return processData(productColors)
  }

  // function csv(){
  //   const hasData = dataSource().length
  //   const header = [[`Start Date:${dateFrom}`, `End Date:${dateTo}`, '', '']]

  //   const body = hasData ?
  //   [['Name', 'Brand', 'Product', 'Date Created'], ...dataSource().map(({name, brand, product, created_at}) => 
  //   Object.values({name, brand: brand?.name, product: `${product?.name} | ${product?.price_per_square_feet}/sqft`, created_at: moment(created_at).format('LLLL')}))]
  //   : [[ '','No Data Available' ]]
 
  //   return {
  //     filename: `product-color-variants-${moment().format('LL').toLocaleLowerCase()}.csv`,
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

   const onEdit = (productColor) => () => {
    form.setFieldsValue(productColor)
    setConfig([true, 'edit', productColor])
  }

  const verbsOptions = { message, form, setConfig, setImage}
 
  const confirmDelete = (productColor) => () => dispatch(deleteProductColor(productColor, verbsOptions))
 
  const onSubmit = async (productColor) => { 
 
    const getImage = async (photo) => photo ? await imageUpload({ destination: 'product_color', photo }) : imageUrl
 
    if (actionType === 'add') {
      const photo = await getImage(imageUrl)
      dispatch(addProductColor({...productColor, photo}, verbsOptions))
    }
    if (actionType === 'edit') {
      const photo = await getImage(imageUrl?.includes('base64') ? imageUrl : '')
      dispatch(updateProductColor({ ...productColor, id: selectedProductColor.id, photo}, verbsOptions))
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
    <main className='product-colors'>
        <PrintComponent {...props} ref={componentRef}>
        <h1 className='print-view-content-title'>Color Variants</h1>
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
        const src = photo ? (process.env.REACT_APP_API_PRODUCT_COLOR_PHOTO + photo) 
        : NoPhoto
        return <img src={src} width='40' height='40' alt='brand'/>
        }
        },
        {
        title: 'Name',
        dataIndex: 'name',
        render: (value ) =>  <span className='color-name'>{value}</span>
        },
        {
        title: 'Brand',
        dataIndex: 'brand',
        render: (brand,record) => brand?.name
        },
        {
        title: 'Product',
        dataIndex: 'product',
        render: (product,record) => `${product?.name} | ${product?.price_per_square_feet}/sqft`
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
        <h1 className='title'>Color Variants</h1>
        <Button className='btn-print' type='primary' loading={isPrintLoading} onClick={handlePrint}><PrinterOutlined /> Print Report</Button>
{/* 
         <Button className='btn-export'>
          <CSVLink {...csv()}><CgSoftwareDownload/>Export</CSVLink>
         </Button> */}
        <Search onSearch={onSearch}/>
        <RangePicker
            onChange={onChangeDate}
            disabled={isLoadingProductColors}
            className='range-date'
            format='MM/DD/YYYY'
            allowEmpty={true}
            />
        <Button className='btn-add-product-color' type='primary' onClick={openModal}>Add Product Color Variant</Button>
        <Table attributes={{ dataSource, isLoading: isLoadingProductColors, isSearching, columns}} className='product-colors-table'/>
        {isVisible && <FormModal
        isVisible={isVisible}
        actionType={actionType}
        closeModal={closeModal}
        setConfig={setConfig}
        isLoading={isLoadingProductColors}
        form={form}
        onSubmit={onSubmit}
        imageUrl={imageUrl}
        uploadImage={uploadImage}
        modalWidth={500}
        brands={brands}
        products={products}
      />}
    </main>
  )
}