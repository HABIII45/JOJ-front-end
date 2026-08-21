import api from "../api/api";

// Créer une actualité
export const creerActualite = async (formData) => {
  try {
    const response = await api.post("/api/actualites/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
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
    const response = await api.get("/api/actualites/");
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
 * Récupérer une actualité par son ID
 */
export const getActualite = async (id) => {
  const response = await api.get(`/api/actualites/${id}/`);
  return response.data;
};

/**
 * Modifier une actualité (PATCH multipart)
 */
export const modifierActualite = async (id, formData) => {
  try {
    const response = await api.patch(`/api/actualites/${id}/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la modification de l'actualité :",
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
    const response = await api.delete(`/api/actualites/${id}/`);
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
    const response = await api.get("/api/events/?page_size=100");
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des événements :",
      error.response?.data || error.message
    );
    throw error;
  }
};




