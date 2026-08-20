import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AjoutCategorie } from "./pages/admin/ajoutCategorie";
import CreerActualite from "./pages/admin/actualites";
import Dashboard from "./pages/admin/Dashboard";
import { DisciplinesGame } from "./pages/public/Game";
import GestionActualites from "./pages/admin/ajoutActualites";
import {DetailsGame} from "././pages/public/GameDetails"
function App() {
  return (
    <BrowserRouter>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/admin/categories" element={<AjoutCategorie />} />
        <Route path="/admin/actualites" element={<CreerActualite />} />
        <Route path="/disciplines" element={<DisciplinesGame/>}/>
         <Route path="disciplines/:id/" element={<DetailsGame/>}/>
         <Route path="admin/listeactualites" element={<GestionActualites/>}/>

      </Routes>


    </BrowserRouter>
  );
}

export default App;