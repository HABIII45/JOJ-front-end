import api from "../api/api";
import axios from "axios";
const GAMER_URL = "http://localhost:8000/api/equipes/";

// Création d'une équipe
export const createTeam = async (payload) => { 
  try {
    const response = await axios.post(GAMER_URL, payload);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création d'un compétiteur :", error);
    throw error;
  }
};





// Création d'un joueur 
const JOUEUR_URL = "http://localhost:8000/api/joueurs/"
export const createJoueur = async (payload) => { 
  try {
    const response = await axios.post(JOUEUR_URL, payload); 
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création du joueur :", error);
    throw error;
  }
};




// Récupération de la liste des compétiteurs
export const getGamers = async () => {
  try {
    const response = await axios.get(GAMER_URL);
    return Array.isArray(response.data) ? response.data : response.data.results ?? [];
  } catch (error) {
    console.error("Erreur lors de la récupération des compétiteurs", error);
    throw error;
  }
};

// Mise à jour d'un compétiteur
export const updateGamer = async (id, payload) => {
  try {
    const response = await axios.patch(`${GAMER_URL}${id}/`, payload);        
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du compétiteur", error);
    throw error;
  }
};

// Suppression d'un compétiteur
export const deleteGamer = async (id) => {
  try {
    const response = await axios.delete(`${GAMER_URL}${id}/`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la suppression du compétiteur", error);
    throw error;
  }
};

// Récupération des catégories / disciplines
export const getCategories = async () => {
  try {
    const response = await axios.get("http://localhost:8000/api/categories/");
    return Array.isArray(response.data) ? response.data : response.data.results ?? [];
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories:", error);
    throw error;
  }
};