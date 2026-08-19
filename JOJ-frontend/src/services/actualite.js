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