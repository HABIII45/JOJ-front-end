import { useState, useEffect, useCallback } from "react";
import { fetchEquipes, fetchResultatsParEvenement } from "../../api/resultats";

function SaisieCollectif({ evenementId, onDonneesChange }) {
  const [matchs,      setMatchs]      = useState([]);
  const [chargement,  setChargement]  = useState(false);
  const [erreur,      setErreur]      = useState("");

  const charger = useCallback(async () => {
    setChargement(true);
    setErreur("");
    try {
      const equipes = await fetchEquipes();

      // Pré-remplit les scores existants si un événement est sélectionné
      let existants = [];
      if (evenementId) {
        existants = await fetchResultatsParEvenement(evenementId);
      }

      // Construit les paires d'affrontement (équipes par paires consécutives)
      const paires = [];
      for (let i = 0; i + 1 < equipes.length; i += 2) {
        const eqA = equipes[i];
        const eqB = equipes[i + 1];

        const resA = existants.find(
          (r) => r.info_competiteur?.id === eqA.id || r.competiteur === eqA.id
        );
        const resB = existants.find(
          (r) => r.info_competiteur?.id === eqB.id || r.competiteur === eqB.id
        );

        paires.push({
          id:          i / 2 + 1,
          equipeA:     eqA,
          equipeB:     eqB,
          scoreA:      resA?.score ?? "0",
          scoreB:      resB?.score ?? "0",
          resultatIdA: resA?.id ?? null,
          resultatIdB: resB?.id ?? null,
        });
      }

      setMatchs(paires);
      onDonneesChange?.(paires);
    } catch {
      setErreur("Impossible de charger les équipes.");
    } finally {
      setChargement(false);
    }
  }, [evenementId, onDonneesChange]);

  useEffect(() => {
    charger();
  }, [charger]);

  const handleScore = (id, cote, valeur) => {
    const maj = matchs.map((m) =>
      m.id === id
        ? { ...m, [cote === "A" ? "scoreA" : "scoreB"]: valeur }
        : m
    );
    setMatchs(maj);
    onDonneesChange?.(maj);
  };

  /** Affiche le logo ou les initiales d'une équipe */
  const AvatarEquipe = ({ equipe }) => (
    <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 bg-[#fef3eb] flex items-center justify-center shrink-0">
      {equipe.image ? (
        <img src={equipe.image} alt={equipe.nom} className="w-full h-full object-cover" />
      ) : (
        <span className="text-[10px] font-bold text-[#c85f18]">
          {equipe.nom.slice(0, 2).toUpperCase()}
        </span>
      )}
    </div>
  );

  if (chargement) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 flex items-center justify-center h-40">
        <span className="text-sm text-gray-400">Chargement des équipes…</span>
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

  if (matchs.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 text-center text-sm text-gray-400">
        {evenementId
          ? "Aucune équipe trouvée. Ajoutez des équipes depuis la gestion des participants."
          : "Sélectionnez d'abord une épreuve pour charger les équipes."}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">

      {/* En-tête */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#fef3eb] rounded-xl flex items-center justify-center">
          <svg className="w-3.5 h-3.5 text-[#c85f18]" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="9" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 2" />
          </svg>
        </div>
        <span className="text-xl font-medium text-black">
          Affrontements
          <span className="ml-2 text-sm text-gray-400">({matchs.length} matchs)</span>
        </span>
      </div>

      {/* En-têtes colonnes */}
      <div className="grid grid-cols-[1fr_120px_1fr] gap-4 mb-4">
        <span className="text-xs font-semibold text-[#c85f18] tracking-[0.60px]">Équipe A</span>
        <span className="text-xs font-semibold text-[#c85f18] tracking-[0.60px] text-center">SCORE</span>
        <span className="text-xs font-semibold text-[#c85f18] tracking-[0.60px]">Équipe B</span>
      </div>

      {/* Matchs */}
      {matchs.map((m) => (
        <div key={m.id}
          className="grid grid-cols-[1fr_120px_1fr] gap-4 items-center mb-3 last:mb-0">

          {/* Équipe A */}
          <div className="flex items-center gap-3 bg-gray-50 rounded-xl border border-gray-200 px-3 py-2">
            <AvatarEquipe equipe={m.equipeA} />
            <div>
              <p className="m-0 text-sm font-medium text-black">{m.equipeA.nom}</p>
              {m.equipeA.pays && (
                <p className="m-0 text-xs text-gray-400">{m.equipeA.pays}</p>
              )}
            </div>
          </div>

          {/* Score */}
          <div className="flex items-center justify-center gap-2 bg-gray-50 rounded-xl border border-gray-200 px-3 py-2">
            <input
              type="number"
              min="0"
              value={m.scoreA}
              onChange={(e) => handleScore(m.id, "A", e.target.value)}
              className="w-8 bg-transparent text-center text-xl font-bold text-[#c85f18] outline-none border-none p-0"
            />
            <span className="text-sm text-gray-400">-</span>
            <input
              type="number"
              min="0"
              value={m.scoreB}
              onChange={(e) => handleScore(m.id, "B", e.target.value)}
              className="w-8 bg-transparent text-center text-xl font-bold text-gray-500 outline-none border-none p-0"
            />
          </div>

          {/* Équipe B */}
          <div className="flex items-center gap-3 bg-gray-50 rounded-xl border border-gray-200 px-3 py-2">
            <AvatarEquipe equipe={m.equipeB} />
            <div>
              <p className="m-0 text-sm font-medium text-black">{m.equipeB.nom}</p>
              {m.equipeB.pays && (
                <p className="m-0 text-xs text-gray-400">{m.equipeB.pays}</p>
              )}
            </div>
          </div>

        </div>
      ))}
    </div>
  );
}

export default SaisieCollectif;
