import { useEffect, useState } from "react";
import {
    getCategories,
    getSites,
    getCompetiteurs,
    createEvent
} from "../../api/Eventapi";

export function FormEventIndividuel() {

    // =========================
    // STATES
    // =========================

    const [categories, setCategories] = useState([]);
    const [sites, setSites] = useState([]);
    const [joueurs, setJoueurs] = useState([]);

    const [categorie, setCategorie] = useState("");
    const [site, setSite] = useState("");
    const [joueur, setJoueur] = useState("");

    const [titre, setTitre] = useState("");
    const [date, setDate] = useState("");
    const [heure, setHeure] = useState("");
    const [description, setDescription] = useState("");

    const [image, setImage] = useState(null);

    const [prixVip, setPrixVip] = useState("");
    const [prixStandard, setPrixStandard] = useState("");
    const [prixPmr, setPrixPmr] = useState("");


    // =========================
    // CHARGEMENT DES DONNÉES
    // =========================

    useEffect(() => {

        const fetchData = async () => {

            try {

                const [
                    categoriesData,
                    sitesData,
                    competiteursData
                ] = await Promise.all([
                    getCategories(),
                    getSites(),
                    getCompetiteurs()
                ]);

                setCategories(categoriesData);
                setSites(sitesData);
                setJoueurs(competiteursData);

            } catch (error) {

                console.error(
                    "Erreur lors du chargement des données :",
                    error
                );

            }

        };

        fetchData();

    }, []);


    // =========================
    // IMAGE
    // =========================

    const handleImageChange = (e) => {

        const file = e.target.files[0];

        if (file) {
            setImage(file);
        }

    };


    // =========================
    // CRÉATION
    // =========================

    const handleSubmit = async (e) => {

        e.preventDefault();

        const formData = new FormData();

        formData.append("titre", titre);
        formData.append("categorie", categorie);
        formData.append("site", site);
        formData.append("date", date);
        formData.append("heure", heure);
        formData.append("description", description);

        // Événement individuel
        if (joueur) {
            formData.append("competiteurs", joueur);
        }

        if (image) {
            formData.append("image", image);
        }

        try {

            const data = await createEvent(formData);

            console.log(
                "Événement individuel créé :",
                data
            );

            handleCancel();

        } catch (error) {

            console.error(
                "Erreur lors de la création :",
                error
            );

        }

    };


    // =========================
    // ANNULER
    // =========================

    const handleCancel = () => {

        setTitre("");
        setCategorie("");
        setSite("");
        setJoueur("");
        setDate("");
        setHeure("");
        setDescription("");

        setPrixVip("");
        setPrixStandard("");
        setPrixPmr("");

        setImage(null);

    };


    // =========================
    // AFFICHAGE
    // =========================

    return (
        <form onSubmit={handleSubmit}>

            <div className="event-layout">

                {/* =========================
                    COLONNE GAUCHE
                ========================= */}

                <div className="left-column">

                    {/* INFORMATIONS GÉNÉRALES */}
                    <section className="form-card general-card">

                        <div className="card-title">
                            <span className="title-icon">✦</span>
                            <h2>Informations Générales</h2>
                        </div>

                        <div className="form-group">

                            <label>
                                TITRE DE L'ÉVÉNEMENT
                            </label>

                            <input
                                type="text"
                                placeholder="ex: Qualifications Hommes — course"
                                value={titre}
                                onChange={(e) =>
                                    setTitre(e.target.value)
                                }
                            />

                        </div>


                        <div className="form-group small-field">

                            <label>
                                CATÉGORIE
                            </label>

                            <select
                                value={categorie}
                                onChange={(e) =>
                                    setCategorie(e.target.value)
                                }
                            >

                                <option value="">
                                    Sélectionner une catégorie
                                </option>

                                {categories.map((cat) => (
                                    <option
                                        key={cat.id}
                                        value={cat.id}
                                    >
                                        {cat.nom}
                                    </option>
                                ))}

                            </select>

                        </div>


                        <div className="form-group">

                            <label>
                                SITE / LOCALISATION
                            </label>

                            <select
                                value={site}
                                onChange={(e) =>
                                    setSite(e.target.value)
                                }
                            >

                                <option value="">
                                    Sélectionner un site
                                </option>

                                {sites.map((s) => (
                                    <option
                                        key={s.id}
                                        value={s.id}
                                    >
                                        {s.nom}
                                    </option>
                                ))}

                            </select>

                        </div>

                    </section>


                    {/* JOUEUR */}
                    <div className="player-field">

                        <div className="form-group">

                            <label>
                                JOUEUR
                            </label>

                            <select
                                value={joueur}
                                onChange={(e) =>
                                    setJoueur(e.target.value)
                                }
                            >

                                <option value="">
                                    Sélectionner un joueur
                                </option>

                                {joueurs.map((j) => (
                                    <option
                                        key={j.id}
                                        value={j.id}
                                    >
                                        {j.nom}
                                    </option>
                                ))}

                            </select>

                        </div>

                    </div>


                    {/* PLANIFICATION */}
                    <section className="form-card planning-card">

                        <div className="card-title">
                            <span className="title-icon">◷</span>
                            <h2>Planification</h2>
                        </div>

                        <div className="planning-grid">

                            <div className="form-group">

                                <label>
                                    DATE DE L'ÉVÉNEMENT
                                </label>

                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) =>
                                        setDate(e.target.value)
                                    }
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    HEURE DE DÉBUT
                                </label>

                                <input
                                    type="time"
                                    value={heure}
                                    onChange={(e) =>
                                        setHeure(e.target.value)
                                    }
                                />

                            </div>

                        </div>

                    </section>


                    {/* DESCRIPTION */}
                    <section className="form-card description-card">

                        <div className="card-title">
                            <span className="title-icon">▤</span>
                            <h2>Description</h2>
                        </div>

                        <div className="form-group">

                            <label>
                                PRÉSENTATION DÉTAILLÉE DE L'ÉVÉNEMENT
                            </label>

                            <textarea
                                placeholder="Décrivez l'événement..."
                                value={description}
                                onChange={(e) =>
                                    setDescription(e.target.value)
                                }
                            />

                        </div>

                    </section>


                    {/* PRIX */}
                    <section className="form-card price-card">

                        <div className="card-title">
                            <span className="title-icon">◉</span>
                            <h2>Prix zone</h2>
                        </div>

                        <div className="price-grid">

                            <div className="form-group">

                                <label>VIP</label>

                                <input
                                    type="number"
                                    value={prixVip}
                                    onChange={(e) =>
                                        setPrixVip(e.target.value)
                                    }
                                />

                            </div>


                            <div className="form-group">

                                <label>STANDARD</label>

                                <input
                                    type="number"
                                    value={prixStandard}
                                    onChange={(e) =>
                                        setPrixStandard(e.target.value)
                                    }
                                />

                            </div>


                            <div className="form-group">

                                <label>PMR</label>

                                <input
                                    type="number"
                                    value={prixPmr}
                                    onChange={(e) =>
                                        setPrixPmr(e.target.value)
                                    }
                                />

                            </div>

                        </div>

                    </section>

                </div>


                {/* =========================
                    COLONNE DROITE
                ========================= */}

                <div className="right-column">

                    {/* MÉDIAS */}
                    <section className="form-card media-card">

                        <div className="card-title">
                            <span className="title-icon">▣</span>
                            <h2>Médias</h2>
                        </div>


                        <label
                            htmlFor="event-image-individuel"
                            className="image-upload"
                        >

                            {image ? (

                                <img
                                    src={URL.createObjectURL(image)}
                                    alt="Aperçu"
                                />

                            ) : (

                                <>
                                    <span className="upload-icon">
                                        ☁
                                    </span>

                                    <strong>
                                        Image Hero de l'événement
                                    </strong>

                                    <small>
                                        PNG, JPG jusqu'à 5MB
                                    </small>
                                </>

                            )}

                            <span className="choose-image">

                                {image
                                    ? "Changer l'image"
                                    : "Parcourir les fichiers"}

                            </span>

                        </label>


                        <input
                            id="event-image-individuel"
                            type="file"
                            accept="image/png,image/jpeg"
                            onChange={handleImageChange}
                            hidden
                        />


                        <div className="recommended">

                            <label>
                                APERÇU RECOMMANDÉ
                            </label>

                            <div className="recommended-image">

                                <img
                                    src="/images/event-preview.jpg"
                                    alt="Aperçu recommandé"
                                />

                            </div>

                        </div>

                    </section>


                    {/* ACTIONS */}
                    <div className="form-actions">

                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={handleCancel}
                        >
                            Annuler
                        </button>

                        <button
                            type="submit"
                            className="btn-submit"
                        >
                            Créer l'événement
                        </button>

                    </div>

                </div>

            </div>

        </form>
    );
}

export default FormEventIndividuel;