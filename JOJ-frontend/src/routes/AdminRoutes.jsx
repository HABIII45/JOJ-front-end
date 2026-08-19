import React from "react";
import Dashboard from "../pages/admin/Dashboard";
import GestionResultatPage from "../pages/public/GestionResultatPage";
import RegisterResultPage from "../pages/public/RegisterResultPage";
import CreerActualite from "../pages/admin/actualites";
import GestionEvents from "../pages/admin/GestionEvents";
import FormEvent from "../pages/admin/EventForm";
import AdminSites from "../pages/admin/AdminSites";
import SiteDetail from "../pages/admin/SitesDetail";
import SiteForm from "../pages/admin/SiteForm";
import GamesList from "../pages/admin/Games";
import CompetiteurForm from "../pages/admin/CompetiteurForm";
import { AjoutCategorie } from "../pages/admin/ajoutCategorie";
import VenteBilletPage from "../pages/public/VenteBilletPage";
import AjoutAdminPage from "../pages/admin/AjoutAdminPage";
import ParamsPage from "../pages/public/ParamsPage";
import ProtectedRoute from "./ProtectedRoutes";
import { PERMISSIONS } from "../utils/permissions";

export const routesAdmin = [
  {
    // ROUTES ACCESSIBLES PAR TOUT ADMIN OU SUPERADMIN
    element: <ProtectedRoute />,
    children: [
      // TABLEAU DE BORD & PARAMÈTRES
      { path: "/admin/dashboard", element: <Dashboard /> },
      { path: "/admin/parametres", element: <ParamsPage /> },

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
          { path: "/admin/sites/:id", element: <SiteDetail /> },
          { path: "/admin/sites/ajout", element: <SiteForm /> },
          { path: "/admin/sites/nouveau", element: <SiteForm /> },
        ],
      },

      // ROUTES GESTION DES ÉQUIPES / COMPÉTITEURS / DISCIPLINES / CATÉGORIES
      {
        element: <ProtectedRoute permissionRequise={PERMISSIONS.COMPETITEURS} />,
        children: [
          { path: "/admin/equipes", element: <GamesList /> },
          { path: "/admin/equipes/ajout", element: <CompetiteurForm /> },
          { path: "/admin/disciplines", element: <GamesList /> },
          { path: "/admin/categories", element: <AjoutCategorie /> },
        ],
      },

      // ROUTES BILLETTERIE
      {
        element: <ProtectedRoute permissionRequise={PERMISSIONS.BILLETS} />,
        children: [
          { path: "/admin/ventbillet", element: <VenteBilletPage /> },
        ],
      },

      // ROUTES UTILISATEURS
      {
        element: <ProtectedRoute permissionRequise={PERMISSIONS.UTILISATEURS} />,
        children: [
          { path: "/admin/utilisateurs", element: <AjoutAdminPage /> },
        ],
      },
    ],
  },
];
