import { useEffect, useMemo, useState } from "react";
import { isBackendConnected } from "../../lib/api";
import apiClient from "../../lib/api";
import { CarteCourse, CarteMatch, pastillesInitiales } from "../../lib/test";
import { RESULTATS_DEMO_ENRICHIS, ICONE_DISCIPLINE } from "../../lib/demoData";
import ChatbotAssistant from "../../components/chat/Chatbot";
import { Footer } from "../../components/layout/Footer";
import { Header } from "../../components/layout/Header";

export default function Resultats() {
  const [resultats, setResultats] = useState([]);
  const [disciplines, setDisciplines] = useState([]);
  const [filtre, setFiltre] = useState("Tous");
  const [recherche, setRecherche] = useState("");
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
  let ignore = false;

  async function charger() {
    setChargement(true);

    const chargerMock = () => {
      setResultats(RESULTATS_DEMO_ENRICHIS);
      const noms = RESULTATS_DEMO_ENRICHIS.map(
        (r) => r.evenement?.discipline || r.evenement?.categorie
      ).filter(Boolean);
      setDisciplines(pastillesInitiales(noms));
    };

    // 1. Si pas de connexion backend détectée -> Mock direct
    if (!isBackendConnected()) {
      if (!ignore) chargerMock();
      setChargement(false);
      return;
    }

    // 2. Tentative de chargement via API
    try {
      const [liste, discList] = await Promise.all([
        apiClient.get("/api/resultats/").then((r) => r.data).catch(() => []),
        apiClient.get("/api/disciplines/").then((r) => r.data).catch(() => []),
      ]);
      
      if (ignore) return;

      // Si l'API répond mais que la liste des résultats est vide -> Fallback Mock
      if (!liste || liste.length === 0) {
        chargerMock();
      } else {
        setResultats(liste);
        const noms = (discList || []).map((d) => d.nom).filter(Boolean);
        setDisciplines(pastillesInitiales(noms));
      }
    } catch (_) {
      if (!ignore) chargerMock();
    } finally {
      if (!ignore) setChargement(false);
    }
  }

  charger();
  return () => {
    ignore = true;
  };
}, []);

  // Filtrage par recherche
  const resultatsFiltres = useMemo(() => {
    const q = recherche.trim().toLowerCase();
    if (!q) return resultats;
    return resultats.filter((r) => {
      const cible = `${r.evenement?.titre || ""} ${r.competiteur?.prenom || ""} ${
        r.adversaire?.prenom || ""
      }`.toLowerCase();
      return cible.includes(q);
    });
  }, [resultats, recherche]);

  // Regroupement garanti par Discipline
  const groupeParDiscipline = useMemo(() => {
    const groupes = {};
    resultatsFiltres.forEach((r) => {
      const discipline =
        r.evenement?.discipline || r.evenement?.categorie || "Divers";
      (groupes[discipline] = groupes[discipline] || []).push(r);
    });
    return groupes;
  }, [resultatsFiltres]);

  const disciplinesVisibles = useMemo(() => {
    const noms = Object.keys(groupeParDiscipline);
    if (filtre === "Tous") return noms;
    return noms.filter((n) => n === filtre);
  }, [groupeParDiscipline, filtre]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <section className="mx-auto max-w-6xl w-full px-4 pt-10 pb-6 text-center">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          Résultats des Compétitions
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-gray-500 leading-relaxed">
          Suivez en direct le classement des groupes et les derniers scores des
          éliminatoires des JOJ Dakar 2026.
        </p>

        {/* Boutons de Filtres */}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {disciplines.map((nom) => (
            <button
              key={nom}
              onClick={() => setFiltre(nom)}
              className={`rounded-full px-4 py-1.5 text-[13px] font-medium border transition ${
                filtre === nom
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-600 border-gray-200 hover:border-orange-500 hover:text-orange-500"
              }`}
            >
              {nom}
            </button>
          ))}
        </div>
      </section>

      <section className="relative bg-gray-100/80 flex-1">
        <div className="mx-auto max-w-6xl px-4 py-10 space-y-6">
          {chargement && (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-32 rounded-2xl bg-white shadow-sm animate-pulse"
                />
              ))}
            </div>
          )}

          {!chargement &&
            disciplinesVisibles.map((discipline) => {
              const rows = groupeParDiscipline[discipline] || [];
              if (rows.length === 0) return null;

              const matchs = rows.filter((r) => r.adversaire);
              const coursesParEvenement = {};
              rows
                .filter((r) => !r.adversaire)
                .forEach((r) => {
                  const cle =
                    r.evenement?.id ?? r.evenement?.titre ?? "sans-evenement";
                  (coursesParEvenement[cle] =
                    coursesParEvenement[cle] || []).push(r);
                });

              return (
                <div key={discipline} className="space-y-4">
                  <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                    <span aria-hidden="true">
                      {ICONE_DISCIPLINE[discipline] || "🏆"}
                    </span>
                    {discipline}
                  </h2>

                  {matchs.map((r) => (
                    <CarteMatch key={r.id} res={r} />
                  ))}

                  {Object.entries(coursesParEvenement).map(
                    ([cle, groupeRes]) => (
                      <CarteCourse
                        key={cle}
                        titre={groupeRes[0].evenement?.titre}
                        statut={groupeRes[0].evenement?.statut}
                        resultats={groupeRes}
                      />
                    )
                  )}
                </div>
              );
            })}

          {!chargement && disciplinesVisibles.length === 0 && (
            <p className="text-center text-sm text-gray-400 py-12">
              Aucun résultat ne correspond aux filtres choisis.
            </p>
          )}
        </div>
      </section>


      <ChatbotAssistant />

      <Footer />
    </div>
  );
}