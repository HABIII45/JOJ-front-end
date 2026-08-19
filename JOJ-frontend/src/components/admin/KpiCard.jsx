import React from "react";

const VARIANTES = {
  rose: { fond: "bg-[#FDE7E3]", icone: "text-[#C25B1E]" },
  orange: { fond: "bg-[#FDEBD6]", icone: "text-[#D98A2B]" },
  bleu: { fond: "bg-[#E4EDFD]", icone: "text-[#3B6FE0]" },
  gris: { fond: "bg-[#F3F4F6]", icone: "text-[#6B7280]" },
};

export function KpiCard({ icone, libelle, valeur, variation, variante = "rose" }) {
  const v = VARIANTES[variante] || VARIANTES.rose;
  
  // Les variations "Stable" ou "+5 aujourd'hui" restent en style neutre/gris
  const variationNeutre = variation === "Stable" || variation.includes("aujourd'hui");

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-6 flex flex-col gap-4 shadow-sm fade-up">
      <div className="flex items-start justify-between">
        <span className={`w-11 h-11 rounded-2xl ${v.fond} flex items-center justify-center shrink-0`}>
          <span className={v.icone}>{icone}</span>
        </span>
        <span className={`text-xs font-bold ${variationNeutre ? "text-gray-400" : "text-[#10B981]"}`}>
          {variation}
        </span>
      </div>
      <div>
        <p className="text-xs font-medium text-gray-500">{libelle}</p>
        <p className="font-display text-2xl font-extrabold text-gray-900 mt-0.5 tracking-tight">
          {valeur}
        </p>
      </div>
    </div>
  );
}