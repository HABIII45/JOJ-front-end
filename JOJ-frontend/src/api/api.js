/**
 * Configuration centrale Axios
 * Toutes les requêtes vers le backend Django passent par cette instance.
 */
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

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
      // Token expiré — on pourrait déclencher un refresh ici
      localStorage.removeItem("access_token");
    }
    return Promise.reject(error);
  }
);

// ── Endpoints organisés par domaine ─────────────────────────────────────────
export const ENDPOINTS = {
  billets: {
    /** GET  /api/tickets/         — liste des billets (admin) */
    liste:    "/api/tickets/",
    /** POST /api/tickets/         — réserver des billets */
    reserver: "/api/tickets/",
    /** GET  /api/tickets/:id/     — détail d'un billet */
    detail:   (id) => `/api/tickets/${id}/`,
    /** GET  /api/scanner/:uuid/   — scanner un billet par QR */
    scanner:  (uuid) => `/api/scanner/${uuid}/`,
  },
  paiements: {
    /** POST /api/payments/        — initier un paiement */
    initier: "/api/payments/",
    /** GET  /api/payments/:id/    — résumé d'un paiement */
    detail:  (id) => `/api/payments/${id}/`,
  },
  evenements: {
    /** GET  /api/events/          — liste des événements */
    liste:   "/api/events/",
    /** GET  /api/events/:id/      — détail */
    detail:  (id) => `/api/events/${id}/`,
  },
  resultats: {
    /** GET/POST /api/resultats/   — liste et création */
    liste:        "/api/resultats/",
    /** GET/PUT/DELETE /api/resultats/:id/ */
    detail:        (id) => `/api/resultats/${id}/`,
    /** GET /api/resultats/?evenement=:id */
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
};

export default api;
