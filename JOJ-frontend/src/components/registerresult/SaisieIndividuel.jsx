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

/** Extrait un nombre depuis un score (ex: "9.91" → 9.91, "3-1" → 3) */
function extraireNombre(score) {
  if (!score || score.toString().trim() === "") return null;
  const propre = score.toString().trim();
  if (propre.includes("-")) {
    const parts = propre.split("-");
    return parseFloat(parts[0]) || null;
  }
  if (propre.includes(" - ")) {
    const parts = propre.split(" - ");
    return parseFloat(parts[0]) || null;
  }
  const parsed = parseFloat(propre);
  return isNaN(parsed) ? null : parsed;
}

function SaisieIndividuel({ evenementId, categorieId, onDonneesChange }) {
  const [participants, setParticipants] = useState([]);
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState("");
  const [ordreCroissant, setOrdreCroissant] = useState(false); // Changé à false par défaut
  const [modeClassement, setModeClassement] = useState("temps");

  const charger = useCallback(async () => {
    if (!evenementId) {
      setParticipants([]);
      onDonneesChange?.([]);
      return;
    }

    setChargement(true);
    setErreur("");
    try {
      const [tousLesJoueurs, existants] = await Promise.all([
        fetchJoueurs(),
        fetchResultatsParEvenement(evenementId),
      ]);

      const idsExistants = new Set(existants.map((r) => String(r.info_competiteur?.id || r.competiteur)));

      const joueursFiltres = tousLesJoueurs.filter((j) => {
        if (idsExistants.has(String(j.id))) return true;
        if (!categorieId) return true;
        const catJoueur = typeof j.categorie === "object" ? j.categorie?.id : j.categorie;
        return String(catJoueur) === String(categorieId);
      });

      const lignes = joueursFiltres.map((j) => {
        const res = existants.find(
          (r) => String(r.info_competiteur?.id || r.competiteur) === String(j.id)
        );
        return {
          id: j.id,
          nom: `${j.prenom ?? ""} ${j.nom ?? ""}`.trim() || j.username || `Athlète #${j.id}`,
          avatar: j.image ?? null,
          pays: j.pays ?? "",
          score: res?.score ?? "",
          resultatId: res ? (res.id ?? null) : null,
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
    onDonneesChange?.(maj);
  };

  const handleEffacerScore = (id) => {
    handleScore(id, "");
  };

  const toggleOrdre = () => {
    setOrdreCroissant(!ordreCroissant);
  };

  const toggleMode = () => {
    setModeClassement(modeClassement === "temps" ? "score" : "temps");
  };

  // Fonction de comparaison selon le mode choisi
  const comparerParticipants = (a, b) => {
    if (modeClassement === "temps") {
      const tempsA = enSecondes(a.score);
      const tempsB = enSecondes(b.score);
      if (tempsA === Infinity && tempsB === Infinity) return 0;
      if (tempsA === Infinity) return 1;
      if (tempsB === Infinity) return -1;
      return ordreCroissant ? tempsA - tempsB : tempsB - tempsA;
    } else {
      const scoreA = extraireNombre(a.score) || 0;
      const scoreB = extraireNombre(b.score) || 0;
      // Pour les scores : le plus grand est meilleur
      // Si ordreCroissant = true (⬆️) : on affiche du plus grand au plus petit
      // Si ordreCroissant = false (⬇️) : on affiche du plus petit au plus grand
      return ordreCroissant ? scoreB - scoreA : scoreA - scoreB;
    }
  };

  const classes = [...participants].sort(comparerParticipants);

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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 pb-4 border-b border-gray-100 gap-3">
        <div>
          <h2 className="text-base font-bold text-gray-900">
            Saisie des Scores & Performances
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Renseignez ou modifiez le chrono, points ou score officiel pour chaque athlète.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="bg-orange-50 text-[#d96814] text-xs font-bold px-3 py-1.5 rounded-full border border-orange-200">
            {participants.length} athlète{participants.length > 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {!chargement && participants.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 mb-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
          <span className="text-xs font-semibold text-gray-600">Classement :</span>
          
          <button
            onClick={toggleMode}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              modeClassement === "temps"
                ? "bg-[#d96814] text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            ⏱️ Temps
          </button>
          
          <button
            onClick={toggleMode}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              modeClassement === "score"
                ? "bg-[#d96814] text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            🏆 Score
          </button>

          <div className="w-px h-6 bg-gray-300" />

          <button
            onClick={toggleOrdre}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition flex items-center gap-1.5"
          >
            {ordreCroissant ? (
              <>
                <span>⬆️</span> Décroissant
              </>
            ) : (
              <>
                <span>⬇️</span> Croissant
              </>
            )}
          </button>

          <span className="text-[10px] text-gray-400 ml-1">
            {modeClassement === "temps" 
              ? "(plus petit = meilleur)" 
              : "(plus grand = meilleur)"}
          </span>
        </div>
      )}

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
          {classes.map((p, idx) => {
            let medal = null;
            if (idx === 0) medal = "🥇";
            else if (idx === 1) medal = "🥈";
            else if (idx === 2) medal = "🥉";

            return (
              <div
                key={p.id}
                className={`flex items-center justify-between p-3.5 bg-[#fbfcfd] border rounded-2xl hover:border-gray-200 transition-colors gap-4 ${
                  idx === 0 ? "border-amber-200 bg-amber-50/30" :
                  idx === 1 ? "border-gray-300 bg-gray-50/30" :
                  idx === 2 ? "border-orange-200 bg-orange-50/30" :
                  "border-gray-100"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center shrink-0 border ${
                    idx === 0 ? "bg-amber-100 text-amber-700 border-amber-300" :
                    idx === 1 ? "bg-gray-100 text-gray-700 border-gray-300" :
                    idx === 2 ? "bg-orange-100 text-orange-700 border-orange-300" :
                    "bg-gray-50 text-gray-500 border-gray-200"
                  }`}>
                    {medal || idx + 1}
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
                    placeholder={modeClassement === "temps" ? "Ex: 10.45 ou 1:02.35" : "Ex: 3 - 1 ou 85"}
                    className={`w-32 sm:w-40 px-3 py-2 bg-white border rounded-xl text-xs font-bold text-gray-900 outline-none transition-colors ${
                      p.score ? "border-[#d96814] focus:border-[#d96814]" : "border-gray-200 focus:border-[#d96814]"
                    }`}
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
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SaisieIndividuel;