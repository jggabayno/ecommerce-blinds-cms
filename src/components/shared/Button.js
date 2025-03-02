import Button from 'antd/lib/button';
import Grid from 'antd/lib/grid';
import helpers from '../../services/helpers'
 
export default function CustomButton({onClick, children, htmlType, ...restProps}) {
 
    const screens = Grid.useBreakpoint()

    const propsClickorHTMLtype = htmlType === 'submit' ?  { htmlType } : { onClick }

    return <Button  
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
     {...propsClickorHTMLtype} {...restProps}>{children}</Button>
}
