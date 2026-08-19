/**
 * Routage JOJ_Events :
 *  - Routes publiques (page d'accueil + sections) avec PublicLayout
 *  - Route /dashboard avec AdminLayout
 * Design : référence maquettes fournies (orange #C25B1E, noir, Poppins).
 * @module App
 */
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/admin/Dashboard";
import Disciplines from "./pages/admin/Games";
import AdminSites from "./pages/admin/AdminSites";
import SiteDetail from "./pages/admin/SitesDetail";
import Utilisateurs from "./pages/admin/Users";
import Home from "./pages/public/Home";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path={"/disciplines"} element={<Disciplines />} />
        <Route path={"/sites"} element={<AdminSites />} />
        <Route path="/sites/:id" element={<SiteDetail />} />
        <Route path={"/utilisateurs"} element={<Utilisateurs/>} />
        <Route path={"/"} element={<Home/>} />
      </Routes>
    </BrowserRouter>
  );
}
