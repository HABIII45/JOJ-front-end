import { useState, useEffect, useCallback } from "react";
import { fetchEquipes, fetchResultatsParEvenement } from "../../api/resultats";

function SaisieCollectif({ evenementId, categorieId, onDonneesChange }) {
  const [matchs,      setMatchs]      = useState([]);
  const [chargement,  setChargement]  = useState(false);
  const [erreur,      setErreur]      = useState("");

  const charger = useCallback(async () => {
    if (!evenementId) {
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

      const idsExistants = new Set(existants.map((r) => String(r.info_competiteur?.id || r.competiteur)));

      // Filtrer les équipes appartenant à la catégorie OU ayant déjà un résultat
      const equipesFiltrees = toutesLesEquipes.filter((eq) => {
        if (idsExistants.has(String(eq.id))) return true;
        if (!categorieId) return true;
        const catEquipe = typeof eq.categorie === "object" ? eq.categorie?.id : eq.categorie;
        return String(catEquipe) === String(categorieId);
      });

      // Construit les paires d'affrontement
      const paires = [];
      for (let i = 0; i + 1 < equipesFiltrees.length; i += 2) {
        const eqA = equipesFiltrees[i];
        const eqB = equipesFiltrees[i + 1];

        const resA = existants.find(
          (r) => String(r.info_competiteur?.id || r.competiteur) === String(eqA.id)
        );
        const resB = existants.find(
          (r) => String(r.info_competiteur?.id || r.competiteur) === String(eqB.id)
        );

        paires.push({
          id:          i / 2 + 1,
          equipeA:     eqA,
          equipeB:     eqB,
          scoreA:      resA?.score ?? "",
          scoreB:      resB?.score ?? "",
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

  if (!evenementId) {
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
        <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
          Sélectionnez une épreuve ci-dessus pour afficher et modifier les scores des équipes.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-base font-bold text-gray-900">
            Saisie des Matchs Collectifs
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Renseignez ou modifiez les scores des affrontements entre équipes.
          </p>
        </div>
        <span className="bg-orange-50 text-[#d96814] text-xs font-bold px-3 py-1.5 rounded-full border border-orange-200">
          {matchs.length} match{matchs.length > 1 ? "s" : ""}
        </span>
      </div>

      {chargement && (
        <div className="py-12 text-center text-gray-400 text-xs">
          <div className="w-6 h-6 border-2 border-[#d96814] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          Chargement des équipes et matchs...
        </div>
      )}

      {erreur && (
        <div className="p-4 bg-red-50 text-red-600 text-xs rounded-xl mb-4 font-medium">
          {erreur}
        </div>
      )}

      {!chargement && matchs.length === 0 && (
        <div className="py-8 text-center text-gray-400 text-xs">
          Aucune équipe enregistrée pour cette catégorie.
        </div>
      )}

      {!chargement && matchs.length > 0 && (
        <div className="space-y-4">
          {matchs.map((m) => (
            <div
              key={m.id}
              className="p-4 bg-[#fbfcfd] border border-gray-100 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              {/* Équipe A */}
              <div className="flex items-center gap-3 flex-1 justify-start">
                <AvatarEquipe equipe={m.equipeA} />
                <div>
                  <p className="font-bold text-xs text-gray-900">{m.equipeA.nom}</p>
                  <p className="text-[10px] text-gray-400 uppercase font-semibold">{m.equipeA.pays || "SN"}</p>
                </div>
              </div>

              {/* Scores confrontation */}
              <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-xl border border-gray-200 shadow-xs">
                <input
                  type="text"
                  value={m.scoreA}
                  onChange={(e) => handleScore(m.id, "A", e.target.value)}
                  placeholder="0"
                  className="w-12 text-center text-sm font-black text-gray-900 outline-none focus:text-[#d96814]"
                />
                <span className="text-gray-400 font-bold text-xs">VS</span>
                <input
                  type="text"
                  value={m.scoreB}
                  onChange={(e) => handleScore(m.id, "B", e.target.value)}
                  placeholder="0"
                  className="w-12 text-center text-sm font-black text-gray-900 outline-none focus:text-[#d96814]"
                />
              </div>

              {/* Équipe B */}
              <div className="flex items-center gap-3 flex-1 justify-end">
                <div className="text-right">
                  <p className="font-bold text-xs text-gray-900">{m.equipeB.nom}</p>
                  <p className="text-[10px] text-gray-400 uppercase font-semibold">{m.equipeB.pays || "SN"}</p>
                </div>
                <AvatarEquipe equipe={m.equipeB} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SaisieCollectif;
