import DatePicker from 'antd/lib/date-picker';
import Grid from 'antd/lib/grid';
import helpers from '../../services/helpers'

export default function CustomRangePicker({...restProps}) {

    const screens = Grid.useBreakpoint()
 
    return (
        <DatePicker.RangePicker
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
        {...restProps}
        placeholder={['Start Date','End Date']}
        />
       
    )
}
