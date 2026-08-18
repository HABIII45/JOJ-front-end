/**
 * Routage JOJ_Events :
 *  - Routes publiques (page d'accueil + sections) avec PublicLayout
 *  - Route /dashboard avec AdminLayout
 * Design : référence maquettes fournies (orange #C25B1E, noir, Poppins).
 * @module App
 */
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/admin/Dashboard";
import Disciplines from "./pages/admin/Games";
import DisciplineForm from "./pages/admin/DisciplineForm";
export default function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path={"/disciplines"} element={<Disciplines />} />
          {/* Route pour afficher le formulaire de création */}
        <Route path="/admin/disciplines/nouvelle" element={<DisciplineForm />} />

        {/* Route pour afficher le formulaire de modification (avec l'ID) */}
        <Route path="/admin/disciplines/:id/modifier" element={<DisciplineForm />} />
        </Routes>
      </BrowserRouter>

  );
}
