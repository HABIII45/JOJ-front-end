/**
 * Service Résultats / Événements / Joueurs / Équipes
 * Tous les appels vers l'app Django "evenements"
 */
import api from "./api";

export const RESULTATS_ENDPOINTS = {
  /** GET  /api/events/                 — liste des événements */
  evenements:  "/api/events/",
  /** GET  /api/events/:id/             — détail d'un événement */
  evenement:   (id) => `/api/events/${id}/`,

  /** GET  /api/joueurs/                — liste des joueurs */
  joueurs:     "/api/joueurs/",
  /** GET  /api/joueurs/:id/            — détail d'un joueur */
  joueur:      (id) => `/api/joueurs/${id}/`,

  /** GET  /api/equipes/                — liste des équipes */
  equipes:     "/api/equipes/",
  /** GET  /api/equipes/:id/            — détail d'une équipe */
  equipe:      (id) => `/api/equipes/${id}/`,

  /** GET  /api/resultats/              — liste des résultats */
  /** POST /api/resultats/              — créer un résultat */
  resultats:   "/api/resultats/",
  /** GET /api/resultats/?evenement=:id — résultats par événement */
  parEvenement:(id) => `/api/resultats/?evenement=${id}`,
  /** /:id/  GET /api/resultats         — détail d'un résultat */
  /** PUT /api/resultats/:id/           — modifier un résultat */
  /** DELETE /api/resultats/:id/        — supprimer un résultat */
  resultat:    (id) => `/api/resultats/${id}/`,

  /** GET /api/categories/              — liste des catégories */
  categories:  "/api/categories/",
};

// ── Événements ───────────────────────────────────────────────────────────────

/**
 * Récupère tous les événements.
 * @returns {Promise<Array>}
 */
export async function fetchEvenements() {
  const { data } = await api.get(RESULTATS_ENDPOINTS.evenements);
  return Array.isArray(data) ? data : data.results ?? [];
}

/**
 * Récupère le détail d'un événement.
 * @param {number|string} id
 * @returns {Promise<Object>}
 */
export async function fetchEvenement(id) {
  const { data } = await api.get(RESULTATS_ENDPOINTS.evenement(id));
  return data;
}

// ── Joueurs ──────────────────────────────────────────────────────────────────

/**
 * Récupère tous les joueurs.
 * @returns {Promise<Array>}
 */
export async function fetchJoueurs() {
  const { data } = await api.get(RESULTATS_ENDPOINTS.joueurs);
  return Array.isArray(data) ? data : data.results ?? [];
}

// ── Équipes ──────────────────────────────────────────────────────────────────

/**
 * Récupère toutes les équipes.
 * @returns {Promise<Array>}
 */
export async function fetchEquipes() {
  const { data } = await api.get(RESULTATS_ENDPOINTS.equipes);
  return Array.isArray(data) ? data : data.results ?? [];
}

// ── Résultats ─────────────────────────────────────────────────────────────────

/**
 * Récupère les résultats existants d'un événement.
 * @param {number|string} evenementId
 * @returns {Promise<Array>}
 */
export async function fetchResultatsParEvenement(evenementId) {
  const { data } = await api.get(RESULTATS_ENDPOINTS.parEvenement(evenementId));
  return Array.isArray(data) ? data : data.results ?? [];
}

/**
 * Crée un résultat individuel.
 * @param {number|string} evenementId  ID de l'événement
 * @param {number|string} competiteurId  ID du joueur (compétiteur)
 * @param {string|number} score  Score / temps
 * @returns {Promise<Object>}
 */
export async function creerResultat(evenementId, competiteurId, score) {
  const { data } = await api.post(RESULTATS_ENDPOINTS.resultats, {
    evenement:    evenementId,
    competiteur:  competiteurId,
    score:        String(score),
  });
  return data;
}

/**
 * Met à jour un résultat existant.
 * @param {number|string} resultatId
 * @param {string|number} score
 * @returns {Promise<Object>}
 */
export async function modifierResultat(resultatId, score) {
  const { data } = await api.patch(RESULTATS_ENDPOINTS.resultat(resultatId), {
    score: String(score),
  });
  return data;
}

/**
 * Supprime un résultat.
 * @param {number|string} resultatId
 * @returns {Promise<void>}
 */
export async function supprimerResultat(resultatId) {
  await api.delete(RESULTATS_ENDPOINTS.resultat(resultatId));
}

/**
 * Publie en masse les résultats d'un onglet (individuel ou collectif).
 * Crée ou met à jour chaque ligne en séquence.
 *
 * @param {number|string} evenementId
 * @param {Array<{competiteurId: number, score: string, resultatId?: number}>} lignes
 * @returns {Promise<Array>}  Résultats créés / mis à jour
 */
export async function publierResultats(evenementId, lignes) {
  const promesses = lignes.map(({ competiteurId, score, resultatId }) => {
    if (resultatId) {
      return modifierResultat(resultatId, score);
    }
    return creerResultat(evenementId, competiteurId, score);
  });
  return Promise.all(promesses);
}
