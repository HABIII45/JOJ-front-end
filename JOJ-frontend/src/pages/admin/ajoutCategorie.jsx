import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, Tags, Trophy, CheckCircle, AlertCircle } from "lucide-react";
import AdminLayout from "../../components/layouts/AdminLayout";
import api from "../../api/api";

export function AjoutCategorie() {
  const navigate = useNavigate();
  const { id } = useParams();
  const estEdition = Boolean(id);

  const [chargement, setChargement] = useState(estEdition);
  const [envoi, setEnvoi] = useState(false);
  const [nom, setNom] = useState("");
  const [discipline, setDiscipline] = useState("");
  const [description, setDescription] = useState("");
  const [disciplines, setDisciplines] = useState([]);
  const [erreurs, setErreurs] = useState({});
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  // Récupération des disciplines depuis la base de données
  useEffect(() => {
    const recupererDisciplines = async () => {
      try {
        const res = await api.get("/api/disciplines/?page_size=100");
        const data = res.data;
        setDisciplines(Array.isArray(data) ? data : data.results ?? []);
      } catch (error) {
        console.error("Erreur lors du chargement des disciplines :", error);
      }
    };
    recupererDisciplines();
  }, []);

  // Mode édition : charger les données existantes de la catégorie
  useEffect(() => {
    if (!estEdition) return;

    const chargerCategorie = async () => {
      try {
        setChargement(true);
        const res = await api.get(`/api/categories/${id}/`);
        const cat = res.data;
        if (cat) {
          setNom(cat.nom || "");
          setDescription(cat.description || "");
          setDiscipline(
            typeof cat.discipline === "object"
              ? cat.discipline.id || ""
              : cat.discipline || ""
          );
        }
      } catch (error) {
        console.error("Erreur chargement catégorie:", error);
        alert("Catégorie introuvable.");
        navigate("/admin/categories");
      } finally {
        setChargement(false);
      }
    };

    chargerCategorie();
  }, [estEdition, id, navigate]);

  // Validation formulaire
  const valider = () => {
    const err = {};
    if (!nom.trim()) {
      err.nom = "Le nom de la catégorie est obligatoire.";
    }
    if (!discipline) {
      err.discipline = "Veuillez sélectionner une discipline parente.";
    }
    setErreurs(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!valider()) return;

    try {
      setEnvoi(true);
      setMessage("");

      const payload = {
        nom: nom.trim(),
        discipline: Number(discipline),
        description: description.trim(),
      };

      if (estEdition) {
        await api.patch(`/api/categories/${id}/`, payload);
      } else {
        await api.post("/api/categories/", payload);
      }

      setMessageType("success");
      setMessage(estEdition ? "Catégorie modifiée avec succès !" : "Catégorie créée avec succès !");

      setTimeout(() => {
        navigate("/admin/categories");
      }, 1000);
    } catch (err) {
      console.error("Erreur enregistrement catégorie :", err);
      setMessageType("error");
      const errData = err.response?.data;
      if (errData) {
        const premierMessage = Object.values(errData).flat().join(" ");
        setMessage(premierMessage || "Une erreur est survenue lors de l'enregistrement.");
      } else {
        setMessage("Impossible de joindre le serveur pour enregistrer la catégorie.");
      }
    } finally {
      setEnvoi(false);
    }
  };

  if (chargement) {
    return (
      <AdminLayout>
        <div className="py-24 text-center text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin text-[#C25B1E] mx-auto mb-3" />
          <p className="text-sm font-semibold">Chargement des données de la catégorie...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <button
          type="button"
          onClick={() => navigate("/admin/categories")}
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
        >
          <ArrowLeft size={15} /> Retour aux catégories
        </button>

        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-sm space-y-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-50 text-[#C25B1E] flex items-center justify-center shrink-0">
                <Tags size={20} />
              </div>
              {estEdition ? `Modifier la catégorie : ${nom || "..."}` : "Créer une nouvelle catégorie"}
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Renseignez le nom, la discipline associée et les spécificités de l'épreuve.
            </p>
          </div>

          {message && (
            <div
              className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-bold border ${
                messageType === "success"
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : "bg-red-50 text-red-800 border-red-200"
              }`}
            >
              {messageType === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
              <span>{message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Nom */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">
                  Nom de la catégorie *
                </label>
                <input
                  type="text"
                  required
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  placeholder="Ex: 100m Hommes, Moins de 73kg, etc."
                  className={`w-full text-xs sm:text-sm p-3.5 bg-gray-50 border rounded-2xl focus:border-[#C25B1E] outline-none transition-all ${
                    erreurs.nom ? "border-red-400" : "border-gray-200"
                  }`}
                />
                {erreurs.nom && <p className="text-xs text-red-500 mt-1.5">{erreurs.nom}</p>}
              </div>

              {/* Discipline parente */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">
                  Discipline Parente *
                </label>
                <select
                  required
                  value={discipline}
                  onChange={(e) => setDiscipline(e.target.value)}
                  className={`w-full text-xs sm:text-sm p-3.5 bg-gray-50 border rounded-2xl focus:border-[#C25B1E] outline-none transition-all ${
                    erreurs.discipline ? "border-red-400" : "border-gray-200"
                  }`}
                >
                  <option value="">Sélectionner une discipline</option>
                  {disciplines.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.nom}
                    </option>
                  ))}
                </select>
                {erreurs.discipline && <p className="text-xs text-red-500 mt-1.5">{erreurs.discipline}</p>}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">
                Description & Réglementation
              </label>
              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Précisez les critères d'éligibilité, les formats ou règles spécifiques..."
                className="w-full text-xs sm:text-sm p-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:border-[#C25B1E] outline-none transition-all"
              />
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate("/admin/categories")}
                className="px-6 py-3 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-2xl text-xs sm:text-sm font-bold transition-colors cursor-pointer"
              >
                Annuler
              </button>

              <button
                type="submit"
                disabled={envoi}
                className="px-8 py-3 bg-[#C25B1E] hover:bg-[#A04816] disabled:opacity-50 text-white rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-2"
              >
                {envoi ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Enregistrement...
                  </>
                ) : estEdition ? (
                  "Modifier la catégorie"
                ) : (
                  "Créer la catégorie"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AjoutCategorie;