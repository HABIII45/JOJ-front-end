import { Routes, Route } from 'react-router-dom'
import Sites from './pages/public/Site'
import DetailSite from './pages/public/DetailSite'
export default function AppRoutes() {
  return (
    <Routes>
        <Route path='/sites' element = {<Sites/>}></Route>
        <Route path='/sites/:id' element = {<DetailSite/>}></Route>
    </Routes>
  )
}
