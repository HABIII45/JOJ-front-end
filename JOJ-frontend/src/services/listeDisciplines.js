import axios from 'axios'
const API_URL="http://127.0.0.1:8000/api";


export async function ListeDiscipline(){
    try{
        const response= await axios.get(`${API_URL}/disciplines/`)
        return response.data
    }catch{
        console.error("Erreur", error)
        throw error
    }

}


export async function DetailsDiscipline(id) {
    try {
        const response= await axios.get(`${API_URL}/events/${id}/`)
        return response.data
    } catch (error) {
        console.error("Erreur", error)
        throw error
        
    }
    
}


// Evenements d'une discipline

// export async function EvenementsDiscipline(nomDiscipline) {
//     try {
//         const nomDiscipline=categorie__discipline__nom
//         if(!nomDiscipline)return
//         const recupereEvenement=await axios.get(`${API_URL}/events/?recherche=${nomDiscipline}`)
//         return recupereEvenement.data
//     } catch (error) {
//         console.error("Erreur", error)
//         throw error
        
//     }
    
// }






/**
 * Récupère les détails complets d'une discipline par son identifiant.
 */
export const getDisciplineDetails = async (id) => {
  try {
    const response = await axios.get(
      `${API_URL}/disciplines/${id}/`
    );

    return response.data;
  } catch (error) {
    console.error(
      `Erreur lors de la récupération de la discipline #${id}:`,
      error
    );
    throw error;
  }
};

/**
 * Récupère les événements.
 * Si disciplineId existe, on demande les événements de cette discipline.
 */
// Dans listeDisciplines.js
export const getEvenements = async (disciplineId = null) => {
  try {
    // 1. Récupère le nom de la discipline
    const discipline = await getDisciplineDetails(disciplineId);
    const nomDiscipline = discipline.nom;
    
    // 2. Utilise la bonne URL avec "events" et "recherche"
    const url = `${API_URL}/events/?recherche=${nomDiscipline}`;
    console.log("URL appelée :", url);
    
    const response = await axios.get(url);
    return response.data.results || response.data;
  } catch (error) {
    console.error("Erreur :", error);
    throw error;
  }
};