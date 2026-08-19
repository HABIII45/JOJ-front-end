/**
 * Service authentification
 * Gère la connexion, déconnexion et rafraîchissement de token JWT.
 *
 * Méthodes alignées sur le backend Django :
 *   profil          → GET / PUT  (pas PATCH)
 *   changer-mot-de-passe → PUT   (pas POST)
 *   utilisateurs    → GET liste complète (réservé superadmin)
 *   revoquer-acces  → POST /:id/
 *   reactiver-acces → POST /:id/
 */
import api from "./api";

// ── Endpoints auth ───────────────────────────────────────────────────────────
export const AUTH_ENDPOINTS = {
  connexion:         "/api/utilisateurs/connexion/",
  deconnexion:       "/api/utilisateurs/deconnexion/",
  rafraichirToken:   "/api/utilisateurs/rafraichir-token/",
  profil:            "/api/utilisateurs/profil/",
  changerMotDePasse: "/api/utilisateurs/changer-mot-de-passe/",
  utilisateurs:      "/api/utilisateurs/utilisateurs/",
  revoquerAcces:     (id) => `/api/utilisateurs/revoquer-acces/${id}/`,
  reactiverAcces:    (id) => `/api/utilisateurs/reactiver-acces/${id}/`,
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
 * @returns {Promise<Object>}
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
 * Met à jour le profil texte de l'utilisateur connecté.
 * Utilise PUT — c'est ce qu'expose le backend (partial=True dans le serializer).
 * @param {Object} donnees  ex: { username, email }
 * @returns {Promise<Object>} Profil mis à jour
 */
export async function updateProfil(donnees) {
  const { data } = await api.put(AUTH_ENDPOINTS.profil, donnees);
  return data;
}

/**
 * Upload ou remplace la photo de profil.
 * Envoie un FormData en PUT (multipart/form-data).
 * @param {File} fichier
 * @returns {Promise<Object>} Profil mis à jour
 */
export async function uploadAvatar(fichier) {
  const formData = new FormData();
  formData.append("avatar", fichier);
  const { data } = await api.put(AUTH_ENDPOINTS.profil, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

/**
 * Change le mot de passe de l'utilisateur connecté.
 * Utilise PUT — c'est ce qu'expose le backend sur /changer-mot-de-passe/.
 * Le backend exige les 3 champs : ancien_mot_de_passe, nouveau_mot_de_passe,
 * confirmation_nouveau_mot_de_passe.
 * @param {string} ancien_mot_de_passe
 * @param {string} nouveau_mot_de_passe
 * @returns {Promise<Object>}
 */
export async function changerMotDePasse(ancien_mot_de_passe, nouveau_mot_de_passe) {
  const { data } = await api.put(AUTH_ENDPOINTS.changerMotDePasse, {
    ancien_mot_de_passe,
    nouveau_mot_de_passe,
    confirmation_nouveau_mot_de_passe: nouveau_mot_de_passe,
  });
  return data;
}

/**
 * Récupère la liste de tous les utilisateurs (réservé superadmins).
 * L'endpoint /utilisateurs/ renvoie tous les comptes actifs et inactifs.
 * @returns {Promise<Array>}
 */
export async function fetchAdminsSecondaires() {
  const { data } = await api.get(AUTH_ENDPOINTS.utilisateurs);
  return Array.isArray(data) ? data : data.results ?? [];
}

/**
 * Révoque l'accès d'un utilisateur (désactive le compte, ne le supprime pas).
 * @param {number|string} id
 * @returns {Promise<Object>}
 */
export async function revoquerAccesAdmin(id) {
  const { data } = await api.post(AUTH_ENDPOINTS.revoquerAcces(id));
  return data;
}

/**
 * Réactive l'accès d'un utilisateur désactivé.
 * @param {number|string} id
 * @returns {Promise<Object>}
 */
export async function reactiverAccesAdmin(id) {
  const { data } = await api.post(AUTH_ENDPOINTS.reactiverAcces(id));
  return data;
}
