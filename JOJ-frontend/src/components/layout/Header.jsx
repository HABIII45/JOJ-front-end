import JOJlogo from "../../assets/images/JOJlogo.jpg";
import { Search } from "lucide-react";
import "./Header.css";
import { NavLink } from "react-router-dom";

export function Header() {
  return (
    <header className="header sticky top-0 z-50">
      {/* logo */}
      <div className="logo">
        <NavLink to="/">
          <img src={JOJlogo} alt="logo JOJ" />
        </NavLink>
      </div>

      {/* navigation */}
      <div className="nav">
        <nav className="nav">
          <NavLink to="/">Accueil</NavLink>
          <NavLink to="/events">Événements</NavLink>
          <NavLink to="/sites">Sites</NavLink>
          <NavLink to="/disciplines">Disciplines</NavLink>
          <NavLink to="/actualites">Actualités</NavLink>
          <NavLink to="/resultats">Résultats</NavLink>
        </nav>
      </div>
      
      {/* barre de recherche */}
      <div className="search">
        <input type="text" placeholder="Rechercher..." />
        <Search size={16} className="search-icon" />
      </div>
    </header>
  );
}