// src/routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PaymentSummary from '../pages/public/PaymentSummary';
import LoginPage from '../pages/public/LoginPage';
import RegisterResultPage from '../pages/public/RegisterResultPage';
<<<<<<< Updated upstream
=======
import VenteBilletPage from '../pages/public/VenteBilletPage';
import GestionResultatPage from '../pages/public/GestionResultatPage';
>>>>>>> Stashed changes

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register-result" element={<RegisterResultPage />} />
<<<<<<< Updated upstream
=======
      <Route path="/ventbillet" element={<VenteBilletPage />} />
      <Route path="/resultats" element={<GestionResultatPage />} />
>>>>>>> Stashed changes
      <Route path="/payment/summary" element={<PaymentSummary />} />
      {/* Toute URL sans route définie redirige vers /ventbillet */}
      <Route path="*" element={<Navigate to="/ventbillet" replace />} />
    </Routes>
  );
};

export default AppRoutes;
