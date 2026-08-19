import Dashboard from "../pages/admin/Dashboard";
import GamesList from "../pages/admin/Games";
import CompetiteurForm from "../pages/admin/CompetiteurForm";
import SiteForm from "../pages/admin/SiteForm";
import GestionEvents from "../pages/admin/GestionEvents";
import FormEvent from "../pages/admin/EventForm";
import ProtectedRoute from "./ProtectedRoutes";

export const routesAdmin = [
  {
    // Accessibles à tous les admins connectés
    element: <ProtectedRoute />, 
    children: [
      { path: "/admin/dashboard", element: <Dashboard /> },
      { path: "/admin/parametres", element: <Dashboard /> }, 

      // ROUTES PERMISSION ACTUALITES
      {
        element: <ProtectedRoute permissionRequise="ACTUALITES" />,
        children: [
          { path: "/admin/actualites", element: <GamesList /> }, 
          { path: "/admin/resultats", element: <GamesList /> },
          { path: "/admin/resultats/ajout", element: <CompetiteurForm /> }
        ]
      },

      // ROUTES PERMISSION JEUX
      {
        element: <ProtectedRoute permissionRequise="JEUX" />,
        children: [
          { path: "/admin/evenements", element: <GestionEvents /> }, 
          { path: "/admin/evenements/ajout", element: <FormEvent /> },
          { path: "/admin/disciplines", element: <GamesList /> }, 
          { path: "/admin/sites", element: <GamesList /> },
          { path: "/admin/sites/ajout", element: <SiteForm /> },
          { path: "/admin/categories", element: <GamesList /> }, 
          { path: "/admin/equipes", element: <GamesList /> },
          { path: "/admin/equipes/ajout", element: <CompetiteurForm /> }
        ]
      },

      // ROUTES PERMISSION UTILISATEURS
      {
        element: <ProtectedRoute permissionRequise="UTILISATEURS" />,
        children: [
          { path: "/admin/ventbillet", element: <GamesList /> }, 
          { path: "/admin/utilisateurs", element: <GamesList /> } 
        ]
      }
    ]
  }
];
