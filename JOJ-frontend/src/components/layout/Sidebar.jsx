// src/components/layout/Sidebar.jsx
import "./Sidebar.css";
import JOJlogo from "../../assets/images/JOJlogo.jpg";
import { useAuth } from "../../contexts/useAuth";
import {
  isSuperAdmin,
  hasPermission,
  PERMISSIONS,
} from "../../utils/permissions";
import {
  LayoutDashboard,
  CalendarDays,
  Trophy,
  MapPin,
  Tags,
  Newspaper,
  Ticket,
  Users,
  UserRound,
  Medal,
  Settings,
  LogOut,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

const routesResultats   = ["/resultats", "/register-result", "/admin/resultats"];
const routesBillets     = ["/ventbillet", "/admin/ventbillet"];
const routesSites       = ["/admin/sites", "/sites"];
const routesCategories  = ["/admin/categories"];
const routesDisciplines = ["/admin/disciplines", "/disciplines", "/jeux"];
const routesEquipes     = ["/admin/equipes", "/competiteurs"];
const routesEvenements  = ["/admin/evenements", "/events"];
const routesActualites  = ["/admin/actualites", "/actualites"];
const routesParams      = ["/parametres", "/admin/parametres"];

export function Sidebar() {
  const location = useLocation();
  const { utilisateur, seDeconnecter, chargement } = useAuth();

  if (chargement) {
    return <div className="sidebar-loading">Chargement...</div>;
  }

  const superAdmin = isSuperAdmin(utilisateur);
  const isAdmin = superAdmin || Boolean(utilisateur);

  const isResultatsActif   = routesResultats.some((r) => location.pathname.startsWith(r));
  const isBilletsActif     = routesBillets.some((r) => location.pathname.startsWith(r));
  const isSitesActif       = routesSites.some((r) => location.pathname.startsWith(r));
  const isCategoriesActif  = routesCategories.some((r) => location.pathname.startsWith(r));
  const isDisciplinesActif = routesDisciplines.some((r) => location.pathname.startsWith(r));
  const isEquipesActif     = routesEquipes.some((r) => location.pathname.startsWith(r));
  const isEvenementsActif  = routesEvenements.some((r) => location.pathname.startsWith(r));
  const isActualitesActif  = routesActualites.some((r) => location.pathname.startsWith(r));
  const isParamsActif      = routesParams.some((r) => location.pathname.startsWith(r));

  const handleDeconnexion = async (e) => {
    e.preventDefault();
    await seDeconnecter();
    window.location.href = "/login";
  };

  return (
    <div className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <img src={JOJlogo} alt="JOJ Events" />
      </div>

      {/* Navigation */}
      <nav className="navigation">
        {/* Dashboard accessible à tous les admins connectés */}
        {utilisateur && (
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              isActive || location.pathname === "/dashboard" ? "active" : ""
            }
          >
            <LayoutDashboard size={19} />
            <span>Dashboard</span>
          </NavLink>
        )}

        {/* Événements */}
        {(isAdmin || hasPermission(utilisateur, PERMISSIONS.EVENEMENTS)) && (
          <NavLink
            to="/admin/evenements"
            className={isEvenementsActif ? "active" : ""}
          >
            <CalendarDays size={19} />
            <span>Événements</span>
          </NavLink>
        )}

        {/* Disciplines */}
        {(isAdmin || hasPermission(utilisateur, PERMISSIONS.DISCIPLINES)) && (
          <NavLink
            to="/admin/disciplines"
            className={isDisciplinesActif ? "active" : ""}
          >
            <Trophy size={19} />
            <span>Disciplines</span>
          </NavLink>
        )}

        {/* Sites */}
        {(isAdmin || hasPermission(utilisateur, PERMISSIONS.SITES)) && (
          <NavLink
            to="/admin/sites"
            className={isSitesActif ? "active" : ""}
          >
            <MapPin size={19} />
            <span>Sites</span>
          </NavLink>
        )}

        {/* Catégories */}
        {(isAdmin || hasPermission(utilisateur, PERMISSIONS.CATEGORIES)) && (
          <NavLink
            to="/admin/categories"
            className={isCategoriesActif ? "active" : ""}
          >
            <Tags size={19} />
            <span>Catégories</span>
          </NavLink>
        )}

        {/* Compétiteurs / Équipes */}
        {(isAdmin || hasPermission(utilisateur, PERMISSIONS.COMPETITEURS)) && (
          <NavLink
            to="/admin/equipes"
            className={isEquipesActif ? "active" : ""}
          >
            <UserRound size={19} />
            <span>Équipes</span>
          </NavLink>
        )}

        {/* Actualités */}
        {(isAdmin || hasPermission(utilisateur, PERMISSIONS.ACTUALITES)) && (
          <NavLink
            to="/admin/actualites"
            className={isActualitesActif ? "active" : ""}
          >
            <Newspaper size={19} />
            <span>Actualités</span>
          </NavLink>
        )}

        {/* Résultats */}
        {(isAdmin || hasPermission(utilisateur, PERMISSIONS.RESULTATS)) && (
          <NavLink
            to="/admin/resultats"
            className={isResultatsActif ? "active" : ""}
          >
            <Medal size={19} />
            <span>Résultats</span>
          </NavLink>
        )}

        {/* Billets */}
        {(isAdmin || hasPermission(utilisateur, PERMISSIONS.BILLETS)) && (
          <NavLink
            to="/ventbillet"
            className={isBilletsActif ? "active" : ""}
          >
            <Ticket size={19} />
            <span>Billets</span>
          </NavLink>
        )}

        {/* Utilisateurs / Administrateurs */}
        {(superAdmin || hasPermission(utilisateur, PERMISSIONS.UTILISATEURS)) && (
          <NavLink to="/parametres/ajouter-admin">
            <Users size={19} />
            <span>Utilisateurs</span>
          </NavLink>
        )}
      </nav>

      {/* Pied de sidebar */}
      <div className="sidebar-bottom">
        <div className="sidebar-separator"></div>

        {/* Paramètres */}
        {utilisateur && (
          <NavLink
            to="/parametres"
            className={isParamsActif ? "active" : ""}
          >
            <Settings size={19} />
            <span>Paramètres</span>
          </NavLink>
        )}

        {/* Déconnexion */}
        {utilisateur && (
          <button
            onClick={handleDeconnexion}
            className="sidebar-logout-btn"
            type="button"
          >
            <LogOut size={19} />
            <span>Déconnexion</span>
          </button>
        )}
      </div>
    </div>
  );
}
