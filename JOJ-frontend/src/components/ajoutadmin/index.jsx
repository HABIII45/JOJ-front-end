import { Sidebar } from "../layout/Sidebar";
import HeaderAjoutAdmin from "./HeaderAjoutAdmin";
import FormAjoutAdmin from "./FormAjoutAdmin";
import { useAuth } from "../../contexts/useAuth";
import { isSuperAdmin } from "../../utils/permissions";
import { Link } from "react-router-dom";

export function AjoutAdmin() {
  const { utilisateur, chargement } = useAuth();

  // Si l'utilisateur n'est pas encore chargé
  if (chargement) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f9fa] text-[#687386] text-sm">
        Chargement...
      </div>
    );
  }

  // Seuls les superadministrateurs ont accès à la création d'administrateurs
  const superAdmin = isSuperAdmin(utilisateur);

  return (
    <div className="flex min-h-screen bg-[#f8f9fa] text-[#111] antialiased">
      {/* Sidebar fixe à gauche (240px) */}
      <Sidebar />

      {/* Contenu principal à droite du Sidebar */}
      <div className="flex-1 ml-[240px] flex flex-col min-h-screen">
        <HeaderAjoutAdmin />

        {superAdmin ? (
          <FormAjoutAdmin />
        ) : (
          <main className="flex-1 flex items-center justify-center p-8">
            <div className="max-w-md rounded-2xl bg-white p-8 text-center border border-red-200 shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600 mb-4">
                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-gray-900">Accès Refusé</h2>
              <p className="mt-2 text-sm text-gray-600">
                Seuls les super-administrateurs ont les droits nécessaires pour créer de nouveaux comptes administrateurs.
              </p>
              <Link
                to="/parametres"
                className="mt-5 inline-block rounded-lg bg-[#d56817] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#b85610] transition-colors"
              >
                Retour aux paramètres
              </Link>
            </div>
          </main>
        )}
      </div>
    </div>
  );
}

export default AjoutAdmin;
