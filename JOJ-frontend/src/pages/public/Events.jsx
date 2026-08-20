import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../components/layout/Header";
import { Footer } from "../../components/layout/Footer";
import ContainerImg from "../../assets/images/Container.jpg";
import api, { getImageUrl } from "../../api/api";
import { Trophy, MapPin, Calendar, Ticket } from "lucide-react";

// ── Sous-composant carte événement ────────────────────────────────────────────
function CarteEvenement({ evenement, onReserver }) {
  const urlImage = getImageUrl(evenement.image);

  return (
    <article className="rounded-2xl bg-white p-6 sm:p-7 lg:p-8
                        shadow-[0_0.4rem_1.5rem_rgba(0,0,0,.08)]
                        transition-transform duration-200 hover:-translate-y-1
                        hover:shadow-[0_1rem_2rem_rgba(0,0,0,.08)] flex flex-col justify-between">
      <div>
        <div className="flex justify-center">
          {urlImage ? (
            <img
              src={urlImage}
              alt={evenement.titre}
              className="h-24 w-24 sm:h-28 sm:w-28 rounded-full object-cover border border-[#eadfd9]"
            />
          ) : (
            <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center text-[#C25B1E]">
              <Trophy size={36} />
            </div>
          )}
        </div>

        <h3 className="mt-6 text-center text-lg sm:text-xl lg:text-2xl font-extrabold text-gray-900">
          {evenement.titre}
        </h3>

        <p className="mt-1 text-center text-sm sm:text-base text-[#d85d16] font-semibold flex items-center justify-center gap-1.5">
          <MapPin size={15} />
          {evenement.site_nom || evenement.site?.nom || "Site Olympique"}
        </p>

        <div className="mt-5 rounded-xl border border-[#f2ddd4] bg-[#fffaf8] py-3 px-4
                        text-center text-sm sm:text-base font-semibold text-gray-800 flex items-center justify-center gap-2">
          <Calendar size={16} className="text-[#d85d16]" />
          {evenement.date || "Date à venir"} {evenement.heure ? `• ${evenement.heure.slice(0, 5)}` : ""}
        </div>
      </div>

      <button
        onClick={() => onReserver(evenement)}
        className="mt-6 w-full rounded-xl bg-black py-3.5
                   text-sm sm:text-base font-bold text-white
                   hover:bg-[#222] transition-colors cursor-pointer flex items-center justify-center gap-2"
      >
        <Ticket size={16} />
        Réserver maintenant
      </button>
    </article>
  );
}

// ── Bouton filtre pill ─────────────────────────────────────────────────────────
function BoutonFiltre({ label, actif, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-xs sm:text-sm transition-colors cursor-pointer ${
        actif
          ? "bg-[#d85d16] font-semibold text-white"
          : "bg-[#fff2ec] text-gray-800 hover:bg-[#ffe5d9]"
      }`}
    >
      {label}
    </button>
  );
}

// ── Composant principal ───────────────────────────────────────────────────────
function Events() {
  const navigate = useNavigate();

  const [evenements, setEvenements] = useState([]);
  const [sitesListe, setSitesListe] = useState([]);
  const [chargement, setChargement] = useState(true);

  const [onglet, setOnglet] = useState("Tous");
  const [recherche, setRecherche] = useState("");
  const [siteChoisi, setSiteChoisi] = useState("Tous les sites");
  const [page, setPage] = useState(1);
  const itemsParPage = 6;

  const chargerEvenements = useCallback(async () => {
    try {
      setChargement(true);
      const [eventsRes, sitesRes] = await Promise.allSettled([
        api.get("/api/events/?page_size=100"),
        api.get("/api/sites/?page_size=100"),
      ]);

      const eventsData = eventsRes.status === "fulfilled" ? eventsRes.value.data : [];
      const sitesData = sitesRes.status === "fulfilled" ? sitesRes.value.data : [];

      setEvenements(Array.isArray(eventsData) ? eventsData : eventsData.results ?? []);
      setSitesListe(Array.isArray(sitesData) ? sitesData : sitesData.results ?? []);
    } catch (err) {
      console.error("Erreur lors du chargement des événements:", err);
    } finally {
      setChargement(false);
    }
  }, []);

  useEffect(() => {
    chargerEvenements();
  }, [chargerEvenements]);

  const listeNomsSites = useMemo(() => {
    return ["Tous les sites", ...sitesListe.map((s) => s.nom).filter(Boolean)];
  }, [sitesListe]);

  const evenementsFiltres = useMemo(() => {
    return evenements.filter((ev) => {
      if (recherche.trim()) {
        const q = recherche.toLowerCase().trim();
        const t = (ev.titre || "").toLowerCase();
        const d = (ev.description || "").toLowerCase();
        if (!t.includes(q) && !d.includes(q)) return false;
      }

      if (siteChoisi !== "Tous les sites") {
        const nomSite = ev.site_nom || ev.site?.nom || "";
        if (nomSite !== siteChoisi) return false;
      }

      return true;
    });
  }, [evenements, recherche, siteChoisi]);

  const nbPages = Math.max(1, Math.ceil(evenementsFiltres.length / itemsParPage));
  const pageCourante = Math.min(page, nbPages);
  const debut = (pageCourante - 1) * itemsParPage;
  const evenementsAffiches = evenementsFiltres.slice(debut, debut + itemsParPage);

  const reinitialiser = () => {
    setRecherche("");
    setSiteChoisi("Tous les sites");
    setOnglet("Tous");
    setPage(1);
  };

  const handleReserver = (ev) => {
    navigate(`/events/${ev.id}`);
  };

  return (
    <>
      <Header />

      <div className="bg-white text-black">
        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section
          className="w-full min-h-[24rem] sm:min-h-[27rem] lg:min-h-[30rem]
                     flex items-center justify-center text-white"
          style={{
            backgroundImage:
              `linear-gradient(rgba(0,0,0,.60),rgba(0,0,0,.60)), url(${ContainerImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="w-full max-w-6xl mx-auto px-5 sm:px-8 lg:px-12 text-center">
            <h1 className="font-extrabold leading-none tracking-tight
                           text-4xl sm:text-5xl lg:text-6xl xl:text-7xl">
              Choisissez votre
              <span className="block text-[#ff6500]">événement</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg lg:text-xl
                          leading-relaxed text-white/90">
              Accédez aux épreuves en cours et à venir ({evenements.length} compétition{evenements.length > 1 ? "s" : ""}). Sélectionnez votre billet
              et vivez l'émotion du sport en direct sur les sites olympiques.
            </p>
          </div>
        </section>

        {/* ── CONTENU PRINCIPAL ─────────────────────────────────────────────── */}
        <main className="w-full">
          {/* FILTRES */}
          <section className="w-full px-5 py-16 sm:px-8 lg:px-12 xl:px-16 sm:py-20 lg:py-24">
            <div className="mx-auto w-full max-w-7xl">
              <div className="text-center">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
                  Filtrer &amp; sélectionner
                </h2>
                <p className="mt-4 text-sm sm:text-base lg:text-lg text-gray-500">
                  Trouvez rapidement votre épreuve sur Dakar, Mbour (Saly) ou Diamniadio.
                </p>
              </div>

              <div className="mt-12 border-t border-[#eadfd9] pt-8">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-x-16">
                  {/* Recherche */}
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold">Rechercher</h3>
                    <input
                      type="text"
                      value={recherche}
                      onChange={(e) => {
                        setRecherche(e.target.value);
                        setPage(1);
                      }}
                      placeholder="Ex: Football, Athlétisme, Basketball..."
                      className="mt-3 w-full rounded-lg border border-[#f0d8cd] bg-white
                                 px-4 py-3 text-sm sm:text-base outline-none
                                 placeholder:text-gray-400 focus:border-[#d85d16] transition-colors"
                    />
                  </div>

                  {/* Site */}
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold">Site d'épreuve</h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {listeNomsSites.map((s) => (
                        <BoutonFiltre
                          key={s}
                          label={s}
                          actif={siteChoisi === s}
                          onClick={() => {
                            setSiteChoisi(s);
                            setPage(1);
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Réinitialiser */}
                <div className="mt-10 flex justify-center">
                  <button
                    type="button"
                    onClick={reinitialiser}
                    className="rounded-lg border-2 border-black bg-white px-8 py-3
                               text-sm sm:text-base font-bold
                               hover:bg-black hover:text-white transition-colors cursor-pointer"
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* ÉVÉNEMENTS */}
          <section className="w-full px-5 pb-16 sm:px-8 lg:px-12 xl:px-16 sm:pb-20 lg:pb-24">
            <div className="mx-auto w-full max-w-7xl">
              <div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
                  Événements ({evenementsFiltres.length})
                </h2>
                <p className="mt-3 text-sm sm:text-base lg:text-lg text-gray-500">
                  Cliquez sur un événement pour afficher les billets et les zones d'accès disponibles.
                </p>
              </div>

              {/* Grille */}
              {chargement ? (
                <div className="py-20 text-center text-gray-400">
                  <div className="w-8 h-8 border-3 border-[#d85d16] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  Chargement des événements...
                </div>
              ) : evenementsAffiches.length === 0 ? (
                <div className="py-16 text-center text-gray-400 border border-dashed border-gray-200 rounded-3xl mt-8">
                  <Trophy size={36} className="text-gray-300 mx-auto mb-2" />
                  <p className="text-base font-bold text-gray-600">Aucun événement ne correspond à vos critères</p>
                  <p className="text-xs text-gray-400 mt-1">Essayez de modifier votre recherche ou vos filtres.</p>
                </div>
              ) : (
                <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {evenementsAffiches.map((evt) => (
                    <CarteEvenement key={evt.id} evenement={evt} onReserver={handleReserver} />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {nbPages > 1 && (
                <div className="mt-16 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={pageCourante <= 1}
                    className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#d85d16] hover:text-[#d85d16] disabled:opacity-30 cursor-pointer"
                  >
                    ‹
                  </button>

                  {Array.from({ length: nbPages }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setPage(i + 1)}
                      className={`w-9 h-9 rounded-full text-sm font-bold transition-colors cursor-pointer ${
                        pageCourante === i + 1
                          ? "bg-[#d85d16] text-white"
                          : "text-gray-500 hover:text-[#d85d16]"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(nbPages, p + 1))}
                    disabled={pageCourante >= nbPages}
                    className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[#d85d16] hover:text-[#d85d16] disabled:opacity-30 cursor-pointer"
                  >
                    ›
                  </button>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>

      <Footer />
    </>
  );
}

export default Events;
