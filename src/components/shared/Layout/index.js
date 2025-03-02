import Header from "./Header"
import Sider from "./Sider"
import Drawer from "./Drawer"
 
export default function Layout({auth, screens, routes, children}) {
    return (
        <div className='layout'>
            <Header auth={auth} screens={screens}/>
            {!screens.xs && <Sider auth={auth} routes={routes}/>}
            {screens.xs && <Drawer auth={auth} routes={routes}/>}
            {children}
        </div>
    )
} 