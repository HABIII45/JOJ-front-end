import api from "./api";

// ── Récupérer la liste des événements (paginée + filtres) ─────────────────────
export async function getEvents(params = {}) {
  const response = await api.get("/api/events/", { params });
  return response.data; // { count, next, previous, results: [...] }
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

// ── Récupérer les sites ───────────────────────────────────────────────────────
export async function getSites() {
  try {
    const response = await api.get("/api/sites/?page_size=100");
    const data = response.data;
    return Array.isArray(data) ? data : data.results ?? [];
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

// ── Créer un événement ────────────────────────────────────────────────────────
export async function createEvent(eventData) {
  const response = await api.post("/api/events/", eventData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}
