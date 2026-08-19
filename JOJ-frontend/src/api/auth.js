/**
 * Service authentification
 * Gère la connexion, déconnexion et rafraîchissement de token JWT.
 */
import api, { ENDPOINTS } from "./api";

// ── Endpoints auth ───────────────────────────────────────────────────────────
export const AUTH_ENDPOINTS = {
  connexion:          "/api/utilisateurs/connexion/",
  deconnexion:        "/api/utilisateurs/deconnexion/",
  rafraichirToken:    "/api/utilisateurs/rafraichir-token/",
  profil:             "/api/utilisateurs/profil/",
  changerMotDePasse:  "/api/utilisateurs/changer-mot-de-passe/",
  adminsSecondaires:  "/api/utilisateurs/admins-secondaires/",
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

/**
 * Met à jour le profil de l'utilisateur connecté.
 * @param {Object} donnees  Champs à modifier (nom, email, departement…)
 * @returns {Promise<Object>} Profil mis à jour
 */
export async function updateProfil(donnees) {
  const { data } = await api.patch(AUTH_ENDPOINTS.profil, donnees);
  return data;
}

/**
 * Change le mot de passe de l'utilisateur connecté.
 * @param {string} ancien_mot_de_passe
 * @param {string} nouveau_mot_de_passe
 * @returns {Promise<Object>}
 */
export async function changerMotDePasse(ancien_mot_de_passe, nouveau_mot_de_passe) {
  const { data } = await api.post(AUTH_ENDPOINTS.changerMotDePasse, {
    ancien_mot_de_passe,
    nouveau_mot_de_passe,
  });
  return data;
}

/**
 * Récupère la liste des administrateurs secondaires.
 * @returns {Promise<Array>}
 */
export async function fetchAdminsSecondaires() {
  const { data } = await api.get(AUTH_ENDPOINTS.adminsSecondaires);
  return data;
}

/**
 * Supprime un administrateur secondaire (suppression réelle en base).
 * @param {number|string} id  ID de l'admin à supprimer
 * @returns {Promise<void>}
 */
export async function supprimerAdminSecondaire(id) {
  // AUTH_ENDPOINTS.adminsSecondaires se termine par "/" → on évite le double slash
  const base = AUTH_ENDPOINTS.adminsSecondaires.replace(/\/$/, "");
  await api.delete(`${base}/${id}/`);
}

/**
 * Upload ou remplace la photo de profil de l'utilisateur connecté.
 * Envoie un FormData (multipart/form-data) pour que Django puisse
 * traiter le fichier image via un ImageField.
 * @param {File} fichier  Fichier image sélectionné par l'utilisateur
 * @returns {Promise<Object>} Profil mis à jour avec la nouvelle URL d'avatar
 */
export async function uploadAvatar(fichier) {
  const formData = new FormData();
  formData.append("avatar", fichier);
  const { data } = await api.patch(AUTH_ENDPOINTS.profil, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}
