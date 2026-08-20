import { useState } from "react";
import { createSite } from "../../services/sites";

const SiteForm = () => {
  const [nom, setNom] = useState('');
  const [capacite, setCapacite] = useState('');
  const [description, setDescription] = useState('');
  const [service, setService] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [ville, setVille] = useState('');
  const [region, setRegion] = useState('');
  const [capaciteStandard, setCapaciteStandard] = useState('');
  const [capaciteVip, setCapaciteVip] = useState('');
  const [capacitePmr, setCapacitePmr] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [loading, setLoading] = useState(false); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 
    try {
      const siteData = {
        nom,
        capacite: parseInt(capacite) || 0, 
        capaciteStandard: parseInt(capaciteStandard) || 0,
        capaciteVip: parseInt(capaciteVip) || 0,
        capacitePmr: parseInt(capacitePmr) || 0,
        description,
        ville,
        region,
        latitude: parseFloat(latitude) || 0, 
        longitude: parseFloat(longitude) || 0,
        service
      };
      
      await createSite(siteData);
      alert('Site créé avec succès');
      
      setNom(''); setCapacite(''); setDescription(''); setService('');
      setLatitude(''); setLongitude(''); setVille(''); setRegion('');
      setCapaciteStandard(''); setCapaciteVip(''); setCapacitePmr('');
      
    } catch (error) {
      console.error("Erreur lors de la création d'un nouveau site", error);
      alert("Erreur lors de la création du site");
    } finally {
      setLoading(false); 
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            Ajouter un nouveau site
          </h1>
          <p className="text-gray-400">
            Configurez un nouveau lieu officiel pour les compétitions.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              
              {/* Informations du Site */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Informations du Site
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">NOM DU SITE</label>
                    <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="ex: Arena Dakar" required/>
                  </div>
                  

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">REGION</label>
                      <input type="text" value={region} onChange={(e) => setRegion(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Dakar"/>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">VILLE</label>
                      <input type="text" value={ville} onChange={(e) => setVille(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="Diamniadio"/>
                    </div>
                  </div>
                </div>
              </div>

              {/* Zones et Capacités */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Zones et Capacités
                </h2>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-400 mb-1">CAPACITÉ TOTALE</label>
                    <input type="number" value={capacite} onChange={(e) => setCapacite(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="ex: 15000" required/>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">STANDARD</label>
                    <input type="number" value={capaciteStandard} onChange={(e) => setCapaciteStandard(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="ex: 10000"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">VIP</label>
                    <input type="number" value={capaciteVip} onChange={(e) => setCapaciteVip(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="ex: 500"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">PMR</label>
                    <input type="number" value={capacitePmr} onChange={(e) => setCapacitePmr(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="ex: 50"/>
                  </div>
                </div>
              </div>

              {/* Description & Services */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                  Description & Services
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">PRÉSENTATION DÉTAILLÉE</label>
                    <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none" placeholder="Décrivez les infrastructures..."/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">SERVICES DISPONIBLES</label>
                    <textarea rows={2} value={service} onChange={(e) => setService(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none" placeholder="ex: Restauration, Parking, Wifi..."/>
                  </div>
                </div>
              </div>
            </div>

            {/* Colonne Latérale */}
            <div className="space-y-6">
              
              {/* Localisation GPS */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Coordonnées GPS
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">LATITUDE</label>
                    <input type="number" step="any" value={latitude} onChange={(e) => setLatitude(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="ex: 14.716677"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">LONGITUDE</label>
                    <input type="number" step="any" value={longitude} onChange={(e) => setLongitude(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="ex: -17.467686"/>
                  </div>
                </div>
              </div>

              {/* Médias */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Médias
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">IMAGE DE COUVERTURE</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer">
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="cover-image"/>
                      <label htmlFor="cover-image" className="cursor-pointer block">
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm text-gray-400 mb-1">Uploadez l'image ici</p>
                        <p className="text-xs text-gray-500">JPG, PNG (max 5MB)</p>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">APERÇU DU SITE</label>
                    <div className="rounded-lg overflow-hidden border border-gray-200">
                      {coverImage ? (<img src={URL.createObjectURL(coverImage)} alt="Aperçu du site" className="w-full h-48 object-cover" />) : (<div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">Aucune image</div>)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Boutons */}
              <div className="flex space-x-3 pt-4">
                <button type="button" onClick={() => window.history.back()} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  Annuler
                </button>
                <button type="submit" disabled={loading} className={`flex-1 px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors ${loading ? 'bg-orange-400 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700'}`}>
                  {loading ? 'Enregistrement...' : 'Enregistrer le site'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SiteForm;