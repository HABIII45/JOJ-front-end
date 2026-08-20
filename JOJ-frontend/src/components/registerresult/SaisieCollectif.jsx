import { useState, useEffect, useCallback } from "react";
import { fetchEquipes, fetchResultatsParEvenement } from "../../api/resultats";

function SaisieCollectif({ evenementId, categorieId, onDonneesChange }) {
  const [matchs, setMatchs] = useState([]);
  const [toutesLesEquipes, setToutesLesEquipes] = useState([]);
  const [equipesDisponibles, setEquipesDisponibles] = useState([]);
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState("");
  const [equipeSelectionneeA, setEquipeSelectionneeA] = useState("");
  const [equipeSelectionneeB, setEquipeSelectionneeB] = useState("");

  const charger = useCallback(async () => {
    if (!evenementId) {
      setMatchs([]);
      setToutesLesEquipes([]);
      setEquipesDisponibles([]);
      onDonneesChange?.([]);
      return;
    }

    setChargement(true);
    setErreur("");
    try {
      const [toutesLesEquipesData, existants] = await Promise.all([
        fetchEquipes(),
        fetchResultatsParEvenement(evenementId),
      ]);

      setToutesLesEquipes(toutesLesEquipesData);

      // Récupérer les IDs des équipes déjà dans des matchs
      const idsExistants = new Set();
      matchs.forEach(m => {
        idsExistants.add(String(m.equipeA.id));
        idsExistants.add(String(m.equipeB.id));
      });

      // Filtrer les équipes disponibles (non utilisées)
      const disponibles = toutesLesEquipesData.filter((eq) => {
        if (!categorieId) return !idsExistants.has(String(eq.id));
        const catEquipe = typeof eq.categorie === "object" ? eq.categorie?.id : eq.categorie;
        const estDansCategorie = String(catEquipe) === String(categorieId);
        return estDansCategorie && !idsExistants.has(String(eq.id));
      });

      setEquipesDisponibles(disponibles);
    } catch {
      setErreur("Impossible de charger les équipes.");
    } finally {
      setChargement(false);
    }
  }, [evenementId, categorieId, matchs]);

  useEffect(() => {
    charger();
  }, [charger]);

  // Ajouter un nouveau match
  const ajouterMatch = () => {
    if (!equipeSelectionneeA || !equipeSelectionneeB) {
      setErreur("Veuillez sélectionner deux équipes.");
      return;
    }

    if (equipeSelectionneeA === equipeSelectionneeB) {
      setErreur("Une équipe ne peut pas s'affronter elle-même.");
      return;
    }

    // Vérifier si les équipes sont déjà dans un match
    const equipesDejaUtilisees = new Set();
    matchs.forEach(m => {
      equipesDejaUtilisees.add(String(m.equipeA.id));
      equipesDejaUtilisees.add(String(m.equipeB.id));
    });

    if (equipesDejaUtilisees.has(equipeSelectionneeA)) {
      setErreur("Cette équipe est déjà dans un match.");
      return;
    }
    if (equipesDejaUtilisees.has(equipeSelectionneeB)) {
      setErreur("Cette équipe est déjà dans un match.");
      return;
    }

    const equipeA = toutesLesEquipes.find(e => String(e.id) === equipeSelectionneeA);
    const equipeB = toutesLesEquipes.find(e => String(e.id) === equipeSelectionneeB);

    const nouveauMatch = {
      id: matchs.length + 1,
      equipeA: equipeA,
      equipeB: equipeB,
      scoreA: "",
      scoreB: "",
      resultatIdA: null,
      resultatIdB: null,
    };

    const nouveauxMatchs = [...matchs, nouveauMatch];
    setMatchs(nouveauxMatchs);
    onDonneesChange?.(nouveauxMatchs);
    setEquipeSelectionneeA("");
    setEquipeSelectionneeB("");
    setErreur("");
  };

  // Supprimer un match
  const supprimerMatch = (id) => {
    const nouveauxMatchs = matchs.filter(m => m.id !== id);
    setMatchs(nouveauxMatchs);
    onDonneesChange?.(nouveauxMatchs);
  };

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
      {equipe?.image ? (
        <img src={equipe.image} alt={equipe.nom} className="w-full h-full object-cover" />
      ) : (
        <span className="text-[10px] font-bold text-[#c85f18]">
          {equipe?.nom?.slice(0, 2).toUpperCase() || "??"}
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

  // Équipes déjà utilisées pour l'affichage
  const equipesUtilisees = new Set();
  matchs.forEach(m => {
    equipesUtilisees.add(String(m.equipeA.id));
    equipesUtilisees.add(String(m.equipeB.id));
  });

  // Filtrer les équipes disponibles (non utilisées et dans la bonne catégorie)
  const equipesDispo = toutesLesEquipes.filter((eq) => {
    if (!categorieId) return !equipesUtilisees.has(String(eq.id));
    const catEquipe = typeof eq.categorie === "object" ? eq.categorie?.id : eq.categorie;
    const estDansCategorie = String(catEquipe) === String(categorieId);
    return estDansCategorie && !equipesUtilisees.has(String(eq.id));
  });

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-base font-bold text-gray-900">
            Saisie des Matchs Collectifs
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Sélectionnez deux équipes pour créer un match, puis saisissez les scores.
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

      {/* Sélection des équipes pour un nouveau match */}
      {!chargement && (
        <div className="mb-6 p-4 bg-orange-50/50 rounded-xl border border-orange-100">
          <p className="text-xs font-semibold text-gray-700 mb-3">➕ Créer un nouveau match</p>
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={equipeSelectionneeA}
              onChange={(e) => setEquipeSelectionneeA(e.target.value)}
              className="flex-1 min-w-[120px] rounded-xl border border-gray-200 px-3 py-2 text-xs outline-none focus:border-[#d96814] bg-white"
            >
              <option value="">Équipe A</option>
              {equipesDispo.map((eq) => (
                <option key={eq.id} value={eq.id}>
                  {eq.nom} ({eq.pays})
                </option>
              ))}
            </select>

            <span className="text-gray-400 font-bold text-xs">VS</span>

            <select
              value={equipeSelectionneeB}
              onChange={(e) => setEquipeSelectionneeB(e.target.value)}
              className="flex-1 min-w-[120px] rounded-xl border border-gray-200 px-3 py-2 text-xs outline-none focus:border-[#d96814] bg-white"
            >
              <option value="">Équipe B</option>
              {equipesDispo.map((eq) => (
                <option key={eq.id} value={eq.id}>
                  {eq.nom} ({eq.pays})
                </option>
              ))}
            </select>

            <button
              onClick={ajouterMatch}
              className="bg-[#d96814] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#c85f18] transition whitespace-nowrap"
            >
              Ajouter le match
            </button>
          </div>
          {equipesDispo.length === 0 && matchs.length > 0 && (
            <p className="text-xs text-gray-400 mt-2">
              Toutes les équipes de cette catégorie sont déjà dans un match.
            </p>
          )}
        </div>
      )}

      {!chargement && toutesLesEquipes.length === 0 && (
        <div className="py-8 text-center text-gray-400 text-xs">
          Aucune équipe enregistrée pour cette catégorie.
        </div>
      )}

      {/* Liste des matchs */}
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
                  <p className="font-bold text-xs text-gray-900">{m.equipeA?.nom || "?"}</p>
                  <p className="text-[10px] text-gray-400 uppercase font-semibold">{m.equipeA?.pays || "SN"}</p>
                </div>
              </div>

              {/* Scores */}
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
                  <p className="font-bold text-xs text-gray-900">{m.equipeB?.nom || "?"}</p>
                  <p className="text-[10px] text-gray-400 uppercase font-semibold">{m.equipeB?.pays || "SN"}</p>
                </div>
                <AvatarEquipe equipe={m.equipeB} />
                <button
                  onClick={() => supprimerMatch(m.id)}
                  className="text-gray-300 hover:text-red-500 transition ml-1"
                  title="Supprimer ce match"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SaisieCollectif;