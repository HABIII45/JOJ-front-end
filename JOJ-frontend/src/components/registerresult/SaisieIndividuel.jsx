import { useState, useEffect, useCallback } from "react";
import { fetchJoueurs, fetchResultatsParEvenement } from "../../api/resultats";

/** Convertit "1:02.35" ou "10.5" en secondes pour le classement */
function enSecondes(str) {
  if (!str || str.toString().trim() === "") return Infinity;
  const propre = str.toString().trim();
  if (propre.includes(":")) {
    const [min, reste] = propre.split(":");
    return parseFloat(min) * 60 + parseFloat(reste || 0);
  }
  return parseFloat(propre);
}

function SaisieIndividuel({ evenementId, categorieId, onDonneesChange }) {
  const [participants, setParticipants] = useState([]);
  const [chargement,   setChargement]   = useState(false);
  const [erreur,       setErreur]       = useState("");
  const [calcule,      setCalcule]      = useState(false);

  const charger = useCallback(async () => {
    if (!evenementId) {
      setParticipants([]);
      onDonneesChange?.([]);
      return;
    }

    setChargement(true);
    setErreur("");
    setCalcule(false);
    try {
      // 1. Charge les joueurs et les résultats de l'événement
      const [tousLesJoueurs, existants] = await Promise.all([
        fetchJoueurs(),
        fetchResultatsParEvenement(evenementId),
      ]);

      const idsExistants = new Set(existants.map((r) => String(r.info_competiteur?.id || r.competiteur)));

      // 2. Filtre les joueurs qui appartiennent à la catégorie OU qui ont déjà un résultat pour cet événement
      const joueursFiltres = tousLesJoueurs.filter((j) => {
        if (idsExistants.has(String(j.id))) return true;
        if (!categorieId) return true;
        const catJoueur = typeof j.categorie === "object" ? j.categorie?.id : j.categorie;
        return String(catJoueur) === String(categorieId);
      });

      // 3. Associe chaque joueur filtré avec son résultat existant éventuel
      const lignes = joueursFiltres.map((j) => {
        const res = existants.find(
          (r) => String(r.info_competiteur?.id || r.competiteur) === String(j.id)
        );
        return {
          id:          j.id,
          nom:         `${j.prenom ?? ""} ${j.nom ?? ""}`.trim() || j.username || `Athlète #${j.id}`,
          avatar:      j.image ?? null,
          pays:        j.pays ?? "",
          score:       res?.score ?? "",
          resultatId:  res ? (res.id ?? null) : null,
        };
      });

      setParticipants(lignes);
      onDonneesChange?.(lignes);
    } catch {
      setErreur("Impossible de charger les participants.");
    } finally {
      setChargement(false);
    }
  }, [evenementId, categorieId, onDonneesChange]);

  useEffect(() => {
    charger();
  }, [charger]);

  const handleScore = (id, valeur) => {
    const maj = participants.map((p) =>
      p.id === id ? { ...p, score: valeur } : p
    );
    setParticipants(maj);
    setCalcule(false);
    onDonneesChange?.(maj);
  };

  const handleEffacerScore = (id) => {
    handleScore(id, "");
  };

  const classes = calcule
    ? [...participants].sort((a, b) => enSecondes(a.score) - enSecondes(b.score))
    : participants;

  // Si l'épreuve n'est pas encore choisie
  if (!evenementId) {
    return (
      <div className="bg-white rounded-3xl border border-dashed border-gray-300 p-12 text-center">
        <div className="mx-auto w-12 h-12 rounded-2xl bg-[#fff0e7] flex items-center justify-center text-[#d96814] mb-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </div>
        <h3 className="text-base font-bold text-gray-800">Sélection requise</h3>
        <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
          Sélectionnez une épreuve ci-dessus pour charger automatiquement les participants et saisir ou modifier leurs scores.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-6">
      {/* En-tête de la section */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-base font-bold text-gray-900">
            Saisie des Scores & Performances
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Renseignez ou modifiez le chrono, points ou score officiel pour chaque athlète.
          </p>
        </div>
        <span className="bg-orange-50 text-[#d96814] text-xs font-bold px-3 py-1.5 rounded-full border border-orange-200">
          {participants.length} athlète{participants.length > 1 ? "s" : ""}
        </span>
      </div>

      {chargement && (
        <div className="py-12 text-center text-gray-400 text-xs">
          <div className="w-6 h-6 border-2 border-[#d96814] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          Chargement des participants et scores enregistrés...
        </div>
      )}

      {erreur && (
        <div className="p-4 bg-red-50 text-red-600 text-xs rounded-xl mb-4 font-medium">
          {erreur}
        </div>
      )}

      {!chargement && participants.length === 0 && (
        <div className="py-8 text-center text-gray-400 text-xs">
          Aucun athlète trouvé pour cette épreuve. Vérifiez les inscriptions.
        </div>
      )}

      {!chargement && participants.length > 0 && (
        <div className="space-y-3">
          {classes.map((p, idx) => (
            <div
              key={p.id}
              className="flex items-center justify-between p-3.5 bg-[#fbfcfd] border border-gray-100 rounded-2xl hover:border-gray-200 transition-colors gap-4"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-orange-100 text-[#d96814] font-bold text-xs flex items-center justify-center shrink-0 border border-orange-200">
                  {idx + 1}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-xs text-gray-900 truncate">{p.nom}</p>
                  <p className="text-[10px] text-gray-400 uppercase font-semibold">
                    {p.pays || "SN"} {p.resultatId ? "• Score enregistré" : ""}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <input
                  type="text"
                  value={p.score}
                  onChange={(e) => handleScore(p.id, e.target.value)}
                  placeholder="Ex: 10.45 ou 3 - 1"
                  className="w-32 sm:w-40 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-900 outline-none focus:border-[#d96814] transition-colors"
                />
                {p.score && (
                  <button
                    type="button"
                    onClick={() => handleEffacerScore(p.id)}
                    className="text-gray-400 hover:text-red-500 text-xs p-1 cursor-pointer"
                    title="Effacer"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SaisieIndividuel;
