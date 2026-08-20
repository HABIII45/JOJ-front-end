import api from "../api/api";

const SITE_URL = "/api/sites/";

// Récupération de l'intégralité des sites réels (parcourt toutes les pages DRF)
export const getAllSites = async () => {
  try {
    let allSites = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await api.get(SITE_URL, { params: { page } });
      const data = response.data;
      const results = Array.isArray(data) ? data : data.results ?? [];
      allSites = allSites.concat(results);
      if (!data.next || results.length === 0) {
        hasMore = false;
      } else {
        page += 1;
      }
    }
    return allSites;
  } catch (error) {
    console.error("Erreur lors de la récupération de tous les sites:", error);
    return [];
  }
};

// Récupération d'une page spécifique
export const getSites = async (page = 1) => {
  try {
    const response = await api.get(SITE_URL, { params: { page } });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des sites:", error);
    throw error;
  }
};

// Récupération d'un site spécifique
export const getSpecificSite = async (id) => {
  try {
    const response = await api.get(`${SITE_URL}${id}/`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération du site n°" + id, error);
    throw error;
  }
};

// Création d'un site
export const createSite = async (payload) => {
  try {
    const response = await api.post(SITE_URL, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création du site:", error);
    throw error;
  }
};