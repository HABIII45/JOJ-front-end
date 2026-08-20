import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Pencil, Trash2, Eye, ImageOff } from "lucide-react";
import api, { ENDPOINTS } from "../../api/api";
import { DEMO } from "../../lib/demoData";
import AdminLayout from "../../components/layouts/AdminLayout";

// Ajuste ce chemin si la liste des disciplines vit ailleurs dans ton routeur.
const ROUTE_LISTE = "/admin/disciplines";

const COULEURS_ICONE = ["#C25B1E", "#16A34A", "#2563EB", "#9333EA", "#0891B2", "#DB2777", "#CA8A04", "#475569"];

/** Vignette de la discipline : l'image venant de la DB si elle existe,
 *  sinon un repli par initiale colorée (utile tant que toutes les
 *  disciplines n'ont pas encore d'image en base). */
function VignetteDiscipline({ discipline }) {
  if (discipline.image) {
    return (
      <img
        src={discipline.image}
        alt=""
        className="w-10 h-10 rounded-xl object-cover shrink-0 border border-gray-100"
        onError={(e) => {
          e.currentTarget.style.display = "none";
          e.currentTarget.nextSibling.style.display = "flex";
        }}
      />
    );
  }
  const fond = COULEURS_ICONE[(discipline.id || 1) % COULEURS_ICONE.length];
  return (
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
      style={{ backgroundColor: fond }}
      aria-hidden="true"
    >
      {discipline.nom ? discipline.nom.charAt(0).toUpperCase() : "D"}
    </div>
  );
}

/** Cellule de texte tronquée (règle / accessibilité), avec le texte complet
 *  visible au survol via `title`, et un tiret si le champ est vide. */
function CelluleTexte({ valeur }) {
  const texte = (valeur || "").trim();
  if (!texte) {
    return <span className="text-gray-300 text-xs">—</span>;
  }
  return (
    <p className="text-gray-600 text-xs max-w-[220px] truncate" title={texte}>
      {texte}
    </p>
  );
}

const PAR_PAGE = 8;

export default function Disciplines() {
  // const [, setLocation] = useLocation();
  const navigate = useNavigate();
  const [chargement, setChargement] = useState(true);
  const [disciplines, setDisciplines] = useState([]);
  const [recherche, setRecherche] = useState("");
  const [page, setPage] = useState(1);

  const chargerDonnees = async () => {
    setChargement(true);
    try {
      const { data } = await api.get(ENDPOINTS.disciplines.liste);
      setDisciplines(Array.isArray(data) && data.length > 0 ? data : DEMO.disciplines);
    } catch {
      setDisciplines(DEMO.disciplines);
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => {
    chargerDonnees();
  }, []);

  const listeFiltree = useMemo(() => {
    const terme = recherche.trim().toLowerCase();
    return disciplines.filter((d) => !terme || d.nom.toLowerCase().includes(terme));
  }, [disciplines, recherche]);

  const total = listeFiltree.length;
  const totalPages = Math.max(1, Math.ceil(total / PAR_PAGE));
  const pageCourante = Math.min(page, totalPages);
  const debut = (pageCourante - 1) * PAR_PAGE;
  const pageDisciplines = listeFiltree.slice(debut, debut + PAR_PAGE);

  useEffect(() => {
    setPage(1);
  }, [recherche]);

  const allerVersAjout = () => navigate(`${ROUTE_LISTE}/nouvelle`);
  const allerVersDetail = (discipline) => navigate(`${ROUTE_LISTE}/${discipline.id}`);
  const allerVersEdition = (discipline) => navigate(`${ROUTE_LISTE}/${discipline.id}/modifier`);

  // Suppression : passe désormais par `api` (donc les mêmes en-têtes / base
  // URL / intercepteurs que le reste de l'app), au lieu d'un fetch séparé
  // pointant potentiellement vers une URL différente. C'est ce décalage qui
  // faisait qu'une discipline "supprimée" réapparaissait après un rechargement
  // de la liste : la suppression ne persistait jamais vraiment côté serveur.
const supprimerDiscipline = async (discipline) => {
  const confirme = window.confirm(
    `Supprimer la discipline « ${discipline.nom} » ? Cette action est irréversible.`
  );
  if (!confirme) return;

  try {
    // Nettoyage du slash de fin pour éviter les erreurs d'URL (ex: /disciplines/12/)
    const baseUrl = ENDPOINTS.disciplines.liste.replace(/\/$/, "");
    await api.delete(`${baseUrl}/${discipline.id}/`);
    
    // Mise à jour de l'état local
    setDisciplines((liste) => liste.filter((d) => d.id !== discipline.id));
    toast.success(`Discipline « ${discipline.nom} » supprimée.`);
  } catch (erreur) {
    toast.error("Impossible de supprimer la discipline côté serveur.");
  }
};

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
          </div>

          <div className="rounded-2xl border border-gray-100 overflow-hidden bg-white mb-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#FAFBFD] border-b border-gray-100 text-[11px] font-bold uppercase tracking-wider text-gray-400 text-left">
                    <th className="px-6 py-4">Nom de la discipline</th>
                    <th className="px-6 py-4">Règle</th>
                    <th className="px-6 py-4">Accessibilité</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {pageDisciplines.map((d) => (
                    <tr key={d.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <button
                          onClick={() => allerVersDetail(d)}
                          className="flex items-center gap-3.5 text-left group"
                        >
                          <VignetteDiscipline discipline={d} />
                          <div>
                            <p className="font-bold text-gray-900 leading-tight group-hover:text-[#D96B27] transition-colors">
                              {d.nom}
                            </p>
                          </div>
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <CelluleTexte valeur={d.regle} />
                      </td>
                      <td className="px-6 py-4">
                        <CelluleTexte valeur={d.accessibilite} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => allerVersDetail(d)}
                            className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                            aria-label="Voir la discipline"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => allerVersEdition(d)}
                            className="p-2 rounded-lg text-gray-400 hover:text-[#D96B27] hover:bg-orange-50 transition-colors"
                            aria-label="Modifier la discipline"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => supprimerDiscipline(d)}
                            className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                            aria-label="Supprimer la discipline"
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