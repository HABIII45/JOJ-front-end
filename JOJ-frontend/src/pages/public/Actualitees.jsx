import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Newspaper, Search, ArrowRight } from "lucide-react";
import { getActualites } from "../../api/Eventapi";
import api, { getImageUrl } from "../../api/api";
import { Header } from "../../components/layout/Header";
import { Footer } from "../../components/layout/Footer";
import ContainerImg from "../../assets/images/Container.jpg";
import "./Actualitees.css";

function extraireTexte(html, max = 160) {
  const texte = String(html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!texte) return "Découvrez les dernières informations officielles des JOJ Dakar 2026.";
  return texte.length > max ? `${texte.slice(0, max).trim()}…` : texte;
}

function formaterDate(valeur) {
  if (!valeur) return null;
  const date = new Date(valeur);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function idEvenement(evenementLie) {
  if (evenementLie == null) return null;
  if (typeof evenementLie === "object") return evenementLie.id ?? null;
  return evenementLie;
}

function CarteActualite({ actualite, nomEvenement }) {
  const image = getImageUrl(actualite.image);
  const date = formaterDate(actualite.date_publication);
  const extrait = extraireTexte(actualite.description);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-[#eadfd9] bg-white shadow-[0_0.4rem_1.5rem_rgba(0,0,0,.06)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_1.2rem_2.4rem_rgba(201,91,30,.14)]">
      <Link to={`/actualites/${actualite.id}`} className="block overflow-hidden">
        <div className="relative h-52 w-full bg-[#fff2ec]">
          {image ? (
            <img
              src={image}
              alt={actualite.titre}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#C25B1E] to-[#7a3410] text-white">
              <Newspaper size={42} />
            </div>
          )}
          {nomEvenement && (
            <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold text-[#C25B1E] shadow-sm">
              {nomEvenement}
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#d85d16]">
          <Calendar size={14} />
          {date || "Publication officielle"}
        </span>

        <h2 className="mt-3 line-clamp-2 text-lg font-extrabold leading-snug text-gray-900">
          {actualite.titre}
        </h2>

        <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-gray-500">
          {extrait}
        </p>

        <Link
          to={`/actualites/${actualite.id}`}
          className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#C25B1E] transition-all hover:gap-3"
        >
          Lire l'article
          <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  );
}

export default function Actualitees() {
  const [actualites, setActualites] = useState([]);
  const [evenementsParId, setEvenementsParId] = useState({});
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState("");
  const [recherche, setRecherche] = useState("");

  useEffect(() => {
    const charger = async () => {
      try {
        setLoading(true);
        setErreur("");

        const [data, eventsRes] = await Promise.all([
          getActualites(),
          api.get("/api/events/?page_size=100").catch(() => ({ data: [] })),
        ]);

        const listeBrute = Array.isArray(data) ? data : data?.results || [];
        const publiees = listeBrute.filter((item) => item && item.brouillon !== true);

        publiees.sort((a, b) => {
          const da = new Date(a.date_publication || 0).getTime();
          const db = new Date(b.date_publication || 0).getTime();
          return db - da;
        });

        setActualites(publiees);

        const eventsData = eventsRes.data;
        const eventsListe = Array.isArray(eventsData)
          ? eventsData
          : eventsData?.results || [];
        const map = {};
        eventsListe.forEach((ev) => {
          if (ev?.id) map[ev.id] = ev.titre || ev.nom;
        });
        setEvenementsParId(map);
      } catch (error) {
        console.error("Erreur lors du chargement des actualités :", error);
        setErreur("Impossible de charger les actualités.");
      } finally {
        setLoading(false);
      }
    };

    charger();
  }, []);

  const actualitesFiltrees = useMemo(() => {
    const q = recherche.trim().toLowerCase();
    if (!q) return actualites;
    return actualites.filter((a) => {
      const titre = (a.titre || "").toLowerCase();
      const texte = extraireTexte(a.description, 400).toLowerCase();
      const ev = evenementsParId[idEvenement(a.evenement_lie)] || "";
      return titre.includes(q) || texte.includes(q) || ev.toLowerCase().includes(q);
    });
  }, [actualites, recherche, evenementsParId]);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />

      <section
        className="flex min-h-[24rem] w-full items-center justify-center text-white sm:min-h-[27rem]"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,.58), rgba(0,0,0,.58)), url(${ContainerImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="mx-auto w-full max-w-6xl px-5 text-center sm:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#ffb07a]">
            JOJ Dakar 2026
          </p>
          <h1 className="mt-3 font-extrabold leading-none tracking-tight text-4xl sm:text-5xl lg:text-6xl">
            Actualités
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg">
            Les dernières informations officielles, coulisses et temps forts
            des Jeux Olympiques de la Jeunesse.
          </p>
        </div>
      </section>

      <main className="flex-1 w-full px-5 py-14 sm:px-8 lg:px-12 xl:px-16">
        <div className="mx-auto w-full max-w-7xl">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Derniers articles
                <span className="ml-2 text-[#d85d16]">({actualitesFiltrees.length})</span>
              </h2>
              <p className="mt-2 text-sm text-gray-500 sm:text-base">
                Parcourez les publications du comité d'organisation.
              </p>
            </div>

            <div className="relative w-full sm:max-w-sm">
              <Search
                size={16}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="search"
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                placeholder="Rechercher un article…"
                className="w-full rounded-xl border border-[#f0d8cd] bg-white py-3 pl-11 pr-4 text-sm outline-none placeholder:text-gray-400 focus:border-[#d85d16]"
              />
            </div>
          </div>

          {loading && (
            <div className="py-24 text-center text-gray-400">
              <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-3 border-[#d85d16] border-t-transparent" />
              Chargement des actualités...
            </div>
          )}

          {!loading && erreur && (
            <div className="mt-10 rounded-3xl border border-red-100 bg-red-50 px-6 py-12 text-center text-sm font-medium text-red-600">
              {erreur}
            </div>
          )}

          {!loading && !erreur && actualitesFiltrees.length === 0 && (
            <div className="mt-10 rounded-3xl border border-dashed border-gray-200 py-16 text-center text-gray-400">
              <Newspaper size={36} className="mx-auto mb-2 text-gray-300" />
              <p className="text-base font-bold text-gray-600">
                Aucune actualité disponible pour le moment.
              </p>
            </div>
          )}

          {!loading && !erreur && actualitesFiltrees.length > 0 && (
            <section className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {actualitesFiltrees.map((actualite, index) => (
                <CarteActualite
                  key={actualite.id || `actu-${index}`}
                  actualite={actualite}
                  nomEvenement={
                    (typeof actualite.evenement_lie === "object" &&
                      (actualite.evenement_lie?.titre || actualite.evenement_lie?.nom)) ||
                    evenementsParId[idEvenement(actualite.evenement_lie)] ||
                    null
                  }
                />
              ))}
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
