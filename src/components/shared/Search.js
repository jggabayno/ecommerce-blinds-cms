  
import Grid from 'antd/lib/grid';
import Search from 'antd/lib/input/Search'
import helpers from '../../services/helpers'

export default function CSearch({ placeholder='Search', isLoading, className, onSearch, ...restProps }) {

    const { search, change } = onSearch()
    const screens = Grid.useBreakpoint()
 
    return (
        <Search
            onSearch={search}
            onChange={change}
            className={`search ${className}`}
            placeholder={placeholder}
            loading={isLoading}
            allowClear
            enterButton
            {...restProps}
            {...helpers.matchedViewport(screens,
                {
                    xxl: 'large',
                    xl: 'large',
                    lg: 'large',
                    md: 'large',
                    sm: 'middle',
                    xs: 'middle'
                })
            }
        />
    )
}