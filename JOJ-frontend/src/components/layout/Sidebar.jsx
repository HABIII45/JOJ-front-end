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
  Medal,
  Settings,
  LogOut,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

const routesResultats    = ["/resultats", "/register-result", "/admin/resultats"];
const routesBillets      = ["/ventbillet", "/admin/ventbillet"];
const routesSites        = ["/admin/sites", "/sites"];
const routesCategories   = ["/admin/categories"];
const routesDisciplines  = ["/admin/disciplines", "/disciplines", "/jeux"];
const routesEquipes      = ["/admin/equipes", "/admin/competiteurs", "/competiteurs"];
const routesEvenements   = ["/admin/evenements", "/events"];
const routesActualites   = ["/admin/actualites", "/actualites"];
const routesUtilisateurs = ["/admin/utilisateurs"];
const routesParams       = ["/parametres", "/admin/parametres"];

export function Sidebar() {
  const location = useLocation();
  const { utilisateur, seDeconnecter, chargement } = useAuth();

  if (chargement) {
    return <div className="sidebar-loading">Chargement...</div>;
  }

  const superAdmin = isSuperAdmin(utilisateur);

  const isResultatsActif    = routesResultats.some((r) => location.pathname.startsWith(r));
  const isBilletsActif      = routesBillets.some((r) => location.pathname.startsWith(r));
  const isSitesActif        = routesSites.some((r) => location.pathname.startsWith(r));
  const isCategoriesActif   = routesCategories.some((r) => location.pathname.startsWith(r));
  const isDisciplinesActif  = routesDisciplines.some((r) => location.pathname.startsWith(r));
  const isEquipesActif      = routesEquipes.some((r) => location.pathname.startsWith(r));
  const isEvenementsActif   = routesEvenements.some((r) => location.pathname.startsWith(r));
  const isActualitesActif   = routesActualites.some((r) => location.pathname.startsWith(r));
  const isUtilisateursActif = routesUtilisateurs.some((r) => location.pathname.startsWith(r));
  const isParamsActif       = routesParams.some((r) => location.pathname.startsWith(r));

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

      {/* Navigation filtrée selon les permissions strictes */}
      <nav className="navigation">
        {/* 1. Dashboard : accessible à tous les connectés */}
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

        {/* ── MODULES JEUX ── */}
        {/* Événements */}
<<<<<<< HEAD
        {(superAdmin || hasPermission(utilisateur, PERMISSIONS.JEUX)) && (
=======
        {(superAdmin || hasPermission(utilisateur, PERMISSIONS.EVENEMENTS)) && (
>>>>>>> origin/feature/copistable
          <NavLink
            to="/admin/evenements"
            className={isEvenementsActif ? "active" : ""}
          >
            <CalendarDays size={19} />
            <span>Événements</span>
          </NavLink>
        )}

        {/* Disciplines */}
<<<<<<< HEAD
        {(superAdmin || hasPermission(utilisateur, PERMISSIONS.JEUX)) && (
          <NavLink to="/admin/disciplines">
=======
        {(superAdmin || hasPermission(utilisateur, PERMISSIONS.DISCIPLINES)) && (
          <NavLink
            to="/admin/disciplines"
            className={isDisciplinesActif ? "active" : ""}
          >
>>>>>>> origin/feature/copistable
            <Trophy size={19} />
            <span>Disciplines</span>
          </NavLink>
        )}

        {/* Sites */}
<<<<<<< HEAD
        {(superAdmin || hasPermission(utilisateur, PERMISSIONS.JEUX)) && (
=======
        {(superAdmin || hasPermission(utilisateur, PERMISSIONS.SITES)) && (
>>>>>>> origin/feature/copistable
          <NavLink
            to="/admin/sites"
            className={isSitesActif ? "active" : ""}
          >
            <MapPin size={19} />
            <span>Sites</span>
          </NavLink>
        )}

        {/* Catégories */}
<<<<<<< HEAD
        {(superAdmin || hasPermission(utilisateur, PERMISSIONS.JEUX)) && (
          <NavLink to="/admin/categories">
=======
        {(superAdmin || hasPermission(utilisateur, PERMISSIONS.CATEGORIES)) && (
          <NavLink
            to="/admin/categories"
            className={isCategoriesActif ? "active" : ""}
          >
>>>>>>> origin/feature/copistable
            <Tags size={19} />
            <span>Catégories</span>
          </NavLink>
        )}

<<<<<<< HEAD
        {/* Compétiteurs / Équipes */}
        {(superAdmin || hasPermission(utilisateur, PERMISSIONS.JEUX)) && (
=======
        {/* Équipes / Compétiteurs */}
        {(superAdmin || hasPermission(utilisateur, PERMISSIONS.EQUIPES)) && (
>>>>>>> origin/feature/copistable
          <NavLink
            to="/admin/equipes"
            className={isEquipesActif ? "active" : ""}
          >
            <Trophy size={19} />
            <span>Équipes</span>
          </NavLink>
        )}

        {/* ── MODULES ACTUALITÉS ── */}
        {/* Actualités */}
        {(superAdmin || hasPermission(utilisateur, PERMISSIONS.ACTUALITES)) && (
          <NavLink
            to="/admin/actualites"
            className={isActualitesActif ? "active" : ""}
          >
            <Newspaper size={19} />
            <span>Actualités</span>
          </NavLink>
        )}

        {/* Résultats */}
<<<<<<< HEAD
        {(superAdmin || hasPermission(utilisateur, PERMISSIONS.ACTUALITES)) && (
=======
        {(superAdmin || hasPermission(utilisateur, PERMISSIONS.RESULTATS)) && (
>>>>>>> origin/feature/copistable
          <NavLink
            to="/admin/resultats"
            className={isResultatsActif ? "active" : ""}
          >
            <Medal size={19} />
            <span>Résultats</span>
          </NavLink>
        )}

<<<<<<< HEAD
        {/* Billets */}
        {(superAdmin || hasPermission(utilisateur, PERMISSIONS.TOUT)) && (
=======
        {/* ── BILLETTERIE & ADMIN (RÉSERVÉ EXCLUSIVEMENT AUX SUPERADMINS) ── */}
        {superAdmin && (
>>>>>>> origin/feature/copistable
          <NavLink
            to="/admin/ventbillet"
            className={isBilletsActif ? "active" : ""}
          >
            <Ticket size={19} />
            <span>Vente Billets</span>
          </NavLink>
        )}

        {/* Gestion des Utilisateurs */}
        {(superAdmin || hasPermission(utilisateur, PERMISSIONS.UTILISATEURS)) && (
          <NavLink
            to="/admin/utilisateurs"
            className={isUtilisateursActif ? "active" : ""}
          >
            <Users size={19} />
            <span>Utilisateurs</span>
          </NavLink>
        )}

        {/* Paramètres */}
        {(superAdmin || hasPermission(utilisateur, PERMISSIONS.PARAMETRES)) && (
          <NavLink
            to="/admin/parametres"
            className={isParamsActif ? "active" : ""}
          >
            <Settings size={19} />
            <span>Paramètres</span>
          </NavLink>
        )}
      </nav>

      {/* Bas de sidebar : Profil & Bouton Déconnexion garanti */}
      <div className="sidebar-bottom">
        <div className="sidebar-profile">
          <div className="profile-avatar">
            {utilisateur?.first_name?.[0] || utilisateur?.username?.[0] || "A"}
          </div>
          <div className="profile-info">
            <p className="profile-name">
              {utilisateur?.first_name
                ? `${utilisateur.first_name} ${utilisateur.last_name || ""}`.trim()
                : utilisateur?.username || "Administrateur"}
            </p>
            <p className="profile-role">
              {superAdmin ? "Super Admin" : "Administrateur"}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="sidebar-logout-btn"
          onClick={handleDeconnexion}
          title="Se déconnecter"
        >
          <LogOut size={16} />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
