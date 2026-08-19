import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Users, User, Trash2, Pencil, Shield, Flag } from "lucide-react";
import AdminLayout from "../../components/layouts/AdminLayout";
import api from "../../api/api";

export default function GamesList() {
  const navigate = useNavigate();

  const [competiteurs, setCompetiteurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all"); 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const chargerCompetiteurs = useCallback(async () => {
    try {
      setLoading(true);

      const [equipesRes, joueursRes] = await Promise.allSettled([
        api.get("/api/equipes/?page_size=100"),
        api.get("/api/joueurs/?page_size=100"),
      ]);

      const equipesData = equipesRes.status === "fulfilled" ? equipesRes.value.data : [];
      const joueursData = joueursRes.status === "fulfilled" ? joueursRes.value.data : [];

      const listeEquipes = (Array.isArray(equipesData) ? equipesData : equipesData.results ?? []).map((e) => ({
        ...e,
        type: "team",
        nom: e.nom || e.name || "Équipe",
        pays: e.pays || e.country || "Sénégal",
        categorie: e.categorie_nom || e.categorie?.nom || "Collectif",
      }));

      const listeJoueurs = (Array.isArray(joueursData) ? joueursData : joueursData.results ?? []).map((j) => ({
        ...j,
        type: "player",
        nom: `${j.prenom ?? ""} ${j.nom ?? ""}`.trim() || j.name || "Athlète",
        pays: j.nationalite || j.pays || "Sénégal",
        categorie: j.categorie_nom || j.categorie?.nom || "Individuel",
      }));

      setCompetiteurs([...listeEquipes, ...listeJoueurs]);
    } catch (error) {
      console.error("Erreur lors de la récupération des compétiteurs:", error);
      setCompetiteurs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    chargerCompetiteurs();
  }, [chargerCompetiteurs]);

  // Filtres
  const filtered = useMemo(() => {
    return competiteurs.filter((c) => {
      const matchSearch =
        (c.nom || "").toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        (c.pays || "").toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        (c.categorie || "").toLowerCase().includes(searchTerm.toLowerCase().trim());
      
      const matchType =
        filterType === "all" ||
        (filterType === "teams" && c.type === "team") ||
        (filterType === "players" && c.type === "player");

      return matchSearch && matchType;
    });
  }, [competiteurs, searchTerm, filterType]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const supprimerCompetiteur = async (c) => {
    if (!window.confirm(`Supprimer « ${c.nom} » ? Cette action est irréversible.`)) return;

    try {
      const endpoint = c.type === "team" ? `/api/equipes/${c.id}/` : `/api/joueurs/${c.id}/`;
      await api.delete(endpoint);
      setCompetiteurs((prev) => prev.filter((item) => !(item.id === c.id && item.type === c.type)));
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
      alert("Erreur lors de la suppression.");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              Gestion des Équipes & Joueurs
            </h1>
            <p className="text-gray-400 text-xs md:text-sm font-medium mt-1">
              Consultez et administrez les participants, délégations et athlètes des JOJ 2026.
            </p>
          </div>
          <button
            onClick={() => navigate("/admin/equipes/ajout")}
            className="inline-flex items-center justify-center gap-2 bg-[#C25B1E] hover:bg-[#A04816] text-white rounded-2xl px-6 py-3.5 text-xs font-bold transition-colors shadow-sm shrink-0 self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            Ajouter un participant
          </button>
        </div>

        {/* Filtres et Recherche */}
        <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-gray-100/50 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search size={14} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom, pays ou catégorie..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-2xl bg-[#F8FAFC] py-3 pl-10 pr-4 text-xs font-medium text-gray-700 outline-none placeholder:text-gray-400 border border-transparent focus:border-gray-200"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
            <button
              onClick={() => { setFilterType("all"); setCurrentPage(1); }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                filterType === "all" ? "bg-gray-900 text-white" : "bg-[#F8FAFC] text-gray-600 hover:bg-gray-100"
              }`}
            >
              Tous ({competiteurs.length})
            </button>
            <button
              onClick={() => { setFilterType("teams"); setCurrentPage(1); }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                filterType === "teams" ? "bg-[#C25B1E] text-white" : "bg-[#F8FAFC] text-gray-600 hover:bg-gray-100"
              }`}
            >
              Équipes ({competiteurs.filter((c) => c.type === "team").length})
            </button>
            <button
              onClick={() => { setFilterType("players"); setCurrentPage(1); }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                filterType === "players" ? "bg-[#3B6FE0] text-white" : "bg-[#F8FAFC] text-gray-600 hover:bg-gray-100"
              }`}
            >
              Joueurs ({competiteurs.filter((c) => c.type === "player").length})
            </button>
          </div>
        </div>

        {/* Tableau des participants */}
        <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-gray-100 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  <th className="pb-4 pt-2 px-4">PARTICIPANT</th>
                  <th className="pb-4 pt-2 px-4">TYPE</th>
                  <th className="pb-4 pt-2 px-4">PAYS / DÉLÉGATION</th>
                  <th className="pb-4 pt-2 px-4">CATÉGORIE</th>
                  <th className="pb-4 pt-2 px-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading && (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-400">
                      <div className="w-6 h-6 border-2 border-[#C25B1E] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      Chargement des participants...
                    </td>
                  </tr>
                )}

                {!loading && paginated.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-400">
                      Aucun participant trouvé dans la base de données.
                    </td>
                  </tr>
                )}

                {!loading &&
                  paginated.map((c) => (
                    <tr key={`${c.type}-${c.id}`} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            c.type === "team" ? "bg-orange-50 text-[#C25B1E]" : "bg-blue-50 text-blue-600"
                          }`}>
                            {c.type === "team" ? <Users size={16} /> : <User size={16} />}
                          </span>
                          <div>
                            <p className="font-bold text-gray-900 leading-tight">
                              {c.nom}
                            </p>
                            <p className="text-[10px] text-gray-400 mt-0.5">
                              ID #{c.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          c.type === "team" ? "bg-orange-100/60 text-[#C25B1E]" : "bg-blue-100/60 text-blue-600"
                        }`}>
                          {c.type === "team" ? "Équipe" : "Joueur individuel"}
                        </span>
                      </td>

                      <td className="py-4 px-4 font-semibold text-gray-700">
                        <span className="inline-flex items-center gap-1.5">
                          <Flag size={13} className="text-gray-400" />
                          {c.pays}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-gray-600 font-medium">
                        {c.categorie}
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end gap-1.5 text-gray-400">
                          <button
                            onClick={() => supprimerCompetiteur(c)}
                            className="p-1.5 hover:text-red-500 transition-colors cursor-pointer"
                            title="Supprimer"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && filtered.length > itemsPerPage && (
            <div className="flex items-center justify-between pt-6 border-t border-gray-100/60 mt-2">
              <p className="text-xs text-gray-400 font-medium">
                Affichage de <span className="font-bold text-gray-700">{paginated.length}</span> sur <span className="font-bold text-gray-700">{filtered.length}</span> participants
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-50 disabled:opacity-30 cursor-pointer"
                >
                  &lt;
                </button>

                <span className="text-xs font-semibold text-gray-700 px-2">
                  Page {currentPage} / {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-50 disabled:opacity-30 cursor-pointer"
                >
                  &gt;
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}