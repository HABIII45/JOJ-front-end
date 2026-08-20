import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

// Créer une actualité
export const creerActualite = async (formData) => {
  try {
    const response = await axios.post(
      `${API_URL}/actualites/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la création de l'actualité :",
      error.response?.data || error.message
    );

    throw error;
  }
};





/**
 * Récupérer toutes les actualités depuis l'API Django
 */
export const getActualites = async () => {
  try {
    const response = await axios.get(`${API_URL}/actualites/`);
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des actualités :",
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * Supprimer une actualité par son ID
 */
export const supprimerActualite = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/actualites/${id}/`);
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la suppression de l'actualité :",
      error.response?.data || error.message
    );
    throw error;
  }
};






// Récupérer les événements pour le select
export const getEvenements = async () => {
  try {
    const response = await axios.get(`${API_URL}/evenements/`);
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des événements :",
      error.response?.data || error.message
    );

    throw error;
  }
};




