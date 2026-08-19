import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Search, Filter, Plus } from "lucide-react";
import "./GestionEvents.css";
import { getEvents,getSites } from "../../api/Eventapi";

export function GestionEvents() {

    const navigate = useNavigate();

    // =========================
    // ÉTATS
    // =========================

    const [events, setEvents] = useState([]);
    
    const [siteFiltre, setSiteFiltre] = useState("");

    // Recherche
    const [recherche, setRecherche] = useState("");

    // Filtres
    const [sites, setSites] = useState([]);
    const [site, setSite] = useState("");
    const [categorie, setCategorie] = useState("");
    const [date, setDate] = useState("");
    const [heure, setHeure] = useState("");

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // États de chargement
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    // =========================
    // RÉCUPÉRATION DES EVENTS
    // =========================

    // useEffect(() => {

    //     const fetchEvents = async () => {

    //         try {

    //             setLoading(true);
    //             setError(null);

    //             const data = await getEvents({

    //                 recherche: recherche,

    //                 site_id: site,

    //                 categorie_id: categorie,

    //                 date: date,

    //                 heure: heure,

    //                 page: currentPage

    //             });

    //             // Les événements de la page actuelle
    //             setEvents(data.results);

    //             // Nombre total de pages
    //             setTotalPages(
    //                 Math.ceil(data.count / 10)
    //             );

    //         } catch (error) {

    //             console.error(
    //                 "Erreur lors du chargement des événements :",
    //                 error
    //             );

    //             setError(
    //                 "Impossible de charger les événements."
    //             );
    //         } finally {
    //             setLoading(false);

    //         }
    //     };

    //     fetchEvents();

    // }, [
    //     recherche,
    //     site,
    //     categorie,
    //     date,
    //     heure,
    //     currentPage
    // ]);
useEffect(() => {

    const fetchEvents = async () => {

        try {

            setLoading(true);

            const data = await getEvents({

                recherche,

                site_id: siteFiltre,

                page: currentPage

            });

            setEvents(data.results);

            setTotalPages(
                Math.ceil(data.count / 10)
            );

        } catch (error) {

            console.error(error);

            setError(
                "Impossible de charger les événements."
            );

        } finally {

            setLoading(false);

        }

    };

    fetchEvents();

}, [
    recherche,
    siteFiltre,
    currentPage
]);
useEffect(() => {

    const fetchSites = async () => {

        try {

            const data = await getSites();

            setSites(data);

        } catch (error) {

            console.error(
                "Erreur lors du chargement des sites :",
                error
            );

        }

    };

    fetchSites();

}, []);

    // =========================
    // RECHERCHE
    // =========================

    const handleRecherche = (e) => {

        setRecherche(e.target.value);

        // Quand on fait une nouvelle recherche,
        // on revient à la première page.
        setCurrentPage(1);

    };


    // =========================
    // PAGINATION
    // =========================

    const pagePrecedente = () => {

        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }

    };


    const pageSuivante = () => {

        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }

    };


    // =========================
    // AFFICHAGE
    // =========================

    return (

        <div className="gestion-events">

            {/* =========================
                TITRE + BOUTON
            ========================= */}

            <div className="section1">

                <div className="titre-desc">

                    <h3>
                        Gestion des Événements
                    </h3>

                    <p>
                        Gérez le calendrier et les détails
                        des compétitions
                    </p>

                </div>


                <div className="boutton">

                    <button
                        onClick={() =>
                            navigate("/events/create")
                        }
                    >

                        <Plus size={17} />

                        Ajouter un événement

                    </button>

                </div>

            </div>


            {/* =========================
                RECHERCHE + FILTRE
            ========================= */}

            <div className="recherche">

    {/* RECHERCHE */}

    <div className="barre-recherche">

        <label htmlFor="recherche">
            Recherche
        </label>

        <div className="input-recherche">

            <Search size={18} />

            <input
                id="recherche"
                type="text"
                placeholder="Nom de l'événement..."
                value={recherche}
                onChange={handleRecherche}
            />

        </div>

    </div>


    {/* SITE */}

    <div className="filtre-site">

        <label htmlFor="site">
            Site
        </label>

        <select
            id="site"
            value={site}
            onChange={(e) => setSite(e.target.value)}
        >

            <option value="">
                Tous les sites
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


    {/* BOUTON FILTRER */}

    <button
        type="button"
        className="filter-button"
        onClick={() => {

            setSiteFiltre(site);
            setCurrentPage(1);

        }}
    >

        <Filter size={17} />

        Filtrer

    </button>

</div>

            {/* =========================
                TABLEAU
            ========================= */}

            <div className="events-table-container">

                {loading && (

                    <p className="table-message">
                        Chargement des événements...
                    </p>

                )}


                {error && !loading && (

                    <p className="table-message error">
                        {error}
                    </p>

                )}


                {!loading && !error && (

                    <table className="events-table">

                        <thead>

                            <tr>

                                <th>ÉVÉNEMENT</th>

                                <th>DISCIPLINE</th>

                                <th>SITE</th>

                                <th>DATE</th>

                                <th>HEURE</th>

                                <th>PRIX</th>

                                <th>STATUT</th>

                                <th>ACTION</th>

                            </tr>

                        </thead>


                        <tbody>

                            {events.length > 0 ? (

                                events.map((event) => (

                                    <tr key={event.id}>

                                        <td>
                                            <div className="event-name">
                                                {event.titre}
                                            </div>
                                        </td>


                                        <td>
                                            {event.categorie?.nom || "-"}
                                        </td>


                                        <td>
                                            {event.site?.nom || "-"}
                                        </td>


                                        <td>
                                            {event.date || "-"}
                                        </td>


                                        <td>
                                            {event.heure || "-"}
                                        </td>


                                        <td>
                                            {event.prix || "-"}
                                        </td>


                                        <td>

                                            <span className="event-status">

                                                {event.statut || "À venir"}

                                            </span>

                                        </td>


                                        <td>

                                            <div className="event-actions">

                                                <button
                                                    onClick={() =>
                                                        navigate(
                                                            `/events/${event.id}`
                                                        )
                                                    }
                                                >
                                                    Voir
                                                </button>


                                                <button
                                                    onClick={() =>
                                                        navigate(
                                                            `/events/${event.id}/edit`
                                                        )
                                                    }
                                                >
                                                    Modifier
                                                </button>


                                                <button
                                                    className="delete-btn"
                                                >
                                                    Supprimer
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))

                            ) : (

                                <tr>

                                    <td
                                        colSpan="8"
                                        className="empty-table"
                                    >
                                        Aucun événement trouvé
                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                )}

            </div>


            {/* =========================
                PAGINATION
            ========================= */}

            {!loading && !error && totalPages > 1 && (

                <div className="pagination">

                    <button
                        type="button"
                        disabled={currentPage === 1}
                        onClick={pagePrecedente}
                    >
                        Précédent
                    </button>


                    <span>
                        Page {currentPage} sur {totalPages}
                    </span>


                    <button
                        type="button"
                        disabled={
                            currentPage === totalPages
                        }
                        onClick={pageSuivante}
                    >
                        Suivant
                    </button>

                </div>

            )}

        </div>
    );
}

export default GestionEvents;