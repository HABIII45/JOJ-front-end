// src/routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PaymentSummary from '../pages/public/PaymentSummary';
import LoginPage from '../pages/public/LoginPage';
import RegisterResultPage from '../pages/public/RegisterResultPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register-result" element={<RegisterResultPage />} />
      <Route path="/payment/summary" element={<PaymentSummary />} />
      <Route path="*" element={<Navigate to="/register-result" replace />} />
    </Routes>
  );
};

export default AppRoutes;
