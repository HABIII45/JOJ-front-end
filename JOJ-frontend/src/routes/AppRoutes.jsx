// src/routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PaymentSummary from '../pages/public/PaymentSummary';
import LoginPage from '../pages/public/LoginPage';
import RegisterResultPage from '../pages/public/RegisterResultPage';
import VenteBilletPage from '../pages/public/VenteBilletPage';
import GestionResultatPage from '../pages/public/GestionResultatPage';
import Sites from '../pages/public/Site';
import DetailSite from '../pages/public/DetailSite';
import SiteForm from '../pages/admin/SiteForm';
import ParamsPage from '../pages/public/ParamsPage';
import Dashboard from "../pages/admin/Dashboard"
import Disciplines from '../pages/admin/Games';
import AdminSites from "../pages/admin/AdminSites"
import SiteDetail from "../pages/admin/SitesDetail"
import Utilisateurs from "../pages/admin/Users"
import Home from "../pages/public/Home"
import Resultats from '../pages/public/Results';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register-result" element={<RegisterResultPage />} />
      <Route path="/ventbillet" element={<VenteBilletPage />} />
      {/* <Route path="/resultats" element={<GestionResultatPage />} /> */}
      <Route path="/payment/summary" element={<PaymentSummary />} />
      <Route path="*" element={<Navigate to="/resultats" replace />} />
      <Route path='/sites' element = {<Sites/>}></Route>
      <Route path='/sites/:id' element = {<DetailSite/>}></Route>
      <Route path='/sites/ajout' element = {<SiteForm/>}></Route>
      <Route path="/parametres" element={<ParamsPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path={"/disciplines"} element={<Disciplines />} />
      <Route path={"/sites"} element={<AdminSites />} />
      <Route path="/sites/:id" element={<SiteDetail />} />
      <Route path={"/utilisateurs"} element={<Utilisateurs/>} />
      <Route path={"/"} element={<Home/>} />
      <Route path={"/resultats"} element={<Resultats/>} />
    </Routes>
  );
};

export default AppRoutes;
