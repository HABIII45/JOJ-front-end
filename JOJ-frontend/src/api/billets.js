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

  const nomSpectateur = `${spectateur.prenom || ""} ${spectateur.nom || ""}`.trim() || (typeof billet.spectateur === 'string' ? billet.spectateur : "Spectateur");
  const dateFormatted = evenement.date
    ? new Date(evenement.date).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : (billet.date || "Date officielle");

  const heureFormatted = evenement.heure ? evenement.heure.slice(0, 5) : (billet.heure || "18:00");
  const codeUnique = billet.code_unique || billet.codeUnique || (billet.id ? `JOJ-${billet.id}` : `JOJ-${Date.now()}`);

  // URL du QR Code récupérée depuis le backend ou générée à partir du code_unique réel du billet
  const qrCodeUrl = billet.qr_code_url
    ? getImageUrl(billet.qr_code_url)
    : `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(codeUnique)}`;

  return {
    // Identification
    id:          billet.id,
    codeUnique:  codeUnique,
    label:       `Billet #${billet.id || ""}`,

    // Catégorie / type
    categorie:   billet.type_billet || billet.categorie || "STANDARD",

    // Épreuve
    epreuve:     billet.evenement_titre || evenement.titre || billet.epreuve || "Compétition Olympique",

    // Site
    site:        site.nom || evenement.site_nom || billet.site || "Site Olympique",
    ville:       site.ville || billet.ville || "Dakar",

    // Date & heure
    date:        dateFormatted,
    heure:       heureFormatted,

    // Siège
    siege:       billet.place || billet.siege || "Tribune générale",

    // Titulaire
    titulaire:   nomSpectateur,

    // Image du site
    imageUrl:    getImageUrl(site.image || evenement.image || billet.imageUrl),

    // QR Code réel
    qrCodeUrl:   qrCodeUrl,

    // Statut
    statut:      billet.statut || "VALIDE",

    // Prix calculé côté serveur
    prix:        billet.prix_unitaire ?? billet.prix ?? (billet.type_billet === "VIP" || billet.categorie === "VIP" ? 15000 : 5000),
  };
}

// ── Appels API ───────────────────────────────────────────────────────────────

/**
 * Récupère la liste de tous les billets en sondant l'API et le stockage
 */
export async function fetchBillets() {
  let billetsTrouves = [];

  // 1. Tenter l'endpoint de liste
  try {
    const { data } = await api.get(ENDPOINTS.billets.liste);
    const liste = Array.isArray(data) ? data : data.results ?? [];
    if (liste.length > 0) {
      billetsTrouves = liste.map(normaliserBillet);
    }
  } catch (err) {
    // 2. Si 405, sonder les billets existants par ID (1 à 40)
    try {
      const idsTest = Array.from({ length: 40 }, (_, i) => i + 1);
      const responses = await Promise.allSettled(
        idsTest.map((id) => api.get(`/api/tickets/${id}/`))
      );
      responses.forEach((res) => {
        if (res.status === "fulfilled" && res.value?.data) {
          billetsTrouves.push(normaliserBillet(res.value.data));
        }
      });
    } catch (e) {
      console.warn("Sondage tickets:", e);
    }
  }

  // 3. Fusionner avec le registre persistant local
  try {
    const raw = localStorage.getItem("joj_tous_les_billets");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const idsExistants = new Set(billetsTrouves.map((b) => String(b.id || b.codeUnique)));
        parsed.forEach((b) => {
          const idKey = String(b.id || b.codeUnique);
          if (!idsExistants.has(idKey)) {
            billetsTrouves.push(normaliserBillet(b));
            idsExistants.add(idKey);
          }
        });
      }
    }
  } catch (e) {
    console.warn("Lecture localStorage billets:", e);
  }

  return billetsTrouves;
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
