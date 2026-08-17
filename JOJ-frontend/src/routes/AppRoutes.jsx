// src/routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PaymentSummary from '../pages/public/PaymentSummary';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/payment/summary" element={<PaymentSummary />} />
    </Routes>
  );
};

export default AppRoutes;
