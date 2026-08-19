// src/routes/routesAdmin.jsx
import { Navigate } from "react-router-dom";
import { ProtectedRoute } from "../components/ProtectedRoute"; // Assurez-vous que l'import est correct

// Importez vos composants de pages
import Dashboard from "../pages/admin/Dashboard";
import GestionEvents from "../pages/admin/GestionEvents";
import FormEvent from "../pages/admin/EventForm";
import GamesList from "../pages/admin/Games";
import CompetiteurForm from "../pages/admin/CompetiteurForm";
import SiteForm from "../pages/admin/SiteForm";

export const adminRoutes = [
  {
    path: "/admin",
    element: <ProtectedRoute permissionRequise="ADMIN" />, 
    children: [
      // Route par défaut du dashboard admin
      { index: true, element: <Dashboard /> },

      // Groupe: Événements & Sites (Permission: JEUX)
      {
        element: <ProtectedRoute permissionRequise="JEUX" />,
        children: [
          { path: "evenements", element: <GestionEvents /> },
          { path: "evenements/ajout", element: <FormEvent /> },
          { path: "sites", element: <GamesList /> },
          { path: "sites/ajout", element: <SiteForm /> },
          { path: "categories", element: <GamesList /> },
          { path: "disciplines", element: <GamesList /> },
        ]
      },

      // Groupe: Résultats (Permission: RESULTATS)
      {
        element: <ProtectedRoute permissionRequise="RESULTATS" />,
        children: [
          { path: "resultats", element: <GamesList /> },
          { path: "resultats/ajout", element: <CompetiteurForm /> },
        ]
      },

      // Groupe: Équipes (Permission: EQUIPES)
      {
        element: <ProtectedRoute permissionRequise="EQUIPES" />,
        children: [
          { path: "equipes", element: <GamesList /> },
          { path: "equipes/ajout", element: <CompetiteurForm /> },
        ]
      },

      // Groupe: Utilisateurs (Permission: UTILISATEURS)
      {
        element: <ProtectedRoute permissionRequise="UTILISATEURS" />,
        children: [
          { path: "utilisateurs", element: <GamesList /> }, 
          { path: "utilisateurs/ajout", element: <CompetiteurForm /> },
        ]
      },
      
  
    ]
  }
];