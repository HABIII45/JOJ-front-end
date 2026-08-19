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
import { adminRoutes } from './ProtectedRoutes';
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register-result" element={<RegisterResultPage />} />
      <Route path="/ventbillet" element={<VenteBilletPage />} />
      <Route path="/resultats" element={<GestionResultatPage />} />
      <Route path="/payment/summary" element={<PaymentSummary />} />
      <Route path="*" element={<Navigate to="/resultats" replace />} />

      {/* SITES SECTION */}
      <Route path='/sites' element = {<Sites/>}></Route>
      <Route path='/sites/:id' element = {<DetailSite/>}></Route>
      <Route path='/sites/ajout' element = {<SiteForm/>}></Route>

      {/* COMPETITEURS SECTION */}
      <Route path='/competiteurs' element = {<GamesList/>}></Route>
      <Route path='/competiteurs/ajout' element = {<CompetiteurForm/>}></Route>
      <adminRoutes/>
    </Routes>
  );
};

export default AppRoutes;
