import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { isBackendConnected, disciplinesService, categoriesService } from "../../lib/api";
import { disciplinesDemo, DEMO, CATEGORIES_DEMO } from "../../lib/demoData";
import AdminLayout from "../../components/layouts/AdminLayout";

// Ajuste ce chemin si la liste des disciplines vit ailleurs dans ton routeur.
const ROUTE_LISTE = "/admin/disciplines";

const COULEURS_ICONE = ["#C25B1E", "#16A34A", "#2563EB", "#9333EA", "#0891B2", "#DB2777", "#CA8A04", "#475569"];

function iconeDiscipline(id, nom) {
  const fond = COULEURS_ICONE[(id || 1) % COULEURS_ICONE.length];
  return (
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
      style={{ backgroundColor: fond }}
      aria-hidden="true"
    >
      {nom ? nom.charAt(0).toUpperCase() : "D"}
    </div>
  );
}

function BadgeStatut({ actif }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
        actif ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-gray-100 text-gray-500 border-gray-200"
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${actif ? "bg-emerald-500" : "bg-gray-400"}`} />
      {actif ? "Active" : "Inactive"}
    </span>
  );
}


const siteDiscipline = (discipline) => {
  const complement = COMPLEMENTS_DEMO[discipline.id];
  return complement ? complement.site : "Arena Dakar";
};

const PAR_PAGE = 8;

export default function Disciplines() {
  const [, setLocation] = useLocation();
  const [chargement, setChargement] = useState(true);
  const [disciplines, setDisciplines] = useState([]);
  const [categories, setCategories] = useState(CATEGORIES_DEMO);
  const [recherche, setRecherche] = useState("");
  const [categorieFiltre, setCategorieFiltre] = useState("Toutes");
  const [statutFiltre, setStatutFiltre] = useState("Tous");
  const [page, setPage] = useState(1);

  const chargerDonnees = () => {
    if (!isBackendConnected()) {
      setDisciplines(DEMO.disciplines);
      setCategories(CATEGORIES_DEMO);
      setChargement(false);
      return;
    }

    Promise.all([
      disciplinesService.lister().catch(() => DEMO.disciplines),
      categoriesService.lister().catch(() => CATEGORIES_DEMO),
    ]).then(([discs, cats]) => {
      setDisciplines(Array.isArray(discs) && discs.length > 0 ? discs : DEMO.disciplines);
      setCategories(Array.isArray(cats) && cats.length > 0 ? cats : CATEGORIES_DEMO);
      setChargement(false);
    });
  };

  useEffect(() => {
    chargerDonnees();
  }, []);

  const nomCategorie = (discipline) => {
    const premiere = Array.isArray(discipline.categories) && discipline.categories.length > 0 ? discipline.categories[0] : null;
    if (!premiere) {
      const complement = COMPLEMENTS_DEMO[discipline.id];
      return complement ? complement.categorie : "Non classée";
    }
    return typeof premiere === "string" ? premiere : premiere.nom;
  };

  const nbCompetiteurs = (discipline) => {
    if (typeof discipline.nombre_competiteurs === "number") {
      return discipline.nombre_competiteurs;
    }
    const complement = COMPLEMENTS_DEMO[discipline.id];
    return complement ? complement.nb : 0;
  };

  const listeFiltree = useMemo(() => {
    const terme = recherche.trim().toLowerCase();
    return disciplines.filter((d) => {
      const correspondRecherche = !terme || d.nom.toLowerCase().includes(terme);
      const categorie = nomCategorie(d);
      const correspondCategorie = categorieFiltre === "Toutes" || categorie === categorieFiltre;
      const actif = nbCompetiteurs(d) > 0;
      const correspondStatut =
        statutFiltre === "Tous" ||
        (statutFiltre === "Actif" && actif) ||
        (statutFiltre === "Inactif" && !actif);

      return correspondRecherche && correspondCategorie && correspondStatut;
    });
  }, [disciplines, recherche, categorieFiltre, statutFiltre]);

  const total = listeFiltree.length;
  const totalPages = Math.max(1, Math.ceil(total / PAR_PAGE));
  const pageCourante = Math.min(page, totalPages);
  const debut = (pageCourante - 1) * PAR_PAGE;
  const pageDisciplines = listeFiltree.slice(debut, debut + PAR_PAGE);

  useEffect(() => {
    setPage(1);
  }, [recherche, categorieFiltre, statutFiltre]);

  // Navigation vers la page dédiée (ajout / édition) au lieu d'ouvrir une modal
  const allerVersAjout = () => setLocation(`${ROUTE_LISTE}/nouvelle`);
  const allerVersEdition = (discipline) => setLocation(`${ROUTE_LISTE}/${discipline.id}/modifier`);

  const supprimerDiscipline = async (discipline) => {
    const confirme = window.confirm(
      `Supprimer la discipline « ${discipline.nom} » ? Cette action est irréversible.`
    );
    if (!confirme) return;

    if (isBackendConnected()) {
      try {
        await fetch(
          `${import.meta.env.VITE_API_URL.replace(/\/$/, "")}/api/disciplines/${discipline.id}/`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("joj_token") || ""}`,
            },
          }
        );
      } catch {
        alert("Impossible de supprimer la discipline côté serveur.");
        return;
      }
    }
    setDisciplines((liste) => liste.filter((d) => d.id !== discipline.id));
  };

  if (chargement) {
    return (
      <AdminLayout>
        <div className="p-8 flex items-center justify-center min-h-[50vh]">
          <p className="text-sm text-gray-500">Chargement des disciplines...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-[#F8FAFC] -m-6 p-6 md:p-10">
        <div className="max-w-7xl mx-auto bg-white rounded-[2rem] border border-gray-100/80 shadow-sm p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
                Liste des Disciplines
              </h1>
              <p className="text-gray-400 text-xs md:text-sm mt-1">
                Gérez l'ensemble des disciplines et épreuves programmées pour Dakar 2026.
              </p>
            </div>

            <button
              onClick={allerVersAjout}
              className="inline-flex items-center justify-center gap-2 bg-[#D96B27] hover:bg-[#c25b1e] text-white rounded-xl px-5 py-3 text-sm font-semibold transition-colors duration-200 shadow-sm shrink-0"
            >
              <Plus className="w-4 h-4" />
              Ajouter une discipline
            </button>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
            <div className="flex items-center bg-[#F8FAFC] rounded-xl px-4 py-3 gap-3 w-full md:max-w-md border border-gray-100">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                type="text"
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                placeholder="Rechercher une discipline (ex: Judo, Natation...)"
                className="bg-transparent outline-none text-xs w-full text-gray-700 placeholder:text-gray-400"
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <select
                value={categorieFiltre}
                onChange={(e) => setCategorieFiltre(e.target.value)}
                className="rounded-xl border border-gray-200 bg-white text-xs font-medium text-gray-600 px-4 py-3 outline-none focus:ring-2 focus:ring-[#D96B27]/20 cursor-pointer min-w-[170px]"
              >
                <option value="Toutes">Catégories: Toutes</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.nom}>{c.nom}</option>
                ))}
              </select>

              <select
                value={statutFiltre}
                onChange={(e) => setStatutFiltre(e.target.value)}
                className="rounded-xl border border-gray-200 bg-white text-xs font-medium text-gray-600 px-4 py-3 outline-none focus:ring-2 focus:ring-[#D96B27]/20 cursor-pointer min-w-[130px]"
              >
                <option value="Tous">Statut: Tous</option>
                <option value="Actif">Active</option>
                <option value="Inactif">Inactive</option>
              </select>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 overflow-hidden bg-white mb-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#FAFBFD] border-b border-gray-100 text-[11px] font-bold uppercase tracking-wider text-gray-400 text-left">
                    <th className="px-6 py-4">Nom de la discipline</th>
                    <th className="px-6 py-4">Catégorie</th>
                    <th className="px-6 py-4">Site principal</th>
                    <th className="px-6 py-4">Statut</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {pageDisciplines.map((d) => (
                    <tr key={d.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3.5">
                          {iconeDiscipline(d.id, d.nom)}
                          <div>
                            <p className="font-bold text-gray-900 leading-tight">{d.nom}</p>
                            <p className="text-[11px] text-gray-400 mt-0.5">15-18 Mai 2026</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 font-medium text-xs">{nomCategorie(d)}</td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-800 text-xs">{siteDiscipline(d)}</p>
                        <p className="text-[11px] text-gray-400">12 épreuves</p>
                      </td>
                      <td className="px-6 py-4">
                        <BadgeStatut actif={nbCompetiteurs(d) > 0} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => allerVersEdition(d)}
                            className="p-2 rounded-lg text-gray-400 hover:text-[#D96B27] hover:bg-orange-50 transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => supprimerDiscipline(d)}
                            className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-gray-400">
              Affichage de <span className="font-bold text-gray-700">{debut + 1}–{Math.min(debut + PAR_PAGE, total)}</span> sur <span className="font-bold text-gray-700">{total}</span> disciplines
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={pageCourante === 1}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-40"
              >
                Précédent
              </button>

              <button className="w-8 h-8 rounded-lg bg-[#D96B27] text-white text-xs font-bold flex items-center justify-center">
                1
              </button>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={pageCourante === totalPages}
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-40"
              >
                Suivant
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}