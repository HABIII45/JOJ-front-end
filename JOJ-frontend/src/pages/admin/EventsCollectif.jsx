import { useEffect, useState } from "react";
import {
    getCategories,
    getSites,
    getCompetiteurs,
    createEvent
} from "../../api/Eventapi";

export function FormEventCollectif() {

    const [categories, setCategories] = useState([]);
    const [sites, setSites] = useState([]);
    const [equipes, setEquipes] = useState([]);

    const [categorie, setCategorie] = useState("");
    const [site, setSite] = useState("");
    // const [equipe, setEquipe] = useState("");
    const [equipe1, setEquipe1] = useState("");
    const [equipe2, setEquipe2] = useState("");

    const [titre, setTitre] = useState("");
    const [date, setDate] = useState("");
    const [heure, setHeure] = useState("");
    const [description, setDescription] = useState("");

    const [image, setImage] = useState(null);

    const [prixVip, setPrixVip] = useState("");
    const [prixStandard, setPrixStandard] = useState("");
    const [prixPmr, setPrixPmr] = useState("");


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

                /*
                 * Pour l'instant on récupère les compétiteurs.
                 * Il faudra filtrer les équipes lorsque ton
                 * endpoint permettra de les identifier.
                 */
                setEquipes(competiteursData);

            } catch (error) {

                console.error(
                    "Erreur lors du chargement des données :",
                    error
                );

            }

        };

        fetchData();

    }, []);


    const handleImageChange = (e) => {

        const file = e.target.files[0];

        if (file) {
            setImage(file);
        }

    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        const formData = new FormData();

        formData.append("titre", titre);
        formData.append("categorie", categorie);
        formData.append("site", site);
        formData.append("date", date);
        formData.append("heure", heure);
        formData.append("description", description);

        if (equipe) {
            formData.append("competiteurs", equipe);
        }

        if (image) {
            formData.append("image", image);
        }

        try {

            const data = await createEvent(formData);

            // console.log(
            //     "Événement collectif créé :",
            //     data
            // );

            handleCancel();

        } catch (error) {

            console.error(
                "Erreur lors de la création :",
                error
            );

        }

    };


    const handleCancel = () => {

        setTitre("");
        setCategorie("");
        setSite("");
        setEquipe("");
        setDate("");
        setHeure("");
        setDescription("");

        setPrixVip("");
        setPrixStandard("");
        setPrixPmr("");

        setImage(null);

    };


    return (
        
        <form onSubmit={handleSubmit}>
          
            <div className="event-layout">
                   
                {/* COLONNE GAUCHE */}

                <div className="left-column">

                    <section className="form-card general-card">

                        <div className="card-title">

                            <span className="title-icon">
                                ✦
                            </span>

                            <h2>
                                Informations Générales
                            </h2>

                        </div>


                        <div className="form-group">

                            <label>
                                TITRE DE L'ÉVÉNEMENT
                            </label>

                            <input
                                type="text"
                                placeholder="ex: Match de basketball"
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


                    {/* ÉQUIPE */}

                    <div className="player-field">

    {/* ÉQUIPE 1 */}
    <div className="form-group">

        <label>
            ÉQUIPE 1
        </label>

        <select
            value={equipe1}
            onChange={(e) => setEquipe1(e.target.value)}
        >
            <option value="">
                Sélectionner l'équipe 1
            </option>

            {equipes.map((e) => (
                <option
                    key={e.id}
                    value={e.id}
                    disabled={String(e.id) === String(equipe2)}
                >
                    {e.nom}
                </option>
            ))}
        </select>

    </div>


    {/* ÉQUIPE 2 */}
    <div className="form-group">

        <label>
            ÉQUIPE 2
        </label>

        <select
            value={equipe2}
            onChange={(e) => setEquipe2(e.target.value)}
        >
            <option value="">
                Sélectionner l'équipe 2
            </option>

            {equipes.map((e) => (
                <option
                    key={e.id}
                    value={e.id}
                    disabled={String(e.id) === String(equipe1)}
                >
                    {e.nom}
                </option>
            ))}
        </select>

    </div>

</div>

                    {/* PLANIFICATION */}

                    <section className="form-card planning-card">

                        <div className="card-title">

                            <span className="title-icon">
                                ◷
                            </span>

                            <h2>
                                Planification
                            </h2>

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

                            <span className="title-icon">
                                ▤
                            </span>

                            <h2>
                                Description
                            </h2>

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

                            <span className="title-icon">
                                ◉
                            </span>

                            <h2>
                                Prix zone
                            </h2>

                        </div>


                        <div className="price-grid">

                            <div className="form-group">

                                <label>
                                    VIP
                                </label>

                                <input
                                    type="number"
                                    value={prixVip}
                                    onChange={(e) =>
                                        setPrixVip(e.target.value)
                                    }
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    STANDARD
                                </label>

                                <input
                                    type="number"
                                    value={prixStandard}
                                    onChange={(e) =>
                                        setPrixStandard(e.target.value)
                                    }
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    PMR
                                </label>

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


                {/* COLONNE DROITE */}

                <div className="right-column">

                    <section className="form-card media-card">

                        <div className="card-title">

                            <span className="title-icon">
                                ▣
                            </span>

                            <h2>
                                Médias
                            </h2>

                        </div>


                        <label
                            htmlFor="event-image-collectif"
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
                            id="event-image-collectif"
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

export default FormEventCollectif;