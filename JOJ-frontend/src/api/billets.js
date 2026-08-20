/**
 * Service billets
 * Communication avec l'API Django pour la billetterie et le paiement.
 */
import api, { ENDPOINTS, getImageUrl } from "./api";

/**
 * Transforme un objet Billet brut (Django) en objet normalisé pour le frontend.
 * @param {Object} billet  Objet renvoyé par le serializer Django
 * @returns {Object}       Objet normalisé pour les composants React
 */
export function normaliserBillet(billet) {
  if (!billet) return null;
  const evenement = billet.evenement_detail || (typeof billet.evenement === 'object' ? billet.evenement : {}) || {};
  const site      = evenement.site_detail || (typeof evenement.site === 'object' ? evenement.site : {}) || {};
  const spectateur = billet.spectateur || {};

  const nomSpectateur = `${spectateur.prenom || ""} ${spectateur.nom || ""}`.trim() || "Spectateur";
  const dateFormatted = evenement.date
    ? new Date(evenement.date).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "Date officielle";

  const heureFormatted = evenement.heure ? evenement.heure.slice(0, 5) : "18:00";

  return {
    // Identification
    id:          billet.id,
    codeUnique:  billet.code_unique || `JOJ-${billet.id}`,
    label:       `Billet #${billet.id}`,

    // Catégorie / type
    categorie:   billet.type_billet || "STANDARD",

    // Épreuve
    epreuve:     billet.evenement_titre || evenement.titre || "Compétition Olympique",

    // Site
    site:        site.nom || evenement.site_nom || "Site Olympique",
    ville:       site.ville || "Dakar",

    // Date & heure
    date:        dateFormatted,
    heure:       heureFormatted,

    // Siège
    siege:       billet.place || "Tribune générale",

    // Titulaire
    titulaire:   nomSpectateur,

    // Image du site
    imageUrl:    getImageUrl(site.image || evenement.image),

    // QR Code
    qrCodeUrl:   getImageUrl(billet.qr_code_url),

    // Statut
    statut:      billet.statut || "VALIDE",

    // Prix calculé côté serveur
    prix:        billet.prix_unitaire ?? (billet.type_billet === "VIP" ? 15000 : 5000),
  };
}

// ── Appels API ───────────────────────────────────────────────────────────────

/**
 * Récupère la liste de tous les billets
 */
export async function fetchBillets() {
  try {
    const { data } = await api.get(ENDPOINTS.billets.liste);
    const liste = Array.isArray(data) ? data : data.results ?? [];
    return liste.map(normaliserBillet);
  } catch (err) {
    console.warn("fetchBillets : fallback local", err);
    return [];
  }
}

/**
 * Récupère le détail d'un billet par son ID.
 */
export async function fetchBilletDetail(id) {
  const { data } = await api.get(ENDPOINTS.billets.detail(id));
  return normaliserBillet(data);
}

/**
 * Réserve des billets pour un spectateur (POST /api/tickets/)
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
 * Initie un paiement pour une liste de billets (POST /api/payments/)
 */
export async function initierPaiement(billetIds, methode) {
  const methodesBackend = {
    wave: "WAVE",
    orange: "ORANGE_MONEY",
    card: "CARTE",
    WAVE: "WAVE",
    ORANGE_MONEY: "ORANGE_MONEY",
    CARTE: "CARTE",
  };
  const methodeBackend = methodesBackend[methode] || "WAVE";
  const { data } = await api.post(ENDPOINTS.paiements.initier, {
    billets: billetIds,
    methode: methodeBackend,
  });
  return data;
}
