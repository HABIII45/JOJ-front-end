/**
 * Service authentification
 * Gère la connexion, déconnexion et rafraîchissement de token JWT.
 */
import api, { ENDPOINTS } from "./api";

// ── Endpoints auth ───────────────────────────────────────────────────────────
export const AUTH_ENDPOINTS = {
  connexion:       "/api/utilisateurs/connexion/",
  deconnexion:     "/api/utilisateurs/deconnexion/",
  rafraichirToken: "/api/utilisateurs/rafraichir-token/",
  profil:          "/api/utilisateurs/profil/",
};

// ── Helpers stockage tokens ──────────────────────────────────────────────────
export const tokenStorage = {
  sauvegarder(access, refresh) {
    localStorage.setItem("access_token",  access);
    localStorage.setItem("refresh_token", refresh);
  },
  supprimer() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  },
  getAccess()  { return localStorage.getItem("access_token");  },
  getRefresh() { return localStorage.getItem("refresh_token"); },
};

// ── Appels API ───────────────────────────────────────────────────────────────

/**
 * Connecte un utilisateur et stocke les tokens JWT.
 * @param {string} username  Identifiant (username Django)
 * @param {string} password
 * @returns {Promise<{ access: string, refresh: string }>}
 */
export async function connexion(username, password) {
  const { data } = await api.post(AUTH_ENDPOINTS.connexion, { username, password });
  tokenStorage.sauvegarder(data.access, data.refresh);
  return data;
}

/**
 * Déconnecte l'utilisateur en blacklistant le refresh token.
 */
export async function deconnexion() {
  const refresh = tokenStorage.getRefresh();
  if (refresh) {
    try {
      await api.post(AUTH_ENDPOINTS.deconnexion, { refresh });
    } catch {
      // On supprime les tokens même si la requête échoue
    }
  }
  tokenStorage.supprimer();
}

/**
 * Récupère le profil de l'utilisateur connecté.
 * @returns {Promise<Object>} Profil Personnel
 */
export async function fetchProfil() {
  const { data } = await api.get(AUTH_ENDPOINTS.profil);
  return data;
}

/**
 * Rafraîchit l'access token avec le refresh token stocké.
 * @returns {Promise<string>} Nouvel access token
 */
export async function rafraichirToken() {
  const refresh = tokenStorage.getRefresh();
  if (!refresh) throw new Error("Pas de refresh token disponible.");
  const { data } = await api.post(AUTH_ENDPOINTS.rafraichirToken, { refresh });
  localStorage.setItem("access_token", data.access);
  return data.access;
}
