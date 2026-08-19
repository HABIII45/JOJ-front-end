import axios from "axios";


const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:8000").replace(/\/$/, "");

const apiClient = axios.create({
  baseURL: API_URL ? API_URL.replace(/\/$/, "") : "",
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("joj_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const isBackendConnected = () => Boolean(API_URL);

// Requête GET utilitaire (retourne tableau vide si pas de backend)
function get(path, params) {
  if (!API_URL) return Promise.resolve([]);
  return apiClient.get(path, { params }).then((r) => r.data);
}

// --- ÉVÉNEMENTS ---
export const evenementsService = {
  lister: () => get("/api/events/"),
  detail: (id) => {
    if (!API_URL) return Promise.reject(new Error("Backend non configuré"));
    return apiClient.get(`/api/events/${id}/`).then((r) => r.data);
  },
  creer: (data) => apiClient.post("/api/events/", data).then((r) => r.data),
};

// --- SITES ---
export const sitesService = {
  lister: () => get("/api/sites/"),
  detail: (id) => {
    if (!API_URL) return Promise.reject(new Error("Backend non configuré"));
    return apiClient.get(`/api/sites/${id}/`).then((r) => r.data);
  },
  creer: (data) => apiClient.post("/api/sites/", data).then((r) => r.data),
};

// --- DISCIPLINES & CATÉGORIES ---
export const disciplinesService = {
  lister: () => get("/api/disciplines/"),
  categories: (id) => apiClient.get(`/api/disciplines/${id}/categories/`).then((r) => r.data),
};

export const categoriesService = {
  lister: () => get("/api/categories/"),
};

// --- ACTUALITÉS ---
export const actualitesService = {
  lister: () => get("/api/actualites/"),
  creer: (data) => apiClient.post("/api/actualites/", data).then((r) => r.data),
};

// --- RÉSULTATS ---
export const resultatsService = {
  lister: () => get("/api/resultats/"),
};

// --- DASHBOARD ADMIN ---
export const dashboardService = {
  kpis: () => {
    if (!API_URL) return Promise.resolve(null);
    // Attrape l'erreur 404 si l'endpoint n'existe pas encore sur Django
    return apiClient.get("/api/admin/kpis/").then((r) => r.data).catch(() => null);
  },
  activites: () => {
    if (!API_URL) return Promise.resolve([]);
    return apiClient.get("/api/admin/activites/").then((r) => r.data).catch(() => []);
  },
};

// --- AUTHENTIFICATION ---
export const authService = {
  async seConnecter(username, password) {
    const { data } = await apiClient.post("/api/utilisateurs/connexion/", { username, password });
    localStorage.setItem("joj_token", data.access);
    localStorage.setItem("joj_refresh", data.refresh);
    return data;
  },
  seDeconnecter() {
    localStorage.removeItem("joj_token");
    localStorage.removeItem("joj_refresh");
  },
  estConnecte: () => Boolean(localStorage.getItem("joj_token")),
  async profil() {
    if (!API_URL) return null;
    try {
      const { data } = await apiClient.get("/api/utilisateurs/profil/");
      return data;
    } catch {
      return null;
    }
  },
};

export default apiClient;