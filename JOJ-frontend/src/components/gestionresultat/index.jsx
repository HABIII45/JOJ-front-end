import { Sidebar } from "../layout/Sidebar";
import HeaderResultat from "./HeaderResultat";
import TitreResultat from "./TitreResultat";
import CartesStatResultat from "./CartesStatResultat";
import ListeResultats from "./ListeResultats";

function GestionResultat() {
  return (
    <div className="flex min-h-screen bg-[#f8f9fb] text-[#111827]">

      {/* Sidebar fixe 240px */}
      <Sidebar />

      {/* Contenu à droite du sidebar */}
      <div className="flex-1 ml-[240px] flex flex-col min-h-screen">

        <HeaderResultat />

        <main className="flex-1 max-w-[55em] w-full mx-auto pt-[28px] pb-[80px]">
          <TitreResultat />
          <CartesStatResultat />
          <ListeResultats />
        </main>

      </div>
    </div>
  );
}

export default GestionResultat;
