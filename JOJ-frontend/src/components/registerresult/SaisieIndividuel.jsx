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
    // Si l'épreuve ET la catégorie ne sont pas encore toutes deux sélectionnées, ne rien charger
    if (!evenementId || !categorieId) {
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

      // 2. Filtre les joueurs qui appartiennent STRICTEMENT à la catégorie sélectionnée
      const joueursFiltres = tousLesJoueurs.filter((j) => {
        const catJoueur = typeof j.categorie === "object" ? j.categorie?.id : j.categorie;
        return String(catJoueur) === String(categorieId);
      });

      // 3. Associe chaque joueur filtré avec son résultat existant éventuel
      const lignes = joueursFiltres.map((j) => {
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
      setErreur("Impossible de charger les participants pour cette catégorie.");
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

  // Si l'épreuve ou la catégorie n'est pas encore choisie
  if (!evenementId || !categorieId) {
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
        <p className="mt-1 text-sm text-gray-500 max-w-md mx-auto">
          Veuillez sélectionner à la fois <strong>l'épreuve</strong> et la <strong>catégorie</strong> ci-dessus pour afficher la liste des joueurs participants et saisir les résultats.
        </p>
      </div>
    );
  }

  if (chargement) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 flex items-center justify-center h-40">
        <span className="text-sm text-gray-400">Chargement des joueurs de la catégorie…</span>
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

  if (participants.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 text-center">
        <div className="mx-auto w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
        </div>
        <p className="text-sm font-semibold text-gray-700">Aucun joueur trouvé dans cette catégorie</p>
        <p className="mt-1 text-xs text-gray-400">
          Il n'y a pas encore de joueur enregistré sous cette catégorie. Vous pouvez en ajouter ou choisir une autre catégorie.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#fef3eb] rounded-xl flex items-center justify-center">
            <svg className="w-4 h-4 text-[#c85f18]" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <span className="text-xl font-medium text-black">
            Joueurs participants
            <span className="ml-2 text-sm text-gray-400 font-normal">({participants.length} joueur{participants.length > 1 ? "s" : ""})</span>
          </span>
        </div>

        <button
          type="button"
          onClick={() => setCalcule(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 hover:bg-[#fef3eb] hover:border-[#c85f18] transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span className="text-sm font-medium text-gray-600">Calculer le classement</span>
        </button>
      </div>

      {/* En-têtes tableau */}
      <div className="flex items-center border-b border-gray-100 pb-2 mb-2 px-4">
        <div className="w-[60px] text-xs font-semibold text-gray-500 tracking-[0.60px]">RANG</div>
        <div className="flex-1 text-xs font-semibold text-gray-500 tracking-[0.60px]">JOUEUR</div>
        <div className="w-[140px] text-xs font-semibold text-gray-500 tracking-[0.60px] text-center">SCORE / TEMPS</div>
        <div className="w-[80px] text-xs font-semibold text-gray-500 tracking-[0.60px] text-right">ACTIONS</div>
      </div>

      {/* Lignes participants */}
      {classes.map((p, index) => {
        const aUnScore = p.score.toString().trim() !== "";
        const rang = calcule && aUnScore ? String(index + 1).padStart(2, "0") : "--";
        const estPremier = calcule && aUnScore && index === 0;
        const estDeuxieme = calcule && aUnScore && index === 1;
        const estTroisieme = calcule && aUnScore && index === 2;

        return (
          <div
            key={p.id}
            className="flex items-center bg-gray-50 rounded-xl border border-gray-200 px-4 py-3 mb-2 last:mb-0 hover:bg-white hover:border-[#d96814]/40 transition-all"
          >
            {/* Rang */}
            <div className="w-[60px] flex items-center gap-1.5">
              <span className={`font-bold text-base ${
                estPremier ? "text-[#d96814]" : estDeuxieme ? "text-gray-600" : estTroisieme ? "text-amber-700" : "text-gray-400"
              }`}>
                {rang}
              </span>
              {estPremier && <span>🥇</span>}
              {estDeuxieme && <span>🥈</span>}
              {estTroisieme && <span>🥉</span>}
            </div>

            {/* Joueur */}
            <div className="flex-1 flex items-center gap-3">
              {p.avatar ? (
                <img
                  src={p.avatar}
                  alt={p.nom}
                  className="w-9 h-9 rounded-full object-cover border border-gray-200 shrink-0"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-[#fef3eb] border border-gray-200 flex items-center justify-center shrink-0">
                  <span className="text-[11px] font-bold text-[#c85f18]">
                    {p.nom.split(" ").map((m) => m[0]).slice(0, 2).join("").toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <span className="text-sm font-semibold text-gray-900">{p.nom}</span>
                {p.pays && (
                  <span className="ml-2 px-1.5 py-0.5 rounded bg-gray-200/70 text-[11px] font-medium text-gray-600">
                    {p.pays}
                  </span>
                )}
              </div>
            </div>

            {/* Score */}
            <div className="w-[140px] flex justify-center">
              <div className="bg-white rounded-lg border border-gray-300 focus-within:border-[#d96814] px-3 py-1.5 w-[110px] text-center shadow-2xs transition-colors">
                <input
                  type="text"
                  value={p.score}
                  onChange={(e) => handleScore(p.id, e.target.value)}
                  placeholder="ex: 10.45"
                  className="w-full bg-transparent text-sm font-bold text-gray-900 text-center outline-none border-none p-0 placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="w-[80px] flex justify-end gap-2 text-gray-400">
              {p.score && (
                <button
                  type="button"
                  onClick={() => handleEffacerScore(p.id)}
                  className="hover:text-red-500 transition-colors cursor-pointer p-1"
                  title="Effacer le score"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}
            </div>
          </div>
        );
      })}

      {calcule && (
        <p className="mt-4 text-xs text-center text-[#d96814] font-medium bg-[#fff8f3] p-2 rounded-lg border border-[#fbd6bc]">
          Classement ordonné calculé avec succès.
        </p>
      )}
    </div>
  );
}

export default SaisieIndividuel;
