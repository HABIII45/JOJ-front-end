import { useState, useEffect } from "react";
import { fetchEvenements, fetchCategories } from "../../api/resultats";

function EpreuveSelectionnee({
  ongletActif,
  modeEdition = false,
  evenementId,
  setEvenementId,
  categorieId,
  setCategorieId,
  setEvenementObjet,
  statut,
  setStatut,
}) {
  const [evenements,  setEvenements]  = useState([]);
  const [categories,  setCategories]  = useState([]);
  const [chargement,  setChargement]  = useState(true);
  const [erreur,      setErreur]      = useState("");

  useEffect(() => {
    const charger = async () => {
      setChargement(true);
      setErreur("");
      try {
        const [evts, cats] = await Promise.all([
          fetchEvenements(),
          fetchCategories(),
        ]);
        setEvenements(evts);
        setCategories(cats);
      } catch {
        setErreur("Impossible de charger les épreuves et catégories.");
      } finally {
        setChargement(false);
      }
    };
    charger();
  }, []);

  const handleEvenementChange = (e) => {
    const id = e.target.value;
    setEvenementId(id);
    const obj = evenements.find((ev) => String(ev.id) === String(id)) ?? null;
    setEvenementObjet?.(obj);

    // Si l'événement a une catégorie rattachée, on la sélectionne automatiquement
    if (obj && obj.categorie) {
      const catId = typeof obj.categorie === "object" ? obj.categorie.id : obj.categorie;
      setCategorieId(String(catId));
    }
  };

  const handleCategorieChange = (e) => {
    setCategorieId(e.target.value);
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 mb-6">
      {/* En-tête */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#fef3eb] rounded-xl flex items-center justify-center">
          <svg className="w-3.5 h-4 text-[#c85f18]" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <span className="text-xl font-medium text-black">Épreuve et Catégorie sélectionnées</span>
      </div>

      {erreur && (
        <p className="mb-4 text-sm text-red-500">{erreur}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
        {/* Select Épreuve */}
        <div className="sm:col-span-5">
          <div className="text-xs font-semibold text-gray-500 tracking-[0.70px] mb-1.5 uppercase">
            1. Nom de l'épreuve <span className="text-[#d96814]">*</span>
          </div>
          <div className="relative">
            <select
              value={evenementId}
              onChange={handleEvenementChange}
              disabled={chargement}
              className={`w-full appearance-none rounded-xl border px-4 py-3 pr-10 text-sm font-medium outline-none cursor-pointer disabled:opacity-60 transition-colors ${
                evenementId ? "bg-white border-[#d96814]/60 text-black shadow-xs" : "bg-gray-50 border-gray-200 text-gray-700"
              }`}
            >
              <option value="">
                {chargement ? "Chargement des épreuves…" : "Sélectionner une épreuve"}
              </option>
              {evenements.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.titre}
                  {ev.date ? ` (${new Date(ev.date).toLocaleDateString("fr-FR")})` : ""}
                </option>
              ))}
            </select>
            <svg
              className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Select Catégorie */}
        <div className="sm:col-span-4">
          <div className="text-xs font-semibold text-gray-500 tracking-[0.70px] mb-1.5 uppercase">
            2. Catégorie <span className="text-[#d96814]">*</span>
          </div>
          <div className="relative">
            <select
              value={categorieId}
              onChange={handleCategorieChange}
              disabled={chargement}
              className={`w-full appearance-none rounded-xl border px-4 py-3 pr-10 text-sm font-medium outline-none cursor-pointer disabled:opacity-60 transition-colors ${
                categorieId ? "bg-white border-[#d96814]/60 text-black shadow-xs" : "bg-gray-50 border-gray-200 text-gray-700"
              }`}
            >
              <option value="">
                {chargement
                  ? "Chargement des catégories…"
                  : categories.length === 0
                  ? "Aucune catégorie trouvée"
                  : "Sélectionner une catégorie"}
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nom} {cat.discipline_nom ? `(${cat.discipline_nom})` : ""}
                </option>
              ))}
            </select>
            <svg
              className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Select Statut */}
        <div className="sm:col-span-3">
          <div className="text-xs font-semibold text-gray-500 tracking-[0.70px] mb-1.5 uppercase">
            Statut
          </div>
          <div className="relative">
            <select
              value={statut}
              onChange={(e) => setStatut(e.target.value)}
              className="w-full appearance-none bg-gray-50 rounded-xl border border-gray-200 px-4 py-3 pr-10 text-sm font-medium text-black outline-none cursor-pointer"
            >
              <option value="publie">Publié</option>
              <option value="brouillon">Brouillon</option>
              <option value="attente">En attente</option>
            </select>
            <svg
              className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Guide d'état */}
      {(!evenementId || !categorieId) && (
        <div className="mt-4 flex items-center gap-2 text-xs text-[#d96814] bg-[#fff8f3] p-2.5 rounded-lg border border-[#fbd6bc]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span>
            {!evenementId && !categorieId
              ? "Veuillez sélectionner une épreuve et une catégorie pour faire apparaître les joueurs participants."
              : !evenementId
              ? "Veuillez choisir une épreuve pour continuer."
              : "Veuillez choisir une catégorie pour filtrer les joueurs de cette épreuve."}
          </span>
        </div>
      )}
    </div>
  );
}

export default EpreuveSelectionnee;
