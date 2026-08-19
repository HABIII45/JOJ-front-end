import { useState, useEffect, useCallback } from "react";
import { fetchJoueurs, fetchResultatsParEvenement } from "../../api/resultats";

/** Convertit "1:02.35" ou "10.5" en secondes pour tri */
function enSecondes(str) {
  if (!str || str.toString().trim() === "") return Infinity;
  const propre = str.toString().trim();
  if (propre.includes(":")) {
    const [min, reste] = propre.split(":");
    return parseFloat(min) * 60 + parseFloat(reste || 0);
  }
  return parseFloat(propre);
}

function IconEditer() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 1 1 3.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  );
}

function SaisieIndividuel({ evenementId, onDonneesChange }) {
  const [participants, setParticipants] = useState([]);
  const [chargement,   setChargement]   = useState(false);
  const [erreur,       setErreur]       = useState("");
  const [calcule,      setCalcule]      = useState(false);

  const charger = useCallback(async () => {
    setChargement(true);
    setErreur("");
    setCalcule(false);
    try {
      // Charge tous les joueurs disponibles
      const joueurs = await fetchJoueurs();

      // Si un événement est sélectionné, pré-remplit les scores existants
      let existants = [];
      if (evenementId) {
        existants = await fetchResultatsParEvenement(evenementId);
      }

      const lignes = joueurs.map((j) => {
        // Retrouve un résultat existant pour ce joueur (compétiteur)
        const res = existants.find(
          (r) => r.info_competiteur?.id === j.id || r.competiteur === j.id
        );
        return {
          id:          j.id,
          nom:         `${j.prenom ?? ""} ${j.nom ?? ""}`.trim() || j.username || "—",
          avatar:      j.image ?? null,
          pays:        j.pays ?? "",
          score:       res?.score ?? "",
          resultatId:  res ? (res.id ?? null) : null,
        };
      });

      setParticipants(lignes);
      onDonneesChange?.(lignes);
    } catch {
      setErreur("Impossible de charger les joueurs.");
    } finally {
      setChargement(false);
    }
  }, [evenementId, onDonneesChange]);

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

  const classes = calcule
    ? [...participants].sort((a, b) => enSecondes(a.score) - enSecondes(b.score))
    : participants;

  if (chargement) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 flex items-center justify-center h-40">
        <span className="text-sm text-gray-400">Chargement des joueurs…</span>
      </div>
    );
  }

  if (erreur) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
        <p className="text-sm text-red-500">{erreur}</p>
        <button onClick={charger} className="mt-3 text-sm text-[#c85f18] hover:underline">
          Réessayer
        </button>
      </div>
    );
  }

  if (participants.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 text-center text-sm text-gray-400">
        {evenementId
          ? "Aucun joueur trouvé. Ajoutez des joueurs depuis la gestion des participants."
          : "Sélectionnez d'abord une épreuve pour charger les participants."}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">

      {/* En-tête */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#fef3eb] rounded-xl flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-[#c85f18]" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <span className="text-xl font-medium text-black">
            Saisie des résultats
            <span className="ml-2 text-sm text-gray-400">({participants.length} participants)</span>
          </span>
        </div>

        <button
          onClick={() => setCalcule(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 hover:bg-[#fef3eb] hover:border-[#c85f18] transition-colors"
        >
          <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span className="text-sm font-medium text-gray-500">Calculer le classement</span>
        </button>
      </div>

      {/* En-têtes tableau */}
      <div className="flex items-center border-b border-gray-100 pb-2 mb-2 px-4">
        <div className="w-[60px]  text-xs font-medium text-gray-500 tracking-[0.60px]">RANG</div>
        <div className="flex-1   text-xs font-medium text-gray-500 tracking-[0.60px]">JOUEUR</div>
        <div className="w-[120px] text-xs font-medium text-gray-500 tracking-[0.60px] text-center">SCORE</div>
        <div className="w-[80px]  text-xs font-medium text-gray-500 tracking-[0.60px] text-right">ACTIONS</div>
      </div>

      {/* Lignes */}
      {classes.map((p, index) => {
        const aUnScore  = p.score.toString().trim() !== "";
        const rang      = calcule && aUnScore ? String(index + 1).padStart(2, "0") : "--";
        const estPremier = calcule && aUnScore && index === 0;

        return (
          <div
            key={p.id}
            className="flex items-center bg-gray-50 rounded-xl border border-gray-200 px-4 py-3 mb-2 last:mb-0"
          >
            {/* Rang */}
            <div className="w-[60px]">
              <span className={`font-bold text-base ${estPremier ? "text-[#c85f18]" : "text-gray-400"}`}>
                {rang}
              </span>
            </div>

            {/* Joueur */}
            <div className="flex-1 flex items-center gap-3">
              {p.avatar ? (
                <img
                  src={p.avatar}
                  alt={p.nom}
                  className="w-8 h-8 rounded-full object-cover border border-gray-200"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#fef3eb] border border-gray-200 flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-bold text-[#c85f18]">
                    {p.nom.split(" ").map((m) => m[0]).slice(0, 2).join("").toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <span className="text-[15px] font-medium text-black">{p.nom}</span>
                {p.pays && (
                  <span className="ml-2 text-xs text-gray-400">{p.pays}</span>
                )}
              </div>
            </div>

            {/* Score */}
            <div className="w-[120px] flex justify-center">
              <div className="bg-white rounded-lg border border-gray-200 px-3 py-2 w-[90px] text-center">
                <input
                  type="text"
                  value={p.score}
                  onChange={(e) => handleScore(p.id, e.target.value)}
                  placeholder="score"
                  className="w-full bg-transparent text-base font-medium text-black text-center outline-none border-none p-0 placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Action */}
            <div className="w-[80px] flex justify-end">
              <button
                type="button"
                className="text-gray-400 hover:text-[#c85f18] transition-colors"
                title="Modifier"
              >
                <IconEditer />
              </button>
            </div>
          </div>
        );
      })}

      {calcule && (
        <p className="mt-3 text-xs text-center text-gray-400">
          Classement calculé du score le plus court au plus long.
        </p>
      )}
    </div>
  );
}

export default SaisieIndividuel;
