import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchResultats,
  fetchEvenements,
  fetchCategories,
  fetchJoueurs,
  fetchEquipes,
  supprimerResultat,
  modifierResultat,
} from "../../api/resultats";

const IconVoir = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
    <circle cx="12" cy="12" r="2.5" />
  </svg>
);

const IconEditer = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const IconSupprimer = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 7h16" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M6 7l1 14h10l1-14" />
    <path d="M9 7V4h6v3" />
  </svg>
);

function ListeResultats() {
  const navigate = useNavigate();

  const [resultats,          setResultats]          = useState([]);
  const [evenements,         setEvenements]         = useState([]);
  const [categories,         setCategories]         = useState([]);
  const [joueurs,            setJoueurs]            = useState([]);
  const [equipes,            setEquipes]            = useState([]);
  const [chargement,         setChargement]         = useState(true);
  const [erreur,             setErreur]             = useState("");

  // Filtres
  const [recherche,          setRecherche]          = useState("");
  const [filtreEvenement,    setFiltreEvenement]    = useState("");
  const [filtreCategorie,    setFiltreCategorie]    = useState("");
  const [typeFiltre,         setTypeFiltre]         = useState("tous"); // 'tous' | 'joueur' | 'equipe'

  // Modale d'édition rapide
  const [editionCible,       setEditionCible]       = useState(null);
  const [nouveauScore,       setNouveauScore]       = useState("");
  const [sauvegardeEnCours,  setSauvegardeEnCours]  = useState(false);
  const [erreurEdition,      setErreurEdition]      = useState("");

  // Modale de suppression
  const [aSupprimer,         setASupprimer]         = useState(null);
  const [suppressionEnCours, setSuppressionEnCours] = useState(false);

  // Pagination / affichage
  const [voirTous,           setVoirTous]           = useState(false);

  const charger = useCallback(async () => {
    setChargement(true);
    setErreur("");
    try {
      const [tousRes, evts, cats, jrs, eqs] = await Promise.all([
        fetchResultats(),
        fetchEvenements(),
        fetchCategories(),
        fetchJoueurs(),
        fetchEquipes(),
      ]);
      setResultats(tousRes);
      setEvenements(evts);
      setCategories(cats);
      setJoueurs(jrs);
      setEquipes(eqs);
    } catch {
      setErreur("Impossible de charger la liste des résultats.");
    } finally {
      setChargement(false);
    }
  }, []);

  useEffect(() => {
    charger();
  }, [charger]);

  // Récupération des métadonnées
  const getEvenement = (id) => evenements.find((e) => String(e.id) === String(id));
  const getCategorie = (id) => categories.find((c) => String(c.id) === String(id));

  const getNomCompetiteur = (r) => {
    if (r.info_competiteur?.nom_complet) {
      return r.info_competiteur.nom_complet;
    }
    const compId = r.competiteur || r.info_competiteur?.id;
    if (compId) {
      const joueur = joueurs.find((j) => String(j.id) === String(compId));
      if (joueur) return `${joueur.prenom ?? ""} ${joueur.nom ?? ""}`.trim() || joueur.username;
      const equipe = equipes.find((eq) => String(eq.id) === String(compId));
      if (equipe) return equipe.nom;
    }
    return "l'athlète / équipe";
  };

  // Filtrage combiné
  const resultatsFiltres = resultats.filter((r) => {
    // Filtre par événement
    if (filtreEvenement && String(r.evenement) !== String(filtreEvenement)) {
      return false;
    }

    // Filtre par catégorie
    const ev = getEvenement(r.evenement);
    const catId = typeof ev?.categorie === "object" ? ev?.categorie?.id : ev?.categorie;
    if (filtreCategorie && String(catId) !== String(filtreCategorie)) {
      return false;
    }

    // Filtre type (joueur vs équipe)
    const typeComp = r.info_competiteur?.type;
    if (typeFiltre === "joueur" && typeComp === "equipe") return false;
    if (typeFiltre === "equipe" && typeComp === "joueur") return false;

    // Recherche textuelle
    if (recherche.trim()) {
      const q = recherche.toLowerCase().trim();
      const nomEvt = (ev?.titre || "").toLowerCase();
      const nomComp = getNomCompetiteur(r).toLowerCase();
      const scoreStr = (r.score || "").toLowerCase();
      const paysStr = (r.info_competiteur?.pays || "").toLowerCase();
      return (
        nomEvt.includes(q) ||
        nomComp.includes(q) ||
        scoreStr.includes(q) ||
        paysStr.includes(q)
      );
    }

    return true;
  });

  const aAfficher = voirTous ? resultatsFiltres : resultatsFiltres.slice(0, 12);

  // ── Édition rapide du score ──────────────────────────────────────────────
  const ouvrirEdition = (res) => {
    const ev = getEvenement(res.evenement);
    const nomParticipant = getNomCompetiteur(res);
    setEditionCible({
      id: res.id,
      originalId: res.id,
      evenementId: res.evenement,
      competiteurId: res.competiteur || res.info_competiteur?.id,
      nom: nomParticipant,
      titreEvenement: ev?.titre || `Épreuve #${res.evenement}`,
      score: res.score || "",
    });
    setNouveauScore(res.score || "");
    setErreurEdition("");
  };

  const sauvegarderEdition = async (e) => {
    e.preventDefault();
    if (!nouveauScore.trim()) {
      setErreurEdition("Veuillez saisir une valeur de score.");
      return;
    }

    setSauvegardeEnCours(true);
    setErreurEdition("");
    try {
      await modifierResultat(
        editionCible.originalId,
        nouveauScore.trim(),
        editionCible.competiteurId,
        editionCible.evenementId
      );

      // Mise à jour de l'état local
      setResultats((prev) =>
        prev.map((r) => {
          const match =
            (editionCible.originalId && r.id === editionCible.originalId) ||
            (r.evenement === editionCible.evenementId &&
              (r.competiteur === editionCible.competiteurId ||
                r.info_competiteur?.id === editionCible.competiteurId));
          return match ? { ...r, score: nouveauScore.trim() } : r;
        })
      );

      setEditionCible(null);
    } catch {
      setErreurEdition("Impossible de sauvegarder la modification. Veuillez réessayer.");
    } finally {
      setSauvegardeEnCours(false);
    }
  };

  // ── Suppression ─────────────────────────────────────────────────────────
  const ouvrirSuppression = (res) => {
    const ev = getEvenement(res.evenement);
    const nomParticipant = getNomCompetiteur(res);
    setASupprimer({
      id: res.id,
      originalId: res.id,
      nom: nomParticipant,
      score: res.score,
      titreEvenement: ev?.titre || `Épreuve #${res.evenement}`,
    });
  };

  const confirmerSuppression = async () => {
    setSuppressionEnCours(true);
    try {
      if (aSupprimer.originalId) {
        await supprimerResultat(aSupprimer.originalId);
      }
      setResultats((prev) =>
        prev.filter((r) => {
          if (aSupprimer.originalId && r.id) return r.id !== aSupprimer.originalId;
          const compId = r.competiteur || r.info_competiteur?.id;
          return `${r.evenement}-${compId}` !== String(aSupprimer.id);
        })
      );
    } catch (err) {
      console.error("Erreur suppression résultat:", err);
      setResultats((prev) => prev.filter((r) => r.id !== aSupprimer.originalId));
    } finally {
      setSuppressionEnCours(false);
      setASupprimer(null);
    }
  };

  return (
    <>
      <section className="mt-[22px] bg-white border border-[#e1e4e7] rounded-[21px] overflow-hidden shadow-xs">
        {/* Barre de contrôle supérieure */}
        <div className="p-5 border-b border-[#edf0f2] bg-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Titre & Compteur */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#fff0e7] flex items-center justify-center text-[#d96814]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                  <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                  <path d="M4 22h16"></path>
                  <path d="M10 14.66V17c0 .55-.45 1-1 1H7v4h10v-4h-2c-.55 0-1-.45-1-1v-2.34"></path>
                  <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
                </svg>
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900 leading-tight">
                  Tableau des Résultats JOJ 2026
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {resultatsFiltres.length} résultat{resultatsFiltres.length > 1 ? "s" : ""} trouvé{resultatsFiltres.length > 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {/* Onglets de type (Tous / Individuel / Collectif) */}
            <div className="flex bg-[#f4f6f9] p-1 rounded-xl border border-[#e5e9f0] self-start md:self-auto">
              <button
                type="button"
                onClick={() => setTypeFiltre("tous")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  typeFiltre === "tous" ? "bg-white text-gray-900 shadow-2xs" : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Tous
              </button>
              <button
                type="button"
                onClick={() => setTypeFiltre("joueur")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  typeFiltre === "joueur" ? "bg-white text-[#d96814] shadow-2xs" : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Individuel
              </button>
              <button
                type="button"
                onClick={() => setTypeFiltre("equipe")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  typeFiltre === "equipe" ? "bg-white text-[#d96814] shadow-2xs" : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Collectif
              </button>
            </div>
          </div>

          {/* Ligne des filtres de recherche */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Recherche textuelle */}
            <div className="sm:col-span-6 relative">
              <input
                type="text"
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                placeholder="Rechercher un athlète, une équipe, un score..."
                className="w-full h-10 pl-9 pr-3.5 rounded-xl border border-gray-200 bg-[#f8f9fa] text-xs text-gray-800 outline-none focus:border-[#d96814] transition-colors"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              {recherche && (
                <button
                  type="button"
                  onClick={() => setRecherche("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Filtre Événement */}
            <div className="sm:col-span-3">
              <select
                value={filtreEvenement}
                onChange={(e) => setFiltreEvenement(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-[#f8f9fa] text-xs text-gray-700 outline-none focus:border-[#d96814] transition-colors cursor-pointer"
              >
                <option value="">Toutes les épreuves</option>
                {evenements.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.titre}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtre Catégorie */}
            <div className="sm:col-span-3">
              <select
                value={filtreCategorie}
                onChange={(e) => setFiltreCategorie(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-[#f8f9fa] text-xs text-gray-700 outline-none focus:border-[#d96814] transition-colors cursor-pointer"
              >
                <option value="">Toutes les catégories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nom} {c.discipline_nom ? `(${c.discipline_nom})` : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* En-tête des colonnes du tableau */}
        <div className="h-[44px] bg-[#fafbfc] border-b border-[#edf0f2] grid grid-cols-[1.8fr_1.5fr_1fr_1fr_90px] items-center px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">
          <span>Épreuve</span>
          <span>Compétiteur / Équipe</span>
          <span>Catégorie</span>
          <span className="text-center">Score / Temps</span>
          <span className="text-right">Actions</span>
        </div>

        {/* État chargement */}
        {chargement && (
          <div className="py-16 text-center text-sm text-gray-400 flex flex-col items-center justify-center gap-2">
            <span className="w-5 h-5 border-2 border-[#d96814] border-t-transparent rounded-full animate-spin"></span>
            Chargement des résultats…
          </div>
        )}

        {/* Erreur */}
        {!chargement && erreur && (
          <div className="py-12 text-center">
            <p className="text-sm text-red-500 font-medium">{erreur}</p>
            <button
              onClick={charger}
              className="mt-3 inline-block px-4 py-1.5 bg-[#fff0e7] text-[#d96814] text-xs font-bold rounded-lg hover:bg-[#ffe5d3] transition-colors cursor-pointer"
            >
              Réessayer
            </button>
          </div>
        )}

        {/* Aucun résultat */}
        {!chargement && !erreur && resultatsFiltres.length === 0 && (
          <div className="py-16 text-center">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 mb-3">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-700">Aucun résultat ne correspond aux filtres</p>
            <p className="mt-1 text-xs text-gray-400">
              Modifiez votre recherche ou saisissez de nouveaux résultats.
            </p>
            <button
              onClick={() => navigate("/register-result")}
              className="mt-4 px-4 py-2 rounded-lg bg-[#d96814] text-white text-xs font-bold hover:bg-[#b85610] transition-colors cursor-pointer"
            >
              + Saisir un nouveau résultat
            </button>
          </div>
        )}

        {/* Lignes du tableau */}
        {!chargement &&
          !erreur &&
          aAfficher.map((r, index) => {
            const ev = getEvenement(r.evenement);
            const catId = typeof ev?.categorie === "object" ? ev?.categorie?.id : ev?.categorie;
            const cat = getCategorie(catId);
            const nomParticipant = getNomCompetiteur(r);
            const comp = r.info_competiteur;

            return (
              <div
                key={r.id || `${r.evenement}-${r.competiteur || comp?.id}-${index}`}
                className="min-h-[64px] py-3 grid grid-cols-[1.8fr_1.5fr_1fr_1fr_90px] items-center px-6 border-b border-[#edf0f2] hover:bg-[#fbfcfd] transition-colors"
              >
                {/* Épreuve */}
                <div className="min-w-0 pr-3">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {ev?.titre || `Épreuve #${r.evenement}`}
                  </p>
                  {ev?.date && (
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {new Date(ev.date).toLocaleDateString("fr-FR")}
                    </p>
                  )}
                </div>

                {/* Compétiteur */}
                <div className="flex items-center gap-2.5 min-w-0 pr-3">
                  <div className="w-8 h-8 rounded-full bg-[#fff0e7] border border-[#fbd6bc] flex items-center justify-center shrink-0 overflow-hidden">
                    <span className="text-xs font-bold text-[#d96814]">
                      {(nomParticipant || "C").slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {nomParticipant}
                    </p>
                    {comp?.pays && (
                      <span className="inline-block text-[10px] uppercase font-bold text-gray-500 bg-gray-100 px-1.5 py-0.2 rounded">
                        {comp.pays}
                      </span>
                    )}
                  </div>
                </div>

                {/* Catégorie */}
                <div className="pr-2">
                  <span className="inline-block px-2.5 py-1 rounded-md bg-[#f4f6f9] border border-[#e2e7ec] text-xs font-medium text-gray-700 truncate max-w-full">
                    {cat?.nom || (ev?.categorie_nom ?? "Standard")}
                  </span>
                </div>

                {/* Score */}
                <div className="text-center">
                  <span className="inline-block px-3 py-1 rounded-lg bg-[#fff8f3] border border-[#fbd6bc] text-sm font-extrabold text-[#d96814]">
                    {r.score ?? "—"}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 text-gray-400">
                  {/* Modifier rapide */}
                  <button
                    type="button"
                    onClick={() => ouvrirEdition(r)}
                    className="p-1.5 rounded-lg hover:bg-orange-50 hover:text-[#d96814] transition-colors cursor-pointer"
                    title="Modifier ce score"
                  >
                    <IconEditer />
                  </button>

                  {/* Accéder à l'épreuve complète */}
                  <button
                    type="button"
                    onClick={() => navigate(`/register-result?id=${r.evenement}&mode=edition`)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 hover:text-gray-700 transition-colors cursor-pointer"
                    title="Ouvrir la saisie complète"
                  >
                    <IconVoir />
                  </button>

                  {/* Supprimer */}
                  <button
                    type="button"
                    onClick={() => ouvrirSuppression(r)}
                    className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer"
                    title="Supprimer ce résultat"
                  >
                    <IconSupprimer />
                  </button>
                </div>
              </div>
            );
          })}

        {/* Footer Voir Tous */}
        {!chargement && !erreur && resultatsFiltres.length > 12 && (
          <div className="p-4 bg-gray-50/50 border-t border-[#edf0f2] flex items-center justify-center">
            <button
              onClick={() => setVoirTous((v) => !v)}
              className="text-xs font-bold text-[#d96814] hover:underline cursor-pointer"
            >
              {voirTous
                ? "Réduire l'affichage"
                : `Afficher l'intégralité des résultats (${resultatsFiltres.length})`}
            </button>
          </div>
        )}
      </section>

      {/* Modale d'Édition Rapide */}
      {editionCible && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">Modifier le résultat</h3>
              <button
                type="button"
                onClick={() => setEditionCible(null)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={sauvegarderEdition} className="mt-4">
              {erreurEdition && (
                <div className="mb-3 p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
                  {erreurEdition}
                </div>
              )}

              <div className="bg-gray-50 p-3 rounded-xl mb-4 border border-gray-100">
                <p className="text-xs text-gray-500 font-medium">Épreuve :</p>
                <p className="text-sm font-bold text-gray-800 mb-2">{editionCible.titreEvenement}</p>
                <p className="text-xs text-gray-500 font-medium">Participant :</p>
                <p className="text-sm font-bold text-gray-800">{editionCible.nom}</p>
              </div>

              <div>
                <label htmlFor="modal_score" className="block text-xs font-bold text-gray-700 mb-1">
                  Nouveau score ou performance
                </label>
                <input
                  id="modal_score"
                  type="text"
                  required
                  value={nouveauScore}
                  onChange={(e) => setNouveauScore(e.target.value)}
                  placeholder="ex: 10.45 ou 3-1"
                  className="w-full h-11 px-3.5 rounded-xl border border-gray-300 text-sm font-bold text-gray-900 outline-none focus:border-[#d96814] transition-colors"
                />
              </div>

              <div className="mt-6 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setEditionCible(null)}
                  disabled={sauvegardeEnCours}
                  className="px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer disabled:opacity-60"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={sauvegardeEnCours}
                  className="px-5 py-2.5 rounded-xl bg-[#d96814] text-white text-xs font-bold hover:bg-[#b85610] cursor-pointer disabled:opacity-60"
                >
                  {sauvegardeEnCours ? "Enregistrement…" : "Enregistrer la modification"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modale de Confirmation de Suppression */}
      {aSupprimer && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              </svg>
            </div>
            <h3 className="text-base font-bold text-gray-900">Supprimer le résultat ?</h3>
            <p className="mt-2 text-xs text-gray-500 leading-relaxed">
              Êtes-vous sûr de vouloir supprimer le résultat de <strong>{aSupprimer.nom}</strong>{aSupprimer.score ? ` (Score : ${aSupprimer.score})` : ""} pour l'épreuve <strong>{aSupprimer.titreEvenement}</strong> ?
            </p>

            <div className="mt-6 flex gap-3 justify-center">
              <button
                type="button"
                onClick={() => setASupprimer(null)}
                disabled={suppressionEnCours}
                className="w-1/2 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer disabled:opacity-60"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={confirmerSuppression}
                disabled={suppressionEnCours}
                className="w-1/2 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 cursor-pointer disabled:opacity-60"
              >
                {suppressionEnCours ? "Suppression…" : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ListeResultats;
