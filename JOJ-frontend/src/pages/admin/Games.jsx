import { useState, useEffect } from 'react'
import { getGamers } from '../../services/competiteur'
import GamerCard from './GamerCard'
import { FiEdit2, FiTrash2, FiMoreVertical } from 'react-icons/fi'

export default function GamesList() {
  const [gamers, setGamers] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all') // 'all' | 'teams' | 'players'
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  useEffect(() => {
    const fetchGamers = async () => {
      try {
        setLoading(true)
        const response = await getGamers()
        setGamers(response)
        console.log("Liste des compétiteurs récupérée avec succès :", response)
      } catch (error) {
        console.error("Erreur lors de la récupération des compétiteurs:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchGamers()
  }, [])

  // Filtres
  const filteredGamers = gamers.filter((gamer) => {
    const matchesSearch = gamer.nom?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter =
      filterType === 'all' ||
      (filterType === 'teams' && gamer.type === 'team') ||
      (filterType === 'players' && gamer.type === 'player')
    return matchesSearch && matchesFilter
  })

  // Pagination
  const totalPages = Math.ceil(filteredGamers.length / itemsPerPage)
  const paginatedGamers = filteredGamers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const toggleStatus = (id) => {
    setGamers((prev) =>
      prev.map((g) => (g.id === id ? { ...g, status: !g.status } : g))
    )
  }

  if (loading) return <div>Chargement...</div>

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* En-tête */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestion des Équipes</h1>
        <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition">
          + Ajouter une équipe
        </button>
      </div>

      {/* Recherche et filtres */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm">
        <input
          type="text"
          placeholder="Nom de l'équipe..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <div className="flex gap-2">
          <button
            className={`px-4 py-2 rounded-lg transition ${
              filterType === 'all'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setFilterType('all')}
          >
            Toutes les équipes
          </button>
          <button
            className={`px-4 py-2 rounded-lg transition ${
              filterType === 'players'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setFilterType('players')}
          >
            Tous les joueurs
          </button>
        </div>
        <button
          onClick={() => {
            setSearchTerm('')
            setFilterType('all')
          }}
          className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition"
        >
          Appliquer
        </button>
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Logo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom de l'équipe</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pays</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sport</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedGamers.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                  Aucun résultat trouvé.
                </td>
              </tr>
            ) : (
              paginatedGamers.map((gamer) => (
                <tr key={gamer.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <GamerCard logo={gamer.logo} className="w-12 h-12 rounded-full" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {gamer.nom}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {gamer.pays}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {gamer.sport}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={gamer.status}
                        onChange={() => toggleStatus(gamer.id)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                    </label>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-3">
                      <button className="text-gray-400 hover:text-blue-600">
                        <FiEdit2 size={18} />
                      </button>
                      <button className="text-gray-400 hover:text-red-600">
                        <FiTrash2 size={18} />
                      </button>
                      <button className="text-gray-400 hover:text-gray-700">
                        <FiMoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-gray-600">
          Affichage de 1-{Math.min(currentPage * itemsPerPage, filteredGamers.length)} sur {filteredGamers.length} équipes
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-100"
          >
            ‹
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded-lg ${
                currentPage === i + 1
                  ? 'bg-orange-600 text-white'
                  : 'border border-gray-300 hover:bg-gray-100'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-100"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  )
}