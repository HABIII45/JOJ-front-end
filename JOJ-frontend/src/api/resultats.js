/**
 * Service Résultats / Événements / Joueurs / Équipes / Catégories / Disciplines
 * Appels vers l'application Django "evenements"
 */
import api from "./api";

export const RESULTATS_ENDPOINTS = {
  /** GET /api/events/ — liste des événements */
  evenements: "/api/events/",
  /** GET /api/events/:id/ — détail d'un événement */
  evenement: (id) => `/api/events/${id}/`,

  /** GET /api/categories/ — liste des catégories */
  categories: "/api/categories/",
  /** GET /api/categories/:id/ — détail d'une catégorie */
  categorie: (id) => `/api/categories/${id}/`,

  /** GET /api/disciplines/ — liste des disciplines */
  disciplines: "/api/disciplines/",
  /** GET /api/disciplines/:id/ — détail d'une discipline */
  discipline: (id) => `/api/disciplines/${id}/`,

  /** GET /api/joueurs/ — liste des joueurs */
  joueurs: "/api/joueurs/",
  /** GET /api/joueurs/:id/ — détail d'un joueur */
  joueur: (id) => `/api/joueurs/${id}/`,

  /** GET /api/equipes/ — liste des équipes */
  equipes: "/api/equipes/",
  /** GET /api/equipes/:id/ — détail d'une équipe */
  equipe: (id) => `/api/equipes/${id}/`,

  /** GET /api/resultats/ — liste des résultats */
  /** POST /api/resultats/ — créer un résultat */
  resultats: "/api/resultats/",
  /** GET /api/resultats/?evenement=:id — résultats par événement */
  parEvenement: (id) => `/api/resultats/?evenement=${id}`,
  /** GET /api/resultats/:id/ — détail */
  /** PATCH/PUT /api/resultats/:id/ — modifier */
  /** DELETE /api/resultats/:id/ — supprimer */
  resultat: (id) => `/api/resultats/${id}/`,
};

// ── Événements ───────────────────────────────────────────────────────────────

export async function fetchEvenements(recupererTout = true) {
  try {
    const { data } = await api.get(RESULTATS_ENDPOINTS.evenements);
    if (Array.isArray(data)) {
      data.totalCount = data.length;
      return data;
    }

    let tous = [...(data.results ?? [])];
    tous.totalCount = typeof data.count === "number" ? data.count : tous.length;

    if (recupererTout && data.next) {
      let nextUrl = data.next;
      while (nextUrl) {
        try {
          const resp = await api.get(nextUrl);
          const nextData = resp.data;
          const lot = Array.isArray(nextData) ? nextData : nextData.results ?? [];
          tous = tous.concat(lot);
          nextUrl = nextData.next;
        } catch {
          break;
        }
      }
    }

    return tous;
  } catch (e) {
    console.error("fetchEvenements error:", e);
    return [];
  }
}

export async function fetchEvenement(id) {
  const { data } = await api.get(RESULTATS_ENDPOINTS.evenement(id));
  return data;
}

// ── Catégories & Disciplines ──────────────────────────────────────────────────

export async function fetchCategories() {
  try {
    const categoriesMap = new Map();

    try {
      const { data: disciplinesData } = await api.get(RESULTATS_ENDPOINTS.disciplines);
      const disciplines = Array.isArray(disciplinesData) ? disciplinesData : disciplinesData.results ?? [];

      disciplines.forEach((d) => {
        if (Array.isArray(d.categories)) {
          d.categories.forEach((cat) => {
            if (cat && cat.id) {
              categoriesMap.set(String(cat.id), {
                id: cat.id,
                nom: cat.nom || `Catégorie #${cat.id}`,
                description: cat.description || "",
                discipline: cat.discipline || d.id,
                discipline_nom: cat.discipline_nom || d.nom,
              });
            }
          });
        }
      });
    } catch {
      // Continuer
    }

    try {
      const { data: categoriesData } = await api.get(RESULTATS_ENDPOINTS.categories);
      const categories = Array.isArray(categoriesData) ? categoriesData : categoriesData.results ?? [];

      categories.forEach((cat) => {
        if (cat && cat.id) {
          const idStr = String(cat.id);
          const existant = categoriesMap.get(idStr);
          categoriesMap.set(idStr, {
            id: cat.id,
            nom: cat.nom || existant?.nom || `Catégorie #${cat.id}`,
            description: cat.description || existant?.description || "",
            discipline: cat.discipline || existant?.discipline || null,
            discipline_nom: cat.discipline_nom || existant?.discipline_nom || "",
          });
        }
      });
    } catch {
      // Ignorer
    }

    return Array.from(categoriesMap.values());
  } catch (err) {
    console.error("fetchCategories error:", err);
    return [];
  }
}

export async function fetchDisciplines() {
  try {
    const { data } = await api.get(RESULTATS_ENDPOINTS.disciplines);
    return Array.isArray(data) ? data : data.results ?? [];
  } catch (e) {
    console.error("fetchDisciplines error:", e);
    return [];
  }
}

// ── Joueurs & Équipes ─────────────────────────────────────────────────────────

export async function fetchJoueurs(recupererTout = true) {
  try {
    const { data } = await api.get(RESULTATS_ENDPOINTS.joueurs);
    let tous = Array.isArray(data) ? [...data] : [...(data.results ?? [])];

    if (recupererTout && data && data.next) {
      let nextUrl = data.next;
      while (nextUrl) {
        try {
          const resp = await api.get(nextUrl);
          const nextData = resp.data;
          const lot = Array.isArray(nextData) ? nextData : nextData.results ?? [];
          tous = tous.concat(lot);
          nextUrl = nextData.next;
        } catch {
          break;
        }
      }
    }
    return tous;
  } catch (e) {
    console.error("fetchJoueurs error:", e);
    return [];
  }
}

export async function fetchEquipes(recupererTout = true) {
  try {
    const { data } = await api.get(RESULTATS_ENDPOINTS.equipes);
    let tous = Array.isArray(data) ? [...data] : [...(data.results ?? [])];

    if (recupererTout && data && data.next) {
      let nextUrl = data.next;
      while (nextUrl) {
        try {
          const resp = await api.get(nextUrl);
          const nextData = resp.data;
          const lot = Array.isArray(nextData) ? nextData : nextData.results ?? [];
          tous = tous.concat(lot);
          nextUrl = nextData.next;
        } catch {
          break;
        }
      }
    }
    return tous;
  } catch (e) {
    console.error("fetchEquipes error:", e);
    return [];
  }
}

// ── Résultats ────────────────────────────────────────────────────────────────

async function associerIdentifiantsResultats(liste) {
  if (!Array.isArray(liste) || liste.length === 0) return [];

  // Normalise chaque résultat pour garantir l'accès à competiteur et info_competiteur
  return liste.map((r, index) => {
    const compId = r.competiteur || r.info_competiteur?.id || r.info_competiteur?.pk || null;
    return {
      ...r,
      id: r.id || index + 1,
      competiteur: compId,
      info_competiteur: r.info_competiteur || (compId ? { id: compId } : null),
    };
  });
}

export async function fetchResultats() {
  try {
    const { data } = await api.get(RESULTATS_ENDPOINTS.resultats);
    const liste = Array.isArray(data) ? data : data.results ?? [];
    return associerIdentifiantsResultats(liste);
  } catch (e) {
    console.error("fetchResultats error:", e);
    return [];
  }
}

export async function fetchResultatsParEvenement(evenementId) {
  try {
    const { data } = await api.get(RESULTATS_ENDPOINTS.parEvenement(evenementId));
    const liste = Array.isArray(data) ? data : data.results ?? [];
    return associerIdentifiantsResultats(liste);
  } catch (e) {
    console.error("fetchResultatsParEvenement error:", e);
    return [];
  }
}

export async function creerResultat(evenementId, competiteurId, score) {
  const { data } = await api.post(RESULTATS_ENDPOINTS.resultats, {
    evenement: evenementId,
    competiteur: competiteurId,
    score: String(score),
  });
  return data;
}

export async function modifierResultat(resultatId, score, competiteurId, evenementId) {
  if (resultatId) {
    try {
      const payload = { score: String(score) };
      if (competiteurId) payload.competiteur = competiteurId;
      if (evenementId) payload.evenement = evenementId;
      const { data } = await api.patch(RESULTATS_ENDPOINTS.resultat(resultatId), payload);
      return data;
    } catch {
      const { data } = await api.put(RESULTATS_ENDPOINTS.resultat(resultatId), {
        evenement: evenementId,
        competiteur: competiteurId,
        score: String(score),
      });
      return data;
    }
  } else if (evenementId && competiteurId) {
    return creerResultat(evenementId, competiteurId, score);
  }
}

export async function supprimerResultat(resultatId) {
  if (resultatId) {
    await api.delete(RESULTATS_ENDPOINTS.resultat(resultatId));
  }
}

/**
 * Publie ou met à jour les résultats sans jamais créer de doublon.
 */
export async function publierResultats(evenementId, lignes) {
  let existants = [];
  try {
    existants = await fetchResultatsParEvenement(evenementId);
  } catch (e) {
    console.warn("fetchResultatsParEvenement pour mise à jour:", e);
  }

  const promesses = lignes.map(async ({ competiteurId, score, resultatId }) => {
    let resId = resultatId;
    if (!resId && existants.length > 0) {
      const match = existants.find(
        (r) => String(r.competiteur || r.info_competiteur?.id) === String(competiteurId)
      );
      if (match) resId = match.id;
    }

    if (resId) {
      return modifierResultat(resId, score, competiteurId, evenementId);
    }
    return creerResultat(evenementId, competiteurId, score);
  });

  return Promise.all(promesses);
}
