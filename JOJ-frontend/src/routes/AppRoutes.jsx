import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import  ChatbotAssistant  from "../components/chat/Chatbot";

// ── Pages publiques ──────────────────────────────────────────────────────────
import Home               from "../pages/public/Home";
import LoginPage          from "../pages/public/LoginPage";
import Events             from "../pages/public/Events";
import EventDetail        from "../pages/public/EventsDetails";
import VenteBilletPage    from "../pages/public/VenteBilletPage";
import BilletsPage        from "../pages/public/BilletsPage";
import PaymentSummary     from "../pages/public/PaymentSummary";
import RegisterResultPage from "../pages/public/RegisterResultPage";
import GestionResultatPage from "../pages/public/GestionResultatPage";
import Resultats          from "../pages/public/Results";
import Sites              from "../pages/public/Site";
import DetailSite         from "../pages/public/DetailSite";
import ParamsPage         from "../pages/public/ParamsPage";
import { DisciplinesGame } from "../pages/public/Game";
import CreerActualite     from "../pages/admin/actualites";

// ── Pages admin ──────────────────────────────────────────────────────────────
import Dashboard          from "../pages/admin/Dashboard";
import GamesList          from "../pages/admin/Games";
import CompetiteurForm    from "../pages/admin/CompetiteurForm";
import AdminSites         from "../pages/admin/AdminSites";
import SiteDetail         from "../pages/admin/SitesDetail";
import SiteForm           from "../pages/admin/SiteForm";
import GestionEvents      from "../pages/admin/GestionEvents";
import FormEvent          from "../pages/admin/EventForm";
import AjoutAdminPage     from "../pages/admin/AjoutAdminPage";

import { routesAdmin } from './AdminRoutes'; 



const AppRoutes = () => {
  const location = useLocation();

  const isBackoffice =
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/parametres') ||
    location.pathname === '/dashboard';

  const renderRoutes = (routes) => {
    return routes.map((route, index) => (
      <Route key={index} path={route.path} element={route.element}>
        {route.children && renderRoutes(route.children)}
      </Route>
    ));
  };

  return (
    <>
      <Routes>
        {/* ── Accueil & Public ── */}
        <Route path="/" element={<Home />} />
        <Route path="/disciplines" element={<DisciplinesGame />} />
        <Route path="/jeux" element={<DisciplinesGame />} />
        <Route path="/actualites" element={<CreerActualite />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register-result" element={<RegisterResultPage />} />
        <Route path="/ventbillet" element={<VenteBilletPage />} />
        <Route path="/billets" element={<BilletsPage />} />
        <Route path="/mes-billets" element={<BilletsPage />} />
        <Route path="/resultats" element={<Resultats />} />
        <Route path="/payment/summary" element={<PaymentSummary />} />

        {/* SITES SECTION */}
        <Route path="/sites" element={<Sites />} />
        <Route path="/sites/:id" element={<DetailSite />} />
        <Route path="/sites/:id/modifier" element={<SiteForm />} />
        <Route path="/sites/ajout" element={<SiteForm />} />

        {/* EVENEMENTS SECTION */}
        <Route path="/events" element={<Events />} />
        <Route path="/evenements" element={<Events />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/events/create" element={<FormEvent />} />

        {/* COMPETITEURS SECTION */}
        <Route path="/competiteurs" element={<GamesList />} />
        <Route path="/competiteurs/ajout" element={<CompetiteurForm />} />

        {/* ROUTES ADMINISTRATION PROTEGEES */}
        {renderRoutes(routesAdmin)}

        {/* Paramètres & Gestion admin */}
        <Route path="/parametres" element={<ParamsPage />} />
        <Route path="/parametres/ajouter-admin" element={<AjoutAdminPage />} />
        <Route path="/admin/ajouter-admin" element={<AjoutAdminPage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>

      {/* Chatbot présent sur toutes les pages publiques et exclu du backoffice */}
      {!isBackoffice && <ChatbotAssistant />}
    </>
  );
};

export default AppRoutes;