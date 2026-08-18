import "./Sidebar.css";
import JOJlogo from "../../assets/images/JOJlogo.jpg";

import {LayoutDashboard,CalendarDays,Trophy,MapPin,Tags,Newspaper,Ticket,Users,UserRound,Medal,Settings,LogOut} from "lucide-react";

import { NavLink } from "react-router-dom";

export function Sidebar() {
    return (
        <div className="sidebar">

            {/* Logo */}
            <div className="sidebar-logo">
                <img src={JOJlogo} alt="JOJ Events" />
            </div>

            {/* Navigation */}
            <nav className="navigation">

                <NavLink to="/dashboard">
                    <LayoutDashboard size={19} />
                    <span>Dashboard</span>
                </NavLink>

                <NavLink to="/evenements">
                    <CalendarDays size={19} />
                    <span>Événements</span>
                </NavLink>

                <NavLink to="/disciplines">
                    <Trophy size={19} />
                    <span>Disciplines</span>
                </NavLink>

                <NavLink to="/sites">
                    <MapPin size={19} />
                    <span>Sites</span>
                </NavLink>

                <NavLink to="admin/categories">
                    <Tags size={19} />
                    <span>Catégories</span>
                </NavLink>

                <NavLink to="/admin/actualites">
                    <Newspaper size={19} />
                    <span>Actualités</span>
                </NavLink>

                <NavLink to="/billets">
                    <Ticket size={19} />
                    <span>Billets</span>
                </NavLink>

                <NavLink to="/utilisateurs">
                    <Users size={19} />
                    <span>Utilisateurs</span>
                </NavLink>

                <NavLink to="/equipes">
                    <UserRound size={19} />
                    <span>Équipes</span>
                </NavLink>

                <NavLink to="/resultats">
                    <Medal size={19} />
                    <span>Résultats</span>
                </NavLink>

            </nav>

            <div className="sidebar-bottom">

                <div className="sidebar-separator"></div>

                <NavLink to="/parametres">
                    <Settings size={19} />
                    <span>Paramètres</span>
                </NavLink>

                <NavLink to="/deconnexion">
                    <LogOut size={19} />
                    <span>Déconnexion</span>
                </NavLink>

            </div>

        </div>
    );
}