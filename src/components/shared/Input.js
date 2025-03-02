import Input from 'antd/lib/input';
import InputNumber from 'antd/lib/input-number';

import Grid from 'antd/lib/grid';
import helpers from '../../services/helpers'

export default function CustomInput({type,...restProps}) {

    const screens = Grid.useBreakpoint()
    
    if (type === 'password') {
       return <Input.Password {...restProps} 
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
        />
    }

      
    if (type === 'number') {
        return <InputNumber {...restProps} 
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
             onKeyPress={helpers.onPreventNumberOnly}

         />
     }

    if (type === 'textarea') {
        return <Input.TextArea {...restProps} 
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
         />
     }
    
 return <Input {...restProps} 
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

 />
    
 

}