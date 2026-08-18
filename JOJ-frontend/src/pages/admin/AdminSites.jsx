import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Eye,
  Filter,
  Pencil,
  Search,
  Trash2,
  Users,
  MapPinned,
  Landmark,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import apiClient, { isBackendConnected } from "../../lib/api";
import AdminLayout from "../../components/layouts/AdminLayout";

const LIMITE_PAR_PAGE = 5;

function statutSite(site, nbCompetitions) {
  if (nbCompetitions > 0) return "OPERATIONNEL";
  return "A_VENIR";
}

const STYLE_STATUT = {
  OPERATIONNEL: "bg-emerald-100/60 text-emerald-600 font-bold",
  MAINTENANCE: "bg-amber-100/60 text-amber-600 font-bold",
  A_VENIR: "bg-blue-100/60 text-blue-600 font-bold",
};

const LIBELLE_STATUT = {
  OPERATIONNEL: "OPÉRATIONNEL",
  MAINTENANCE: "MAINTENANCE",
  A_VENIR: "À VENIR",
};

const IMAGES_DEMO = {
  1: "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=120&q=80",
  2: "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=120&q=80",
  3: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=120&q=80",
  4: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=120&q=80",
  5: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=120&q=80",
};

const COMPETITIONS_DEMO = { 1: 12, 2: 8, 3: 15, 4: 6, 5: 10 };

export default function SitesGestion() {
  const navigate = useNavigate();

  const [sites, setSites] = useState([]);
  const [chargement, setChargement] = useState(true);

  const [recherche, setRecherche] = useState("");
  const [filtreVille, setFiltreVille] = useState("TOUTES");
  const [filtreCapacite, setFiltreCapacite] = useState("TOUTES");
  const [page, setPage] = useState(1);

  useEffect(() => {
    let actif = true;

    const charger = async () => {
      setChargement(true);
      try {
        const estConnecte = typeof isBackendConnected === "function" ? isBackendConnected() : false;

        if (!estConnecte) {
          if (actif) setSites(sitesDemoCompletes());
          return;
        }

        const response = await apiClient.get("/api/sites/");
        const liste = response?.data;
        
        if (!liste || !Array.isArray(liste) || liste.length === 0) {
          if (actif) setSites(sitesDemoCompletes());
          return;
        }

        if (!actif) return;

        let nbParSite = {};
        try {
          const evenements = await apiClient.get("/api/events/").then((r) => r.data);
          if (Array.isArray(evenements)) {
            evenements.forEach((ev) => {
              const siteId = ev.site?.id ?? ev.site;
              if (siteId) nbParSite[siteId] = (nbParSite[siteId] || 0) + 1;
            });
          }
        } catch (_) {}

        setSites(
          liste.map((s) => ({
            ...s,
            _nbCompetitions: nbParSite[s.id] || 0,
            _statut: statutSite(s, nbParSite[s.id] || 0),
          }))
        );
      } catch (erreur) {
        if (!actif) return;
        console.warn("API indisponible, chargement des données de démo...", erreur);
        setSites(sitesDemoCompletes());
      } finally {
        if (actif) setChargement(false);
      }
    };

    charger();
    return () => {
      actif = false;
    };
  }, []);

  const villes = useMemo(
    () => [
      "TOUTES",
      ...Array.from(new Set(sites.map((s) => s.ville).filter(Boolean))),
    ],
    [sites]
  );

  const sitesFiltres = useMemo(() => {
    const q = recherche.trim().toLowerCase();
    return sites.filter((s) => {
      if (q && !s.nom?.toLowerCase().includes(q)) return false;
      if (filtreVille !== "TOUTES" && s.ville !== filtreVille) return false;
      if (filtreCapacite === "MOINS_5000" && s.capacite >= 5000) return false;
      if (
        filtreCapacite === "5000_20000" &&
        (s.capacite < 5000 || s.capacite > 20000)
      )
        return false;
      if (filtreCapacite === "PLUS_20000" && s.capacite <= 20000) return false;
      return true;
    });
  }, [sites, recherche, filtreVille, filtreCapacite]);

  const nbPages = Math.max(1, Math.ceil(sitesFiltres.length / LIMITE_PAR_PAGE));
  const pageCourante = Math.min(page, nbPages);
  const debut = (pageCourante - 1) * LIMITE_PAR_PAGE;
  const visibles = sitesFiltres.slice(debut, debut + LIMITE_PAR_PAGE);

  const stats = useMemo(() => {
    const total = sites.length;
    const operationnels = sites.filter(
      (s) => (s._statut || statutSite(s, s._nbCompetitions || 0)) === "OPERATIONNEL"
    ).length;
    const capaciteTotale = sites.reduce((acc, s) => acc + (s.capacite || 0), 0);
    const villesHotes = new Set(sites.map((s) => s.ville).filter(Boolean)).size;
    return { total, operationnels, capaciteTotale, villesHotes };
  }, [sites]);

  async function supprimerSite(site) {
    if (
      !window.confirm(
        `Supprimer le site « ${site.nom} » ? Cette action est irréversible.`
      )
    )
      return;

    try {
      if (typeof isBackendConnected === "function" && isBackendConnected()) {
        await apiClient.delete(`/api/sites/${site.id}/`);
      }
      setSites((avant) => avant.filter((s) => s.id !== site.id));
    } catch (erreur) {
      console.error("Erreur lors de la suppression du site", erreur);
      setSites((avant) => avant.filter((s) => s.id !== site.id));
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 1. En-tête */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              Gestion des Sites Olympiques
            </h1>
            <p className="text-gray-400 text-xs md:text-sm font-medium mt-1">
              Supervisez les infrastructures et la logistique des sites de compétition.
            </p>
          </div>
          <button
            onClick={() => navigate("/admin/sites/nouveau")}
            className="inline-flex items-center justify-center gap-2 bg-[#D96B27] hover:bg-[#c25b1e] text-white rounded-2xl px-6 py-3.5 text-xs font-bold transition-colors shadow-sm shrink-0 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            Ajouter un site
          </button>
        </div>

        {/* 2. Cartes statistiques */}
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100/50 flex items-center gap-5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-50/80 text-amber-700">
              <Building2 size={24} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Sites Opérationnels
              </p>
              <p className="font-display text-2xl font-extrabold text-gray-900 mt-1">
                {stats.operationnels} <span className="text-gray-300 font-medium">/ {stats.total}</span>
              </p>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100/50 flex items-center gap-5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-500">
              <Users size={24} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Capacité Totale
              </p>
              <p className="font-display text-2xl font-extrabold text-gray-900 mt-1">
                {stats.capaciteTotale.toLocaleString("fr-FR")}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100/50 flex items-center gap-5">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500">
              <Landmark size={24} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Villes Hôtes
              </p>
              <p className="font-display text-2xl font-extrabold text-gray-900 mt-1">
                {stats.villesHotes}
              </p>
            </div>
          </div>
        </div>

        {/* 3. Carte de Filtres */}
        <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-gray-100/50">
          <div className="grid gap-4 md:grid-cols-4 items-end">
            <div>
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                NOM DU SITE
              </label>
              <div className="relative">
                <Search
                  size={14}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={recherche}
                  onChange={(e) => {
                    setRecherche(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Ex: Arena..."
                  className="w-full rounded-2xl bg-[#F8FAFC] py-3 pl-10 pr-4 text-xs font-medium text-gray-700 outline-none placeholder:text-gray-400 border border-transparent focus:border-gray-200"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                FILTRER PAR VILLE
              </label>
              <select
                value={filtreVille}
                onChange={(e) => setFiltreVille(e.target.value)}
                className="w-full rounded-2xl bg-[#F8FAFC] py-3 px-4 text-xs font-medium text-gray-700 outline-none border border-transparent focus:border-gray-200 cursor-pointer"
              >
                {villes.map((v) => (
                  <option key={v} value={v}>
                    {v === "TOUTES" ? "Toutes les villes" : v}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                CAPACITÉ
              </label>
              <select
                value={filtreCapacite}
                onChange={(e) => setFiltreCapacite(e.target.value)}
                className="w-full rounded-2xl bg-[#F8FAFC] py-3 px-4 text-xs font-medium text-gray-700 outline-none border border-transparent focus:border-gray-200 cursor-pointer"
              >
                <option value="TOUTES">Toutes capacités</option>
                <option value="MOINS_5000">Moins de 5 000</option>
                <option value="5000_20000">5 000 — 20 000</option>
                <option value="PLUS_20000">Plus de 20 000</option>
              </select>
            </div>

            <div>
              <button
                onClick={() => setPage(1)}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-black py-3 px-4 text-xs font-bold text-white transition hover:bg-gray-800 cursor-pointer"
              >
                <Filter size={14} />
                Appliquer les filtres
              </button>
            </div>
          </div>
        </div>

        {/* 4. Tableau Principale */}
        <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-gray-100 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  <th className="pb-4 pt-2 px-4">SITE OLYMPIQUE</th>
                  <th className="pb-4 pt-2 px-4">VILLE</th>
                  <th className="pb-4 pt-2 px-4">CAPACITÉ</th>
                  <th className="pb-4 pt-2 px-4">ÉVÉNEMENTS</th>
                  <th className="pb-4 pt-2 px-4">STATUT</th>
                  <th className="pb-4 pt-2 px-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {chargement &&
                  Array.from({ length: LIMITE_PAR_PAGE }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={6} className="py-6 px-4">
                        <div className="h-4 w-3/4 animate-pulse rounded bg-gray-100" />
                      </td>
                    </tr>
                  ))}

                {!chargement && visibles.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-400">
                      Aucun site ne correspond aux filtres choisis.
                    </td>
                  </tr>
                )}

                {!chargement &&
                  visibles.map((site) => {
                    const statut =
                      site._statut || statutSite(site, site._nbCompetitions || 0);
                    const nbComp =
                      site._nbCompetitions ?? COMPETITIONS_DEMO[site.id] ?? 0;
                    const image =
                      site.image || IMAGES_DEMO[site.id % 6] || IMAGES_DEMO[1];

                    return (
                      <tr key={site.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={image}
                              alt={site.nom}
                              className="h-10 w-14 rounded-lg object-cover shrink-0"
                            />
                            <div>
                              <p className="font-bold text-gray-900 leading-tight">
                                {site.nom}
                              </p>
                              <p className="text-[10px] text-gray-400 mt-0.5">
                                {site.service || site.description || "Site olympique"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4 font-semibold text-gray-600">
                          <span className="inline-flex items-center gap-1.5">
                            <MapPinned size={13} className="text-gray-400" />
                            {site.ville || "—"}
                          </span>
                        </td>

                        <td className="py-4 px-4">
                          <p className="font-bold text-gray-900 leading-tight">
                            {(site.capacite || 0).toLocaleString("fr-FR")}
                          </p>
                          <p className="text-[10px] text-gray-400">places</p>
                        </td>

                        <td className="py-4 px-4">
                          <span className="inline-flex items-center gap-2 text-gray-600 font-medium">
                            <span className="flex h-6 min-w-6 items-center justify-center rounded-md bg-gray-100 font-bold text-gray-800 text-[11px]">
                              {nbComp}
                            </span>
                            compétitions
                          </span>
                        </td>

                        <td className="py-4 px-4">
                          <span
                            className={`inline-block rounded-full px-3 py-1 text-[9px] uppercase tracking-wider ${
                              STYLE_STATUT[statut] || STYLE_STATUT.A_VENIR
                            }`}
                          >
                            {LIBELLE_STATUT[statut] || "À VENIR"}
                          </span>
                        </td>

                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end gap-1.5 text-gray-400">
                            <button
                              onClick={() => navigate(`/sites/${site.id}`)}
                              className="p-1.5 hover:text-gray-700 transition-colors cursor-pointer"
                            >
                              <Eye size={15} />
                            </button>
                            <button
                              onClick={() => navigate(`/sites/${site.id}/modifier`)}
                              className="p-1.5 hover:text-gray-700 transition-colors cursor-pointer"
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              onClick={() => supprimerSite(site)}
                              className="p-1.5 hover:text-red-500 transition-colors cursor-pointer"
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
          <div className="flex items-center justify-between pt-6 border-t border-gray-100/60 mt-2">
            <p className="text-xs text-gray-400 font-medium">
              Affichage de <span className="font-bold text-gray-700">{sitesFiltres.length === 0 ? 0 : debut + 1}–{Math.min(debut + LIMITE_PAR_PAGE, sitesFiltres.length)}</span> sur <span className="font-bold text-gray-700">{sitesFiltres.length}</span> sites olympiques
            </p>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={pageCourante <= 1}
                className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-50 disabled:opacity-30 cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>
              
              {Array.from({ length: nbPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-8 h-8 rounded-full text-xs font-bold transition cursor-pointer ${
                    pageCourante === i + 1
                      ? "bg-[#D96B27] text-white"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => setPage((p) => Math.min(nbPages, p + 1))}
                disabled={pageCourante >= nbPages}
                className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-50 disabled:opacity-30 cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function sitesDemoCompletes() {
  const base = [
    { id: 1, nom: "Dakar Arena", ville: "Diamniadio", capacite: 15000, description: "Complexe multi-sports de classe mondiale", image: IMAGES_DEMO[2] },
    { id: 2, nom: "Stade Abdoulaye Wade", ville: "Diamniadio", capacite: 50000, description: "Stade National Olympique", image: IMAGES_DEMO[1] },
    { id: 3, nom: "Piscine Olympique Dakar", ville: "Dakar", capacite: 3500, description: "Centre Aquatique National", image: IMAGES_DEMO[3], _statut: "MAINTENANCE" },
    { id: 4, nom: "Arène de Plage Saly", ville: "Saly", capacite: 2000, description: "Site pour sports nautiques et plage", image: IMAGES_DEMO[4], _statut: "A_VENIR" },
    { id: 5, nom: "Stade Iba Mar Diop", ville: "Dakar", capacite: 5000, description: "Stadium couvert historique", image: IMAGES_DEMO[5] },
  ];
  return base.map((s) => ({
    ...s,
    _nbCompetitions: COMPETITIONS_DEMO[s.id] || Math.floor(Math.random() * 14) + 2,
  }));
}