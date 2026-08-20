import { useEffect, useMemo, useState } from "react";
import {
  Eye,
  Mail,
  Plus,
  Search,
  ShieldCheck,
  ShieldX,
  Users,
  UserX,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import apiClient, { isBackendConnected } from "../../lib/api";
import UserModal from "../../components/modal/UserModal";
import AdminLayout from "../../components/layouts/AdminLayout";

const LIMITE_PAR_PAGE = 5;

const LIBELLE_PERMISSION = {
  JEUX: "Gestion des Jeux & Compétitions",
  ACTUALITES: "Gestion des Actualités",
  UTILISATEURS: "Gestion des Utilisateurs",
  TOUT: "Toutes les permissions (Superadmin)",
  EVENEMENTS: "Gestion des Événements",
  SITES: "Gestion des Sites",
  BILLETS: "Gestion des Billets",
  PAIEMENTS: "Gestion des Paiements",
  RESULTATS: "Gestion des Résultats",
  NOTIFICATIONS: "Gestion des Notifications",
  DISCIPLINES: "Gestion des Disciplines",
  CATEGORIES: "Gestion des Catégories",
  COMPETITEURS: "Gestion des Compétiteurs",
  ZONES: "Gestion des Zones",
};

const LIBELLE_ROLE = {
  SUPERADMIN: "Super Admin",
  ADMIN: "Administrateur",
};

const UTILISATEURS_DEMO = [
  { id: 1, nom_complet: "Amadou Diop", username: "adiop", email: "a.diop@joj2026.sn", tel: "+221 77 123 45 67", role: "SUPERADMIN", permissions_app: ["TOUT"], is_active: true },
  { id: 2, nom_complet: "Fatou Ndiaye", username: "fndiaye", email: "f.ndiaye@joj2026.sn", tel: "+221 70 987 65 43", role: "ADMIN", permissions_app: ["EVENEMENTS", "ACTUALITES"], is_active: true },
  { id: 3, nom_complet: "Moussa Ba", username: "mba", email: "m.ba@joj2026.sn", tel: "+221 78 456 12 34", role: "ADMIN", permissions_app: ["SITES"], is_active: true },
  { id: 4, nom_complet: "Aïssatou Fall", username: "afall", email: "a.fall@joj2026.sn", tel: "+221 76 321 65 43", role: "ADMIN", permissions_app: ["BILLETS", "PAIEMENTS"], is_active: false },
  { id: 5, nom_complet: "Ibrahima Sarr", username: "isarr", email: "i.sarr@joj2026.sn", tel: "+221 77 654 32 10", role: "ADMIN", permissions_app: ["RESULTATS", "DISCIPLINES"], is_active: true },
  { id: 6, nom_complet: "Coumba Diagne", username: "cdiagne", email: "c.diagne@joj2026.sn", tel: "+221 70 111 22 33", role: "ADMIN", permissions_app: ["NOTIFICATIONS"], is_active: true },
  { id: 7, nom_complet: "Ousmane Mbaye", username: "ombaye", email: "o.mbaye@joj2026.sn", tel: "+221 78 222 33 44", role: "ADMIN", permissions_app: ["EVENEMENTS"], is_active: false },
  { id: 8, nom_complet: "Ndeye Sophie Cissé", username: "ncisse", email: "n.cisse@joj2026.sn", tel: "+221 76 444 55 66", role: "ADMIN", permissions_app: ["SITES", "ACTUALITES"], is_active: true },
];

const STYLE_STATUT = {
  actif: "bg-emerald-100/60 text-emerald-600 font-bold border-transparent",
  suspendu: "bg-red-100/60 text-red-600 font-bold border-transparent",
};

function BadgeStatut({ actif }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] uppercase tracking-wider ${
        STYLE_STATUT[actif ? "actif" : "suspendu"]
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${actif ? "bg-emerald-500" : "bg-red-500"}`} />
      {actif ? "Actif" : "Suspendu"}
    </span>
  );
}

export default function Utilisateurs() {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [popupOuvert, setPopupOuvert] = useState(false);

  const [recherche, setRecherche] = useState("");
  const [filtreRole, setFiltreRole] = useState("TOUS");
  const [filtreStatut, setFiltreStatut] = useState("TOUS");
  const [page, setPage] = useState(1);

  useEffect(() => {
    let actif = true;

    async function charger() {
      setChargement(true);
      try {
        if (!isBackendConnected()) {
          if (actif) setUtilisateurs(UTILISATEURS_DEMO);
          return;
        }
        const liste = await apiClient
          .get("/api/utilisateurs/utilisateurs/")
          .then((r) => r.data);
        if (!actif) return;
        setUtilisateurs(liste || []);
      } catch (erreur) {
        if (actif) setUtilisateurs(UTILISATEURS_DEMO);
      } finally {
        if (actif) setChargement(false);
      }
    }

    charger();
    return () => {
      actif = false;
    };
  }, []);

  const listesFiltrees = useMemo(() => {
    const q = recherche.trim().toLowerCase();
    return utilisateurs.filter((u) => {
      if (q) {
        const cible = `${u.nom_complet || ""} ${u.email || ""} ${u.username || ""}`.toLowerCase();
        if (!cible.includes(q)) return false;
      }
      if (filtreRole !== "TOUS" && u.role !== filtreRole) return false;
      if (filtreStatut === "ACTIF" && !u.is_active) return false;
      if (filtreStatut === "SUSPENDU" && u.is_active) return false;
      return true;
    });
  }, [utilisateurs, recherche, filtreRole, filtreStatut]);

  const nbPages = Math.max(1, Math.ceil(listesFiltrees.length / LIMITE_PAR_PAGE));
  const pageCourante = Math.min(page, nbPages);
  const debut = (pageCourante - 1) * LIMITE_PAR_PAGE;
  const visibles = listesFiltrees.slice(debut, debut + LIMITE_PAR_PAGE);

  const stats = useMemo(() => {
    const total = utilisateurs.length;
    const superadmins = utilisateurs.filter((u) => u.role === "SUPERADMIN").length;
    const actifs = utilisateurs.filter((u) => u.is_active).length;
    const suspendus = total - actifs;
    return { total, superadmins, actifs, suspendus };
  }, [utilisateurs]);

  function onAdminCree(nouvel) {
    setUtilisateurs((avant) => [nouvel, ...avant]);
  }

  async function basculerStatut(u) {
    const suspendre = u.is_active;
    try {
      if (isBackendConnected()) {
        const url = suspendre
          ? `/api/utilisateurs/revoquer-acces/${u.id}/`
          : `/api/utilisateurs/reactiver-acces/${u.id}/`;
        await apiClient.post(url);
      }
      setUtilisateurs((avant) =>
        avant.map((x) => (x.id === u.id ? { ...x, is_active: !x.is_active } : x))
      );
    } catch (erreur) {
      setUtilisateurs((avant) =>
        avant.map((x) => (x.id === u.id ? { ...x, is_active: !x.is_active } : x))
      );
    }
  }

  return (
    <AdminLayout>
    <div className="space-y-6">
      {/* --- En-tête --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
            Gestion des Utilisateurs
          </h1>
          <p className="text-gray-400 text-xs md:text-sm font-medium mt-1">
            Administrez les accès du personnel et des super administrateurs.
          </p>
        </div>
        <button
          onClick={() => setPopupOuvert(true)}
          className="inline-flex items-center justify-center gap-2 bg-[#D96B27] hover:bg-[#c25b1e] text-white rounded-2xl px-6 py-3.5 text-xs font-bold transition-colors shadow-sm shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          Ajouter un administrateur
        </button>
      </div>

      {/* --- Cartes statistiques --- */}
      <div className="grid gap-6 sm:grid-cols-3">
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100/50 flex items-center gap-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-500">
            <Users size={24} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Total Utilisateurs
            </p>
            <p className="font-display text-2xl font-extrabold text-gray-900 mt-1">
              {stats.total}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100/50 flex items-center gap-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <ShieldCheck size={24} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Administrateurs Actifs
            </p>
            <p className="font-display text-2xl font-extrabold text-gray-900 mt-1">
              {stats.actifs}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100/50 flex items-center gap-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <UserX size={24} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Comptes Suspendus
            </p>
            <p className="font-display text-2xl font-extrabold text-gray-900 mt-1">
              {stats.suspendus}
            </p>
          </div>
        </div>
      </div>

      {/* --- Barre de filtres --- */}
      <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-gray-100/50">
        <div className="grid gap-4 md:grid-cols-3 items-end">
          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-gray-400">
              RECHERCHE
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
                placeholder="Nom ou email…"
                className="w-full rounded-2xl bg-[#F8FAFC] py-3 pl-10 pr-4 text-xs font-medium text-gray-700 outline-none placeholder:text-gray-400 border border-transparent focus:border-gray-200"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-gray-400">
              RÔLE
            </label>
            <select
              value={filtreRole}
              onChange={(e) => {
                setFiltreRole(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-2xl bg-[#F8FAFC] py-3 px-4 text-xs font-medium text-gray-700 outline-none border border-transparent focus:border-gray-200 cursor-pointer"
            >
              <option value="TOUS">Tous les rôles</option>
              <option value="SUPERADMIN">Super Admin</option>
              <option value="ADMIN">Administrateur</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-gray-400">
              STATUT
            </label>
            <select
              value={filtreStatut}
              onChange={(e) => {
                setFiltreStatut(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-2xl bg-[#F8FAFC] py-3 px-4 text-xs font-medium text-gray-700 outline-none border border-transparent focus:border-gray-200 cursor-pointer"
            >
              <option value="TOUS">Tous les statuts</option>
              <option value="ACTIF">Actif</option>
              <option value="SUSPENDU">Suspendu</option>
            </select>
          </div>
        </div>
      </div>

      {/* --- Tableau --- */}
      <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-gray-100 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                <th className="pb-4 pt-2 px-4">UTILISATEUR</th>
                <th className="pb-4 pt-2 px-4">CONTACT</th>
                <th className="pb-4 pt-2 px-4">RÔLE</th>
                <th className="pb-4 pt-2 px-4">PERMISSIONS</th>
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
                    Aucun utilisateur ne correspond aux filtres choisis.
                  </td>
                </tr>
              )}

              {!chargement &&
                visibles.map((u) => {
                  const initiales = (u.nom_complet || u.username || "?")
                    .split(" ")
                    .map((p) => p[0])
                    .filter(Boolean)
                    .slice(0, 2)
                    .join("")
                    .toUpperCase();
                  const estSuper = u.role === "SUPERADMIN";

                  return (
                    <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-4 font-bold text-gray-900">
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-orange-100/60 font-bold text-[#D96B27]">
                            {initiales}
                          </span>
                          <div>
                            <div className="font-bold text-gray-900 leading-tight">
                              {u.nom_complet || u.username}
                            </div>
                            <div className="text-[10px] text-gray-400 font-normal">@{u.username}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 font-semibold text-gray-600">
                        <div className="inline-flex items-center gap-1.5">
                          <Mail size={13} className="text-gray-400" />
                          {u.email}
                        </div>
                        {u.tel && (
                          <div className="text-[10px] text-gray-400 font-normal mt-0.5">{u.tel}</div>
                        )}
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-wider ${
                            estSuper
                              ? "bg-orange-100/60 text-[#D96B27]"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {estSuper ? <ShieldCheck size={12} /> : null}
                          {LIBELLE_ROLE[u.role] || u.role}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1">
                          {(u.permissions_app || []).slice(0, 2).map((p) => (
                            <span
                              key={p}
                              className="rounded-lg bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600"
                            >
                              {LIBELLE_PERMISSION[p] || p}
                            </span>
                          ))}
                          {(u.permissions_app || []).length > 2 && (
                            <span className="rounded-lg bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-400">
                              +{(u.permissions_app || []).length - 2}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <BadgeStatut actif={u.is_active} />
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end gap-1 text-gray-400">
                          <button
                            className="p-1.5 hover:text-gray-700 transition-colors cursor-pointer"
                            title="Voir le profil"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => basculerStatut(u)}
                            disabled={estSuper}
                            className={`p-1.5 transition-colors cursor-pointer ${
                              estSuper
                                ? "cursor-not-allowed opacity-30"
                                : u.is_active
                                ? "hover:text-red-500"
                                : "hover:text-emerald-600"
                            }`}
                            title={
                              estSuper
                                ? "Un Super Admin ne peut pas être suspendu"
                                : u.is_active
                                ? "Suspendre l'accès"
                                : "Réactiver l'accès"
                            }
                          >
                            {u.is_active ? <ShieldX size={15} /> : <ShieldCheck size={15} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {/* --- Pagination --- */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-100/60 mt-2">
          <p className="text-xs text-gray-400 font-medium">
            Affichage de{" "}
            <span className="font-bold text-gray-700">
              {listesFiltrees.length === 0 ? 0 : debut + 1}–{Math.min(debut + LIMITE_PAR_PAGE, listesFiltrees.length)}
            </span>{" "}
            sur <span className="font-bold text-gray-700">{listesFiltrees.length}</span>{" "}
            utilisateurs
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

      {/* --- Modale --- */}
      <UserModal
        ouvert={popupOuvert}
        fermer={() => setPopupOuvert(false)}
        onCree={onAdminCree}
      />
    </div>
    </AdminLayout>
  );
}