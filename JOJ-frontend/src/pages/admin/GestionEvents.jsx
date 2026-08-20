import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { Search, Filter, Plus, Calendar, MapPin, Eye, Pencil, Trash2, ChevronLeft, ChevronRight, Trophy } from "lucide-react";
import AdminLayout from "../../components/layouts/AdminLayout";
import api, { getImageUrl } from "../../api/api";

export function GestionEvents() {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [sites, setSites] = useState([]);

  const [recherche, setRecherche] = useState("");
  const [siteFiltre, setSiteFiltre] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Récupération des sites pour le filtre
  useEffect(() => {
    const fetchSites = async () => {
      try {
        const res = await api.get("/api/sites/?page_size=100");
        const data = res.data;
        setSites(Array.isArray(data) ? data : data.results ?? []);
      } catch (err) {
        console.error("Erreur chargement des sites :", err);
      }
    };
    fetchSites();
  }, []);

  // 2. Récupération paginée des événements
  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: currentPage,
      };
      if (recherche.trim()) params.recherche = recherche.trim();
      if (siteFiltre) params.site = siteFiltre;

      const res = await api.get("/api/events/", { params });
      const data = res.data;

      if (Array.isArray(data)) {
        setEvents(data);
        setTotalCount(data.length);
        setTotalPages(1);
      } else {
        setEvents(data.results ?? []);
        const count = typeof data.count === "number" ? data.count : (data.results?.length ?? 0);
        setTotalCount(count);
        setTotalPages(Math.max(1, Math.ceil(count / 10)));
      }
    } catch (err) {
      console.error("Erreur chargement des événements :", err);
      setError("Impossible de charger les événements.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, recherche, siteFiltre]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const supprimerEvenement = async (event) => {
    if (!window.confirm(`Supprimer l'événement « ${event.titre} » ? Cette action est irréversible.`)) {
      return;
    }
    try {
      await api.delete(`/api/events/${event.id}/`);
      setEvents((prev) => prev.filter((e) => e.id !== event.id));
      setTotalCount((c) => Math.max(0, c - 1));
    } catch (err) {
      console.error("Erreur suppression événement:", err);
      alert("Erreur lors de la suppression de l'événement.");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              Gestion des Événements
            </h1>
            <p className="text-gray-400 text-xs md:text-sm font-medium mt-1">
              Gérez le calendrier, les épreuves et les détails des compétitions en temps réel.
            </p>
          </div>
          <button
            onClick={() => navigate("/admin/evenements/ajout")}
            className="inline-flex items-center justify-center gap-2 bg-[#C25B1E] hover:bg-[#A04816] text-white rounded-2xl px-6 py-3.5 text-xs font-bold transition-colors shadow-sm shrink-0 self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            Ajouter un événement
          </button>
        </div>

        {/* Barre de Recherche et Filtres */}
        <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-gray-100/50">
          <div className="grid gap-4 md:grid-cols-3 items-end">
            <div>
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                RECHERCHE ÉVÉNEMENT
              </label>
              <div className="relative">
                <Search size={14} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={recherche}
                  onChange={(e) => {
                    setRecherche(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Nom de l'événement..."
                  className="w-full rounded-2xl bg-[#F8FAFC] py-3 pl-10 pr-4 text-xs font-medium text-gray-700 outline-none placeholder:text-gray-400 border border-transparent focus:border-gray-200"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                FILTRER PAR SITE
              </label>
              <select
                value={siteFiltre}
                onChange={(e) => {
                  setSiteFiltre(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-2xl bg-[#F8FAFC] py-3 px-4 text-xs font-medium text-gray-700 outline-none border border-transparent focus:border-gray-200 cursor-pointer"
              >
                <option value="">Tous les sites</option>
                {sites.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nom} ({s.ville || s.region || "Sénégal"})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <button
                type="button"
                onClick={() => fetchEvents()}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-black py-3 px-4 text-xs font-bold text-white transition hover:bg-gray-800 cursor-pointer"
              >
                <Filter size={14} />
                Actualiser la liste
              </button>
            </div>
          </div>
        </div>

        {/* Tableau des Événements */}
        <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-gray-100 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  <th className="pb-4 pt-2 px-4">ÉVÉNEMENT</th>
                  <th className="pb-4 pt-2 px-4">DISCIPLINE / CATÉGORIE</th>
                  <th className="pb-4 pt-2 px-4">SITE</th>
                  <th className="pb-4 pt-2 px-4">DATE & HEURE</th>
                  <th className="pb-4 pt-2 px-4">PRIX</th>
                  <th className="pb-4 pt-2 px-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-400">
                      <div className="w-6 h-6 border-2 border-[#C25B1E] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      Chargement des événements...
                    </td>
                  </tr>
                )}

                {error && !loading && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-red-500 font-semibold">
                      {error}
                    </td>
                  </tr>
                )}

                {!loading && !error && events.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-400">
                      Aucun événement trouvé dans la base de données.
                    </td>
                  </tr>
                )}

                {!loading &&
                  !error &&
                  events.map((event) => {
                    const urlImage = getImageUrl(event.image);
                    return (
                    <tr key={event.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          {urlImage ? (
                            <img
                              src={urlImage}
                              alt={event.titre}
                              className="h-10 w-14 rounded-lg object-cover shrink-0 border border-gray-200"
                            />
                          ) : (
                            <div className="h-10 w-14 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 font-bold text-xs shrink-0">
                              <Trophy size={16} />
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-gray-900 leading-tight">
                              {event.titre}
                            </p>
                            <p className="text-[10px] text-gray-400 mt-0.5">
                              {event.description?.slice(0, 45) || "Épreuve sportive"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 font-semibold text-gray-700">
                        {event.categorie_nom || event.categorie?.nom || "Standard"}
                      </td>

                      <td className="py-4 px-4 text-gray-600">
                        <span className="inline-flex items-center gap-1.5 font-medium">
                          <MapPin size={13} className="text-gray-400" />
                          {event.site_nom || event.site?.nom || "Site principal"}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-gray-600">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar size={13} className="text-gray-400" />
                          {event.date || "—"} {event.heure ? `à ${event.heure.slice(0, 5)}` : ""}
                        </span>
                      </td>

                      <td className="py-4 px-4 font-bold text-gray-900">
                        {event.prix ? `${Number(event.prix).toLocaleString("fr-FR")} FCFA` : "Gratuit"}
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end gap-1.5 text-gray-400">
                          <button
                            onClick={() => navigate(`/events/${event.id}`)}
                            className="p-1.5 hover:text-gray-700 transition-colors cursor-pointer"
                            title="Voir"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => navigate(`/admin/evenements/ajout`)}
                            className="p-1.5 hover:text-gray-700 transition-colors cursor-pointer"
                            title="Modifier"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => supprimerEvenement(event)}
                            className="p-1.5 hover:text-red-500 transition-colors cursor-pointer"
                            title="Supprimer"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && !error && totalCount > 0 && (
            <div className="flex items-center justify-between pt-6 border-t border-gray-100/60 mt-2">
              <p className="text-xs text-gray-400 font-medium">
                Affichage de <span className="font-bold text-gray-700">{events.length}</span> sur <span className="font-bold text-gray-700">{totalCount}</span> événements
              </p>

              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage <= 1}
                    className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-50 disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  <span className="text-xs font-semibold text-gray-700 px-2">
                    Page {currentPage} / {totalPages}
                  </span>

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage >= totalPages}
                    className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-50 disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default GestionEvents;