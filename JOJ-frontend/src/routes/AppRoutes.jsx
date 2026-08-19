import { Routes, Route, Navigate } from "react-router-dom";

// Pages publiques
import PaymentSummary from "../pages/public/PaymentSummary";
import LoginPage from "../pages/public/LoginPage";
import RegisterResultPage from "../pages/public/RegisterResultPage";
import VenteBilletPage from "../pages/public/VenteBilletPage";
import GestionResultatPage from "../pages/public/GestionResultatPage";
import Sites from "../pages/public/Site";
import DetailSite from "../pages/public/DetailSite";
import ParamsPage from "../pages/public/ParamsPage";
import Events from "../pages/public/Events";
import EventDetail from "../pages/public/EventsDetails";
     import Dashboard from "./pages/admin/Dashboard";
import Disciplines from "./pages/admin/Games";
import AdminSites from "./pages/admin/AdminSites";
import SiteDetail from "./pages/admin/SitesDetail";

// Pages admin
import SiteForm from "../pages/admin/SiteForm";

import { GestionEvents } from "../pages/admin/GestionEvents";
import { FormEvent } from "../pages/admin/EventForm";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Authentification */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register-result" element={<RegisterResultPage />} />

      {/* Billetterie / résultats */}
      <Route path="/ventbillet" element={<VenteBilletPage />} />
      <Route path="/payment/summary" element={<PaymentSummary />} />
      <Route path="/resultats" element={<GestionResultatPage />} />

      {/* Sites */}
      <Route path="/sites" element={<Sites />} />
      <Route path="/sites/:id" element={<DetailSite />} />
      <Route path="/sites/ajout" element={<SiteForm />} />

      {/* Événements publics */}
      <Route path="/evenements" element={<Events />} />

      {/* Gestion des événements */}
      <Route path="/events" element={<GestionEvents />} />
      <Route path="/events/create" element={<FormEvent />} />
      <Route path="/events/:id" element={<EventDetail />} />
      <Route path="/events/:id/edit" element={<FormEvent />} />


      {/* Paramètres */}
      <Route path="/parametres" element={<ParamsPage />} />

      {/* Accueil */}
      <Route path="/" element={<Navigate to="/events" replace />} />

      {/* Route inconnue */}
      <Route path="*" element={<Navigate to="/resultats" replace />} />
      {/* site admin */}
       <Route path="/dashboard" element={<Dashboard />} />
        <Route path={"/disciplines"} element={<Disciplines />} />
        <Route path={"/sites"} element={<AdminSites />} />
        <Route path="/sites/:id" element={<SiteDetail />} />
    </Routes>
  );
};

export default AppRoutes;