import axios from "axios";

const GAMER_URL='http://localhost:8000/api/equipes/'

// Creating gamer
export const createGamer = async (payload) => { 
    try {
        const response = await axios.post(GAMER_URL, payload);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la création d'un compétiteur :", error);
        throw error;
    }
};



// Retrieving categories list

const CATEGORIES_URL = 'http://localhost:8000/api/disciplines/'
export const getCategories = async() => {
    try{
    const response = await axios.post(CATEGORIES_URL);
    return response.data
    }catch (error){
        console.error("Error during retrieving categories")
        throw error;
    }
}