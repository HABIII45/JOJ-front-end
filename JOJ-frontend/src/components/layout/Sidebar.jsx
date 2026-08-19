import "./Sidebar.css";
import JOJlogo from "../../assets/images/JOJlogo.jpg";
import { useAuth } from "../../context/AuthContext"; 

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

//   Recupere l'utilisateur connecte et la deconnexion
  const { utilisateur, seDeconnecter } = useAuth(); 

  // Fonction pour vérifier les permissions
  const aAcces = (permission) => {
    if (!utilisateur) return false;
    if (utilisateur.role === "superadmin") return true;
    return utilisateur.permissions?.includes(permission);
  };

  const isResultatsActif = routesResultats.some((r) => location.pathname.startsWith(r));
  const isBilletsActif   = routesBillets.some((r) => location.pathname.startsWith(r));

  // Deconnexion
  const handleDeconnexion = (e) => {
    e.preventDefault(); 
    seDeconnecter();
  };

  return (
    <div className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <img src={JOJlogo} alt="JOJ Events" />
      </div>

      {/* Navigation */}
      <nav className="navigation">
        {/* Accessible à tous les admins connectés */}
        <NavLink to="/dashboard">
          <LayoutDashboard size={19} />
          <span>Dashboard</span>
        </NavLink>

        {/* ROUTES POUR PERMISSION JEUX */}
        {aAcces("JEUX") && (
          <>
            <NavLink to="/events">
              <CalendarDays size={19} />
              <span>Événements</span>
            </NavLink>

            <NavLink to="/disciplines">
              <Trophy size={19} />
              <span>Disciplines</span>
            </NavLink>

            <NavLink to="/sites">
              <MapPin size={19} />
              <span>Sites</span>
            </NavLink>

            <NavLink to="/categories">
              <Tags size={19} />
              <span>Catégories</span>
            </NavLink>

            <NavLink to="/equipes">
              <UserRound size={19} />
              <span>Équipes</span>
            </NavLink>
          </>
        )}

        {/* ROUTES POUR PERMISSION ACTUALITES */}
        {aAcces("ACTUALITES") && (
          <>
            <NavLink to="/actualites">
              <Newspaper size={19} />
              <span>Actualités</span>
            </NavLink>

            <NavLink to="/resultats" className={isResultatsActif ? "active" : ""}>
              <Medal size={19} />
              <span>Résultats</span>
            </NavLink>
          </>
        )}

        {/* RUTES POUR UTILISATEURS */}
        {aAcces("UTILISATEURS") && (
          <>
            <NavLink to="/ventbillet" className={isBilletsActif ? "active" : ""}>
              <Ticket size={19} />
              <span>Billets</span>
            </NavLink>

            <NavLink to="/utilisateurs">
              <Users size={19} />
              <span>Utilisateurs</span>
            </NavLink>
          </>
        )}
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-separator"></div>

        {/* LIEN COMMUN */}
        <NavLink to="/parametres">
          <Settings size={19} />
          <span>Paramètres</span>
        </NavLink>

        {/* Deconnexion  */}
        <button onClick={handleDeconnexion} className="sidebar-logout-btn">
          <LogOut size={19} />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );
}
