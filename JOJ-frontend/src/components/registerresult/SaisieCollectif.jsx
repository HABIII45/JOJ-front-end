import { useState, useEffect, useCallback } from "react";
import { fetchEquipes, fetchResultatsParEvenement } from "../../api/resultats";

function SaisieCollectif({ evenementId, categorieId, onDonneesChange }) {
  const [matchs,      setMatchs]      = useState([]);
  const [chargement,  setChargement]  = useState(false);
  const [erreur,      setErreur]      = useState("");

  const charger = useCallback(async () => {
    // Si l'épreuve ET la catégorie ne sont pas sélectionnées, ne rien afficher
    if (!evenementId || !categorieId) {
      setMatchs([]);
      onDonneesChange?.([]);
      return;
    }

    setChargement(true);
    setErreur("");
    try {
      const [toutesLesEquipes, existants] = await Promise.all([
        fetchEquipes(),
        fetchResultatsParEvenement(evenementId),
      ]);

      // Filtrer les équipes appartenant à la catégorie sélectionnée
      const equipesFiltrees = toutesLesEquipes.filter((eq) => {
        const catEquipe = typeof eq.categorie === "object" ? eq.categorie?.id : eq.categorie;
        return String(catEquipe) === String(categorieId);
      });

      // Construit les paires d'affrontement
      const paires = [];
      for (let i = 0; i + 1 < equipesFiltrees.length; i += 2) {
        const eqA = equipesFiltrees[i];
        const eqB = equipesFiltrees[i + 1];

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
  }, [evenementId, categorieId, onDonneesChange]);

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

  if (!evenementId || !categorieId) {
    return (
      <div className="bg-white rounded-3xl border border-dashed border-gray-300 p-12 text-center">
        <div className="mx-auto w-12 h-12 rounded-2xl bg-[#fff0e7] flex items-center justify-center text-[#d96814] mb-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="2" y1="12" x2="22" y2="12"></line>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
        </div>
        <h3 className="text-base font-bold text-gray-800">Sélection requise</h3>
        <p className="mt-1 text-sm text-gray-500 max-w-md mx-auto">
          Veuillez sélectionner <strong>l'épreuve</strong> et la <strong>catégorie</strong> ci-dessus pour afficher les équipes et les matchs.
        </p>
      </div>
    );
  }

  if (chargement) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 flex items-center justify-center h-40">
        <span className="text-sm text-gray-400">Chargement des équipes de la catégorie…</span>
      </div>
    );
  }

  if (erreur) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
        <p className="text-sm text-red-500">{erreur}</p>
        <button onClick={charger} className="mt-3 text-sm text-[#c85f18] hover:underline cursor-pointer">
          Réessayer
        </button>
      </div>
    );
  }

  if (matchs.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 text-center text-sm text-gray-400">
        Aucun affrontement d'équipes disponible pour cette catégorie (au moins 2 équipes requises).
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
      {/* En-tête */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#fef3eb] rounded-xl flex items-center justify-center">
          <svg className="w-4 h-4 text-[#c85f18]" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="9" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 2" />
          </svg>
        </div>
        <span className="text-xl font-medium text-black">
          Affrontements collectifs
          <span className="ml-2 text-sm text-gray-400 font-normal">({matchs.length} match{matchs.length > 1 ? "s" : ""})</span>
        </span>
      </div>

      {/* En-têtes colonnes */}
      <div className="grid grid-cols-[1fr_120px_1fr] gap-4 mb-4">
        <span className="text-xs font-semibold text-[#c85f18] tracking-[0.60px] uppercase">Équipe A</span>
        <span className="text-xs font-semibold text-[#c85f18] tracking-[0.60px] text-center uppercase">SCORE</span>
        <span className="text-xs font-semibold text-[#c85f18] tracking-[0.60px] uppercase">Équipe B</span>
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
              className="w-10 bg-transparent text-center text-lg font-bold text-[#c85f18] outline-none border-none p-0"
            />
            <span className="text-sm text-gray-400 font-bold">-</span>
            <input
              type="number"
              min="0"
              value={m.scoreB}
              onChange={(e) => handleScore(m.id, "B", e.target.value)}
              className="w-10 bg-transparent text-center text-lg font-bold text-gray-700 outline-none border-none p-0"
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
