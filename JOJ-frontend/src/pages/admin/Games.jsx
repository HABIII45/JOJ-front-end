<<<<<<< HEAD
import { useState, useEffect } from 'react'
import { getGamers } from '../../services/competiteur'
import GamerCard from './GamerCard'
import { FiEdit2, FiTrash2, FiMoreVertical } from 'react-icons/fi'

export default function GamesList() {
  const [gamers, setGamers] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all') // 'all' | 'teams' | 'players'
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  useEffect(() => {
    const fetchGamers = async () => {
      try {
        setLoading(true)
        const response = await getGamers()
        setGamers(response)
        console.log("Liste des compétiteurs récupérée avec succès :", response)
      } catch (error) {
        console.error("Erreur lors de la récupération des compétiteurs:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchGamers()
  }, [])

  // Filtres
  const filteredGamers = gamers.filter((gamer) => {
    const matchesSearch = gamer.nom?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter =
      filterType === 'all' ||
      (filterType === 'teams' && gamer.type === 'team') ||
      (filterType === 'players' && gamer.type === 'player')
    return matchesSearch && matchesFilter
  })

  // Pagination
  const totalPages = Math.ceil(filteredGamers.length / itemsPerPage)
  const paginatedGamers = filteredGamers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const toggleStatus = (id) => {
    setGamers((prev) =>
      prev.map((g) => (g.id === id ? { ...g, status: !g.status } : g))
    )
  }

  if (loading) return <div>Chargement...</div>

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* En-tête */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestion des Équipes</h1>
        <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition">
          + Ajouter une équipe
        </button>
      </div>

      {/* Recherche et filtres */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm">
        <input
          type="text"
          placeholder="Nom de l'équipe..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <div className="flex gap-2">
          <button
            className={`px-4 py-2 rounded-lg transition ${
              filterType === 'all'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setFilterType('all')}
          >
            Toutes les équipes
          </button>
          <button
            className={`px-4 py-2 rounded-lg transition ${
              filterType === 'players'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setFilterType('players')}
          >
            Tous les joueurs
          </button>
        </div>
        <button
          onClick={() => {
            setSearchTerm('')
            setFilterType('all')
          }}
          className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition"
        >
          Appliquer
        </button>
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Logo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom de l'équipe</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pays</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sport</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedGamers.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                  Aucun résultat trouvé.
                </td>
              </tr>
            ) : (
              paginatedGamers.map((gamer) => (
                <tr key={gamer.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <GamerCard logo={gamer.logo} className="w-12 h-12 rounded-full" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {gamer.nom}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {gamer.pays}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {gamer.sport}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={gamer.status}
                        onChange={() => toggleStatus(gamer.id)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                    </label>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-3">
                      <button className="text-gray-400 hover:text-blue-600">
                        <FiEdit2 size={18} />
                      </button>
                      <button className="text-gray-400 hover:text-red-600">
                        <FiTrash2 size={18} />
                      </button>
                      <button className="text-gray-400 hover:text-gray-700">
                        <FiMoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-gray-600">
          Affichage de 1-{Math.min(currentPage * itemsPerPage, filteredGamers.length)} sur {filteredGamers.length} équipes
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-100"
          >
            ‹
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded-lg ${
                currentPage === i + 1
                  ? 'bg-orange-600 text-white'
                  : 'border border-gray-300 hover:bg-gray-100'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-100"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  )
=======
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
>>>>>>> b164f2a2c928dde807ea3a3e8ef851c0941a4d15
}