import { useEffect, useState } from "react";
import {
  actualitesService,
  disciplinesService,
  evenementsService,
  isBackendConnected,
  sitesService,
} from "../lib/api";
import {
  actualitesDemo,
  disciplinesDemo,
  evenementsDemo,
  sitesDemo,
} from "../lib/demoData";

const ETAT_INITIAL = {
  chargement: true,
  evenements: [],
  sites: [],
  disciplines: [],
  actualites: [],
  source: "demo",
};

/**
 * Normalise et extrait un Tableau pur depuis le résultat de la requête.
 * Gère les cas : Tableau brut, pagination DRF ({ results: [] }), Axios ({ data: [] }).
 * @param {PromiseSettledResult<any>} result
 * @param {any[]} fallback
 * @returns {any[]}
 */
function unwrap(result, fallback) {
  if (result.status !== "fulfilled" || !result.value) {
    return fallback;
  }

  const val = result.value;

  // 1. Si c'est déjà un tableau
  if (Array.isArray(val)) {
    return val.length > 0 ? val : fallback;
  }

  // 2. Si c'est une pagination Django REST Framework (ex: { results: [...] })
  if (Array.isArray(val.results)) {
    return val.results.length > 0 ? val.results : fallback;
  }

  // 3. Si c'est un wrapper Axios (ex: { data: [...] })
  if (Array.isArray(val.data)) {
    return val.data.length > 0 ? val.data : fallback;
  }

  // 4. Si c'est un wrapper Axios + DRF (ex: { data: { results: [...] } })
  if (val.data && Array.isArray(val.data.results)) {
    return val.data.results.length > 0 ? val.data.results : fallback;
  }

  return fallback;
}

/**
 * Retourne les données de la page d'accueil (mode API ou démo).
 * @returns {{ chargement: boolean, evenements: any[], sites: any[], disciplines: any[], actualites: any[], source: string }}
 */
export function useHomeData() {
  const [data, setData] = useState(ETAT_INITIAL);

  useEffect(() => {
    let ignore = false;

    if (!isBackendConnected()) {
      // Mode démo : données immédiates
      setData({
        chargement: false,
        evenements: evenementsDemo,
        sites: sitesDemo,
        disciplines: disciplinesDemo,
        actualites: actualitesDemo,
        source: "demo",
      });
      return;
    }

    // Mode API : requêtes parallèles
    Promise.allSettled([
      evenementsService.lister(),
      sitesService.lister(),
      disciplinesService.lister(),
      actualitesService.lister(),
    ]).then(([ev, sites, disc, act]) => {
      if (ignore) return;

      setData({
        chargement: false,
        evenements: unwrap(ev, evenementsDemo),
        sites: unwrap(sites, sitesDemo),
        disciplines: unwrap(disc, disciplinesDemo),
        actualites: unwrap(act, actualitesDemo),
        source: "api",
      });
    });

    return () => {
      ignore = true;
    };
  }, []);

  return data;
}