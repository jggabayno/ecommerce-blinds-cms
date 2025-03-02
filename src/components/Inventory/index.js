import {useState, useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux';
import './index.scss'

import Tabs from 'antd/lib/tabs'
import Button from '../shared/Button'
import Table from '../shared/Table'
import Search from '../shared/Search'

import moment from 'moment';
import { CSVLink } from "react-csv";
import { CgSoftwareDownload } from "react-icons/cg";
import NoPhoto from '../../assets/images/no_photo.png'
import Manage from './Manage'

import {fetchBrands} from '../../states/brands/actions'

export default function Inventory(props) {

  const [searchKey, setSearchKey] = useState('')
  const isSearching = searchKey.length >= 1
  
  const [activeParentBrand, setActiveParentBrand] = useState(1)

  const dispatch = useDispatch()
  const {isLoading, data: brands} = useSelector((state) => state.brands)
 
  useEffect(() => {
    dispatch(fetchBrands(true))
  }, [])
  
  function sample(row) {
    const getProductColors = brands.find((f) => f.id === row.brand_id).product_colors
    const selectedProductColor = getProductColors.find(f => f.id === row.id)
    return selectedProductColor
  }

  function getStockMovement(stock_movement){
    const deducted = stock_movement?.filter(row => row.type === 0)?.map(({quantity}) => Number(quantity)).reduce((a,c) => a + c, 0)
    const added = stock_movement?.filter(row => row.type === 1)?.map(({quantity}) => Number(quantity)).reduce((a,c) => a + c, 0)
    const reserved = stock_movement?.filter(row => row.type === 2)?.map(({quantity}) => Number(quantity)).reduce((a,c) => a + c, 0)
    const committed = stock_movement?.filter(row => row.type === 3)?.map(({quantity}) => Number(quantity)).reduce((a,c) => a + c, 0)

    const available = added - deducted
    return available - reserved - committed;
     
  }

  const columns = [
    {
      title: 'Product',
      dataIndex: 'product',
      render: (_, record) => {
        const src = record.photo ? (process.env.REACT_APP_API_PRODUCT_COLOR_PHOTO + record.photo) 
        : NoPhoto
        return (
          <div className='inventory-column-highlight'>
            <img src={src} width='40' height='40' alt='brand'/>
            <span>{record.product?.name} ({record.name})</span>
          </div>
        )
      }
    },
      {
        title: 'Available Stocks',
        dataIndex: 'stock_movement',
        render: stock_movement => getStockMovement(stock_movement)
      }, 
      {
        title: 'Actions',
        dataIndex: 'id',
        render: (_,row) => <div onClick={() => toggleInventoryDrawer(sample(row))} className='manage-stock-link'>Manage Stock</div>
      }
  ]
 
  function dataSource() {
      return brands
  }

  function csv(){
    const hasData = dataSource()?.flatMap(row => row?.product_colors)?.length && dataSource()?.flatMap(row => row?.product_colors).every(row => row != undefined)
    const header = ['Brand','Product','Color Variant','Available Stocks']
    const body = hasData ?
    dataSource()?.flatMap(row => row?.product_colors)?.map(({brand, product, name, stock_movement}) => 
    Object.values({br: brand?.name, product: product.name, name, available_stocks: getStockMovement(stock_movement)}))
    : [[ '','No Data Available', '' ]]

    return {
      filename: `inventory-${moment().format('LL')}.csv`,
      data: [header, ...body]
    }
  }

  const onSearch = () => {
    return {
      search: (key) => setSearchKey(key),
      change: (event) => !event.currentTarget.value && setSearchKey('')
    }
  }

  const [drawerState, setDrawerState] = useState({
    selectedData: {},
    isVisible: false
  })
  
  const toggleInventoryDrawer = (selectedData) => {
    setDrawerState(prevState => ({selectedData, isVisible: !prevState.isVisible}))
  }
 
   return (
    <main className='inventory'>
        <h1 className='title'>Inventory</h1>
         <Button className='btn-export'>
          <CSVLink {...csv()}><CgSoftwareDownload/>Export</CSVLink>
         </Button>
        <Search onSearch={onSearch}/>
         <Tabs
          onChange={(e) => setActiveParentBrand(e)}
          activeKey={activeParentBrand.toString()}
          className='inventory-tabs'
        >
            {dataSource()?.map(({id, name, product_colors = []}) => {
                return (
                <Tabs.TabPane tab={name} key={id
                }>
                  <Table attributes={{ dataSource:() => {
                    function processData(colors) {
                      const toTrimStringLower = (value) => value.trim().toString().toLowerCase()
                      return searchKey ? 
                      colors.filter((color) => toTrimStringLower(color.name)
                      .includes(toTrimStringLower(searchKey))) 
                      : colors
                    }
                    return processData(product_colors) 
                  }
                    
                    
                    , isLoading, isSearching, columns}} />
               </Tabs.TabPane>
                )
            })}
      </Tabs>

    <Manage 
      drawerState={drawerState}
      setDrawerState={setDrawerState}
    />
    </main>
  )
}