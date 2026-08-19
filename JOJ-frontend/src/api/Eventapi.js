const API_URL = "http://127.0.0.1:8000/api";

// ── Récupérer la liste des événements (paginée + filtres) ─────────────────────
export async function getEvents(params = {}) {
  const queryParams = new URLSearchParams();

  if (params.recherche) queryParams.append("recherche", params.recherche);
  if (params.site_id)   queryParams.append("site_id",   params.site_id);
  if (params.page)      queryParams.append("page",      params.page);

  const response = await fetch(
    `${API_URL}/events/?${queryParams.toString()}`
  );

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des événements");
  }

  return response.json(); // { count, next, previous, results: [...] }
}

// ── Récupérer les catégories ──────────────────────────────────────────────────
export async function getCategories() {
  const response = await fetch(`${API_URL}/categories/`);

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des catégories");
  }

  const data = await response.json();
  // Normalise : tableau direct ou paginé { results: [...] }
  return Array.isArray(data) ? data : data.results ?? [];
}

// ── Récupérer les sites ───────────────────────────────────────────────────────
export async function getSites() {
  const response = await fetch(`${API_URL}/sites/`);

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des sites");
  }

  const data = await response.json();
  // L'endpoint /api/sites/ renvoie { count, results: [...] }
  return Array.isArray(data) ? data : data.results ?? [];
}

// ── Récupérer les compétiteurs ────────────────────────────────────────────────
export async function getCompetiteurs() {
  const response = await fetch(`${API_URL}/competiteurs/`);

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des compétiteurs");
  }

  const data = await response.json();
  return Array.isArray(data) ? data : data.results ?? [];
}

// ── Créer un événement ────────────────────────────────────────────────────────
export async function createEvent(eventData) {
  const token = localStorage.getItem("access_token");

  const response = await fetch(`${API_URL}/events/`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: eventData, // FormData — ne pas mettre Content-Type manuellement
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("Erreur backend :", errorData);
    throw new Error("Erreur lors de la création de l'événement");
  }

  return response.json();
}
