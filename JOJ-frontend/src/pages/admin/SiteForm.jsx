import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createSite, getSpecificSite, updateSite } from "../../services/sites";
import { getImageUrl } from "../../api/api";
import AdminLayout from "../../components/layouts/AdminLayout";
import { Building2, ArrowLeft, Upload, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

const SiteForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const estModification = Boolean(id);

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
  const [imagePreview, setImagePreview] = useState(null);
  
  const [chargementInitial, setChargementInitial] = useState(estModification);
  const [loading, setLoading] = useState(false);
  const [messageSucces, setMessageSucces] = useState("");
  const [messageErreur, setMessageErreur] = useState("");

  // Pré-remplissage en mode modification
  useEffect(() => {
    if (!estModification) return;

    let actif = true;
    async function chargerDonneesSite() {
      try {
        setChargementInitial(true);
        const data = await getSpecificSite(id);
        if (!actif) return;

        setNom(data.nom || '');
        setCapacite(data.capacite ? String(data.capacite) : '');
        setVille(data.ville || '');
        setRegion(data.region || '');
        setDescription(data.description || '');
        setService(data.service || '');
        setLatitude(data.latitude ? String(data.latitude) : '');
        setLongitude(data.longitude ? String(data.longitude) : '');
        setCapaciteStandard(data.capacite_standard || data.capaciteStandard ? String(data.capacite_standard || data.capaciteStandard) : '');
        setCapaciteVip(data.capacite_vip || data.capaciteVip ? String(data.capacite_vip || data.capaciteVip) : '');
        setCapacitePmr(data.capacite_pmr || data.capacitePmr ? String(data.capacite_pmr || data.capacitePmr) : '');

        if (data.image) {
          setImagePreview(getImageUrl(data.image));
        }
      } catch (err) {
        console.error("Erreur chargement site à modifier:", err);
        setMessageErreur("Impossible de charger les données du site.");
      } finally {
        if (actif) setChargementInitial(false);
      }
    }

    chargerDonneesSite();
    return () => { actif = false; };
  }, [id, estModification]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessageErreur("");
    setMessageSucces("");

    try {
      const formData = new FormData();
      formData.append("nom", nom.trim());
      formData.append("capacite", parseInt(capacite) || 0);
      if (ville.trim()) formData.append("ville", ville.trim());
      if (region.trim()) formData.append("region", region.trim());
      if (description.trim()) formData.append("description", description.trim());
      if (service.trim()) formData.append("service", service.trim());
      if (latitude) formData.append("latitude", parseFloat(latitude) || 0);
      if (longitude) formData.append("longitude", parseFloat(longitude) || 0);
      if (capaciteStandard) formData.append("capacite_standard", parseInt(capaciteStandard) || 0);
      if (capaciteVip) formData.append("capacite_vip", parseInt(capaciteVip) || 0);
      if (capacitePmr) formData.append("capacite_pmr", parseInt(capacitePmr) || 0);

      if (coverImage) {
        formData.append("image", coverImage);
      }

      if (estModification) {
        await updateSite(id, formData);
        setMessageSucces("Le site a été modifié avec succès !");
      } else {
        await createSite(formData);
        setMessageSucces("Nouveau site créé avec succès !");
      }

      setTimeout(() => {
        navigate("/admin/sites");
      }, 1000);
    } catch (error) {
      console.error("Erreur enregistrement site:", error);
      const data = error?.response?.data;
      if (data) {
        const errorMsg = Object.values(data).flat().join(" ");
        setMessageErreur(errorMsg || "Une erreur est survenue lors de l'enregistrement.");
      } else {
        setMessageErreur("Erreur de communication avec le serveur.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (chargementInitial) {
    return (
      <AdminLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-gray-400">
          <Loader2 className="w-8 h-8 text-[#C25B1E] animate-spin" />
          <span className="text-sm font-medium">Chargement des données du site...</span>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* En-tête */}
        <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
              <Building2 size={15} className="text-[#C25B1E]" />
              <span>{estModification ? "Modification de site" : "Nouveau site olympique"}</span>
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              {estModification ? `Modifier le site : ${nom || "Site"}` : "Créer un nouveau site"}
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              {estModification
                ? "Modifiez les informations techniques, la capacité d'accueil et l'image du site."
                : "Configurez un nouveau lieu officiel pour accueillir les compétitions JOJ 2026."}
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/admin/sites")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} />
            Retour aux sites
          </button>
        </div>

        {messageSucces && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2">
            <CheckCircle2 size={16} />
            {messageSucces}
          </div>
        )}

        {messageErreur && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-xs font-bold rounded-2xl flex items-center gap-2">
            <AlertCircle size={16} />
            {messageErreur}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne Principale */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Informations Générales */}
            <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100 space-y-4">
              <h2 className="text-base font-bold text-gray-900">
                Informations Principales
              </h2>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Nom officiel du site *
                </label>
                <input
                  type="text"
                  required
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  className="w-full px-4 py-3 bg-[#F8FAFC] border border-gray-200 rounded-2xl text-xs text-gray-800 outline-none focus:border-[#C25B1E] transition-all"
                  placeholder="Ex: Arena Dakar"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Région
                  </label>
                  <input
                    type="text"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full px-4 py-3 bg-[#F8FAFC] border border-gray-200 rounded-2xl text-xs text-gray-800 outline-none focus:border-[#C25B1E] transition-all"
                    placeholder="Ex: Dakar"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Ville / Commune
                  </label>
                  <input
                    type="text"
                    value={ville}
                    onChange={(e) => setVille(e.target.value)}
                    className="w-full px-4 py-3 bg-[#F8FAFC] border border-gray-200 rounded-2xl text-xs text-gray-800 outline-none focus:border-[#C25B1E] transition-all"
                    placeholder="Ex: Diamniadio"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Capacité totale (Spectateurs) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={capacite}
                  onChange={(e) => setCapacite(e.target.value)}
                  className="w-full px-4 py-3 bg-[#F8FAFC] border border-gray-200 rounded-2xl text-xs text-gray-800 outline-none focus:border-[#C25B1E] transition-all"
                  placeholder="Ex: 15000"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Description & Spécificités du site
                </label>
                <textarea
                  rows="4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 bg-[#F8FAFC] border border-gray-200 rounded-2xl text-xs text-gray-800 outline-none focus:border-[#C25B1E] transition-all"
                  placeholder="Détails sur l'infrastructure, accès et commodités..."
                />
              </div>
            </div>

            {/* Répartition des Capacités */}
            <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100 space-y-4">
              <h2 className="text-base font-bold text-gray-900">
                Répartition des Zones & Places
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1.5">
                    Tribune Standard
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={capaciteStandard}
                    onChange={(e) => setCapaciteStandard(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#F8FAFC] border border-gray-200 rounded-xl text-xs text-gray-800 outline-none focus:border-[#C25B1E]"
                    placeholder="12000"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1.5">
                    Tribune VIP
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={capaciteVip}
                    onChange={(e) => setCapaciteVip(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#F8FAFC] border border-gray-200 rounded-xl text-xs text-gray-800 outline-none focus:border-[#C25B1E]"
                    placeholder="2500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1.5">
                    Accès PMR
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={capacitePmr}
                    onChange={(e) => setCapacitePmr(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#F8FAFC] border border-gray-200 rounded-xl text-xs text-gray-800 outline-none focus:border-[#C25B1E]"
                    placeholder="500"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Colonne Latérale : Image & Actions */}
          <div className="space-y-6">

            {/* Photo du Site */}
            <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-base font-bold text-gray-900 mb-3">
                Photo du Site
              </h2>

              <div className="border-2 border-dashed border-gray-200 rounded-2xl p-4 text-center hover:border-gray-300 transition-colors">
                {imagePreview ? (
                  <div className="space-y-3">
                    <img
                      src={imagePreview}
                      alt="Aperçu du site"
                      className="w-full h-40 object-cover rounded-xl border border-gray-200"
                    />
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700 cursor-pointer transition-colors">
                      <Upload size={13} />
                      Changer la photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-36 cursor-pointer">
                    <Upload size={28} className="text-gray-400 mb-2" />
                    <span className="text-xs font-bold text-gray-700">Importer une image</span>
                    <span className="text-[10px] text-gray-400 mt-0.5">PNG, JPG jusqu'à 5MB</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Boutons d'Action */}
            <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100 space-y-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-[#C25B1E] hover:bg-[#A04816] disabled:opacity-50 text-white text-xs font-bold rounded-2xl shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  estModification ? "Modifier le site" : "Enregistrer le site"
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate("/admin/sites")}
                className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-2xl transition-colors cursor-pointer"
              >
                Annuler
              </button>
            </div>

          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default SiteForm;