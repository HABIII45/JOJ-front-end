import "./Header_Admin.css";
import { Search, Bell, UserRound } from "lucide-react";

export function HeaderAdmin({
    title = "",
    userName = "Administrateur",
    userRole = "Admin",
    showSearch = true,
}) {
    return (
        <header className="header-admin">

            {/* Partie gauche */}
            <div className="header-title">
                <h2>{title}</h2>
            </div>

            {/* Partie droite */}
            <div className="header-right">

                {/* Recherche */}
                {showSearch && (
                    <div className="header-search">
                        <Search size={19} />
                        <input
                            type="text"
                            placeholder="Rechercher..."
                        />
                    </div>
                )}

                {/* Notifications */}
                <button className="header-icon">
                    <Bell size={20} />
                </button>

                {/* Profil */}
                <div className="header-profile">

                    <div className="profile-icon">
                        <UserRound size={20} />
                    </div>

                    <div className="profile-info">
                        <span className="profile-name">
                            {userName}
                        </span>

                        <span className="profile-role">
                            {userRole}
                        </span>
                    </div>

                </div>

            </div>

        </header>
    );
}