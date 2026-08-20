import { useState, useEffect } from 'react';
import { createGamer, getCategories } from '../../services/competiteur';
import AdminLayout from '../../components/layouts/AdminLayout';
const CompetiteurForm = () => {
  const [teamType, setTeamType] = useState('individuel');
  const [formData, setFormData] = useState({
    teamName: '',
    country: '',
    category: '', 
    status: true
  });
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]); 

  // Récupération des catégories au chargement du composant
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
        console.log(data.categories)

      } catch (error) {
        console.error("Erreur lors de la récupération des catégories", error);
      }
    };

    fetchCategories();
  }, []);


// Gestion de l'image uploadee
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(...file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

// Gestion du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation simple
    if (!formData.category) {
      alert("Veuillez sélectionner une catégorie");
      return;
    }

    setLoading(true); 
    try {
      await createGamer(formData);
      alert('Compétiteur créé avec succès');
      
      // Reset du formulaire
      setFormData({
        teamName: '',
        country: '',
        category: '',
        status: true
      });
      
    } catch (error) {
      console.error("Erreur lors de la création d'un nouveau compétiteur", error);
      alert("Erreur lors de la création du compétiteur");
    } finally {
      setLoading(false); 
    }
  };

  return (
  <> <AdminLayout/> 
    <div className="min-h-screen bg-gray-50 py-8">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <h1 className="text-3xl font-bold text-center mb-8">Créer une nouvelle équipe</h1>

        {/* Team Type Toggle */}
        <div className="flex justify-start mb-8">
          <div className="bg-gray-100 rounded-full p-1 flex">
            <button onClick={() => setTeamType('individuel')} className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${ teamType === 'individuel' ? 'bg-white text-gray-900 shadow-sm': 'text-gray-600 hover:text-gray-900'}`}>
              Individuel
            </button>
            <button onClick={() => setTeamType('collectif')} className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${teamType === 'collectif'? 'bg-white text-gray-900 shadow-sm': 'text-gray-600 hover:text-gray-900'}`}>
              Collectif
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <form onSubmit={handleSubmit}>
            {/* Team Name */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Nom de l'équipe ou du joueur
              </label>
              <input
                type="text"
                name="teamName"
                value={formData.teamName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Entrez le nom..."
              />
            </div>

            {/* Logo Upload */}
            <div className="mb-6">
              <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Logo de l'équipe ou photo du joueur</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors cursor-pointer">
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="image"/>
                      <label htmlFor="image" className="cursor-pointer block">
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm text-gray-400 mb-1">Uploadez l'image ici</p>
                        <p className="text-xs text-gray-500">JPG, PNG (max 5MB)</p>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

            {/* Country */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Pays
              </label>
              <select name="country"value={formData.country} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                <option value="">Sélectionnez un pays</option>
                <option value="SN">Sénégal</option>
                <option value="FR">France</option>
                <option value="US">États-Unis</option>
                <option value="JP">Japon</option>
                <option value="OT">Autre</option>
              </select>            
            </div>

            {/* Category Select */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Catégorie
              </label>
              <select name="category" value={formData.category} onChange={handleInputChange}  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white">
                <option value="">Sélectionnez une catégorie</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nom}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Toggle */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Status
              </label>
              <button type="button" onClick={() => setFormData(prev => ({ ...prev, status: !prev.status }))} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.status ? 'bg-orange-600' : 'bg-gray-200'}`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${ formData.status ? 'translate-x-6' : 'translate-x-1'}`}/>
              </button>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3">
              <button type="button" className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                Annuler
              </button>
              <button type="submit" disabled={loading} className={`px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}> {loading ? 'Création...' : 'Créer'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
    </>
  );
};

export default CompetiteurForm;