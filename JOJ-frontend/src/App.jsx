import { BrowserRouter, Routes, Route } from "react-router-dom";


import { AjoutCategorie } from "./pages/admin/ajoutCategorie";
import CreerActualite from "./pages/admin/actualites";
import Dashboard from "./pages/admin/Dashboard";

function App() {
  return (
    <BrowserRouter>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/admin/categories" element={<AjoutCategorie />} />
        <Route path="/admin/actualites" element={<CreerActualite />} />
      </Routes>


    </BrowserRouter>
  );
}

export default App;