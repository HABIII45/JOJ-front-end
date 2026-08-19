import axios from "axios";

const GAMER_URL='http://localhost:8000/api/equipes/'

// Creating gamer
export const createGamer = async (payload) => { 
    try {
        const response = await axios.post(GAMER_URL, payload);
        return response;
    } catch (error) {
        console.error("Erreur lors de la création d'un compétiteur :", error);
        throw error;
    }
};


// Retrieving gamers list
export const getGamers = async() => {
    try{
        const response = await axios.get(GAMER_URL);
        return response.data
    }catch(error){
        console.error("Error lors de la récupération des compétiteurs", error)
        throw error
    }
}


// Updating a gamer
export const updateGamer = async(id, payload) => {
    try{
        const response = await axios.patch(`${GAMER_URL}${id}`, payload);        
        return response.data
    }catch(error){
        console.error("Error lors d el mise à jour de ce compétiteur" + error)
        throw error
    }

}


//Deleting a gamer 
export const deleteGamer = async(id) => {
    try{
        const response = await axios.delete(`${GAMER_URL}${id}`)
        return response.data
    }catch(error){
        console.error("Error lors de la suppression de ce cmpétiteur" + error)
        throw error
    }



}






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