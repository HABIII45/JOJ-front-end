import  JOJlogo from "../../assets/images/JOJlogo.jpg" 
import {Search} from "lucide-react"
import "./Header.css"
import { NavLink } from "react-router-dom"
export function Header() {
    return(
        <div className="header">
        {/* logo */}
        <div className="logo">
            <img src={JOJlogo} alt="logo" />

        </div>
        {/* navigation */}
        <div className="nav">
            <nav className="nav">
                <NavLink to="/">Accueil</NavLink>
                <NavLink to="/evenements">Événements</NavLink>
                <NavLink to="/sites">Sites</NavLink>
                <NavLink to="/jeux">Jeux</NavLink>
                <NavLink to="/actualites">Actualités</NavLink>
                <NavLink to="/resultats">Résultats</NavLink>
            </nav>
        </div>
        
        {/* barre de recherche */}
        <div className="search">
          
         <input type="text" placeholder="Rechercher" />
         <Search size={16} className="search-icon" />
         
        </div>
           
        
        </div>
    )
}