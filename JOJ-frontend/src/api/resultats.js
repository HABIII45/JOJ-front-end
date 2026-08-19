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
}

export async function fetchEvenement(id) {
  const { data } = await api.get(RESULTATS_ENDPOINTS.evenement(id));
  return data;
}

// ── Catégories & Disciplines ──────────────────────────────────────────────────

export async function fetchCategories() {
  try {
    const categoriesMap = new Map();

    // 1. Récupération depuis /api/disciplines/ (le backend Django imbrique toutes les catégories dans les disciplines)
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
    } catch (e) {
      console.warn("Notice disciplines categories:", e);
    }

    // 2. Récupération directe /api/categories/
    try {
      const { data: categoriesData } = await api.get(RESULTATS_ENDPOINTS.categories);
      const directCategories = Array.isArray(categoriesData) ? categoriesData : categoriesData.results ?? [];
      directCategories.forEach((cat) => {
        if (cat && cat.id && cat.nom) {
          categoriesMap.set(String(cat.id), {
            id: cat.id,
            nom: cat.nom,
            description: cat.description || "",
            discipline: cat.discipline,
            discipline_nom: cat.discipline_nom,
          });
        }
      });
    } catch (e) {
      console.warn("Notice direct categories:", e);
    }

    // 3. Extraction depuis les événements
    try {
      const { data: evtsData } = await api.get(RESULTATS_ENDPOINTS.evenements);
      const evts = Array.isArray(evtsData) ? evtsData : evtsData.results ?? [];
      evts.forEach((ev) => {
        if (ev && ev.categorie) {
          const catObj = typeof ev.categorie === "object" ? ev.categorie : null;
          const catId = catObj ? catObj.id : ev.categorie;
          const catNom = catObj ? catObj.nom : (ev.categorie_nom || `Catégorie #${catId}`);
          if (catId && !categoriesMap.has(String(catId))) {
            categoriesMap.set(String(catId), {
              id: catId,
              nom: catNom,
              discipline_nom: ev.discipline || "",
            });
          }
        }
      });
    } catch (e) {
      console.warn("Notice events categories:", e);
    }

    return Array.from(categoriesMap.values());
  } catch (err) {
    console.error("Erreur chargement catégories:", err);
    return [];
  }
}

export async function fetchDisciplines() {
  const { data } = await api.get(RESULTATS_ENDPOINTS.disciplines);
  return Array.isArray(data) ? data : data.results ?? [];
}

// ── Joueurs ──────────────────────────────────────────────────────────────────

export async function fetchJoueurs() {
  const { data } = await api.get(RESULTATS_ENDPOINTS.joueurs);
  return Array.isArray(data) ? data : data.results ?? [];
}

// ── Équipes ──────────────────────────────────────────────────────────────────

export async function fetchEquipes() {
  const { data } = await api.get(RESULTATS_ENDPOINTS.equipes);
  return Array.isArray(data) ? data : data.results ?? [];
}

// ── Résultats ─────────────────────────────────────────────────────────────────

/**
 * Découvre les identifiants réels des résultats en base Django
 */
async function associerIdentifiantsResultats(liste) {
  if (!Array.isArray(liste) || liste.length === 0) return [];

  // Si les objets possèdent déjà un id valide
  if (liste.every((r) => r && r.id != null)) {
    return liste;
  }

  try {
    // Sonde les 60 premiers ID pour cartographier les résultats existants
    const sondes = [];
    for (let testId = 1; testId <= 60; testId++) {
      sondes.push(
        api.get(`/api/resultats/${testId}/`)
          .then((res) => ({ id: testId, data: res.data }))
          .catch(() => null)
      );
    }
    const decouverts = (await Promise.all(sondes)).filter(Boolean);

    // Mappe chaque résultat avec son identifiant découvert
    const decouvertsUtilises = new Set();

    return liste.map((r, index) => {
      if (r.id) return r;

      const compId = r.competiteur || r.info_competiteur?.id;
      const match = decouverts.find((d) => {
        if (decouvertsUtilises.has(d.id)) return false;
        const dCompId = d.data?.competiteur || d.data?.info_competiteur?.id;
        return (
          String(d.data?.evenement) === String(r.evenement) &&
          (compId ? String(dCompId) === String(compId) : true) &&
          String(d.data?.score) === String(r.score)
        );
      });

      if (match) {
        decouvertsUtilises.add(match.id);
        return { ...r, id: match.id };
      }

      // Fallback sur le n-ième découvert disponible
      const fallback = decouverts.find((d) => !decouvertsUtilises.has(d.id));
      if (fallback) {
        decouvertsUtilises.add(fallback.id);
        return { ...r, id: fallback.id };
      }

      return { ...r, id: index + 1 };
    });
  } catch {
    return liste.map((r, idx) => ({ ...r, id: r.id || idx + 1 }));
  }
}

export async function fetchResultats() {
  const { data } = await api.get(RESULTATS_ENDPOINTS.resultats);
  const liste = Array.isArray(data) ? data : data.results ?? [];
  return associerIdentifiantsResultats(liste);
}

export async function fetchResultatsParEvenement(evenementId) {
  const { data } = await api.get(RESULTATS_ENDPOINTS.parEvenement(evenementId));
  const liste = Array.isArray(data) ? data : data.results ?? [];
  return associerIdentifiantsResultats(liste);
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

export async function publierResultats(evenementId, lignes) {
  const promesses = lignes.map(({ competiteurId, score, resultatId }) => {
    if (resultatId) {
      return modifierResultat(resultatId, score, competiteurId, evenementId);
    }
    return creerResultat(evenementId, competiteurId, score);
  });
  return Promise.all(promesses);
}
