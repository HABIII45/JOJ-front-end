import { useEffect, useMemo, useState } from "react";
import {
  fetchResultats,
  fetchEvenements,
  fetchDisciplines,
  fetchCategories,
  fetchEquipes,
  fetchJoueurs,
} from "../../api/resultats";
import { getImageUrl } from "../../api/api";
import { Header } from "../../components/layout/Header";
import { Footer } from "../../components/layout/Footer";
import ChatbotAssistant from "../../components/chat/Chatbot";
import { Trophy, Search, Calendar, MapPin, Swords, Medal } from "lucide-react";

export default function Resultats() {
  const [resultats, setResultats] = useState([]);
  const [evenements, setEvenements] = useState([]);
  const [disciplines, setDisciplines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [equipes, setEquipes] = useState([]);
  const [joueurs, setJoueurs] = useState([]);
  const [filtreSelectionne, setFiltreSelectionne] = useState("Tous");
  const [recherche, setRecherche] = useState("");
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    let actif = true;

    async function chargerDonnees() {
      setChargement(true);
      try {
        const [resList, evList, discList, catList, eqList, jrList] = await Promise.all([
          fetchResultats().catch(() => []),
          fetchEvenements().catch(() => []),
          fetchDisciplines().catch(() => []),
          fetchCategories().catch(() => []),
          fetchEquipes().catch(() => []),
          fetchJoueurs().catch(() => []),
        ]);

        if (!actif) return;

        setResultats(resList || []);
        setEvenements(evList || []);
        setDisciplines(discList || []);
        setCategories(catList || []);
        setEquipes(eqList || []);
        setJoueurs(jrList || []);
      } catch (err) {
        console.error("Erreur chargement résultats publics:", err);
      } finally {
        if (actif) setChargement(false);
      }
    }

    chargerDonnees();
    return () => { actif = false; };
  }, []);

  // Map des catégories par ID
  const categoriesMap = useMemo(() => {
    const map = new Map();
    categories.forEach((c) => {
      if (c && c.id) map.set(String(c.id), c);
    });
    return map;
  }, [categories]);

  // Map des événements par ID
  const evenementsMap = useMemo(() => {
    const map = new Map();
    evenements.forEach((ev) => {
      if (ev && ev.id) map.set(String(ev.id), ev);
    });
    return map;
  }, [evenements]);

  // Map des équipes et joueurs pour enrichir les résultats
  const equipesMap = useMemo(() => {
    const map = new Map();
    equipes.forEach((eq) => {
      if (eq && eq.id) map.set(String(eq.id), eq);
      if (eq && eq.competiteur_ptr_id) map.set(String(eq.competiteur_ptr_id), eq);
    });
    return map;
  }, [equipes]);

  const joueursMap = useMemo(() => {
    const map = new Map();
    joueurs.forEach((j) => {
      if (j && j.id) map.set(String(j.id), j);
      if (j && j.competiteur_ptr_id) map.set(String(j.competiteur_ptr_id), j);
    });
    return map;
  }, [joueurs]);

  // Helper pour obtenir les données complètes d'un compétiteur (Équipe ou Joueur)
const getCompetiteurInfo = (r) => {
  // Récupérer l'ID du compétiteur
  const compId = String(r.competiteur || r.info_competiteur?.id || "");
  
  console.log("CompID trouvé:", compId); // Pour déboguer
  
  // Chercher dans les équipes
  const equipe = equipes.find(e => String(e.id) === compId);
  if (equipe) {
    return {
      type: "equipe",
      nom: equipe.nom,
      pays: equipe.pays || "SN",
      image: equipe.image || null,
    };
  }

  // Chercher dans les joueurs
  const joueur = joueurs.find(j => String(j.id) === compId);
  if (joueur) {
    return {
      type: "joueur",
      nom: joueur.prenom ? `${joueur.prenom} ${joueur.nom}` : joueur.nom,
      pays: joueur.pays || "SN",
      image: joueur.image || null,
    };
  }

  // Si on trouve un nom directement dans le résultat
  if (r.competiteur_nom) {
    return {
      type: "joueur",
      nom: r.competiteur_nom,
      pays: r.competiteur_pays || "SN",
      image: null,
    };
  }

  // Fallback
  return {
    type: "joueur",
    nom: `Athlète #${compId || "inconnu"}`,
    pays: "SN",
    image: null,
  };
};

  // Liste des pastilles de filtres dynamiques (Disciplines & Catégories réelles)
  const listeFiltres = useMemo(() => {
    const setFiltres = new Set(["Tous"]);

    disciplines.forEach((d) => {
      if (d.nom?.trim()) setFiltres.add(d.nom.trim());
    });

    categories.forEach((c) => {
      if (c.nom?.trim()) setFiltres.add(c.nom.trim());
      if (c.discipline_nom?.trim()) setFiltres.add(c.discipline_nom.trim());
    });

    evenements.forEach((ev) => {
      if (ev.discipline_nom?.trim()) setFiltres.add(ev.discipline_nom.trim());
      if (ev.categorie_nom?.trim()) setFiltres.add(ev.categorie_nom.trim());
    });

    return Array.from(setFiltres);
  }, [disciplines, categories, evenements]);

  // Regroupement des résultats réels par Événement
  const evenementsAvecResultats = useMemo(() => {
    const groupes = new Map();

    // 1. Initialiser avec tous les événements connus
    evenements.forEach((ev) => {
      const evId = String(ev.id);
      const catId = typeof ev.categorie === "object" ? ev.categorie?.id : ev.categorie;
      const catObj = categoriesMap.get(String(catId));

      groupes.set(evId, {
        evenement: {
          ...ev,
          categorie_nom: catObj?.nom || ev.categorie_nom || "Compétition",
          discipline_nom: catObj?.discipline_nom || ev.discipline_nom || "Épreuve officielle",
        },
        resultats: [],
      });
    });

    // 2. Ajouter les résultats
    resultats.forEach((r) => {
      const evId = String(r.evenement?.id || r.evenement || "");
      if (!groupes.has(evId)) {
        const ev = evenementsMap.get(evId) || (typeof r.evenement === "object" ? r.evenement : { id: evId, titre: `Épreuve #${evId}` });
        const catId = typeof ev.categorie === "object" ? ev.categorie?.id : ev.categorie;
        const catObj = categoriesMap.get(String(catId));

        groupes.set(evId, {
          evenement: {
            ...ev,
            categorie_nom: catObj?.nom || ev.categorie_nom || "Compétition",
            discipline_nom: catObj?.discipline_nom || ev.discipline_nom || "Épreuve officielle",
          },
          resultats: [],
        });
      }
      groupes.get(evId).resultats.push(r);
    });

    return Array.from(groupes.values());
  }, [evenements, resultats, evenementsMap, categoriesMap]);

  // Filtrage selon recherche et filtre sélectionné
  const evenementsFiltres = useMemo(() => {
    return evenementsAvecResultats.filter(({ evenement, resultats }) => {
      const nomDisc = (evenement.discipline_nom || "").toLowerCase().trim();
      const nomCat = (evenement.categorie_nom || "").toLowerCase().trim();
      const titreEv = (evenement.titre || "").toLowerCase().trim();

      // 1. Filtre par pastille
      if (filtreSelectionne !== "Tous") {
        const f = filtreSelectionne.toLowerCase().trim();
        const correspond = nomDisc === f || nomCat === f || titreEv.includes(f);
        if (!correspond) return false;
      }

      // 2. Filtre par texte de recherche
      if (recherche.trim()) {
        const q = recherche.toLowerCase().trim();
        const titreMatch = titreEv.includes(q);
        const siteMatch = (evenement.site_nom || evenement.site?.nom || "").toLowerCase().includes(q);
        const discMatch = nomDisc.includes(q) || nomCat.includes(q);
        const participantMatch = resultats.some((r) => {
          const comp = getCompetiteurInfo(r);
          return comp.nom.toLowerCase().includes(q) || comp.pays.toLowerCase().includes(q);
        });

        return titreMatch || siteMatch || discMatch || participantMatch;
      }

      return true;
    });
  }, [evenementsAvecResultats, filtreSelectionne, recherche]);

  // Regroupement garanti par Discipline
  const groupeParDiscipline = useMemo(() => {
    const groupes = {};
    evenementsFiltres.forEach((r) => {
      const discipline =
        r.evenement?.discipline || r.evenement?.categorie || "Divers";
      (groupes[discipline] = groupes[discipline] || []).push(r);
    });
    return groupes;
  }, [evenementsFiltres]);

  const disciplinesVisibles = useMemo(() => {
    const noms = Object.keys(groupeParDiscipline);
    if (filtreSelectionne === "Tous") return noms;
    return noms.filter((n) => n === filtreSelectionne);
  }, [groupeParDiscipline, filtreSelectionne]);
// Ajoutez après les useState
useEffect(() => {
  console.log("=== VÉRIFICATION DES DONNÉES ===");
  console.log("Résultats:", resultats);
  console.log("Équipes:", equipes);
  console.log("Joueurs:", joueurs);
  
  // Vérifier le premier résultat
  if (resultats.length > 0) {
    console.log("Premier résultat:", resultats[0]);
    console.log("competiteur ID:", resultats[0].competiteur);
    console.log("info_competiteur:", resultats[0].info_competiteur);
  }
}, [resultats, equipes, joueurs]);
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Header />

      {/* --- En-tête officiel --- */}
      <section className="bg-white border-b border-gray-100 py-12 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 text-[#C25B1E] border border-orange-200 text-xs font-extrabold uppercase tracking-wider mb-4">
            <Trophy size={14} />
            <span>Scores & Matchs Officiels • JOJ Dakar 2026</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
            Résultats des Compétitions
          </h1>
          <p className="mt-3 text-sm sm:text-base text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Suivez en direct le classement des groupes et les derniers scores des éliminatoires et finales des JOJ Dakar 2026.
          </p>

          {/* Barre de Recherche */}
          <div className="mt-8 max-w-md mx-auto relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              placeholder="Rechercher une épreuve, une équipe, un pays..."
              className="w-full pl-11 pr-4 py-3 bg-[#F8FAFC] border border-gray-200 rounded-2xl text-xs text-gray-800 outline-none focus:border-[#C25B1E] transition-all shadow-xs"
            />
          </div>

          {/* Pastilles de filtres dynamiques */}
          {listeFiltres.length > 1 && (
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {listeFiltres.map((nom) => (
                <button
                  key={nom}
                  onClick={() => setFiltreSelectionne(nom)}
                  className={`rounded-full px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                    filtreSelectionne === nom
                      ? "bg-[#C25B1E] text-white shadow-sm"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {nom}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* --- Grille des Épreuves et Résultats Réels --- */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-10">
        {chargement ? (
          <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3 text-gray-400">
            <span className="w-8 h-8 border-3 border-[#C25B1E] border-t-transparent rounded-full animate-spin"></span>
            <span className="text-sm font-medium">Synchronisation des scores officiels en direct…</span>
          </div>
        ) : evenementsFiltres.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 max-w-md mx-auto shadow-xs">
            <Trophy size={36} className="text-gray-300 mx-auto mb-3" />
            <h3 className="font-bold text-gray-800 text-base">Aucun résultat trouvé</h3>
            <p className="text-xs text-gray-400 mt-1">
              Aucun score enregistré ne correspond à vos critères de recherche.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {evenementsFiltres.map(({ evenement, resultats }) => {
              const urlPhoto = getImageUrl(evenement.image);
              const dateFormatee = evenement.date
                ? new Date(evenement.date).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })
                : "Date officielle";

              // Détection si l'épreuve est un match / sport collectif
              const estCollectif =
                resultats.some((r) => {
                  const comp = getCompetiteurInfo(r);
                  return comp.type === "equipe";
                }) ||
                (evenement.discipline_nom &&
                  /foot|basket|hand|volley|rugby|hockey|water/i.test(evenement.discipline_nom)) ||
                (evenement.categorie_nom &&
                  /foot|basket|hand|volley|rugby|equipe/i.test(evenement.categorie_nom));

              // Construction des paires de matchs pour les sports collectifs
              const pairesMatchs = [];
              if (estCollectif && resultats.length > 0) {
                for (let i = 0; i < resultats.length; i += 2) {
                  const rA = resultats[i];
                  const rB = resultats[i + 1];
                  pairesMatchs.push({
                    id: Math.floor(i / 2) + 1,
                    equipeA: getCompetiteurInfo(rA),
                    scoreA: rA.score ?? "0",
                    equipeB: rB ? getCompetiteurInfo(rB) : null,
                    scoreB: rB ? rB.score ?? "0" : "—",
                  });
                }
              }

              return (
                <article
                  key={evenement.id}
                  className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* En-tête de la carte Épreuve */}
                  <div className="p-6 sm:p-8 bg-gradient-to-r from-gray-900 to-gray-800 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="bg-[#C25B1E] text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-full tracking-wider">
                          {evenement.discipline_nom || evenement.categorie_nom || "Compétition Olympique"}
                        </span>
                        <span className="text-xs text-gray-300 font-medium">
                          {resultats.length > 0
                            ? estCollectif
                              ? `${pairesMatchs.length} match(s) disputé(s)`
                              : `${resultats.length} score(s) validé(s)`
                            : "Compétition programmée"}
                        </span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                        {evenement.titre}
                      </h2>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-300 font-medium pt-1">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={13} className="text-[#C25B1E]" />
                          {dateFormatee} {evenement.heure ? `à ${evenement.heure.slice(0, 5)} GMT` : ""}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin size={13} className="text-[#C25B1E]" />
                          {evenement.site_nom || evenement.site?.nom || "Site Olympique"}
                        </span>
                      </div>
                    </div>

                    {urlPhoto && (
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 border border-white/20 shadow-sm">
                        <img
                          src={urlPhoto}
                          alt={evenement.titre}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>

                  {/* Corps des Résultats : Affichage Matchs ou Classement Individuel */}
                  <div className="p-6">
                    {resultats.length === 0 ? (
                      <div className="py-8 text-center text-gray-400">
                        <p className="text-xs font-semibold text-gray-600">
                          Scores en attente de publication
                        </p>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          Les résultats officiels seront affichés ici dès la fin de l'épreuve.
                        </p>
                      </div>
                    ) : estCollectif ? (
                      /* ── AFFICHAGE FORMAT MATCHS (Équipe A Score VS Score Équipe B) ── */
                      <div className="space-y-4">
                        {pairesMatchs.map((match) => (
                          <div
                            key={match.id}
                            className="bg-[#F8FAFC] border border-gray-200/80 rounded-2xl p-5 hover:border-orange-200 transition-colors"
                          >
                            <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-4 pb-2 border-b border-gray-200/60">
                              <span className="flex items-center gap-1.5 text-gray-700">
                                <Swords size={14} className="text-[#C25B1E]" />
                                Match #{match.id}
                              </span>
                              <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">
                                ● Score Officiel
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-7 items-center gap-4">
                              {/* Équipe A */}
                              <div className="md:col-span-3 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-orange-100 text-[#C25B1E] font-black text-sm flex items-center justify-center shrink-0 border border-orange-200 shadow-2xs">
                                  {match.equipeA.nom.slice(0, 2).toUpperCase()}
                                </div>
                                <div>
                                  <p className="font-extrabold text-sm text-gray-900 leading-tight">
                                    {match.equipeA.nom}
                                  </p>
                                  <span className="inline-block mt-0.5 uppercase font-bold text-gray-600 bg-gray-200/80 px-2 py-0.5 rounded text-[10px]">
                                    {match.equipeA.pays}
                                  </span>
                                </div>
                              </div>

                              {/* Tableau des Scores Centré */}
                              <div className="md:col-span-1 flex items-center justify-center gap-2">
                                <div className="px-3.5 py-2 bg-white border border-gray-300 rounded-xl shadow-xs">
                                  <span className="font-black text-xl text-gray-900">
                                    {match.scoreA}
                                  </span>
                                </div>
                                <span className="font-bold text-xs text-gray-400">VS</span>
                                <div className="px-3.5 py-2 bg-white border border-gray-300 rounded-xl shadow-xs">
                                  <span className="font-black text-xl text-gray-900">
                                    {match.scoreB}
                                  </span>
                                </div>
                              </div>

                              {/* Équipe B */}
                              <div className="md:col-span-3 flex items-center justify-start md:justify-end gap-3 text-left md:text-right">
                                <div className="order-2 md:order-1">
                                  <p className="font-extrabold text-sm text-gray-900 leading-tight">
                                    {match.equipeB ? match.equipeB.nom : "Adversaire"}
                                  </p>
                                  <span className="inline-block mt-0.5 uppercase font-bold text-gray-600 bg-gray-200/80 px-2 py-0.5 rounded text-[10px]">
                                    {match.equipeB ? match.equipeB.pays : "—"}
                                  </span>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 font-black text-sm flex items-center justify-center shrink-0 border border-slate-200 shadow-2xs order-1 md:order-2">
                                  {match.equipeB ? match.equipeB.nom.slice(0, 2).toUpperCase() : "?"}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      /* ── AFFICHAGE FORMAT COURSE / INDIVIDUEL (Classement Athlètes) ── */
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left">
                          <thead>
                            <tr className="border-b border-gray-100 text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                              <th className="pb-3 px-3">RANG / ATHLÈTE</th>
                              <th className="pb-3 px-3">PAYS</th>
                              <th className="pb-3 px-3 text-right">SCORE OFFICIEL</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {resultats.map((r, idx) => {
                              const comp = getCompetiteurInfo(r);

                              return (
                                <tr key={r.id || idx} className="hover:bg-gray-50/60 transition-colors">
                                  <td className="py-3 px-3">
                                    <div className="flex items-center gap-3">
                                      <div className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs shrink-0 ${
                                        idx === 0 ? "bg-amber-100 text-amber-700 border border-amber-300" :
                                        idx === 1 ? "bg-slate-100 text-slate-700 border border-slate-300" :
                                        idx === 2 ? "bg-orange-100 text-orange-700 border border-orange-300" :
                                        "bg-gray-100 text-gray-500"
                                      }`}>
                                        {idx + 1}
                                      </div>
                                      <div>
                                        <p className="font-bold text-gray-900">{comp.nom}</p>
                                        <p className="text-[10px] text-gray-400">
                                          {comp.type === "equipe" ? "Équipe Officielle" : "Athlète officiel"}
                                        </p>
                                      </div>
                                    </div>
                                  </td>

                                  <td className="py-3 px-3">
                                    <span className="inline-block uppercase font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded text-[10px]">
                                      {comp.pays}
                                    </span>
                                  </td>

                                  <td className="py-3 px-3 text-right">
                                    <span className="inline-block px-3.5 py-1 rounded-xl bg-orange-50 border border-orange-200 font-black text-sm text-[#C25B1E]">
                                      {r.score ?? "—"}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      <ChatbotAssistant />
      <Footer />
    </div>
  );
}