import { useState } from "react";
import { useNavigate } from "react-router-dom";

const IconVoir = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
    <circle cx="12" cy="12" r="2.5" />
  </svg>
);

const IconSupprimer = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 7h16" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M6 7l1 14h10l1-14" />
    <path d="M9 7V4h6v3" />
  </svg>
);

const STATUTS = {
  publie:    { label: "Publié",     style: "bg-[#d9f8e4] text-[#20a35b] w-[54px]" },
  brouillon: { label: "Brouillon",  style: "bg-[#ffecd5] text-[#e87820] w-[66px]" },
  attente:   { label: "En attente", style: "bg-[#f0f1f3] text-[#4b5563] w-[74px]" },
};

const donneesInitiales = [
  { id: 1, evenement: "Qualifications Hommes — Course", date: "12 oct 2026, 14:30", statut: "publie" },
  { id: 2, evenement: "Basket-ball Finale",             date: "11 oct 2026, 18:45", statut: "brouillon" },
  { id: 3, evenement: "100m Hommes - Finale",           date: "10 oct 2026, 10:00", statut: "attente" },
];

const colsGrid = "grid-cols-[2.3fr_1.15fr_.85fr_.8fr]";

function ListeResultats() {
  const navigate = useNavigate();
  const [resultats, setResultats]             = useState(donneesInitiales);
  const [filtreEvenement, setFiltreEvenement] = useState("");
  const [filtreStatut, setFiltreStatut]       = useState("");
  const [voirArchives, setVoirArchives]       = useState(false);
  const [aSupprimer, setASupprimer]           = useState(null); // id en attente de confirmation

  /* ---- Filtrage ---- */
  const affichees = resultats.filter((r) => {
    const matchEvt    = filtreEvenement === "" || r.evenement === filtreEvenement;
    const matchStatut = filtreStatut    === "" || r.statut    === filtreStatut;
    return matchEvt && matchStatut;
  });

  const evenementsUniques = [...new Set(donneesInitiales.map((r) => r.evenement))];

  /* ---- Suppression ---- */
  const confirmerSuppression = () => {
    setResultats((prev) => prev.filter((r) => r.id !== aSupprimer));
    setASupprimer(null);
  };

  return (
    <>
      <section className="mt-[22px] bg-white border border-[#e1e4e7] rounded-[21px] overflow-hidden">

        {/* En-tête */}
        <div className="h-[64px] px-[27px] flex items-center justify-between">
          <h2 className="text-[18px] font-semibold text-[#15171a]">Liste des Résultats</h2>

          <div className="flex items-center gap-[8px]">
            {/* Filtre par événement */}
            <select
              value={filtreEvenement}
              onChange={(e) => setFiltreEvenement(e.target.value)}
              className="h-[32px] px-[11px] rounded-[6px] border border-[#e5e7eb] bg-[#fafbfc] text-[13px] text-[#4b5563] outline-none cursor-pointer"
            >
              <option value="">Par événement</option>
              {evenementsUniques.map((evt) => (
                <option key={evt} value={evt}>{evt}</option>
              ))}
            </select>

            {/* Filtre par statut */}
            <select
              value={filtreStatut}
              onChange={(e) => setFiltreStatut(e.target.value)}
              className="h-[32px] px-[11px] rounded-[6px] border border-[#e5e7eb] bg-[#fafbfc] text-[13px] text-[#4b5563] outline-none cursor-pointer"
            >
              <option value="">Par statut</option>
              <option value="publie">Publié</option>
              <option value="brouillon">Brouillon</option>
              <option value="attente">En attente</option>
            </select>
          </div>
        </div>

        {/* Header colonnes */}
        <div className={`h-[44px] bg-[#fafbfc] border-y border-[#edf0f2] grid ${colsGrid} items-center px-[27px] text-[13px] font-medium text-[#727a86]`}>
          <span>Événement</span>
          <span>Date de l'épreuve</span>
          <span>Statut</span>
          <span>Actions</span>
        </div>

        {/* Lignes */}
        {affichees.length === 0 && (
          <div className="h-[62px] flex items-center justify-center text-[14px] text-[#9ca3af]">
            Aucun résultat trouvé
          </div>
        )}

        {affichees.map((r) => {
          const s = STATUTS[r.statut];
          return (
            <div
              key={r.id}
              className={`h-[66px] grid ${colsGrid} items-center px-[27px] border-b border-[#edf0f2]`}
            >
              <span className="text-[15px] text-[#303846]">{r.evenement}</span>
              <span className="text-[15px] text-[#303846]">{r.date}</span>
              <span className={`${s.style} h-[22px] rounded-full text-[12px] flex items-center justify-center`}>
                {s.label}
              </span>
              <div className="flex items-center gap-[13px] text-[#9aa2ad]">
                {/* Oeil — voir / éditer */}
                <button
                  onClick={() => navigate(`/register-result?id=${r.id}&mode=edition`)}
                  className="hover:text-[#d96814] transition-colors"
                  title="Voir / Modifier"
                >
                  <IconVoir />
                </button>
                {/* Supprimer */}
                <button
                  onClick={() => setASupprimer(r.id)}
                  className="hover:text-red-500 transition-colors"
                  title="Supprimer"
                >
                  <IconSupprimer />
                </button>
              </div>
            </div>
          );
        })}

        {/* Footer */}
        <div className="h-[52px] flex items-center justify-center">
          <button
            onClick={() => setVoirArchives((v) => !v)}
            className="text-[15px] font-medium text-[#d96814] hover:underline"
          >
            {voirArchives ? "Masquer les résultats archivés" : "Voir tous les résultats archivés"}
          </button>
        </div>

        {/* Section archives (simulée) */}
        {voirArchives && (
          <div className="border-t border-[#edf0f2] px-[27px] py-[18px]">
            <p className="text-[14px] text-[#9ca3af] italic">Aucun résultat archivé pour le moment.</p>
          </div>
        )}

      </section>

      {/* Modale confirmation suppression */}
      {aSupprimer !== null && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-[360px] shadow-xl">
            <h3 className="text-[18px] font-bold text-[#111214] mb-2">Supprimer ce résultat ?</h3>
            <p className="text-[14px] text-[#68717e] mb-6">
              Cette action est irréversible. Le résultat sera définitivement supprimé.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setASupprimer(null)}
                className="px-5 py-2 rounded-lg border border-[#e5e7eb] text-[14px] text-[#4b5563] hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={confirmerSuppression}
                className="px-5 py-2 rounded-lg bg-red-500 text-white text-[14px] font-semibold hover:bg-red-600"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ListeResultats;
