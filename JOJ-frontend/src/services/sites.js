import axios from "axios"

const SITE_URL = "http://127.0.0.1:8000/api/sites/"


// Retrieving sites list
export const getSites = async () =>{ 
    try{
        const response = await axios.get(SITE_URL)
        return response.data
    } catch (error) {
        console.error("Erreur lors de la récupération des données" + error)
    }

}

// Retrieving specific site
export const getSpecificSite = async (id) =>{
    try{
        const response = await axios.get(`${SITE_URL}${id}`);        
        return response.data
    }catch (error) {
        console.error("Error lors de la récupération du site n"+id, error)
    }

}

// Creating a site
export const createSite = async (payload) => { 
    try {
        const response = await axios.post(SITE_URL, payload);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la création du site :", error);
        throw error;
    }
};