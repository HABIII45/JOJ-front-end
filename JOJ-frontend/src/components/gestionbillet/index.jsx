import { Sidebar } from "../layout/Sidebar";
import HeaderVente from "./HeaderVente";
import TitreVente from "./TitreVente";
import CartesKPI from "./CartesKPI";
import GraphiqueVentes from "./GraphiqueVentes";
import TableauTransactions from "./TableauTransactions";

function GestionBillet() {
  return (
    <div className="flex min-h-screen bg-[#f8f9fb] text-[#111827]">

      {/* Sidebar fixe 240px */}
      <Sidebar />

      {/* Tout le contenu à droite du sidebar */}
      <div className="flex-1 ml-[240px] flex flex-col min-h-screen">

        <HeaderVente />

        <main className="flex-1 max-w-[90em] w-full mx-auto px-[28px] pt-[28px] pb-[45px]">
          <TitreVente />
          <CartesKPI />
          <GraphiqueVentes />
          <TableauTransactions />
        </main>

      </div>
    </div>
  );
}

export default GestionBillet;
