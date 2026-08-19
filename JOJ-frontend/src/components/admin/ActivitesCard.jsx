import React, { useState } from "react";
import { Plus, Pencil, FileText, Trash2, Clock, X, Search, Filter } from "lucide-react";

const CONFIG_PAR_TYPE = {
  creation: { icone: Plus, fond: "bg-[#E3F8EC]", ic: "text-[#10B981]", libelle: "Événement" },
  modification: { icone: Pencil, fond: "bg-[#E4EDFD]", ic: "text-[#3B6FE0]", libelle: "Actualité" },
  publication: { icone: FileText, fond: "bg-[#FDEBD6]", ic: "text-[#D98A2B]", libelle: "Résultat" },
  suppression: { icone: Trash2, fond: "bg-[#FDE7E3]", ic: "text-[#EF4444]", libelle: "Suppression" },
};

export function ActivitesCard({ activites = [], toutesActivites = [] }) {
  const [modalOuverte, setModalOuverte] = useState(false);
  const [recherche, setRecherche] = useState("");
  const [filtreType, setFiltreType] = useState("tous");

  const listeComplete = toutesActivites.length > 0 ? toutesActivites : activites;

  // Filtrage dans la modale
  const activitesFiltrees = listeComplete.filter((act) => {
    if (filtreType !== "tous" && act.type !== filtreType) {
      return false;
    }
    if (recherche.trim()) {
      const q = recherche.toLowerCase().trim();
      const t = (act.titre || "").toLowerCase();
      const d = (act.detail || "").toLowerCase();
      return t.includes(q) || d.includes(q);
    }
    return true;
  });

  return (
    <>
      <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm fade-up flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-lg font-bold text-gray-900">
              Activités Récentes
            </h3>
            {listeComplete.length > 0 && (
              <span className="text-[11px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                {listeComplete.length} au total
              </span>
            )}
          </div>

          {activites.length === 0 ? (
            <div className="py-8 text-center text-gray-400">
              <Clock className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-xs font-semibold text-gray-600">Aucune activité récente</p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Les actions effectuées sur la plateforme s'afficheront ici en direct.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {activites.map((act) => {
                const conf = CONFIG_PAR_TYPE[act.type] ?? CONFIG_PAR_TYPE.publication;
                const Icon = conf.icone;
                return (
                  <div key={act.id} className="flex items-start gap-4">
                    <span className={`w-10 h-10 rounded-full ${conf.fond} flex items-center justify-center shrink-0`}>
                      <Icon className={`w-4 h-4 ${conf.ic}`} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-gray-900 leading-snug">
                        {act.titre}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">
                        {act.detail}
                      </p>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mt-1">
                        {act.ilYA}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {activites.length > 0 && (
          <div className="border-t border-gray-100 mt-6 pt-4 text-center">
            <button
              type="button"
              onClick={() => setModalOuverte(true)}
              className="text-xs font-bold text-[#C25B1E] hover:text-[#A04816] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              Afficher toutes les activités
              <span className="text-[10px] bg-[#fff0e7] px-1.5 py-0.5 rounded-full text-[#d96814]">
                ({listeComplete.length})
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Modale d'Historique Complet des Activités */}
      {modalOuverte && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header de la Modale */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Historique Complet des Activités
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Toutes les actions et enregistrements de la base de données ({activitesFiltrees.length} affichée{activitesFiltrees.length > 1 ? "s" : ""})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOuverte(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Barre de Recherche et Filtres */}
            <div className="p-4 bg-[#fafbfc] border-b border-gray-100 flex flex-col sm:flex-row gap-3 items-center justify-between">
              {/* Input Recherche */}
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={recherche}
                  onChange={(e) => setRecherche(e.target.value)}
                  placeholder="Rechercher une activité..."
                  className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-gray-200 text-xs text-gray-800 outline-none focus:border-[#C25B1E] transition-colors"
                />
              </div>

              {/* Filtres par Type */}
              <div className="flex items-center gap-1.5 self-start sm:self-auto overflow-x-auto w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setFiltreType("tous")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                    filtreType === "tous" ? "bg-[#C25B1E] text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  Toutes
                </button>
                <button
                  type="button"
                  onClick={() => setFiltreType("creation")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                    filtreType === "creation" ? "bg-[#10B981] text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  Événements
                </button>
                <button
                  type="button"
                  onClick={() => setFiltreType("publication")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                    filtreType === "publication" ? "bg-[#D98A2B] text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  Résultats
                </button>
                <button
                  type="button"
                  onClick={() => setFiltreType("modification")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                    filtreType === "modification" ? "bg-[#3B6FE0] text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  Actualités
                </button>
              </div>
            </div>

            {/* Liste Déroulante des Activités */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {activitesFiltrees.length === 0 ? (
                <div className="py-12 text-center text-gray-400">
                  <p className="text-sm font-semibold text-gray-600">Aucune activité trouvée</p>
                  <p className="text-xs text-gray-400 mt-1">Aucune activité ne correspond à vos filtres de recherche.</p>
                </div>
              ) : (
                activitesFiltrees.map((act) => {
                  const conf = CONFIG_PAR_TYPE[act.type] ?? CONFIG_PAR_TYPE.publication;
                  const Icon = conf.icone;
                  return (
                    <div
                      key={act.id}
                      className="flex items-start gap-4 p-3.5 rounded-2xl bg-gray-50/70 border border-gray-100 hover:bg-white hover:border-gray-200 transition-all"
                    >
                      <span className={`w-10 h-10 rounded-full ${conf.fond} flex items-center justify-center shrink-0`}>
                        <Icon className={`w-4 h-4 ${conf.ic}`} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-bold text-gray-900 leading-snug">
                            {act.titre}
                          </p>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 shrink-0">
                            {act.ilYA}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-0.5">
                          {act.detail}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer de la Modale */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => setModalOuverte(false)}
                className="px-5 py-2 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}