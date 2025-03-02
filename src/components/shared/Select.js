import Select from 'antd/lib/select';
import Grid from 'antd/lib/grid';
import helpers from '../../services/helpers'

export default function CustomSelect({children, ...restProps}) {
    
    const screens = Grid.useBreakpoint()

    return (
        <Select
            {...restProps}
            {...helpers.matchedViewport(screens,
                {
                    xxl: 'large',
                    xl: 'large',
                    lg: 'large',
                    md: 'large',
                    sm: 'middle',
                    xs: 'middle'
                }
                )}
            onSelect={restProps.onSelect}
            filterOption={(input, option) => option?.children?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0}
            optionFilterProp="children"
            showSearch
        >
           {children}
         </Select>
  
    )
}
