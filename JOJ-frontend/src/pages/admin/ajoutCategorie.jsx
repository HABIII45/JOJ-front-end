import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import apiClient, { isBackendConnected } from "../../lib/api";
import { disciplinesDemo } from "../../lib/demoData";

export default function CategorieForm() {
  const navigate = useNavigate();
  const { id } = useParams(); // undefined en création, présent en édition
  const estEdition = Boolean(id);

  // Stocke les données saisies dans le formulaire
  const [chargement, setChargement] = useState(estEdition);
  const [envoi, setEnvoi] = useState(false);
  const [nom, setNom] = useState("");
  const [discipline, setDiscipline] = useState("");
  const [description, setDescription] = useState("");

  // Stocke la liste des disciplines (API ou démonstration)
  const [disciplines, setDisciplines] = useState([]);

  // Erreurs renvoyées par le serializer DRF, affichées sous chaque champ
  const [erreurs, setErreurs] = useState({});

  // Récupération des disciplines au chargement de la page
  useEffect(() => {
    let actif = true;
    if (!isBackendConnected()) {
      setDisciplines(disciplinesDemo);
      setChargement(false);
      return;
    }
    apiClient
      .get("/api/disciplines/")
      .then((r) => r.data)
      .catch(() => disciplinesDemo)
      .then((discs) => {
        if (!actif) return;
        const liste = Array.isArray(discs) ? discs : disciplinesDemo;
        setDisciplines(liste);
        setChargement(false);
      });
    return () => {
      actif = false;
    };
  }, []);

  // En mode édition : charger la catégorie existante
  useEffect(() => {
    if (!estEdition) return;
    let actif = true;
    apiClient
      .get(`/api/categories/${id}/`)
      .then((r) => r.data)
      .catch(() => null)
      .then((categorie) => {
        if (!actif) return;
        if (categorie) {
          setNom(categorie.nom || "");
          setDescription(categorie.description || "");
          if (categorie.discipline) {
            setDiscipline(
              typeof categorie.discipline === "string"
                ? categorie.discipline
                : categorie.discipline.id || ""
            );
          }
        } else {
          toast.error("Catégorie introuvable.");
          navigate("/dashboard/categories", { replace: true });
        }
        setChargement(false);
      });
    return () => {
      actif = false;
    };
  }, [estEdition, id, navigate]);

  // Validation côté client, calquée sur le serializer CategorieSerializer
  const valider = () => {
    const nouvellesErreurs = {};
    const nomNettoye = nom.trim();
    if (!nomNettoye) {
      nouvellesErreurs.nom = ["Le nom de la catégorie ne peut pas être vide."];
    } else if (nomNettoye.length < 2 || nomNettoye.length > 100) {
      nouvellesErreurs.nom = [
        "Le nom de la catégorie doit être compris entre 2 et 100 caractères.",
      ];
    }
    if (!discipline) {
      nouvellesErreurs.discipline = [
        "Veuillez sélectionner une discipline parente.",
      ];
    }
    setErreurs(nouvellesErreurs);
    return Object.keys(nouvellesErreurs).length === 0;
  };

  // Fonction appelée lors de l'envoi du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!valider()) {
      toast.error("Veuillez corriger les erreurs du formulaire.");
      return;
    }

    setEnvoi(true);
    const data = {
      nom: nom.trim(),
      discipline: discipline,
      description: description.trim(),
    };

    try {
      if (isBackendConnected()) {
        if (estEdition) {
          await apiClient.patch(`/api/categories/${id}/`, data);
        } else {
          await apiClient.post("/api/categories/", data);
        }
      }
      toast.success(
        estEdition
          ? `Catégorie « ${nom.trim()} » modifiée.`
          : `Catégorie « ${nom.trim()} » enregistrée.`
      );
      handleCancel();
      navigate("/dashboard/categories");
    } catch (erreur) {
      // Les erreurs du serializer DRF sont affichées sous chaque champ
      const reponse = erreur.response;
      if (reponse && reponse.data) {
        setErreurs(reponse.data);
        const premierChamp = Object.keys(reponse.data)[0];
        const premierMessage = Array.isArray(reponse.data[premierChamp])
          ? reponse.data[premierChamp][0]
          : String(reponse.data[premierChamp]);
        toast.error(premierMessage);
      } else {
        toast.error(
          "Impossible d'enregistrer la catégorie. Vérifiez votre connexion."
        );
      }
    } finally {
      setEnvoi(false);
    }
  };

  // Annuler = vider le formulaire et revenir à la liste
  const handleCancel = () => {
    setNom("");
    setDiscipline("");
    setDescription("");
    setErreurs({});
  };

  // Affichage d'une erreur de champ (format DRF : liste ou chaîne)
  const messageErreur = (champ) => {
    if (!erreurs[champ]) return null;
    const premier = Array.isArray(erreurs[champ])
      ? erreurs[champ][0]
      : String(erreurs[champ]);
    return (
      <p className="mt-2 text-xs font-medium text-red-600">{premier}</p>
    );
  };

  if (chargement) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-5 h-5 animate-spin text-joj-orange" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] px-4 md:px-10 py-10">
      {/* En-tête de la page */}
      <div className="mb-8">
        <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
          Administration
        </p>
        <h1 className="mt-1 text-3xl font-bold text-black font-display">
          {estEdition ? `Modifier : ${nom || "Catégorie"}` : "Nouvelle Catégorie"}
        </h1>
      </div>

      {/* Carte principale */}
      <div className="rounded-[24px] border border-[#f3e5df] bg-white px-6 md:px-10 py-10 shadow-sm">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900">
            Informations Générales
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Définissez les caractéristiques de la nouvelle catégorie sportive.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Première ligne : Nom + Discipline */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Nom de la catégorie */}
            <div>
              <label
                htmlFor="nom"
                className="mb-3 block text-sm font-semibold text-gray-700"
              >
                Nom de la catégorie
              </label>
              <input
                id="nom"
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Ex: Course de haies, 100m, etc."
                className={`w-full rounded-xl border px-4 py-4 text-sm text-gray-900 outline-none transition focus:ring-2 focus:ring-[#d96517]/10 ${
                  erreurs.nom
                    ? "border-red-300 focus:border-red-500"
                    : "border-[#f4dfd5] focus:border-[#d96517]"
                }`}
              />
              {messageErreur("nom") || (
                <p className="mt-2 text-xs text-gray-400">
                  Le nom spécifique de l'épreuve ou de la sous-discipline.
                </p>
              )}
            </div>

            {/* Discipline parente */}
            <div>
              <label
                htmlFor="discipline"
                className="mb-3 block text-sm font-semibold text-gray-700"
              >
                Discipline Parente
              </label>
              <select
                id="discipline"
                value={discipline}
                onChange={(e) => setDiscipline(e.target.value)}
                className={`w-full appearance-none rounded-xl border bg-white px-4 py-4 text-sm text-gray-900 outline-none transition focus:ring-2 focus:ring-[#d96517]/10 ${
                  erreurs.discipline
                    ? "border-red-300 focus:border-red-500"
                    : "border-[#f4dfd5] focus:border-[#d96517]"
                }`}
              >
                <option value="">Sélectionner une discipline</option>
                {disciplines.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nom}
                  </option>
                ))}
              </select>
              {messageErreur("discipline")}
            </div>
          </div>

          {/* Description */}
          <div className="mt-8">
            <label
              htmlFor="description"
              className="mb-3 block text-sm font-semibold text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="6"
              placeholder="Décrivez les règles ou les spécificités de cette catégorie..."
              className="w-full resize-none rounded-xl border border-[#f4dfd5] px-4 py-4 text-sm text-gray-900 outline-none transition focus:border-[#d96517] focus:ring-2 focus:ring-[#d96517]/10"
            />
            {messageErreur("description")}
          </div>

          {/* Boutons */}
          <div className="mt-6 flex flex-wrap justify-end gap-4">
            <button
              type="button"
              onClick={() => {
                handleCancel();
                navigate("/dashboard/categories");
              }}
              className="rounded-xl border border-gray-200 bg-white px-8 py-4 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={envoi}
              className="rounded-xl bg-black px-9 py-4 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 press-scale"
            >
              {envoi ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Enregistrement...
                </span>
              ) : estEdition ? (
                "Enregistrer les modifications"
              ) : (
                "Enregistrer la catégorie"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
