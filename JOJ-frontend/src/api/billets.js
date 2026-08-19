/**
 * Service billets
 * Toutes les fonctions qui communiquent avec l'API Django pour les billets.
 */
import api, { ENDPOINTS } from "./api";

const BASE_MEDIA = import.meta.env.VITE_API_URL || "http://localhost:8000";

/**
 * Transforme un objet Billet brut (Django) en objet normalisé pour le frontend.
 * Adapte les noms de champs et construit les URLs complètes des médias.
 *
 * @param {Object} billet  Objet renvoyé par le serializer Django
 * @returns {Object}       Objet normalisé pour les composants React
 */
export function normaliserBillet(billet) {
  const evenement = billet.evenement_detail || {};
  const site      = evenement.site_detail   || {};

  return {
    // Identification
    id:          billet.id,
    codeUnique:  billet.code_unique,
    label:       `Billet #${billet.id}`,

    // Catégorie / type
    categorie:   billet.type_billet || "STANDARD",

    // Épreuve
    epreuve:     billet.evenement_titre || evenement.titre || "—",

    // Site
    site:        site.nom  || evenement.lieu || "—",
    ville:       site.ville || "—",

    // Date & heure (depuis l'événement)
    date:        evenement.date_debut
                   ? new Date(evenement.date_debut).toLocaleDateString("fr-FR", {
                       day: "2-digit", month: "long", year: "numeric",
                     })
                   : "—",
    heure:       evenement.date_debut
                   ? new Date(evenement.date_debut).toLocaleTimeString("fr-FR", {
                       hour: "2-digit", minute: "2-digit",
                     })
                   : "—",

    // Siège
    siege:       billet.place || "—",

    // Titulaire
    titulaire:   billet.spectateur
                   ? `${billet.spectateur.prenom} ${billet.spectateur.nom}`
                   : "—",

    // Image du site (fallback Unsplash si le backend n'en fournit pas)
    imageUrl:    site.image
                   ? `${BASE_MEDIA}${site.image}`
                   : "https://images.unsplash.com/photo-1518605348400-437a4a7761c4?w=800&q=80",

    // QR Code réel généré par Django
    qrCodeUrl:   billet.qr_code_url
                   ? `${BASE_MEDIA}${billet.qr_code_url}`
                   : null,

    // Statut
    statut:      billet.statut,

    // Prix calculé côté serveur
    prix:        billet.prix_unitaire ?? 0,
  };
}

// ── Appels API ───────────────────────────────────────────────────────────────

/**
 * Récupère la liste de tous les billets (nécessite un token admin).
 * @returns {Promise<Object[]>} Billets normalisés
 */
export async function fetchBillets() {
  const { data } = await api.get(ENDPOINTS.billets.liste);
  // L'API renvoie soit un tableau direct, soit { results: [...] } (pagination)
  const liste = Array.isArray(data) ? data : data.results ?? [];
  return liste.map(normaliserBillet);
}

/**
 * Récupère le détail d'un billet par son ID.
 * @param {number} id
 * @returns {Promise<Object>} Billet normalisé
 */
export async function fetchBilletDetail(id) {
  const { data } = await api.get(ENDPOINTS.billets.detail(id));
  return normaliserBillet(data);
}

/**
 * Récupère un billet par son code UUID (utilisé depuis le QR code).
 * @param {string} uuid
 * @returns {Promise<Object>} Billet normalisé
 */
export async function fetchBilletParUUID(uuid) {
  const { data } = await api.get(ENDPOINTS.billets.scanner(uuid));
  return normaliserBillet(data);
}

/**
 * Réserve des billets pour un spectateur.
 * @param {Object} payload  Conforme à CommandeBilletSerializer
 * @returns {Promise<Object>} { billets, total, nombre_billets }
 */
export async function reserverBillets(payload) {
  const { data } = await api.post(ENDPOINTS.billets.reserver, payload);
  return {
    billets:        (data.billets || []).map(normaliserBillet),
    total:          data.total,
    nombreBillets:  data.nombre_billets,
  };
}

/**
 * Initie un paiement pour une liste de billets.
 * @param {number[]} billetIds
 * @param {string}   methode  'ORANGE_MONEY' | 'WAVE' | 'CARTE' | 'MOCK'
 * @returns {Promise<Object[]>} Paiements créés
 */
export async function initierPaiement(billetIds, methode) {
  const { data } = await api.post(ENDPOINTS.paiements.initier, {
    billets: billetIds,
    methode,
  });
  return data;
}
