// src/routes/AppRoutes.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import PaymentSummary from '../pages/public/PaymentSummary';
import LoginPage from '../pages/public/LoginPage';
import RegisterResultPage from '../pages/public/RegisterResultPage';
import VenteBilletPage from '../pages/public/VenteBilletPage';
import GestionResultatPage from '../pages/public/GestionResultatPage';
import Sites from '../pages/public/Site';
import DetailSite from '../pages/public/DetailSite';
import SiteForm from '../pages/admin/SiteForm';
import CompetiteurForm from '../pages/admin/CompetiteurForm';
import GamesList from '../pages/admin/Games';

import { routesAdmin } from './AdminRoutes'; 

const AppRoutes = () => {
  const renderRoutes = (routes) => {
    return routes.map((route, index) => (
      <Route key={index} path={route.path} element={route.element}>
        {route.children && renderRoutes(route.children)}
      </Route>
    ));
  };

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/ventbillet" element={<VenteBilletPage />} />
      <Route path="/resultats" element={<GestionResultatPage />} />
      <Route path="/payment/summary" element={<PaymentSummary />} />

      {/* SITES SECTION */}
      <Route path='/sites' element = {<Sites/>}></Route>
      <Route path='/sites/:id' element = {<DetailSite/>}></Route>



      {renderRoutes(routesAdmin)}

      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />

    </Routes>
  );
};

export default AppRoutes;
