import { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Tags,
  Trophy,
  Filter,
} from "lucide-react";
import AdminLayout from "../../components/layouts/AdminLayout";
import api from "../../api/api";

const PAR_PAGE = 8;

export default function AdminCategorie() {
  const navigate = useNavigate();
  const [chargement, setChargement] = useState(true);
  const [categories, setCategories] = useState([]);
  const [disciplines, setDisciplines] = useState([]);
  const [recherche, setRecherche] = useState("");
  const [disciplineFiltre, setDisciplineFiltre] = useState("Toutes");
  const [page, setPage] = useState(1);
  const [erreur, setErreur] = useState(null);

  // Chargement réel des données depuis l'API Django
  const chargerDonnees = useCallback(async () => {
    try {
      setChargement(true);
      setErreur(null);

      const [resCats, resDiscs] = await Promise.allSettled([
        api.get("/api/categories/?page_size=100"),
        api.get("/api/disciplines/?page_size=100"),
      ]);

      const dataCats = resCats.status === "fulfilled" ? resCats.value.data : [];
      const dataDiscs = resDiscs.status === "fulfilled" ? resDiscs.value.data : [];

      const listeCats = Array.isArray(dataCats) ? dataCats : dataCats.results ?? [];
      const listeDiscs = Array.isArray(dataDiscs) ? dataDiscs : dataDiscs.results ?? [];

      setCategories(listeCats);
      setDisciplines(listeDiscs);
    } catch (err) {
      console.error("Erreur lors du chargement des catégories :", err);
      setErreur("Impossible de charger les catégories.");
      setCategories([]);
    } finally {
      setChargement(false);
    }
  }, []);

  useEffect(() => {
    chargerDonnees();
  }, [chargerDonnees]);

  // Supprimer une catégorie réelle
  const supprimerCategorie = async (categorie) => {
    if (!window.confirm(`Voulez-vous vraiment supprimer la catégorie « ${categorie.nom} » ?`)) {
      return;
    }

    try {
      await api.delete(`/api/categories/${categorie.id}/`);
      setCategories((prev) => prev.filter((c) => c.id !== categorie.id));
    } catch (err) {
      console.error("Erreur suppression catégorie :", err);
      alert("Impossible de supprimer cette catégorie car elle est peut-être liée à des événements existants.");
    }
  };

  // Trouver le nom de la discipline
  const getNomDiscipline = (cat) => {
    if (cat.discipline_nom) return cat.discipline_nom;
    if (cat.discipline && typeof cat.discipline === "object") return cat.discipline.nom || "Discipline";
    const found = disciplines.find((d) => String(d.id) === String(cat.discipline));
    return found ? found.nom : "Non classée";
  };

  // Filtrage et recherche
  const listeFiltree = useMemo(() => {
    const q = recherche.trim().toLowerCase();

    return categories.filter((cat) => {
      const matchNom = (cat.nom || "").toLowerCase().includes(q);
      const matchDesc = (cat.description || "").toLowerCase().includes(q);
      const nomDisc = getNomDiscipline(cat).toLowerCase();
      const matchDisc = nomDisc.includes(q);

      const matchFiltreDisc =
        disciplineFiltre === "Toutes" ||
        nomDisc === disciplineFiltre.toLowerCase() ||
        String(cat.discipline) === String(disciplineFiltre);

      return (matchNom || matchDesc || matchDisc) && matchFiltreDisc;
    });
  }, [categories, disciplines, recherche, disciplineFiltre]);

  const totalPages = Math.max(1, Math.ceil(listeFiltree.length / PAR_PAGE));
  const pageCourante = Math.min(page, totalPages);
  const categoriesAffichees = listeFiltree.slice(
    (pageCourante - 1) * PAR_PAGE,
    pageCourante * PAR_PAGE
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2.5">
              <Tags size={28} className="text-[#C25B1E]" />
              Gestion des Catégories
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">
              {categories.length} catégorie{categories.length > 1 ? "s" : ""} sportive{categories.length > 1 ? "s" : ""} enregistrée{categories.length > 1 ? "s" : ""} dans la base de données
            </p>
          </div>

          <button
            onClick={() => navigate("/admin/categories/ajout")}
            className="inline-flex items-center justify-center gap-2 bg-[#C25B1E] hover:bg-[#A04816] text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <Plus size={16} />
            Ajouter une catégorie
          </button>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une catégorie..."
              value={recherche}
              onChange={(e) => {
                setRecherche(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#C25B1E] transition-all"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter size={15} className="text-gray-400 shrink-0" />
            <select
              value={disciplineFiltre}
              onChange={(e) => {
                setDisciplineFiltre(e.target.value);
                setPage(1);
              }}
              className="w-full sm:w-auto px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 outline-none focus:border-[#C25B1E]"
            >
              <option value="Toutes">Toutes les disciplines</option>
              {disciplines.map((d) => (
                <option key={d.id} value={d.nom}>
                  {d.nom}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tableau des catégories */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50 text-[11px] font-extrabold uppercase tracking-wider text-gray-400">
                  <th className="py-3.5 px-4">Nom de la catégorie</th>
                  <th className="py-3.5 px-4">Discipline parente</th>
                  <th className="py-3.5 px-4">Description</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs sm:text-sm">
                {chargement && (
                  <tr>
                    <td colSpan={4} className="py-16 text-center text-gray-400">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#C25B1E] border-t-transparent mx-auto mb-2" />
                      Chargement des catégories...
                    </td>
                  </tr>
                )}

                {!chargement && categoriesAffichees.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-16 text-center text-gray-400">
                      <Tags size={36} className="text-gray-300 mx-auto mb-2" />
                      <p className="font-bold text-gray-700">Aucune catégorie trouvée</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {recherche ? "Modifiez vos filtres de recherche." : "Cliquez sur « Ajouter une catégorie » pour en créer une."}
                      </p>
                    </td>
                  </tr>
                )}

                {!chargement &&
                  categoriesAffichees.map((cat) => (
                    <tr key={cat.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-4 px-4 font-bold text-gray-900">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#C25B1E] flex items-center justify-center font-bold text-xs shrink-0">
                            <Tags size={16} />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{cat.nom}</p>
                            <p className="text-[10px] text-gray-400">ID: #{cat.id}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 text-gray-700 font-semibold">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                          <Trophy size={12} />
                          {getNomDiscipline(cat)}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-gray-500 max-w-xs truncate">
                        {cat.description || "Aucune description"}
                      </td>

                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 text-gray-400">
                          <button
                            onClick={() => navigate(`/admin/categories/${cat.id}/modifier`)}
                            className="p-1.5 hover:text-[#C25B1E] hover:bg-orange-50 rounded-lg transition-colors cursor-pointer"
                            title="Modifier"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => supprimerCategorie(cat)}
                            className="p-1.5 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
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
          {!chargement && totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-gray-50/30">
              <p className="text-xs text-gray-400">
                Page {pageCourante} sur {totalPages} ({listeFiltree.length} résultat{listeFiltree.length > 1 ? "s" : ""})
              </p>
              <div className="flex items-center gap-1">
                <button
                  disabled={pageCourante <= 1}
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft size={14} />
                </button>
                <span className="text-xs font-bold px-2">{pageCourante}</span>
                <button
                  disabled={pageCourante >= totalPages}
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
