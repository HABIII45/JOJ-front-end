import React from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trophy, Wallet, MapPin, FileText } from "lucide-react";
import AdminLayout from "../../components/layouts/AdminLayout";
import { KpiCard } from "../../components/admin/KpiCard";
import { VentesChart } from "../../components/admin/VentesChart";
import { ActivitesCard } from "../../components/admin/ActivitesCard";
import { useAdminData } from "../../hooks/useAdminData";
import { useAuth } from "../../contexts/useAuth";
import { isSuperAdmin, hasPermission, PERMISSIONS } from "../../utils/permissions";

export default function Dashboard() {
  const navigate = useNavigate();
  const { utilisateur } = useAuth();
  const { chargement, kpi, ventes, activites, toutesActivites } = useAdminData();

  const superAdmin = isSuperAdmin(utilisateur);
  const peutCreerEvenement = superAdmin || hasPermission(utilisateur, PERMISSIONS.EVENEMENTS);

  if (chargement) {
    return (
      <AdminLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-gray-400">
          <span className="w-8 h-8 border-3 border-[#C25B1E] border-t-transparent rounded-full animate-spin"></span>
          <span className="text-sm font-medium">Chargement des données du backend en temps réel…</span>
        </div>
      </AdminLayout>
    );
  }

  // Formatage des montants : 15.420.000 FCFA
  const formatFcfaPoint = (n) => {
    if (n == null || isNaN(n)) return "0";
    return Number(n).toLocaleString("fr-FR");
  };

  return (
    <AdminLayout>
      {/* Titre et Bouton d'Action conditionné aux droits d'accès */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
            Tableau de Bord JOJ 2026
          </h1>
          <p className="text-gray-500 text-xs mt-1">
            Indicateurs de performance, statistiques et activités en temps réel synchronisés avec le backend.
          </p>
        </div>

       
      </div>

      {/* Grid des cartes KPI dynamiques */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
        <KpiCard
          icone={<Trophy className="w-5 h-5" />}
          libelle="Total Événements"
          valeur={String(kpi.totalEvenements)}
          variation={kpi.variationEvenements}
          variante="rose"
        />
        <KpiCard
          icone={<Wallet className="w-5 h-5" />}
          libelle="Revenus Billets (FCFA)"
          valeur={formatFcfaPoint(kpi.revenusBillets)}
          variation={kpi.variationRevenus}
          variante="orange"
        />
        <KpiCard
          icone={<MapPin className="w-5 h-5" />}
          libelle="Sites Actifs"
          valeur={String(kpi.sitesActifs)}
          variation="En direct"
          variante="bleu"
        />
        <KpiCard
          icone={<FileText className="w-5 h-5" />}
          libelle="Compétitions / Résultats"
          valeur={String(kpi.actualitesPubliees)}
          variation="En direct"
          variante="gris"
        />
      </div>

      {/* Grid Graphique + Activités */}
      <div className="grid xl:grid-cols-[1.5fr_1fr] gap-6">
        <VentesChart data={ventes} />
        <ActivitesCard activites={activites} toutesActivites={toutesActivites} />
      </div>
    </AdminLayout>
  );
}