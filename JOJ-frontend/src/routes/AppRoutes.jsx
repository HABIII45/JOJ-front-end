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
import Events from '../pages/public/Events';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register-result" element={<RegisterResultPage />} />
      <Route path="/ventbillet" element={<VenteBilletPage />} />
      <Route path="/resultats" element={<GestionResultatPage />} />
      <Route path="/payment/summary" element={<PaymentSummary />} />
      <Route path="/sites" element={<Sites />} />
      <Route path="/sites/:id" element={<DetailSite />} />
      <Route path="/sites/ajout" element={<SiteForm />} />
      <Route path="/parametres" element={<ParamsPage />} />
      <Route path="/evenements" element={<Events />} />
      <Route path="*" element={<Navigate to="/resultats" replace />} />
    </Routes>
  );
};

export default AppRoutes;