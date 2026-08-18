import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { Sidebar } from "./components/layout/Sidebar";

import { AjoutCategorie } from "./pages/admin/ajoutCategorie";
import CreerActualite from "./pages/admin/actualites";
import Dashboard from "./pages/admin/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<Dashboard />} />
       
      </Routes>

      <Sidebar />
      <Footer />
    </BrowserRouter>
  );
}

export default App;