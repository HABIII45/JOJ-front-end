import { Routes, Route } from 'react-router-dom'
import Sites from './pages/public/Site'
import DetailSite from './pages/public/DetailSite'
import SiteForm from './pages/admin/SiteForm'
import CompetiteurForm from './pages/admin/CompetiteurForm'

export default function AppRoutes() {
  return (
    <Routes>
        <Route path='/sites' element = {<Sites/>}></Route>
        <Route path='/sites/:id' element = {<DetailSite/>}></Route>
        <Route path='/sites/ajout' element = {<SiteForm/>}></Route>
        <Route path='/equipes/ajout' element = {<CompetiteurForm/>}></Route>
    </Routes>
  )
}
