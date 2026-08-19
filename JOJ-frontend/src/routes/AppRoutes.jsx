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

// Pages admin
import SiteForm from "../pages/admin/SiteForm";
import FormEvent from "../pages/admin/EventForm";
import { GestionEvents } from "../pages/admin/GestionEvents";

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

      {/* Paramètres */}
      <Route path="/parametres" element={<ParamsPage />} />

      {/* Accueil */}
      <Route path="/" element={<Navigate to="/events" replace />} />

      {/* Route inconnue */}
      <Route path="*" element={<Navigate to="/resultats" replace />} />
    </Routes>
  );
};

export default AppRoutes;