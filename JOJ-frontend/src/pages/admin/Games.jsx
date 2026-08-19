import { useState, useEffect } from 'react'
import { getGamers } from '../../services/competiteur'
export default function GamesList() {
    const [gamers, setGamers] = useState([])
    const[loading, setLoading] = useState(false)
    useEffect(() => {
        const fetchGamers = async () => {
            try{
                const response = await getGamers()
                setLoading(true)
                setGamers(response.data)
                console.log("Liste des compétiteurs récupérée avec succès : " + response.data)
            }catch(error){
                console.error("Error lors de la récupération des compétiteurs" + error)
            }finally{
                setLoading(false)
            }
        }

        fetchGamers()
    
    }, [])
  return (
    <div>List {loading} {gamers}</div>
  )
}
