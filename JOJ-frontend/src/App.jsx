/**
 * Routage JOJ_Events :
 *  - Routes publiques (page d'accueil + sections) avec PublicLayout
 *  - Route /dashboard avec AdminLayout
 * Design : référence maquettes fournies (orange #C25B1E, noir, Poppins).
 * @module App
 */
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/admin/Dashboard";

export default function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>

  );
}
