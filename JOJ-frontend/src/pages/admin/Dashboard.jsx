import React, { useState } from "react";
import { Plus, Trophy, Wallet, MapPin, FileText } from "lucide-react";
import AdminLayout from "../../components/layouts/AdminLayout";
import { Sidebar } from "../../components/layout/Sidebar";
import { KpiCard } from "../../components/admin/KpiCard";
import { VentesChart } from "../../components/admin/VentesChart";
import { ActivitesCard } from "../../components/admin/ActivitesCard";
import { useAdminData } from "../../hooks/useAdminData";

export default function Dashboard() {
  const { chargement, kpi, ventes, activites } = useAdminData();
  const [creerOuvert, setCreerOuvert] = useState(false);

  if (chargement) {
    return (
      <Sidebar>
        <div className="min-h-[60vh] flex items-center justify-center text-gray-400">
          Chargement des données en temps réel...
        </div>
      </Sidebar>
    );
  }

  // Formatage personnalisé conforme à la maquette : 15.420.000
  const formatFcfaPoint = (n) => {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <AdminLayout>
      {/* Titre et Bouton d'Action */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
            Bienvenue sur votre Dashboard
          </h1>
          <p className="text-gray-500 text-xs mt-1">
            Voici les statistiques clés de JOJ Events en temps réel.
          </p>
        </div>
        <button
          onClick={() => setCreerOuvert(!creerOuvert)}
          className="inline-flex items-center gap-2 bg-[#C25B1E] hover:bg-[#A04816] text-white rounded-full px-5 py-2.5 text-xs font-bold transition-all shadow-sm active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Créer un événement
        </button>
      </div>

      {/* Grid des cartes KPI */}
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
          variation="Stable"
          variante="bleu"
        />
        <KpiCard
          icone={<FileText className="w-5 h-5" />}
          libelle="Actualités Publiées"
          valeur={String(kpi.actualitesPubliees)}
          variation="+5 aujourd'hui"
          variante="gris"
        />
      </div>

      {/* Grid Graphique + Activités */}
      <div className="grid xl:grid-cols-[1.5fr_1fr] gap-6">
        <VentesChart data={ventes} />
        <ActivitesCard activites={activites} />
      </div>
    </AdminLayout>
  );
}