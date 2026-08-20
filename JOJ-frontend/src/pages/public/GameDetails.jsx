import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import mapImage  from "../../assets/images/map.png";
import { Header } from "../../components/layout/Header";
import { Footer } from "../../components/layout/Footer";

import {
  getDisciplineDetails,
  getEvenements,
} from "../../services/listeDisciplines";

import {
  FiMapPin,
  FiClock,
  FiBookOpen,
  FiUserCheck,
  FiExternalLink,
  FiLoader,
  FiAlertCircle,
} from "react-icons/fi";

const DEFAULT_HERO_IMAGE =
  "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1200&q=80";

export function DetailsGame() {
  const { id } = useParams();

  // ==========================================
  // ÉTATS
  // ==========================================
  const [discipline, setDiscipline] = useState(null);
  const [evenements, setEvenements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDateFilter, setSelectedDateFilter] = useState("Tout");

  // ==========================================
  // CHARGEMENT DES DONNÉES
  // ==========================================
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [disciplineData, eventsData] = await Promise.all([
          getDisciplineDetails(id),
          getEvenements(id),
        ]);

        if (isMounted) {
          setDiscipline(disciplineData);
          setEvenements(eventsData || []);
        }
      } catch (err) {
        console.error("Erreur lors du chargement des données :", err);
        if (isMounted) {
          setError("Impossible de charger les détails de cette discipline.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (id) {
      fetchData();
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  // ==========================================
  // SITE PRINCIPAL ET LIEN GOOGLE MAPS DYNAMIQUE
  // ==========================================
  const sitePrincipal = useMemo(() => {
    if (discipline?.site) return discipline.site;
    if (evenements.length > 0 && evenements[0].site_nom) {
      return evenements[0].site_nom;
    }
    return "Arena Dakar";
  }, [discipline, evenements]);

  // Génération dynamique de l'URL Google Maps
  const googleMapsUrl = useMemo(() => {
    const query = sitePrincipal
      ? `${sitePrincipal}, Dakar, Senegal`
      : "JOJ Dakar 2026 Senegal";
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      query
    )}`;
  }, [sitePrincipal]);

  // ==========================================
  // DATES DISPONIBLES
  // ==========================================
  const availableDates = useMemo(() => {
    if (!evenements || evenements.length === 0) return [];

    const datesSet = new Set(
      evenements.map((evt) => {
        const date = new Date(evt.date);
        return date.toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "short",
        });
      })
    );

    return Array.from(datesSet);
  }, [evenements]);

  // ==========================================
  // FILTRAGE PAR DATE
  // ==========================================
  const filteredEvenements = useMemo(() => {
    if (selectedDateFilter === "Tout") return evenements;

    return evenements.filter((evt) => {
      const formattedDate = new Date(evt.date).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
      });

      return (
        formattedDate.toLowerCase() === selectedDateFilter.toLowerCase()
      );
    });
  }, [evenements, selectedDateFilter]);

  // ==========================================
  // PLAGE DES DATES
  // ==========================================
  const plageDates = useMemo(() => {
    if (evenements.length === 0) return "Non disponible";

    const timestamps = evenements
      .map((event) => new Date(event.date).getTime())
      .filter((time) => !isNaN(time))
      .sort((a, b) => a - b);

    if (timestamps.length === 0) return "Non disponible";

    const startDate = new Date(timestamps[0]);
    const endDate = new Date(timestamps[timestamps.length - 1]);

    const startDay = startDate.getDate();
    const endDay = endDate.getDate();
    const month = startDate.toLocaleDateString("fr-FR", { month: "short" });

    if (startDay === endDay) {
      return `${startDay} ${month}`;
    }

    return `${startDay}–${endDay} ${month}`;
  }, [evenements]);

  // ==========================================
  // CHARGEMENT ET ERREURS
  // ==========================================
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white gap-4">
        <FiLoader className="animate-spin text-[#D9531E]" size={40} />
        <p className="text-sm font-medium">Chargement de la discipline...</p>
      </div>
    );
  }

  if (error || !discipline) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <FiAlertCircle size={48} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Une erreur est survenue
        </h2>
        <p className="text-slate-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-800 flex flex-col">
      <Header />

      {/* HERO */}
      <section className="relative bg-slate-950 text-white overflow-hidden min-h-[380px] lg:min-h-[420px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src={discipline.image || DEFAULT_HERO_IMAGE}
            alt={discipline.nom}
            className="w-full h-full object-cover object-center opacity-40 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
          <span className="inline-block px-3.5 py-1 bg-[#D9531E] text-white text-[11px] font-bold uppercase tracking-wider rounded-full mb-4">
            DISCIPLINE
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4">
            {discipline.nom}
          </h1>

          <div className="flex items-center gap-2 text-slate-300 text-sm font-medium">
            <FiMapPin className="text-[#D9531E]" size={18} />
            <span>{sitePrincipal} — Sénégal</span>
          </div>
        </div>
      </section>

      {/* STATISTIQUES */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-12 relative z-20 w-full">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 grid grid-cols-3 divide-x divide-slate-100 text-center">
          <div className="px-2">
            <span className="text-xs font-bold text-slate-400 uppercase block mb-1">
              ÉVÉNEMENTS
            </span>
            <span className="text-2xl sm:text-4xl font-extrabold text-[#D9531E]">
              {evenements.length}
            </span>
          </div>

          <div className="px-2">
            <span className="text-xs font-bold text-slate-400 uppercase block mb-1">
              SITE
            </span>
            <span className="text-base sm:text-xl font-bold text-slate-800">
              {sitePrincipal}
            </span>
          </div>

          <div className="px-2">
            <span className="text-xs font-bold text-slate-400 uppercase block mb-1">
              DATES
            </span>
            <span className="text-base sm:text-xl font-bold text-slate-800">
              {plageDates}
            </span>
          </div>
        </div>
      </div>

      {/* CONTENU PRINCIPAL */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* PROGRAMME */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Programme Officiel
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Retrouvez toutes les épreuves de cette discipline.
                </p>
              </div>

              {/* FILTRES */}
              <div className="flex items-center gap-2 overflow-x-auto">
                <button
                  onClick={() => setSelectedDateFilter("Tout")}
                  className={`px-4 py-2 text-xs font-bold rounded-full ${
                    selectedDateFilter === "Tout"
                      ? "bg-[#D9531E] text-white"
                      : "bg-white text-slate-600 border"
                  }`}
                >
                  Tout
                </button>

                {availableDates.map((dateStr) => (
                  <button
                    key={dateStr}
                    onClick={() => setSelectedDateFilter(dateStr)}
                    className={`px-4 py-2 text-xs font-bold rounded-full whitespace-nowrap ${
                      selectedDateFilter === dateStr
                        ? "bg-[#D9531E] text-white"
                        : "bg-white text-slate-600 border"
                    }`}
                  >
                    {dateStr}
                  </button>
                ))}
              </div>
            </div>

            {/* LISTE DES ÉVÉNEMENTS */}
            <div className="space-y-4">
              {filteredEvenements.length > 0 ? (
                filteredEvenements.map((evt) => {
                  const dateObj = new Date(evt.date);
                  const monthName = dateObj
                    .toLocaleDateString("fr-FR", { month: "short" })
                    .replace(".", "")
                    .toUpperCase();
                  const dayNumber = dateObj.getDate();

                  return (
                    <div
                      key={evt.id}
                      className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        {/* DATE */}
                        <div className="w-14 h-14 bg-orange-50 rounded-2xl border border-orange-100 flex flex-col items-center justify-center">
                          <span className="text-[10px] font-black text-[#D9531E] uppercase">
                            {monthName}
                          </span>
                          <span className="text-xl font-black text-[#D9531E]">
                            {dayNumber}
                          </span>
                        </div>

                        {/* INFORMATIONS */}
                        <div>
                          <h3 className="text-base font-bold text-slate-900">
                            {evt.titre}
                          </h3>

                          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 flex-wrap">
                            <span className="flex items-center gap-1">
                              <FiClock size={13} />
                              {evt.heure
                                ? evt.heure.substring(0, 5)
                                : "Heure non disponible"}
                            </span>
                            <span>—</span>
                            <span>{sitePrincipal}</span>
                            {evt.categorie_nom && (
                              <>
                                <span>•</span>
                                <span>{evt.categorie_nom}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <button className="px-5 py-2 border-2 border-[#D9531E] text-[#D9531E] hover:bg-[#D9531E] hover:text-white font-bold text-xs rounded-xl transition-all">
                        Billets
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                  <p className="text-slate-500">
                    Aucune épreuve disponible pour cette discipline.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* INFOS PRATIQUES */}
          <aside className="lg:col-span-4">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-slate-900">
                Infos Pratiques
              </h2>

              {/* RÈGLE */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#D9531E] font-bold text-sm">
                  <FiBookOpen size={18} />
                  <h3>Règle</h3>
                </div>
                <p className="text-sm text-slate-600">
                  {discipline.regle || "Informations non disponibles."}
                </p>
              </div>

              {/* ACCESSIBILITÉ */}
              <div className="space-y-2 pt-4 border-t">
                <div className="flex items-center gap-2 text-[#D9531E] font-bold text-sm">
                  <FiUserCheck size={18} />
                  <h3>Accessibilité</h3>
                </div>
                <p className="text-sm text-slate-600">
                  {discipline.accessibilite || "Informations non disponibles."}
                </p>
              </div>

              {/* LOCALISATION AVEC LIEN GOOGLE MAPS DYNAMIQUE */}
              <div className="space-y-3 pt-4 border-t">
                <h3 className="text-sm font-bold">Localisation</h3>
                <img src={mapImage} alt="" />
                 

                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#D9531E] hover:underline transition-all"
                >
                  Ouvrir dans Google Maps
                  <FiExternalLink size={14} />
                </a>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}