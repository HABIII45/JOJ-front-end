import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../../components/layouts/AdminLayout";
export function AjoutCategorie() {
    // Stocke les données saisies dans le formulaire
    const [nom, setNom] = useState("");
    const [discipline, setDiscipline] = useState("");
    const [description, setDescription] = useState("");

    // Stocke la liste des disciplines récupérées depuis l'API
    const [disciplines, setDisciplines] = useState([]);

    // Permet d'afficher un message pendant l'enregistrement
    const [loading, setLoading] = useState(false);

    // Message de succès ou d'erreur
    const [message, setMessage] = useState("");

    // Récupération des disciplines au chargement de la page
    useEffect(() => {
        const recupererDisciplines = async () => {
            try {
                const response = await axios.get(
                    "http://127.0.0.1:8000/api/disciplines/"
                );

                setDisciplines(response.data.results || response.data);
            } catch (error) {
                console.error(
                    "Erreur lors du chargement des disciplines :",
                    error
                );
                setMessage("Impossible de charger les disciplines.");
            }
        };

        recupererDisciplines();
    }, []);

    // Fonction appelée lors de l'envoi du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Vérification simple des champs obligatoires
        if (!nom.trim() || !discipline) {
            setMessage("Veuillez remplir les champs obligatoires.");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            // Données envoyées au backend
            const data = {
                nom: nom,
                discipline: discipline,
                description: description,
            };

            // Envoi de la requête POST
            await axios.post(
                "http://127.0.0.1:8000/api/categories/",
                data
            );

            setMessage("Catégorie enregistrée avec succès.");

            // Réinitialisation du formulaire
            // setNom("");
            // setDiscipline("");
            // setDescription("");
            handleCancel()

        } catch (error) {
            console.error(
                "Erreur lors de l'enregistrement :",
                error.response?.data || error
            );

            setMessage(
                error.response?.data?.detail ||
                "Une erreur est survenue lors de l'enregistrement."
            );
        } finally {
            setLoading(false);
        }
    };

    // Annuler = vider le formulaire
    const handleCancel = () => {
        setNom("");
        setDiscipline("");
        setDescription("");
        setMessage("");
    };

    return (
        <AdminLayout>
        <div className=" min-h-screen bg-[#f8f9fa] px-10 py-10">

            {/* En-tête de la page */}
            <div className="mb-8">
                <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
                    Administration
                </p>

                <h1 className="mt-1 text-3xl font-bold text-black">
                    Nouvelle Catégorie
                </h1>
            </div>

            {/* Carte principale */}
            <div className="rounded-[24px] border border-[#f3e5df] bg-white px-10 py-10 shadow-sm">

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
                                className="w-full rounded-xl border border-[#f4dfd5] px-4 py-4 text-sm text-gray-900 outline-none transition focus:border-[#d96517] focus:ring-2 focus:ring-[#d96517]/10"
                            />

                            <p className="mt-2 text-xs text-gray-400">
                                Le nom spécifique de l'épreuve ou de la sous-discipline.
                            </p>
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
                                className="w-full appearance-none rounded-xl border border-[#f4dfd5] bg-white px-4 py-4 text-sm text-gray-900 outline-none transition focus:border-[#d96517] focus:ring-2 focus:ring-[#d96517]/10"
                            >
                                <option value="">
                                    Sélectionner une discipline
                                </option>

                                {disciplines.map((item) => (
                                    <option
                                        key={item.id}
                                        value={item.id}
                                    >
                                        {item.nom}
                                    </option>
                                ))}
                            </select>
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
                    </div>

                    {/* Message */}
                    {message && (
                        <p className="mt-4 text-sm font-medium text-gray-600">
                            {message}
                        </p>
                    )}

                    {/* Boutons */}
                    <div className="mt-6 flex justify-end gap-4">

                        <button
                            type="button"
                            onClick={handleCancel}
                            className="rounded-xl border border-gray-200 bg-white px-8 py-4 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
                        >
                            Annuler
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-xl bg-black px-9 py-4 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading
                                ? "Enregistrement..."
                                : "Enregistrer la catégorie"}
                        </button>

                    </div>

                </form>
            </div>
        </div>
        </AdminLayout>
    );
}
