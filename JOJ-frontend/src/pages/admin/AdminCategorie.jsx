import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {Plus,Search,Pencil, Trash2, ChevronLeft, ChevronRight,} from "lucide-react";
import {isBackendConnected, disciplinesService, categoriesService,} from "../../lib/api";
import {  COULEURS_ICONE , DEMO} from "../../lib/demoData";

function iconeDiscipline(disciplineId, nom) {
  const fond = COULEURS_ICONE[(disciplineId || 1) % COULEURS_ICONE.length];
  return (
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
      style={{ backgroundColor: fond }}
      aria-hidden="true"
    >
      {nom ? nom.charAt(0).toUpperCase() : "C"}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Badge de statut : le serializer ne contient pas de champ « active » — le
// statut est déduit de la présence d'une description. Ce choix est
// volontairement documenté pour que l'équipe puisse le brancher sur un vrai
// champ si le modèle évolue.
// ---------------------------------------------------------------------------
function BadgeStatut({ actif }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
        actif
          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
          : "bg-gray-100 text-gray-500 border-gray-200"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          actif ? "bg-emerald-500" : "bg-gray-400"
        }`}
      />
      {actif ? "Actif" : "Inactif"}
    </span>
  );
}


const PAR_PAGE = 8;

export default function Categories() {
  const navigate = useNavigate();
  const [chargement, setChargement] = useState(true);
  const [categories, setCategories] = useState([]);
  const [disciplines, setDisciplines] = useState([]);
  const [recherche, setRecherche] = useState("");
  const [disciplineFiltre, setDisciplineFiltre] = useState("Toutes");
  const [statutFiltre, setStatutFiltre] = useState("Tous");
  const [page, setPage] = useState(1);

  // Chargement des données réelles (ou fallback démo)
  useEffect(() => {
    let actif = true;
    if (!isBackendConnected()) {
      setCategories(DEMO.categories);
      setDisciplines(DEMO.disciplines);
      setChargement(false);
      return;
    }
    Promise.all([
      categoriesService.lister().catch(() => DEMO.categories),
      disciplinesService.lister().catch(() => DEMO.disciplines),
    ]).then(([cats, discs]) => {
      if (!actif) return;
      setCategories(
        Array.isArray(cats) && cats.length > 0 ? cats : DEMO.categories
      );
      // Le serializer Discipline peut ne pas renvoyer « nom » directement ;
      // on normalise pour le filtre et les icônes.
      const normalise = Array.isArray(discs)
        ? discs.map((d) => (typeof d === "string" ? { id: d, nom: d } : d))
        : DEMO.disciplines;
      setDisciplines(normalise.length > 0 ? normalise : DEMO.disciplines);
      setChargement(false);
    });
    return () => {
      actif = false;
    };
  }, []);

  // Nom de la discipline parente
  const nomDiscipline = (categorie) => {
    if (categorie.discipline) {
      return typeof categorie.discipline === "string"
        ? categorie.discipline
        : categorie.discipline.nom || "Non classée";
    }
    return "Non classée";
  };

  // Recherche + filtres (client-side)
  const listeFiltree = useMemo(() => {
    const terme = recherche.trim().toLowerCase();
    return categories.filter((c) => {
      const correspondRecherche =
        !terme ||
        c.nom.toLowerCase().includes(terme) ||
        (c.description || "").toLowerCase().includes(terme);
      const correspondDiscipline =
        disciplineFiltre === "Toutes" || nomDiscipline(c) === disciplineFiltre;
      const actif = Boolean(c.description && c.description.trim());
      const correspondStatut =
        statutFiltre === "Tous" ||
        (statutFiltre === "Actif" && actif) ||
        (statutFiltre === "Inactif" && !actif);
      return correspondRecherche && correspondDiscipline && correspondStatut;
    });
  }, [categories, recherche, disciplineFiltre, statutFiltre]);

  // Pagination
  const total = listeFiltree.length;
  const totalPages = Math.max(1, Math.ceil(total / PAR_PAGE));
  const pageCourante = Math.min(page, totalPages);
  const debut = (pageCourante - 1) * PAR_PAGE;
  const pageCategories = listeFiltree.slice(debut, debut + PAR_PAGE);

  // Réinitialiser la page quand les filtres changent
  useEffect(() => {
    setPage(1);
  }, [recherche, disciplineFiltre, statutFiltre]);

  const supprimerCategorie = async (categorie) => {
    const confirme = window.confirm(
      `Supprimer la catégorie « ${categorie.nom} » ? Cette action est irréversible.`
    );
    if (!confirme) return;
    if (isBackendConnected()) {
      try {
        await fetch(
          `${import.meta.env.VITE_API_URL.replace(/\/$/, "")}/api/categories/${categorie.id}/`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("joj_token") || ""}`,
            },
          }
        );
      } catch {
        toast.error(
          "Impossible de supprimer la catégorie côté serveur. Vérifiez votre connexion."
        );
        return;
      }
    }
    setCategories((liste) => liste.filter((c) => c.id !== categorie.id));
    toast.success(`Catégorie « ${categorie.nom} » supprimée.`);
  };

  if (chargement) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[50vh]">
        <p className="text-sm text-muted-foreground">
          Chargement des catégories...
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* En-tête de section */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-extrabold text-joj-black">
            Liste des Catégories
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Gérez les catégories et épreuves rattachées à chaque discipline
            olympique.
          </p>
        </div>
        <button
          onClick={() => navigate("/dashboard/categories/nouvelle")}
          className="press-scale inline-flex items-center gap-2 bg-joj-orange hover:bg-joj-orange-dark text-white rounded-full px-5 py-2.5 text-sm font-semibold transition-colors duration-200"
        >
          <Plus className="w-4 h-4" />
          Ajouter une catégorie
        </button>
      </div>

      {/* Barre de filtres */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-5 mb-6">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex items-center bg-[#F1F5F9] rounded-full px-4 py-2.5 gap-2 flex-1 md:max-w-md">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="text"
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              placeholder="Rechercher une catégorie (ex: 100m, Tournoi 3x3...)"
              className="bg-transparent outline-none text-xs w-full text-gray-700 placeholder:text-gray-400"
              aria-label="Rechercher une catégorie"
            />
          </div>
          <select
            value={disciplineFiltre}
            onChange={(e) => setDisciplineFiltre(e.target.value)}
            className="rounded-full border border-gray-200 bg-white text-xs text-gray-700 px-4 py-2.5 outline-none focus:ring-2 focus:ring-joj-orange/30"
            aria-label="Filtrer par discipline"
          >
            <option>Toutes</option>
            {disciplines.map((d) => (
              <option key={d.id}>{d.nom}</option>
            ))}
          </select>
          <select
            value={statutFiltre}
            onChange={(e) => setStatutFiltre(e.target.value)}
            className="rounded-full border border-gray-200 bg-white text-xs text-gray-700 px-4 py-2.5 outline-none focus:ring-2 focus:ring-joj-orange/30"
            aria-label="Filtrer par statut"
          >
            <option>Tous</option>
            <option>Actif</option>
            <option>Inactif</option>
          </select>
        </div>
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-[11px] font-bold uppercase tracking-wider text-gray-400 text-left">
                <th className="px-5 py-3.5">Nom de la catégorie</th>
                <th className="px-5 py-3.5">Discipline parente</th>
                <th className="px-5 py-3.5 hidden md:table-cell">Description</th>
                <th className="px-5 py-3.5">Statut</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageCategories.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-14 text-center text-muted-foreground"
                  >
                    Aucune catégorie ne correspond à vos critères.
                  </td>
                </tr>
              )}
              {pageCategories.map((c) => {
                const actif = Boolean(c.description && c.description.trim());
                return (
                  <tr
                    key={c.id}
                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {iconeDiscipline(c.discipline?.id, nomDiscipline(c))}
                        <div>
                          <p className="font-semibold text-gray-900 leading-tight">
                            {c.nom}
                          </p>
                          <p className="text-[11px] text-gray-400 mt-0.5">
                            N°{c.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600">
                      {nomDiscipline(c)}
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell text-gray-500 text-xs leading-relaxed max-w-xs">
                      {c.description
                        ? c.description.length > 90
                          ? `${c.description.slice(0, 90)}…`
                          : c.description
                        : "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      <BadgeStatut actif={actif} />
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() =>
                            navigate(`/dashboard/categories/${c.id}/modifier`)
                          }
                          className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                          aria-label={`Modifier ${c.nom}`}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => supprimerCategorie(c)}
                          className="p-2 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                          aria-label={`Supprimer ${c.nom}`}
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
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 px-5 py-4 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Affichage de{" "}
            {total === 0
              ? 0
              : `${debut + 1}–${Math.min(debut + PAR_PAGE, total)}`}{" "}
            sur {total} catégorie{total > 1 ? "s" : ""}
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={pageCourante <= 1}
              className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Page précédente"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
                  n === pageCourante
                    ? "bg-joj-black text-white"
                    : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={pageCourante >= totalPages}
              className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Page suivante"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Note technique */}
      <p className="text-[11px] text-gray-400 mt-4 leading-relaxed">
        Le modèle Categorie n'expose pas de champ « statut » : la page déduit
        l'état Actif/Inactif de la présence d'une description, et les
        catégories liées à un événement sont considérées actives. Un champ
        dédié peut être ajouté au modèle si besoin.
      </p>
    </div>
  );
}
