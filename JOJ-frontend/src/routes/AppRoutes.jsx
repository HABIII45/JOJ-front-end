import { Routes, Route, Navigate } from "react-router-dom";

// ── Pages publiques ──────────────────────────────────────────────────────────
import LoginPage          from "../pages/public/LoginPage";
import Events             from "../pages/public/Events";
import EventDetail        from "../pages/public/EventsDetails";
import VenteBilletPage    from "../pages/public/VenteBilletPage";
import PaymentSummary     from "../pages/public/PaymentSummary";
import RegisterResultPage from "../pages/public/RegisterResultPage";
import GestionResultatPage from "../pages/public/GestionResultatPage";
import Sites              from "../pages/public/Site";
import DetailSite         from "../pages/public/DetailSite";
import ParamsPage         from "../pages/public/ParamsPage";

// ── Pages admin ──────────────────────────────────────────────────────────────
import Dashboard          from "../pages/admin/Dashboard";
import Disciplines        from "../pages/admin/Games";
import AdminSites         from "../pages/admin/AdminSites";
import SiteDetail         from "../pages/admin/SitesDetail";
import SiteForm           from "../pages/admin/SiteForm";
import GestionEvents      from "../pages/admin/GestionEvents";
import FormEvent          from "../pages/admin/EventForm";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Authentification */}
      <Route path="/login"             element={<LoginPage />} />

      {/* Billetterie & paiements */}
      <Route path="/ventbillet"        element={<VenteBilletPage />} />
      <Route path="/payment/summary"   element={<PaymentSummary />} />

      {/* Résultats */}
      <Route path="/resultats"         element={<GestionResultatPage />} />
      <Route path="/register-result"   element={<RegisterResultPage />} />

      {/* Sites publics */}
      <Route path="/sites"             element={<Sites />} />
      <Route path="/sites/:id"         element={<DetailSite />} />

      {/* Événements publics */}
      <Route path="/evenements"        element={<Events />} />

      {/* Paramètres */}
      <Route path="/parametres"        element={<ParamsPage />} />

      {/* ── Admin ── */}
      <Route path="/dashboard"         element={<Dashboard />} />
      <Route path="/disciplines"       element={<Disciplines />} />

      {/* Gestion sites admin */}
      <Route path="/admin/sites"       element={<AdminSites />} />
      <Route path="/admin/sites/:id"   element={<SiteDetail />} />
      <Route path="/sites/ajout"       element={<SiteForm />} />

      {/* Gestion événements admin */}
      <Route path="/events"            element={<GestionEvents />} />
      <Route path="/events/create"     element={<FormEvent />} />
      <Route path="/events/:id"        element={<EventDetail />} />
      <Route path="/events/:id/edit"   element={<FormEvent />} />

      {/* Accueil → redirige vers events */}
      <Route path="/"                  element={<Navigate to="/events" replace />} />

      {/* Route inconnue */}
      <Route path="*"                  element={<Navigate to="/resultats" replace />} />
    </Routes>
  );
};

export default AppRoutes;
