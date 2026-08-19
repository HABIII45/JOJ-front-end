import "./Sidebar.css";
import JOJlogo from "../../assets/images/JOJlogo.jpg";
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
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";
import { isSuperAdmin, hasPermission, PERMISSIONS } from "../../utils/permissions";

// Pages considérées comme sous-pages de "Résultats"
const routesResultats = ["/resultats", "/register-result"];

// Pages considérées comme sous-pages de "Billets"
const routesBillets = ["/ventbillet", "/payment"];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { utilisateur, seDeconnecter } = useAuth();

  const isResultatsActif = routesResultats.some((r) => location.pathname.startsWith(r));
  const isBilletsActif   = routesBillets.some((r) => location.pathname.startsWith(r));

  const superAdmin = isSuperAdmin(utilisateur);

  const handleDeconnexion = async (e) => {
    e.preventDefault();
    try {
      await seDeconnecter();
    } catch {
      // Nettoyage standard même en cas d'erreur
    } finally {
      navigate("/login");
    }
  };

  return (
    <div className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <img src={JOJlogo} alt="JOJ Events" />
      </div>

      {/* Navigation filtrée selon les droits / permissions */}
      <nav className="navigation">
        {/* Dashboard : Toujours visible pour Superadmin et Admin */}
        <NavLink to="/dashboard">
          <LayoutDashboard size={19} />
          <span>Dashboard</span>
        </NavLink>

        {/* Événements */}
        {(superAdmin || hasPermission(utilisateur, PERMISSIONS.EVENEMENTS)) && (
          <NavLink to="/events">
            <CalendarDays size={19} />
            <span>Événements</span>
          </NavLink>
        )}

        {/* Disciplines */}
        {(superAdmin || hasPermission(utilisateur, PERMISSIONS.DISCIPLINES)) && (
          <NavLink to="/disciplines">
            <Trophy size={19} />
            <span>Disciplines</span>
          </NavLink>
        )}

        {/* Sites */}
        {(superAdmin || hasPermission(utilisateur, PERMISSIONS.SITES)) && (
          <NavLink to="/sites">
            <MapPin size={19} />
            <span>Sites</span>
          </NavLink>
        )}

        {/* Catégories */}
        {(superAdmin || hasPermission(utilisateur, PERMISSIONS.CATEGORIES)) && (
          <NavLink to="/admin/categories">
            <Tags size={19} />
            <span>Catégories</span>
          </NavLink>
        )}

        {/* Actualités */}
        {(superAdmin || hasPermission(utilisateur, PERMISSIONS.ACTUALITES)) && (
          <NavLink to="/admin/actualites">
            <Newspaper size={19} />
            <span>Actualités</span>
          </NavLink>
        )}

        {/* Billets */}
        {(superAdmin || hasPermission(utilisateur, [PERMISSIONS.BILLETS, PERMISSIONS.PAIEMENTS])) && (
          <NavLink to="/ventbillet" className={isBilletsActif ? "active" : ""}>
            <Ticket size={19} />
            <span>Billets</span>
          </NavLink>
        )}

        {/* Utilisateurs (réservé Superadmin ou permission UTILISATEURS) */}
        {(superAdmin || hasPermission(utilisateur, PERMISSIONS.UTILISATEURS)) && (
          <NavLink to="/utilisateurs">
            <Users size={19} />
            <span>Utilisateurs</span>
          </NavLink>
        )}

        {/* Équipes & Compétiteurs */}
        {(superAdmin || hasPermission(utilisateur, PERMISSIONS.COMPETITEURS)) && (
          <NavLink to="/equipes">
            <UserRound size={19} />
            <span>Équipes</span>
          </NavLink>
        )}

        {/* Résultats */}
        {(superAdmin || hasPermission(utilisateur, PERMISSIONS.RESULTATS)) && (
          <NavLink to="/resultats" className={isResultatsActif ? "active" : ""}>
            <Medal size={19} />
            <span>Résultats</span>
          </NavLink>
        )}
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-separator"></div>

        {/* Paramètres */}
        <NavLink to="/parametres">
          <Settings size={19} />
          <span>Paramètres</span>
        </NavLink>

        {/* Bouton de déconnexion */}
        <button
          type="button"
          onClick={handleDeconnexion}
          className="flex items-center gap-[13px] px-[15px] h-[45px] w-full rounded-[8px] text-[#cfcfcf] hover:bg-[#222222] hover:text-white transition-colors cursor-pointer text-sm font-medium border-0 bg-transparent text-left"
        >
          <LogOut size={19} className="shrink-0" />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;