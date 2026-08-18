import { useEffect, useState } from "react";
import { authService, dashboardService, isBackendConnected } from "../lib/api";
import { activitesDemo, adminDemo, kpiDemo, ventesMensuellesDemo } from "../lib/demoData";

function libelleIlYa(dateISO) {
  if (!dateISO) return "";
  const diffMin = Math.floor((Date.now() - new Date(dateISO).getTime()) / 60000);
  if (diffMin < 0) return "À venir";
  if (diffMin < 1) return "À L'INSTANT";
  if (diffMin < 60) return `IL Y A ${diffMin} MIN`;
  const heures = Math.floor(diffMin / 60);
  if (heures < 24) return `IL Y A ${heures} H`;
  const jours = Math.floor(heures / 24);
  return `IL Y A ${jours} J`;
}

export function useAdminData() {
  const [data, setData] = useState({
    chargement: true,
    kpi: kpiDemo,
    ventes: ventesMensuellesDemo,
    activites: activitesDemo,
    utilisateur: null,
    source: "demo",
  });

  useEffect(() => {
    let actif = true;

    if (!isBackendConnected()) {
      setData({
        chargement: false,
        kpi: kpiDemo,
        ventes: ventesMensuellesDemo,
        activites: activitesDemo,
        utilisateur: adminDemo,
        source: "demo",
      });
      return;
    }

    // Capture des requêtes sans faire crasher l'application si l'API renvoie 404/401
    Promise.all([
      authService.profil().catch(() => null),
      dashboardService.kpis().catch(() => null),
      dashboardService.activites().catch(() => null),
    ]).then(([profil, kpis, activitesBrutes]) => {
      if (!actif) return;

      // Si l'API activités renvoie des données réelles, on les formates, sinon on prend activitesDemo
      const activites = Array.isArray(activitesBrutes) && activitesBrutes.length > 0
        ? activitesBrutes.map((a) => ({ ...a, ilYA: libelleIlYa(a.date) }))
        : activitesDemo;

      setData({
        chargement: false,
        source: "api",
        utilisateur: profil || adminDemo,
        // Fallback sur ventesMensuellesDemo pour que le graphique contienne toujours des points
        ventes: ventesMensuellesDemo, 
        activites,
        kpi: kpis || kpiDemo,
      });
    });

    return () => {
      actif = false;
    };
  }, []);

  return data;
}