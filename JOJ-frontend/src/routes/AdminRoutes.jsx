import ProtectedRoute from "../components/ProtectedRoute";
import CompetiteurForm from "../pages/admin/CompetiteurForm";
import GamesList from "../pages/admin/Games";
import Dashboard from "../pages/admin/Dashboard";
import FormEvent from "../pages/admin/EventForm";
import GestionEvents from "../pages/admin/GestionEvents";
import SiteForm from "../pages/admin/SiteForm";

export const routesAdmin = [
  {
    // ROUTES ACCESSIBLES QUE PAR Admin ou Superadmin
    element: <ProtectedRoute />, 
    children: [
      // HOME POUR ADMIN/SUPERADMIN
      { path: "/admin/dashboard", element: <Dashboard /> },

      // ROUTES POUR ADMIN GERANT ACTUALITES ET RESULTATS
      {
        element: <ProtectedRoute permissionRequise="ACTUALITES" />,
        children: [
          { path: "/admin/resultats", element: <GamesList /> },
          { path: "/admin/resultats/ajout", element: <CompetiteurForm /> }
        ]
      },

      // ROUTES POUR ADMIN GERANT JEUX (SITES, DISCIPLINES, ZONES, CATEGORIES, EVENEMENTS)
      {
        element: <ProtectedRoute permissionRequise="JEUX" />,
        children: [
          { path: "/admin/sites", element: <GamesList /> },
          { path: "/admin/sites/ajout", element: <SiteForm /> },
          { path: "/admin/equipes", element: <GamesList /> },
          { path: "/admin/equipes/ajout", element: <CompetiteurForm /> },
          { path: "/admin/evenements", element: <GestionEvents /> }, 
          { path: "/admin/evenements/ajout", element: <FormEvent /> }
        ]
      },
        // ROUTES POUR ADMIN GERANT LES UTILISATEURS DONC SUPERADMIN
      {
        element: <ProtectedRoute permissionRequise="UTILISATEURS" />,
        children: [
          // { path: "/admin/utilisateurs", element: <UtilisateursList /> },
          // { path: "/admin/utilisateurs/ajout", element: <UserForm /> }
        ]
      }
    ]
  }
];
