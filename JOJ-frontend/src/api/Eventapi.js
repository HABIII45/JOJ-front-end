import api from "./api";

// ── Récupérer la liste des événements (paginée + filtres) ─────────────────────
export async function getEvents(params = {}) {
  const response = await api.get("/api/events/", { params });
  return response.data; // { count, next, previous, results: [...] }
}

/** Parcourt toutes les pages pour récupérer chaque événement avec son image. */
export async function getAllEvents() {
  try {
    let tous = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await api.get("/api/events/", {
        params: { page, page_size: 100 },
      });
      const data = response.data;
      const results = Array.isArray(data) ? data : data.results ?? [];
      tous = tous.concat(results);
      if (!data?.next || results.length === 0) {
        hasMore = false;
      } else {
        page += 1;
      }
    }
    return tous;
  } catch (err) {
    console.error("Erreur lors du chargement des événements:", err);
    return [];
  }
}

// ── Récupérer un événement spécifique ─────────────────────────────────────────
export async function getEventDetail(id) {
  const response = await api.get(`/api/events/${id}/`);
  return response.data;
}

// ── Récupérer les catégories ──────────────────────────────────────────────────
export async function getCategories() {
  try {
    const response = await api.get("/api/disciplines/");
    const data = response.data;
    return Array.isArray(data) ? data : data.results ?? [];
  } catch {
    return [];
  }
}

// ── Récupérer tous les sites (parcourt toutes les pages) ──────────────────────
export async function getSites() {
  try {
    let allSites = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await api.get("/api/sites/", { params: { page } });
      const data = response.data;
      const results = Array.isArray(data) ? data : data.results ?? [];
      allSites = allSites.concat(results);
      if (!data.next || results.length === 0) {
        hasMore = false;
      } else {
        page += 1;
      }
    }
    return allSites;
  } catch {
    return [];
  }
}

// ── Récupérer les compétiteurs (équipes + joueurs) ───────────────────────────
export async function getCompetiteurs() {
  try {
    const [equipes, joueurs] = await Promise.allSettled([
      api.get("/api/equipes/?page_size=100"),
      api.get("/api/joueurs/?page_size=100"),
    ]);
    const eqList = equipes.status === "fulfilled" ? (Array.isArray(equipes.value.data) ? equipes.value.data : equipes.value.data.results ?? []) : [];
    const joList = joueurs.status === "fulfilled" ? (Array.isArray(joueurs.value.data) ? joueurs.value.data : joueurs.value.data.results ?? []) : [];
    return [...eqList, ...joList];
  } catch {
    return [];
  }
}

export async function getActualites() {
  const response = await api.get("/api/actualites/");
  return response.data;
}

export async function getActualite(id) {
  const response = await api.get(`/api/actualites/${id}/`);
  return response.data;
}

// ── Créer un événement ────────────────────────────────────────────────────────
export async function createEvent(eventData) {
  const response = await api.post("/api/events/", eventData);
  return response.data;
}
