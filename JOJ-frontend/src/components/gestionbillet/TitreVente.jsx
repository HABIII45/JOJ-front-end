import React from "react";
import { Download } from "lucide-react";

function TitreVente({ totalBillets = 0, onExport }) {
  return (
    <section className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Ventes & Billetterie
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Suivez les ventes de billets, les revenus et les transactions en temps réel ({totalBillets} billet{totalBillets > 1 ? "s" : ""} enregistré{totalBillets > 1 ? "s" : ""}).
        </p>
      </div>

      <button
        onClick={onExport}
        className="h-10 px-5 rounded-2xl bg-[#C25B1E] hover:bg-[#A04816] text-white text-xs font-bold transition-all flex items-center gap-2 shadow-sm cursor-pointer"
      >
        <Download size={14} />
        Exporter le rapport
      </button>
    </section>
  );
}

export default TitreVente;
