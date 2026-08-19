import api from "../api/api";

const GAMER_URL = "/api/equipes/";

// Création d'un compétiteur / équipe
export const createGamer = async (payload) => { 
  try {
    const response = await api.post(GAMER_URL, payload);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création d'un compétiteur :", error);
    throw error;
  }
};

// Récupération de la liste des compétiteurs
export const getGamers = async () => {
  try {
    const response = await api.get(GAMER_URL);
    return Array.isArray(response.data) ? response.data : response.data.results ?? [];
  } catch (error) {
    console.error("Erreur lors de la récupération des compétiteurs", error);
    throw error;
  }
};

// Mise à jour d'un compétiteur
export const updateGamer = async (id, payload) => {
  try {
    const response = await api.patch(`${GAMER_URL}${id}/`, payload);        
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du compétiteur", error);
    throw error;
  }
};

// Suppression d'un compétiteur
export const deleteGamer = async (id) => {
  try {
    const response = await api.delete(`${GAMER_URL}${id}/`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la suppression du compétiteur", error);
    throw error;
  }
};

// Récupération des catégories / disciplines
export const getCategories = async () => {
  try {
    const response = await api.get("/api/disciplines/");
    return Array.isArray(response.data) ? response.data : response.data.results ?? [];
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories:", error);
    throw error;
  }
};