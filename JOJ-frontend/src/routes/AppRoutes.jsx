// src/routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PaymentSummary from '../pages/public/PaymentSummary';
import LoginPage from '../pages/public/LoginPage';
import RegisterResultPage from '../pages/public/RegisterResultPage';
import VenteBilletPage from '../pages/public/VenteBilletPage';
import GestionResultatPage from '../pages/public/GestionResultatPage';
import ParamsPage from '../pages/public/ParamsPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register-result" element={<RegisterResultPage />} />
      <Route path="/ventbillet" element={<VenteBilletPage />} />
      <Route path="/resultats" element={<GestionResultatPage />} />
      <Route path="/payment/summary" element={<PaymentSummary />} />
      <Route path="*" element={<Navigate to="/resultats" replace />} />
      <Route path="/parametres" element={<ParamsPage />} />
    </Routes>
  );
};

export default AppRoutes;
