import { useEffect, useMemo, useState } from "react";
import { isBackendConnected } from "../../lib/api";
import apiClient from "../../lib/api";
import { estMatch, CarteCourse, CarteMatch } from "../../lib/test";
import { RESULTATS_DEMO_ENRICHIS, pastillesInitiales, disciplinesDemo, ICONE_DISCIPLINE } from "../../lib/demoData";
import { ChatbotAssistant } from "../../components/chat/Chatbot";
import { Footer } from "../../components/layout/Footer";
import { Header } from "../../components/layout/Header";

export default function Resultats() {
  const [resultats, setResultats] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filtre, setFiltre] = useState("Tous");
  const [recherche, setRecherche] = useState("");
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function charger() {
      setChargement(true);
      if (!isBackendConnected()) {
        if (!ignore) {
          setResultats(RESULTATS_DEMO_ENRICHIS);
          setCategories(pastillesInitiales(disciplinesDemo.map((d) => d.nom)));
        }
        setChargement(false);
        return;
      }

      try {
        const [liste, cats] = await Promise.all([
          apiClient.get("/api/resultats/").then((r) => r.data).catch(() => []),
          apiClient.get("/api/categories/").then((r) => r.data).catch(() => []),
        ]);
        if (ignore) return;

        let evenements = [];
        try {
          evenements = await apiClient.get("/api/events/").then((r) => r.data).catch(() => []);
        } catch (_) {}
        
        const evenementsParId = {};
        (evenements || []).forEach((ev) => {
          evenementsParId[ev.id] = ev;
        });

        const enrichis = (liste || []).map((res, idx) => ({
          ...res,
          _position: res.position || 0,
          _adversaire: res.adversaire || null,
          evenement: res.evenement || evenementsParId[res.evenement] || {
            titre: `Épreuve ${idx + 1}`,
          },
        }));

        setResultats(enrichis);
        const noms = (cats || []).map((c) => c.nom).filter(Boolean);
        setCategories(pastillesInitiales(noms));
      } catch (_) {
        if (!ignore) {
          setResultats(RESULTATS_DEMO_ENRICHIS);
          setCategories(pastillesInitiales(disciplinesDemo.map((d) => d.nom)));
        }
      } finally {
        if (!ignore) setChargement(false);
      }
    }

    charger();
    return () => {
      ignore = true;
    };
  }, []);

  const groupeParDiscipline = useMemo(() => {
    const groupes = {};
    resultats.forEach((r) => {
      const discipline = r.evenement?.categorie || "Divers";
      (groupes[discipline] = groupes[discipline] || []).push(r);
    });
    return groupes;
  }, [resultats]);

  const disciplinesVisibles = useMemo(() => {
    const noms = Object.keys(groupeParDiscipline);
    if (filtre === "Tous") return noms;
    return noms.filter((n) => n === filtre);
  }, [groupeParDiscipline, filtre]);

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

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Dynamic Keyframes Animation Style */}
      <style>{`
        @keyframes bubblePop {
          0% { opacity: 0; transform: translateY(6px) scale(0.9); }
          10%, 85% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(6px) scale(0.95); }
        }
        .animate-bubble-pop { animation: bubblePop 5.6s ease-in-out forwards; }

        @keyframes shootUpwardStar {
          0% { opacity: 0; transform: translate(0,0) scale(0.3) rotate(0deg); filter: drop-shadow(0 0 4px var(--star-color)); }
          15% { opacity: 1; transform: translate(calc(var(--tw-tx) * 0.2), calc(var(--tw-ty) * 0.2)) scale(1.3); filter: drop-shadow(0 0 14px var(--star-color)); }
          80% { opacity: 0.8; transform: translate(calc(var(--tw-tx) * 0.85), calc(var(--tw-ty) * 0.85)) scale(0.8); }
          100% { opacity: 0; transform: translate(var(--tw-tx), var(--tw-ty)) scale(0.1) rotate(360deg); }
        }
        .shooting-particle { animation: shootUpwardStar var(--star-duration) cubic-bezier(0.25,1,0.5,1) forwards; animation-delay: var(--star-delay); }

        @keyframes warmGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(217,93,39,0.45), 0 8px 24px rgba(0,0,0,0.18); }
          50% { box-shadow: 0 0 0 10px rgba(217,93,39,0), 0 8px 28px rgba(217,93,39,0.28); }
        }
        .animate-warm-glow { animation: warmGlow 2.6s ease-in-out infinite; }
      `}</style>

      <Header/>

      {/* --- En-tête de section --- */}
      <section className="mx-auto max-w-6xl w-full px-4 pt-10 pb-6 text-center">
        <h1 className="font-display text-3xl font-bold text-black sm:text-4xl">
          Résultats des Compétitions
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-gray-500 leading-relaxed">
          Suivez en direct le classement des groupes et les derniers scores des
          éliminatoires des JOJ Dakar 2026.
        </p>

        <div className="mt-5 flex justify-center">
          <select
            defaultValue="DAKAR_2026"
            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 pr-10 text-sm font-medium text-gray-700 outline-none transition focus:border-[#D95D27]"
            aria-label="Jeux"
          >
            <option value="DAKAR_2026">Jeux: Dakar 2026</option>
          </select>
        </div>

        {/* Filtres sans doublons */}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {categories.map((nom) => (
            <button
              key={nom}
              onClick={() => setFiltre(nom)}
              className={`rounded-full px-4 py-1.5 text-[13px] font-medium border transition ${
                filtre === nom
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-600 border-gray-200 hover:border-[#D95D27] hover:text-[#D95D27]"
              }`}
            >
              {nom}
            </button>
          ))}
        </div>
      </section>

      {/* --- Section principale + Carte de résultats --- */}
      <section className="relative bg-gray-100/80 flex-1">
        <div className="mx-auto max-w-6xl px-4 py-10 space-y-6">
          {chargement && (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 rounded-2xl bg-white shadow-sm animate-pulse" />
              ))}
            </div>
          )}

          {!chargement &&
            disciplinesVisibles.map((discipline) => {
              const rows = resultatsFiltres.filter(
                (r) => (r.evenement?.categorie || "Divers") === discipline
              );
              if (rows.length === 0) return null;

              const matchs = rows.filter((r) => estMatch(r.score) && r.adversaire);
              const courses = rows.filter((r) => !estMatch(r.score) || !r.adversaire);

              return (
                <div key={discipline} className="space-y-4">
                  <h2 className="flex items-center gap-2 font-display text-lg font-bold text-black">
                    <span aria-hidden="true">{ICONE_DISCIPLINE[discipline] || "🏆"}</span>
                    {discipline}
                  </h2>

                  {matchs.map((r) => (
                    <CarteMatch key={r.id} res={r} />
                  ))}
                  {courses.length > 0 && (
                    <CarteCourse titre={courses[0].evenement?.titre} resultats={courses} />
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
      {/* Bouton Chatbot Assistant virtuel (issu de HeroSection) */}
      <ChatbotAssistant />
      <Footer />
    </div>
  );
}