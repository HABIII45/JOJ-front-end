// src/components/Sidebar.jsx
import "./Sidebar.css";
import JOJlogo from "../../assets/images/JOJlogo.jpg";
// ❌ SUPPRIMEZ CETTE LIGNE : import { AuthProvider } from "../../contexts/AuthContext";
import { useAuth } from "../../contexts/AuthContext"; // ✅ AJOUTEZ CECI

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
  LogOut
} from "lucide-react";

import { NavLink, useLocation } from "react-router-dom";

const routesResultats = ["/resultats", "/register-result"];
const routesBillets = ["/ventbillet"];

export function Sidebar() {
  const location = useLocation();

  const { utilisateur, seDeconnecter, chargement } = useAuth(); 

  // Gestion du chargement : si on est en train de charger, on affiche rien ou un spinner
  if (chargement) {
    return <div className="sidebar-loading">Chargement...</div>;
  }

  // Fonction pour vérifier les permissions
  const aAcces = (permission) => {
    if (!utilisateur) return false;
    if (utilisateur.role === "superadmin") return true;
    return utilisateur.permissions?.includes(permission);
  };

  const isResultatsActif = routesResultats.some((r) => location.pathname.startsWith(r));
  const isBilletsActif   = routesBillets.some((r) => location.pathname.startsWith(r));

  // Deconnexion
  const handleDeconnexion = async (e) => {
    e.preventDefault(); 
    await seDeconnecter();
    window.location.href = "/"; 
  };

  return (
    <div className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <img src={JOJlogo} alt="JOJ Events" />
      </div>

      {/* Navigation */}
      <nav className="navigation">
        {/* Accessible à tous les admins connectés (Dashboard) */}
        {utilisateur && (
          <NavLink to="/dashboard">
            <LayoutDashboard size={19} />
            <span>Dashboard</span>
          </NavLink>
        )}

        {/* ROUTES POUR PERMISSION JEUX */}
        {aAcces("JEUX") && (
          <>
            <NavLink to="/admin/evenements"> {/* Assurez-vous que les chemins correspondent à vos routes */}
              <CalendarDays size={19} />
              <span>Événements</span>
            </NavLink>

            <NavLink to="/admin/disciplines">
              <Trophy size={19} />
              <span>Disciplines</span>
            </NavLink>

            <NavLink to="/admin/sites">
              <MapPin size={19} />
              <span>Sites</span>
            </NavLink>

            <NavLink to="/admin/categories">
              <Tags size={19} />
              <span>Catégories</span>
            </NavLink>

            <NavLink to="/admin/equipes">
              <UserRound size={19} />
              <span>Équipes</span>
            </NavLink>
          </>
        )}

        {/* ROUTES POUR PERMISSION ACTUALITES / RESULTATS */}
        {aAcces("ACTUALITES") && (
          <>
            <NavLink to="/admin/actualites">
              <Newspaper size={19} />
              <span>Actualités</span>
            </NavLink>

            <NavLink to="/admin/resultats" className={isResultatsActif ? "active" : ""}>
              <Medal size={19} />
              <span>Résultats</span>
            </NavLink>
          </>
        )}

        {/* ROUTES POUR UTILISATEURS / BILLETS */}
        {aAcces("UTILISATEURS") && (
          <>
            <NavLink to="/admin/ventbillet" className={isBilletsActif ? "active" : ""}>
              <Ticket size={19} />
              <span>Billets</span>
            </NavLink>

            <NavLink to="/admin/utilisateurs">
              <Users size={19} />
              <span>Utilisateurs</span>
            </NavLink>
          </>
        )}
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-separator"></div>

        {/* LIEN COMMUN (Paramètres) */}
        {utilisateur && (
          <NavLink to="/admin/parametres">
            <Settings size={19} />
            <span>Paramètres</span>
          </NavLink>
        )}

        {/* Deconnexion */}
        {utilisateur && (
          <button onClick={handleDeconnexion} className="sidebar-logout-btn">
            <LogOut size={19} />
            <span>Déconnexion</span>
          </button>
        )}
      </div>
    </div>
  );
}