
import axios from "axios";

export const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ── Intercepteur requête : injecte le token JWT si présent ──────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Intercepteur réponse : gestion globale des erreurs ──────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
    }
    return Promise.reject(error);
  }
);

// ── Helper pour formater les URLs d'images retournées par le backend ───────
export function getImageUrl(imagePath) {
  if (!imagePath) return null;
  if (typeof imagePath !== "string") return null;
  if (
    imagePath.startsWith("http://") ||
    imagePath.startsWith("https://") ||
    imagePath.startsWith("data:") ||
    imagePath.startsWith("blob:")
  ) {
    return imagePath;
  }
  const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  return `${BASE_URL}${cleanPath}`;
}

// ── Endpoints organisés par domaine ─────────────────────────────────────────
export const ENDPOINTS = {
  billets: {
    liste:    "/api/tickets/",
    reserver: "/api/tickets/",
    detail:   (id) => `/api/tickets/${id}/`,
    scanner:  (uuid) => `/api/scanner/${uuid}/`,
  },
  paiements: {
    initier: "/api/payments/",
    detail:  (id) => `/api/payments/${id}/`,
  },
  evenements: {
    liste:   "/api/events/",
    detail:  (id) => `/api/events/${id}/`,
  },
  resultats: {
    liste:        "/api/resultats/",
    detail:        (id) => `/api/resultats/${id}/`,
    parEvenement:  (id) => `/api/resultats/?evenement=${id}`,
  },
  joueurs: {
    liste:  "/api/joueurs/",
    detail: (id) => `/api/joueurs/${id}/`,
  },
  equipes: {
    liste:  "/api/equipes/",
    detail: (id) => `/api/equipes/${id}/`,
  },

  disciplines: {
    liste:      "/api/disciplines/",
    creer:      "/api/disciplines/",
    categories: (id) => `/api/disciplines/${id}/categories/`,
  },
};

export default api;
