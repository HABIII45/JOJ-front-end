import React, { useState, useEffect, useMemo } from "react";
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiEye,
  FiEdit3,
  FiTrash2,
  FiChevronLeft,
  FiChevronRight,
  FiTrendingUp,
  FiClock,
  FiLoader,
} from "react-icons/fi";

import AdminLayout from "../../components/layouts/AdminLayout";
import { getActualites, supprimerActualite } from "../../services/actualite";

// ==========================================
// IMAGES PAR DÉFAUT (SI SANS IMAGE DANS LA BDD)
// ==========================================
const DEFAULT_ARTICLE_IMAGE =
  "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=300&q=80";
const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80";

export default function GestionActualites({ onNavigateToCreate }) {
  // --- ÉTATS DONNÉES ET CHARGEMENT ---
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- ÉTATS DES FILTRES ---
  const [search, setSearch] = useState("");
  const [categorie, setCategorie] = useState("Toutes les catégories");
  const [statut, setStatut] = useState("Tous les statuts");

  // --- CHARGEMENT DYNAMIQUE DEPUIS DJANGO ---
  const chargerActualites = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getActualites();

      // Gestion automatique si Django retourne une pagination (data.results) ou une liste brute
      setArticles(data.results || data);
    } catch (err) {
      setError("Impossible de charger les actualités. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chargerActualites();
  }, []);

  // --- SUPPRESSION D'UN ARTICLE VIA API ---
  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cet article ?")) return;

    try {
      await supprimerActualite(id);
      // Mise à jour instantanée du state local
      setArticles((prev) => prev.filter((art) => art.id !== id));
    } catch (err) {
      alert("Une erreur est survenue lors de la suppression.");
    }
  };

  // --- FILTRAGE EN TEMPS RÉEL (RECHERCHE, CATÉGORIE, STATUT) ---
  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      // Recherche par titre
      const matchSearch = (art.titre || "")
        .toLowerCase()
        .includes(search.toLowerCase());

      // Filtre catégorie (recherche dans l'événement lié ou la catégorie)
      const catName = art.evenement_lie_detail?.nom || art.categorie || "";
      const matchCat =
        categorie === "Toutes les catégories" ||
        catName.toLowerCase() === categorie.toLowerCase();

      // Filtre statut
      const matchStatut =
        statut === "Tous les statuts" ||
        (statut === "Publié" && !art.brouillon) ||
        (statut === "Brouillon" && art.brouillon);

      return matchSearch && matchCat && matchStatut;
    });
  }, [articles, search, categorie, statut]);

  // --- STATISTIQUES DYNAMIQUES ---
  const totalArticles = articles.length;
  const totalPublies = articles.filter((a) => !a.brouillon).length;
  const totalBrouillons = articles.filter((a) => a.brouillon).length;

  return (
    <AdminLayout>
      <main className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full font-sans text-slate-800">
        
        {/* ==========================================
            1. EN-TÊTE DE PAGE + BOUTON NOUVEL ARTICLE
        ========================================== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              Gestion des Actualités
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Rédigez, modérez et publiez les dernières informations des JOJ 2026.
            </p>
          </div>

          <button
            onClick={onNavigateToCreate}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#D9531E] hover:bg-[#c24818] text-white font-semibold text-sm rounded-xl shadow-lg shadow-[#D9531E]/20 hover:shadow-xl hover:shadow-[#D9531E]/30 transition-all active:scale-[0.98]"
          >
            <FiPlus size={18} />
            <span>Publier un article</span>
          </button>
        </div>

        {/* ==========================================
            2. CARTES DE STATISTIQUES DYNAMIQUES
        ========================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="TOTAL ARTICLES"
            value={totalArticles}
            badge="Données en direct"
            badgeColor="text-emerald-600 bg-emerald-50"
            icon={<FiTrendingUp size={14} className="text-emerald-600" />}
          />

          <StatCard
            title="VUES TOTALES"
            value="12.5k"
            badge="+15% vs hier"
            badgeColor="text-emerald-600 bg-emerald-50"
            icon={<FiTrendingUp size={14} className="text-emerald-600" />}
          />

          {/* CARTE ARTICLES PUBLIÉS AVEC BARRE DE PROGRESSION */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                ARTICLES PUBLIÉS
              </span>
              <p className="text-3xl font-extrabold text-slate-900 mt-2">
                {totalPublies}
              </p>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-4 overflow-hidden">
              <div
                className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
                style={{
                  width: `${
                    totalArticles > 0 ? (totalPublies / totalArticles) * 100 : 0
                  }%`,
                }}
              ></div>
            </div>
          </div>

          <StatCard
            title="BROUILLONS"
            value={totalBrouillons}
            badge="En attente de revue"
            badgeColor="text-amber-600 bg-amber-50"
            icon={<FiClock size={14} className="text-amber-600" />}
          />
        </div>

        {/* ==========================================
            3. BARRE DE FILTRES ET RECHERCHE
        ========================================== */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/70 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* Champ Recherche */}
          <div className="flex-1 flex flex-col gap-1.5">
            <label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              Recherche
            </label>
            <div className="relative">
              <FiSearch
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Titre de l'article..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:bg-white focus:border-[#D9531E] transition-all"
              />
            </div>
          </div>

          {/* Filtre par Catégorie */}
          <div className="w-full lg:w-56 flex flex-col gap-1.5">
            <label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              Catégorie
            </label>
            <select
              value={categorie}
              onChange={(e) => setCategorie(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:bg-white focus:border-[#D9531E] transition-all"
            >
              <option>Toutes les catégories</option>
              <option>Communiqué</option>
              <option>Résultats</option>
              <option>Orientation</option>
            </select>
          </div>

          {/* Filtre par Statut */}
          <div className="w-full lg:w-48 flex flex-col gap-1.5">
            <label className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              Statut
            </label>
            <select
              value={statut}
              onChange={(e) => setStatut(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:bg-white focus:border-[#D9531E] transition-all"
            >
              <option>Tous les statuts</option>
              <option>Publié</option>
              <option>Brouillon</option>
            </select>
          </div>

          {/* Bouton Filtrer */}
          <div className="flex items-end">
            <button className="w-full lg:w-auto px-5 py-2.5 bg-black hover:bg-slate-800 text-white font-medium text-sm rounded-xl flex items-center justify-center gap-2 transition-colors">
              <FiFilter size={16} />
              <span>Filtrer</span>
            </button>
          </div>
        </div>

        {/* ==========================================
            4. TABLEAU DU CONTENU DYNAMIQUE
        ========================================== */}
        <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
              <FiLoader className="animate-spin text-[#D9531E]" size={32} />
              <p className="text-sm font-medium">Chargement des actualités...</p>
            </div>
          ) : error ? (
            <div className="py-12 text-center text-red-500 text-sm font-medium">
              {error}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                    <th className="py-4 px-6">Article</th>
                    <th className="py-4 px-4">Catégorie</th>
                    <th className="py-4 px-4">Auteur</th>
                    <th className="py-4 px-4">Date de Publication</th>
                    <th className="py-4 px-4">Statut</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredArticles.length > 0 ? (
                    filteredArticles.map((art) => {
                      // Formatage du nom de l'auteur
                      const authorName =
                        art.auteur_detail?.username ||
                        art.auteur_detail?.first_name ||
                        art.auteur ||
                        "Admin";

                      // Formatage propre de la date ISO provenant de Django
                      const publishedDate = art.date_publication
                        ? new Date(art.date_publication).toLocaleDateString(
                            "fr-FR",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )
                        : "Non programmée";

                      return (
                        <tr
                          key={art.id}
                          className="hover:bg-slate-50/60 transition-colors group"
                        >
                          {/* Article : Image + Titre + Extrait */}
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-4 max-w-md">
                              <img
                                src={art.image || DEFAULT_ARTICLE_IMAGE}
                                alt={art.titre}
                                className="w-16 h-12 rounded-xl object-cover shrink-0 shadow-xs border border-slate-100"
                                onError={(e) => {
                                  e.target.src = DEFAULT_ARTICLE_IMAGE;
                                }}
                              />
                              <div className="min-w-0">
                                <h4 className="font-bold text-slate-800 truncate group-hover:text-[#D9531E] transition-colors">
                                  {art.titre}
                                </h4>
                                <p className="text-xs text-slate-400 mt-0.5 truncate">
                                  {art.description
                                    ? art.description.replace(/<[^>]*>?/gm, "")
                                    : "Aucun aperçu"}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Catégorie */}
                          <td className="py-4 px-4">
                            <CategoryBadge
                              category={
                                art.evenement_lie_detail?.nom ||
                                art.categorie ||
                                "Général"
                              }
                            />
                          </td>

                          {/* Auteur */}
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={art.auteur_detail?.avatar || DEFAULT_AVATAR}
                                alt={authorName}
                                className="w-7 h-7 rounded-full object-cover"
                                onError={(e) => {
                                  e.target.src = DEFAULT_AVATAR;
                                }}
                              />
                              <span className="font-semibold text-slate-700 text-xs">
                                {authorName}
                              </span>
                            </div>
                          </td>

                          {/* Date */}
                          <td className="py-4 px-4 text-xs font-medium text-slate-600">
                            {publishedDate}
                          </td>

                          {/* Statut (Brouillon vs Publié) */}
                          <td className="py-4 px-4">
                            {art.brouillon ? (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-600 border border-amber-200/60 uppercase tracking-wider">
                                Brouillon
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200/60 uppercase tracking-wider">
                                Publié
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-4 px-6 text-right">
                            <div className="inline-flex items-center gap-1 text-slate-400">
                              <button
                                title="Aperçu"
                                className="p-1.5 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                              >
                                <FiEye size={16} />
                              </button>
                              <button
                                title="Modifier"
                                className="p-1.5 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              >
                                <FiEdit3 size={16} />
                              </button>
                              <button
                                title="Supprimer"
                                onClick={() => handleDelete(art.id)}
                                className="p-1.5 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <FiTrash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="py-12 text-center text-slate-400 text-sm"
                      >
                        Aucun article ne correspond à votre recherche.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* PAGINATION */}
          {!loading && !error && filteredArticles.length > 0 && (
            <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-500">
              <div>
                Affichage de{" "}
                <span className="font-bold text-slate-800">
                  1-{filteredArticles.length}
                </span>{" "}
                sur{" "}
                <span className="font-bold text-slate-800">
                  {articles.length}
                </span>{" "}
                articles
              </div>

              <div className="flex items-center gap-1.5">
                <button className="p-2 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 text-slate-400 disabled:opacity-50">
                  <FiChevronLeft size={16} />
                </button>

                <button className="w-8 h-8 rounded-lg bg-[#D9531E] text-white font-bold flex items-center justify-center shadow-xs">
                  1
                </button>

                <button className="p-2 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 text-slate-600">
                  <FiChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </AdminLayout>
  );
}

// ==========================================
// PETITS COMPOSANTS (STAT CARD & BADGE)
// ==========================================

function StatCard({ title, value, badge, badgeColor, icon }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-sm flex flex-col justify-between">
      <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
        {title}
      </span>
      <div className="mt-2 flex items-baseline justify-between">
        <p className="text-3xl font-extrabold text-slate-900">{value}</p>
      </div>
      <div className="mt-3 flex items-center gap-1.5">
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${badgeColor}`}
        >
          {icon}
          {badge}
        </span>
      </div>
    </div>
  );
}

function CategoryBadge({ category }) {
  const styles = {
    Communiqué: "bg-blue-50 text-blue-600 border-blue-200/60",
    Résultats: "bg-orange-50 text-orange-600 border-orange-200/60",
    Orientation: "bg-purple-50 text-purple-600 border-purple-200/60",
  };

  const defaultStyle = "bg-slate-50 text-slate-600 border-slate-200/60";

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${
        styles[category] || defaultStyle
      }`}
    >
      {category}
    </span>
  );
}