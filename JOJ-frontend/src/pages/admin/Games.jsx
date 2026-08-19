import { useEffect, useMemo, useState } from "react";
import { Plus, Search, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { isBackendConnected, disciplinesService, categoriesService } from "../../lib/api";
import { disciplinesDemo } from "../../lib/demoData";
import AdminLayout from "../../components/layouts/AdminLayout";
import DisciplineModal from "../../components/modal/DisciplineModal";

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

const CATEGORIES_DEMO = [
  { id: 1, nom: "Sports Individuels", description: "" },
  { id: 2, nom: "Sports Aquatiques", description: "" },
  { id: 3, nom: "Sports Artistiques", description: "" },
  { id: 4, nom: "Sports de Combat", description: "" },
  { id: 5, nom: "Sports Collectifs", description: "" },
];

const COMPLEMENTS_DEMO = {
  1: { categorie: "Sports Collectifs", nb: 4, site: "Complexe Iba Mar Diop" },
  2: { categorie: "Sports Collectifs", nb: 12, site: "Dakar Arena" },
  3: { categorie: "Sports Collectifs", nb: 0, site: "Complexe Iba Mar Diop" },
  4: { categorie: "Sports de Combat", nb: 6, site: "Arena de Toubab Dialaw" },
};

const DEMO = {
  disciplines:
    Array.isArray(disciplinesDemo) && disciplinesDemo.length > 0
      ? disciplinesDemo
      : [
          { id: 1, nom: "Athlétisme", regle: "", accessibilite: "", categories: [], nombre_competiteurs: 4 },
          { id: 2, nom: "Basket-ball", regle: "", accessibilite: "", categories: [], nombre_competiteurs: 12 },
          { id: 3, nom: "Football", regle: "", accessibilite: "", categories: [], nombre_competiteurs: 0 },
          { id: 4, nom: "Judo", regle: "", accessibilite: "", categories: [], nombre_competiteurs: 6 },
        ],
};

const siteDiscipline = (discipline) => {
  const complement = COMPLEMENTS_DEMO[discipline.id];
  return complement ? complement.site : "Arena Dakar";
};

const PAR_PAGE = 8;

export default function Disciplines() {
  const [chargement, setChargement] = useState(true);
  const [disciplines, setDisciplines] = useState([]);
  const [categories, setCategories] = useState(CATEGORIES_DEMO);
  const [recherche, setRecherche] = useState("");
  const [categorieFiltre, setCategorieFiltre] = useState("Toutes");
  const [statutFiltre, setStatutFiltre] = useState("Tous");
  const [page, setPage] = useState(1);

  // État de gestion du Popup (Modal)
  const [modalOuverte, setModalOuverte] = useState(false);
  const [disciplineSelectionnee, setDisciplineSelectionnee] = useState(null);

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

  // Filtrage des données
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

  // Pagination
  const total = listeFiltree.length;
  const totalPages = Math.max(1, Math.ceil(total / PAR_PAGE));
  const pageCourante = Math.min(page, totalPages);
  const debut = (pageCourante - 1) * PAR_PAGE;
  const pageDisciplines = listeFiltree.slice(debut, debut + PAR_PAGE);

  useEffect(() => {
    setPage(1);
  }, [recherche, categorieFiltre, statutFiltre]);

  const ouvrirModalAjout = () => {
    setDisciplineSelectionnee(null);
    setModalOuverte(true);
  };

  const ouvrirModalEdition = (discipline) => {
    setDisciplineSelectionnee(discipline);
    setModalOuverte(true);
  };

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
      <div>
        {/* En-tête */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-extrabold text-gray-900">
              Liste des Disciplines
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Gérez l'ensemble des disciplines et épreuves programmées pour Dakar 2026.
            </p>
          </div>
          <button
            onClick={ouvrirModalAjout}
            className="inline-flex items-center gap-2 bg-[#f28c28] hover:bg-[#d8781a] text-white rounded-full px-5 py-2.5 text-sm font-semibold transition-colors duration-200 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Ajouter une discipline
          </button>
        </div>

        {/* Filtres : Recherche à gauche, Sélecteurs alignés à droite */}
<div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
  
  {/* Champ de recherche à gauche avec largeur maximale */}
  <div className="flex items-center bg-[#F8FAFC] rounded-2xl px-4 py-3 gap-3 w-full md:max-w-md border border-gray-100 shadow-sm">
    <Search className="w-4 h-4 text-gray-400 shrink-0" />
    <input
      type="text"
      value={recherche}
      onChange={(e) => setRecherche(e.target.value)}
      placeholder="Rechercher une discipline (ex: Judo, Natation...)"
      className="bg-transparent outline-none text-xs w-full text-gray-700 placeholder:text-gray-400"
    />
  </div>

          {/* Filtres alignés à droite */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <select
              value={categorieFiltre}
              onChange={(e) => setCategorieFiltre(e.target.value)}
              className="rounded-2xl border border-gray-200 bg-white text-xs font-medium text-gray-700 px-4 py-3 outline-none focus:ring-2 focus:ring-[#f28c28]/30 shadow-sm cursor-pointer min-w-[170px]"
            >
              <option value="Toutes">Catégories: Toutes</option>
              {categories.map((c) => (
                <option key={c.id} value={c.nom}>{c.nom}</option>
              ))}
            </select>

            <select
              value={statutFiltre}
              onChange={(e) => setStatutFiltre(e.target.value)}
              className="rounded-2xl border border-gray-200 bg-white text-xs font-medium text-gray-700 px-4 py-3 outline-none focus:ring-2 focus:ring-[#f28c28]/30 shadow-sm cursor-pointer min-w-[130px]"
            >
              <option value="Tous">Statut: Tous</option>
              <option value="Actif">Active</option>
              <option value="Inactif">Inactive</option>
            </select>
          </div>

        </div>

        {/* Tableau */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-[11px] font-bold uppercase tracking-wider text-gray-400 text-left">
                  <th className="px-5 py-3.5">Nom de la discipline</th>
                  <th className="px-5 py-3.5">Catégorie</th>
                  <th className="px-5 py-3.5">Site principal</th>
                  <th className="px-5 py-3.5">Statut</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageDisciplines.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-14 text-center text-gray-500">
                      Aucune discipline trouvée.
                    </td>
                  </tr>
                )}
                {pageDisciplines.map((d) => {
                  const actif = nbCompetiteurs(d) > 0;
                  return (
                    <tr
                      key={d.id}
                      className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          {iconeDiscipline(d.id, d.nom)}
                          <div>
                            <p className="font-semibold text-gray-900 leading-tight">{d.nom}</p>
                            <p className="text-[11px] text-gray-400 mt-0.5">
                              {actif ? `${nbCompetiteurs(d)} compétiteurs` : "Aucun compétiteur"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-gray-600">{nomCategorie(d)}</td>
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-gray-800 leading-tight">{siteDiscipline(d)}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <BadgeStatut actif={actif} />
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => ouvrirModalEdition(d)}
                            className="p-2 rounded-lg text-gray-400 hover:text-[#f28c28] hover:bg-orange-50 transition-colors"
                            title="Modifier"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => supprimerDiscipline(d)}
                            className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
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
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-t border-gray-100 bg-white">
            <p className="text-xs text-gray-500">
              Affichage de <span className="font-semibold">{total > 0 ? debut + 1 : 0}</span>–
              <span className="font-semibold">{Math.min(debut + PAR_PAGE, total)}</span> sur{" "}
              <span className="font-semibold">{total}</span> disciplines
            </p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={pageCourante === 1}
                className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-[#f28c28] disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Précédent
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={pageCourante === totalPages}
                className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-[#f28c28] disabled:opacity-40 transition-colors"
              >
                Suivant
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Modal de création / modification */}
        <DisciplineModal
          isOpen={modalOuverte}
          discipline={disciplineSelectionnee}
          onClose={() => setModalOuverte(false)}
          onSuccess={chargerDonnees}
        />
      </div>
    </AdminLayout>
  );
}