import { Sidebar } from "../layout/Sidebar";
import HeaderParams from "./HeaderParams";
import ProfilAdmin from "./ProfilAdmin";
import AdminsSecondaires from "./AdminsSecondaires";
import SecuriteParams from "./SecuriteParams";
import ApplicationParams from "./ApplicationParams";

function ParamAdmin() {
  return (
    <div className="flex min-h-screen bg-[#f8f9fb] text-[#111111] antialiased">

      {/* Sidebar fixe 240px */}
      <Sidebar />

      {/* Contenu à droite du sidebar */}
      <div className="flex-1 ml-[240px] flex flex-col min-h-screen">

        <HeaderParams />

        <main className="w-[55rem] mx-auto pt-[23px] pb-[45px]">

          {/* Titre */}
          <div>
            <h1 className="m-0 text-3xl leading-[30px] font-extrabold tracking-[-0.8px]">
              Paramètres
            </h1>
            <p className="m-0 mt-[5px] text-sm leading-[17px] text-[#68717e]">
              Gérez votre profil, la sécurité et les configurations de la plateforme JOJ 2026.
            </p>
          </div>

          {/* Grille 2 colonnes */}
          <div className="grid grid-cols-[600px_226px] gap-[20px] mt-[27px]">

            {/* Colonne gauche */}
            <div>
              <ProfilAdmin />
              <AdminsSecondaires />
            </div>

            {/* Colonne droite */}
            <div>
              <SecuriteParams />
              <ApplicationParams />
            </div>

          </div>
        </main>

      </div>
    </div>
  );
}

export default ParamAdmin;
