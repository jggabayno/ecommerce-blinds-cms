import { useSelector } from 'react-redux';
import { useLocation, Routes, Route} from "react-router-dom"
import './App.scss'

import useRoutes from '../routes'
 
import Layout from './shared/Layout'
import useBreakPoints from '../hooks/useBreakPoints'
export default function App() {

  const screens = useBreakPoints()
  const {pathname} = useLocation()
  const auth = useSelector(state => state.auth)
  
  const routes = useRoutes({auth, pathname})
  
  const mappedRoutes = <Routes>{routes.map(route => <Route key={route.path} {...route} />)}</Routes>

  if (auth.isLoggedIn) return <Layout auth={auth} screens={screens} routes={routes}>{mappedRoutes}</Layout>

  return mappedRoutes
 
}