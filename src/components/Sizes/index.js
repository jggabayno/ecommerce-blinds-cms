import {useState, useEffect, useRef, useCallback} from 'react'

import { useSelector, useDispatch } from 'react-redux';
import {fetchProductSizesWithDateFilter, addProductSize, updateProductSize, deleteProductSize} from '../../states/productSizes/actions'
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
import { CSVLink } from "react-csv";
import RangePicker from '../shared/RangePicker'

import { useReactToPrint } from 'react-to-print'
import PrintComponent from '../shared/PrintComponent';
import { PrinterOutlined } from '@ant-design/icons';
import AntdTable from 'antd/lib/table'

export default function ProductSizes(props) {

  const [rangeDate, setRangeDate] = useState()
  const [dateFrom, dateTo] = rangeDate || ['','']
  const onChangeDate = (ymd) => setRangeDate(ymd?.map(date => moment(date).format('YYYY-MM-DD')))


  const [searchKey, setSearchKey] = useState('')
  const isSearching = searchKey.length >= 1
  const [config, setConfig] = useState([false, null, null])
  const [isVisible, actionType, selectedProductSize] = config
  const [image, setImage] = useState([null, null]);
  const [, imageUrl] = image;

  const [form] = Form.useForm();
  const dispatch = useDispatch()
  const {isLoading, data: productSizes} = useSelector((state) => state.productSizes)

  
  useEffect(() => {dispatch(fetchProductSizesWithDateFilter({dateFrom,dateTo}))}, [dispatch,dateFrom,dateTo])

  const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        sorter: (a, b) => a.name.localeCompare(b.name)
      },
      {
        title: 'Multiplier',
        dataIndex: 'multiplier',
        sorter: (a, b) => a.multiplier.localeCompare(b.multiplier),
        render: (multiplier) => multiplier?.toLocaleString()
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
  
        const productSize = productSizes.find((productSize) => productSize.id === row.id)

        return (
        <Space size="middle">
          <div onClick={onEdit(productSize)}>Edit</div>          
          <Popconfirm
            title={`Are you sure to delete ${productSize.name}?`}
            onConfirm={confirmDelete(productSize)}
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
    function  processData(productSizes) {
      const toTrimStringLower = (value) => value.trim().toString().toLowerCase()
      return searchKey ? 
      productSizes.filter((productSize) => toTrimStringLower(productSize.name)
      .includes(toTrimStringLower(searchKey))) 
      : productSizes
    }
    return processData(productSizes.sort((a,c) => a.multiplier - c.multiplier))
  }

  // function csv(){
  //   const hasData = dataSource().length
  //   const header = [[`Start Date:${dateFrom}`, `End Date:${dateTo}`, '', '']]

  //   const body = hasData ?
  //   [['Name', 'Multiplier', 'Date Created'], ...dataSource().map(({name, multiplier, created_at}) => 
  //   Object.values({name, multiplier: multiplier?.toLocaleString(), created_at: moment(created_at).format('LLLL')}))]
  //   : [[ '','No Data Available', '' ]]

  //   return {
  //     filename: `product-sizes-${moment().format('LL').toLocaleLowerCase()}.csv`,
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
  }
  
  const closeModal = () => {
    setConfig([false, null, null])
    form.resetFields()
  }

   const onEdit = (productSize) => () => {
    form.setFieldsValue(productSize)
    setConfig([true, 'edit', productSize])
  }

  const verbsOptions = { message, form, setConfig, setImage}

  const confirmDelete = (productSize) => () => dispatch(deleteProductSize(productSize, verbsOptions))
 
  const onSubmit = async (productSize) => { 
    if (actionType === 'add') dispatch(addProductSize(productSize, verbsOptions))
    if (actionType === 'edit') dispatch(updateProductSize({ ...productSize, id: selectedProductSize?.id}, verbsOptions))
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
    <main className='product-sizes'>
           <PrintComponent {...props} ref={componentRef}>
    <h1 className='print-view-content-title'>Product Sizes</h1>
    <div className='print-view-content-range-date'>
    {`Start Date: ${dateFrom ? dateFrom : 'None'} - End Date: ${dateTo ? dateTo : 'None'}`}
    </div>
    <AntdTable
      className='print-view-content-table'
      columns={
      [
      {
      title: 'Name',
      dataIndex: 'name',
      },
      {
      title: 'Multiplier',
      dataIndex: 'multiplier',
      render: (multiplier) => multiplier?.toLocaleString()
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
        <h1 className='title'>Product Sizes</h1>
         {/* <Button className='btn-export'>
          <CSVLink {...csv()}><CgSoftwareDownload/>Export</CSVLink>
         </Button> */}
                 <Button className='btn-print' type='primary' loading={isPrintLoading} onClick={handlePrint}><PrinterOutlined /> Print Report</Button>

        <Search onSearch={onSearch}/>
        <RangePicker
            onChange={onChangeDate}
            disabled={isLoading}
            className='range-date'
            format='MM/DD/YYYY'
            allowEmpty={true}
            />
        <Button className='btn-add-product-size' type='primary' onClick={openModal}>Add Product Size</Button>
        <Table attributes={{ dataSource, isLoading: isLoading, isSearching, columns}} className='product-size-table'/>
        {isVisible && <FormModal
        isVisible={isVisible}
        actionType={actionType}
        closeModal={closeModal}
        setConfig={setConfig}
        isLoading={isLoading}
        form={form}
        onSubmit={onSubmit}
        imageUrl={imageUrl}
        modalWidth={400}
      />}
    </main>
  )
}