import { useState, useEffect } from "react";
import { fetchEvenements } from "../../api/resultats";

function EpreuveSelectionnee({
  ongletActif,
  modeEdition = false,
  evenementId,
  setEvenementId,
  setEvenementObjet,
  statut,
  setStatut,
}) {
  const [evenements,  setEvenements]  = useState([]);
  const [chargement,  setChargement]  = useState(true);
  const [erreur,      setErreur]      = useState("");

  useEffect(() => {
    const charger = async () => {
      setChargement(true);
      setErreur("");
      try {
        const data = await fetchEvenements();
        setEvenements(data);
      } catch {
        setErreur("Impossible de charger les épreuves.");
      } finally {
        setChargement(false);
      }
    };
    charger();
  }, []);

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
        <span className="text-xl font-medium text-black">Épreuve sélectionnée</span>
      </div>

      {erreur && (
        <p className="mb-4 text-sm text-red-500">{erreur}</p>
      )}

      <div className="flex gap-6">
        {/* Select épreuve */}
        <div className="flex-1">
          <div className="text-sm font-medium text-gray-500 tracking-[0.70px] mb-1 uppercase">
            Nom de l'épreuve
          </div>
          <div className="relative">
            <select
              value={evenementId}
              onChange={(e) => {
                const id = e.target.value;
                setEvenementId(id);
                // Remonte l'objet événement complet (avec image) vers le parent
                const obj = evenements.find((ev) => String(ev.id) === String(id)) ?? null;
                setEvenementObjet?.(obj);
              }}
              disabled={chargement}
              className="w-full appearance-none bg-gray-50 rounded-xl border border-gray-200 px-4 py-3 pr-10 text-base font-medium text-black outline-none cursor-pointer disabled:opacity-60"
            >
              <option value="">
                {chargement ? "Chargement…" : "Faire une sélection"}
              </option>
              {evenements.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.titre}
                  {ev.categorie_nom ? ` — ${ev.categorie_nom}` : ""}
                  {ev.date ? ` (${new Date(ev.date).toLocaleDateString("fr-FR")})` : ""}
                </option>
              ))}
            </select>
            <svg
              className="absolute right-4 top-1/2 -translate-y-1/2 w-2.5 h-2 text-gray-400 pointer-events-none"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Select statut — géré localement, pas en base */}
        <div className="w-[180px]">
          <div className="text-sm font-medium text-gray-500 tracking-[0.70px] mb-1 uppercase">
            Statut
          </div>
          <div className="relative">
            <select
              value={statut}
              onChange={(e) => setStatut(e.target.value)}
              className="w-full appearance-none bg-gray-50 rounded-xl border border-gray-200 px-4 py-3 pr-10 text-base font-medium text-black outline-none cursor-pointer"
            >
              <option value="">Choisir</option>
              <option value="brouillon">Brouillon</option>
              <option value="attente">En attente</option>
              <option value="publie">Publié</option>
            </select>
            <svg
              className="absolute right-4 top-1/2 -translate-y-1/2 w-2.5 h-2 text-gray-400 pointer-events-none"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EpreuveSelectionnee;
