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