import React from "react";
import Dashboard from "../pages/admin/Dashboard";
import GestionResultatPage from "../pages/public/GestionResultatPage";
import RegisterResultPage from "../pages/public/RegisterResultPage";
import CreerActualite from "../pages/admin/actualites";
import GestionEvents from "../pages/admin/GestionEvents";
import FormEvent from "../pages/admin/EventForm";
import AdminSites from "../pages/admin/AdminSites";
import SiteForm from "../pages/admin/SiteForm";
import GamesList from "../pages/admin/Games";
import CompetiteurForm from "../pages/admin/CompetiteurForm";
import ProtectedRoute from "./ProtectedRoutes";
import { PERMISSIONS } from "../utils/permissions";

export const routesAdmin = [
  {
    // ROUTES ACCESSIBLES PAR TOUT ADMIN OU SUPERADMIN
    element: <ProtectedRoute />,
    children: [
      // TABLEAU DE BORD
      { path: "/admin/dashboard", element: <Dashboard /> },

      // ROUTES GESTION DES RÉSULTATS
      {
        element: <ProtectedRoute permissionRequise={PERMISSIONS.RESULTATS} />,
        children: [
          { path: "/admin/resultats", element: <GestionResultatPage /> },
          { path: "/admin/resultats/ajout", element: <RegisterResultPage /> },
        ],
      },

      // ROUTES GESTION DES ACTUALITÉS
      {
        element: <ProtectedRoute permissionRequise={PERMISSIONS.ACTUALITES} />,
        children: [
          { path: "/admin/actualites", element: <CreerActualite /> },
          { path: "/admin/actualites/ajout", element: <CreerActualite /> },
        ],
      },

      // ROUTES GESTION DES ÉVÉNEMENTS
      {
        element: <ProtectedRoute permissionRequise={PERMISSIONS.EVENEMENTS} />,
        children: [
          { path: "/admin/evenements", element: <GestionEvents /> },
          { path: "/admin/evenements/ajout", element: <FormEvent /> },
        ],
      },

      // ROUTES GESTION DES SITES
      {
        element: <ProtectedRoute permissionRequise={PERMISSIONS.SITES} />,
        children: [
          { path: "/admin/sites", element: <AdminSites /> },
          { path: "/admin/sites/ajout", element: <SiteForm /> },
          { path: "/admin/sites/nouveau", element: <SiteForm /> },
        ],
      },

      // ROUTES GESTION DES ÉQUIPES / COMPÉTITEURS
      {
        element: <ProtectedRoute permissionRequise={PERMISSIONS.COMPETITEURS} />,
        children: [
          { path: "/admin/equipes", element: <GamesList /> },
          { path: "/admin/equipes/ajout", element: <CompetiteurForm /> },
        ],
      },
    ],
  },
];
