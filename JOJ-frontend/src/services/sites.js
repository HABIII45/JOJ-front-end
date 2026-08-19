import api from "../api/api";

const SITE_URL = "/api/sites/";

// Récupération de la liste des sites
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
    const response = await api.post(SITE_URL, payload);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création du site:", error);
    throw error;
  }
};