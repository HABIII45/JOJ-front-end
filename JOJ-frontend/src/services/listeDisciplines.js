import api from "../api/api";

export async function ListeDiscipline() {
  try {
    const response = await api.get("/api/disciplines/");
    return Array.isArray(response.data) ? response.data : response.data.results ?? [];
  } catch (error) {
    console.error("Erreur chargement disciplines", error);
    throw error;
  }
}