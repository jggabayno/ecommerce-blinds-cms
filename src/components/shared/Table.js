import React  from 'react'

import Empty from 'antd/lib/empty';
import Table from 'antd/lib/table';
import Grid from 'antd/lib/grid';

import helpers from '../../services/helpers'

export default function CustomTable({ attributes, ...restProps }) {

    const { dataSource, isLoading, isSearching, columns,
         currentPage, pageSize, total, onPaginate,data
         } = attributes

        const screens = Grid.useBreakpoint()
        const isXs = screens.xs
   
    const paginationConfig = attributes.hasOwnProperty('currentPage') ? {pagination: { current: currentPage, pageSize, total },onChange: onPaginate} : 
    {pagination: { pageSize: 5 }}

    const includeDescription = isLoading ? {description: 'Loading...'} : {}
    
    return (
        <Table
          
            {...helpers.matchedViewport(screens,
                {
                    xxl: 'default',
                    xl: 'default',
                    lg: 'default',
                    md: 'default',
                    sm: 'middle',
                    xs: 'middle'
                }
                )}
            {...paginationConfig}
            rowKey={obj => obj.id}
            loading={isLoading}
            columns={columns}
            dataSource={dataSource()}
            scroll={isXs && { x: 'max-content' }}
            locale={{
                emptyText: (isSearching
                    ?
                    <>
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='No Results Found' />
                    </>
                    : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} {...includeDescription} />)
            }}
            {...restProps}
        />
    )
}