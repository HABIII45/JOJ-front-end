import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {CalendarDays,Clock3,MapPin,Minus, Plus,Trophy, Users,Ticket} from "lucide-react";
import {getEvents,getCategories,getSites,getCompetiteurs} from "../../api/Eventapi";
import "./EventDetail.css";

export function EventDetail() {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [categories, setCategories] = useState([]);
    const [sites, setSites] = useState([]);
    const [competiteurs, setCompetiteurs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [tickets, setTickets] = useState({
        vip: 0,
        standard: 0,
        pmr: 0
    });


    // =====================================================
    // RÉCUPÉRATION DES DONNÉES
    // =====================================================

    useEffect(() => {

        const fetchData = async () => {

            try {

                setLoading(true);
                setError("");

                /*
                 * On récupère les catégories, les sites,
                 * les compétiteurs et les événements.
                 */
                const [categoriesData,sitesData,competiteursData,firstEventsPage] = await Promise.all([getCategories(),getSites(),getCompetiteurs(),getEvents({page: 1})]);
                setCategories(Array.isArray(categoriesData)? categoriesData: []);
                setSites(Array.isArray(sitesData)? sitesData: []);

                setCompetiteurs( Array.isArray(competiteursData)? competiteursData: []);

                /*
                 * getEvents() retourne normalement :
                 *
                 * {
                 *     count: ...,
                 *     results: [...]
                 * }
                 *
                 * On cherche d'abord dans la première page.
                 */
                let events = firstEventsPage?.results || [];


                let eventFound = events.find(
                    (item) =>
                        String(item.id) === String(id)
                );


                /*
                 * Si l'événement n'est pas dans la première page,
                 * on récupère les pages suivantes.
                 *
                 * Cela évite de mettre une fausse donnée.
                 */
                if (
                    !eventFound &&
                    firstEventsPage?.count
                ) {

                    const pageSize = events.length || 10;

                    const totalPages = Math.ceil(
                        firstEventsPage.count / pageSize
                    );


                    for (
                        let page = 2;
                        page <= totalPages;
                        page++
                    ) {

                        const pageData = await getEvents({
                            page
                        });


                        const pageEvents =
                            pageData?.results || [];


                        eventFound = pageEvents.find(
                            (item) =>
                                String(item.id) === String(id)
                        );


                        if (eventFound) {
                            break;
                        }

                    }

                }


                if (!eventFound) {

                    setError(
                        "Événement introuvable."
                    );

                    return;
                }


                setEvent(eventFound);

            } catch (err) {

                console.error(
                    "Erreur lors du chargement de l'événement :",
                    err
                );

                setError(
                    "Impossible de charger les informations de l'événement."
                );

            } finally {

                setLoading(false);

            }

        };


        fetchData();

    }, [id]);


    // =====================================================
    // CHARGEMENT
    // =====================================================

    if (loading) {

        return (
            <div className="event-detail-loading">
                Chargement de l'événement...
            </div>
        );

    }


    // =====================================================
    // ERREUR
    // =====================================================

    if (error || !event) {

        return (
            <div className="event-detail-error">
                <h2>
                    {error || "Événement introuvable"}
                </h2>
            </div>
        );

    }


    // =====================================================
    // CATÉGORIE
    // =====================================================

    /*
     * Ton API renvoie déjà normalement :
     *
     * event.categorie.nom
     *
     * comme on le voit dans GestionEvents.
     *
     * On garde cependant la recherche dans categories
     * comme solution de secours.
     */

    const categorie =
        event.categorie?.nom ||
        categories.find(
            (cat) =>
                String(cat.id) ===
                String(
                    event.categorie?.id ||
                    event.categorie
                )
        )?.nom ||
        "";


    // =====================================================
    // SITE
    // =====================================================

    const site =
        event.site?.nom ||
        sites.find(
            (s) =>
                String(s.id) ===
                String(
                    event.site?.id ||
                    event.site
                )
        )?.nom ||
        "";


    // =====================================================
    // COMPÉTITEURS
    // =====================================================

    const eventCompetiteurs =
        Array.isArray(event.competiteurs)
            ? event.competiteurs
            : [];


    const getCompetiteurName = (competiteur) => {

        if (!competiteur) {
            return "";
        }

        if (typeof competiteur === "object") {

            return (
                competiteur.nom ||
                competiteur.nom_equipe ||
                competiteur.nom_complet ||
                `${competiteur.prenom || ""} ${competiteur.nom || ""}`.trim()
            );

        }


        const found = competiteurs.find(
            (item) =>
                String(item.id) ===
                String(competiteur)
        );


        return (
            found?.nom ||
            found?.nom_equipe ||
            found?.nom_complet ||
            ""
        );

    };


    // =====================================================
    // IMAGE
    // =====================================================

    const getImageUrl = (image) => {

        if (!image) {
            return "";
        }

        if (
            image.startsWith("http://") ||
            image.startsWith("https://")
        ) {
            return image;
        }

        /*
         * Si ton backend renvoie seulement :
         * /media/events/image.jpg
         *
         * on utilise l'origine actuelle du backend.
         *
         * Si ton API renvoie déjà une URL complète,
         * elle est conservée telle quelle.
         */
        return image;

    };


    const imageUrl =
        getImageUrl(event.image);


    // =====================================================
    // DATE
    // =====================================================

    const formatDate = (date) => {

        if (!date) {
            return "";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return date;
        }

        return parsedDate.toLocaleDateString(
            "fr-FR",
            {
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );

    };


    // =====================================================
    // HEURE
    // =====================================================

    const formatHeure = (heure) => {

        if (!heure) {
            return "";
        }

        return heure.substring(0, 5);

    };


    // =====================================================
    // PRIX
    // =====================================================

    /*
     * On ne met aucune valeur fictive.
     *
     * On accepte plusieurs noms possibles afin de
     * fonctionner avec la structure de ton backend.
     */

    const prixVip =
        event.prix_vip ??
        event.prixVip ??
        event.prix?.vip ??
        0;


    const prixStandard =
        event.prix_standard ??
        event.prixStandard ??
        event.prix?.standard ??
        0;


    const prixPmr =
        event.prix_pmr ??
        event.prixPmr ??
        event.prix?.pmr ??
        0;


    // =====================================================
    // TICKETS
    // =====================================================

    const updateTicket = (type, value) => {

        setTickets((previous) => ({
            ...previous,

            [type]: Math.max(
                0,
                previous[type] + value
            )
        }));

    };


    const totalTickets =
        tickets.vip +
        tickets.standard +
        tickets.pmr;


    const totalPrice =
        tickets.vip * Number(prixVip || 0) +
        tickets.standard * Number(prixStandard || 0) +
        tickets.pmr * Number(prixPmr || 0);


    // =====================================================
    // RENDU
    // =====================================================

    return (

        <div className="event-detail-page">

            {/* =================================================
                HERO
            ================================================= */}

            <section
                className="event-detail-hero"
                style={
                    imageUrl
                        ? {
                            backgroundImage:
                                `url("${imageUrl}")`
                        }
                        : undefined
                }
            >

                <div className="event-detail-hero-overlay"></div>

                <div className="event-detail-hero-content">

                    <div className="event-detail-badges">

                        {categorie && (
                            <span className="event-category-badge">
                                {categorie}
                            </span>
                        )}

                        {event.type && (
                            <span className="event-type-badge">
                                {event.type}
                            </span>
                        )}

                    </div>


                    <h1>
                        {event.titre}
                    </h1>

                </div>

            </section>


            {/* =================================================
                INFORMATIONS RAPIDES
            ================================================= */}

            <section className="event-detail-info">

                <div className="event-info-item">

                    <div className="event-info-icon">
                        <CalendarDays size={16} />
                    </div>

                    <div>

                        <span>
                            DATE DE L'ÉVÉNEMENT
                        </span>

                        <strong>
                            {formatDate(event.date)}
                        </strong>

                    </div>

                </div>


                <div className="event-info-separator"></div>


                <div className="event-info-item">

                    <div className="event-info-icon">
                        <Clock3 size={16} />
                    </div>

                    <div>

                        <span>
                            HEURE DE DÉBUT
                        </span>

                        <strong>
                            {formatHeure(event.heure)}
                        </strong>

                    </div>

                </div>


                <div className="event-info-separator"></div>


                <div className="event-info-item">

                    <div className="event-info-icon">
                        <MapPin size={16} />
                    </div>

                    <div>

                        <span>
                            SITE / LOCALISATION
                        </span>

                        <strong>
                            {site}
                        </strong>

                    </div>

                </div>

            </section>


            {/* =================================================
                CONTENU PRINCIPAL
            ================================================= */}

            <main className="event-detail-content">


                {/* =================================================
                    GAUCHE
                ================================================= */}

                <div className="event-detail-main">


                    {/* DESCRIPTION */}

                    <section className="event-description-section">

                        <h2>
                            description
                        </h2>


                        {event.description && (

                            <div className="event-description">

                                {event.description
                                    .split("\n")
                                    .map((paragraph, index) => (

                                        <p key={index}>
                                            {paragraph}
                                        </p>

                                    ))
                                }

                            </div>

                        )}

                    </section>


                    {/* SITE */}

                    <section className="event-site-section">

                        <h2>
                            Le Site :
                            {" "}
                            <strong>
                                {site}
                            </strong>
                        </h2>


                        {imageUrl && (

                            <img
                                src={imageUrl}
                                alt={event.titre}
                                className="event-site-image"
                            />

                        )}

                    </section>


                    {/* =================================================
                        CONFRONTATION
                    ================================================= */}

                    {eventCompetiteurs.length > 0 && (

                        <section className="confrontation-card">

                            <div className="confrontation-header">

                                <div className="confrontation-icon">
                                    <Trophy size={15} />
                                </div>

                                <h2>
                                    Confrontation
                                </h2>

                            </div>


                            <div className="confrontation-list">

                                {eventCompetiteurs.map(
                                    (competiteur, index) => {

                                        /*
                                         * Pour un événement collectif,
                                         * si l'API renvoie une liste
                                         * de compétiteurs, on les affiche.
                                         */

                                        const name =
                                            getCompetiteurName(
                                                competiteur
                                            );


                                        return (

                                            <div
                                                className="confrontation-row"
                                                key={
                                                    competiteur?.id ||
                                                    index
                                                }
                                            >

                                                <span>
                                                    ÉQUIPE
                                                    {" "}
                                                    {index + 1}
                                                </span>

                                                <strong>
                                                    {name}
                                                </strong>

                                            </div>

                                        );

                                    }
                                )}

                            </div>

                        </section>

                    )}


                    {/* =================================================
                        INFORMATIONS COMPLÉMENTAIRES
                    ================================================= */}

                    {eventCompetiteurs.length === 0 && (
                        <section className="event-no-confrontation">

                            <div className="event-no-confrontation-icon">
                                <Users size={15} />
                            </div>

                            <span>
                                Aucun compétiteur associé à cet événement.
                            </span>

                        </section>
                    )}

                </div>


                {/* =================================================
                    DROITE : RÉSERVATION
                ================================================= */}

                <aside className="reservation-card">

                    <div className="reservation-header">

                        <Ticket size={16} />

                        <h2>
                            Réserver vos billets
                        </h2>

                    </div>


                    {/* VIP */}

                    <div className="ticket-item">

                        <div className="ticket-info">

                            <strong>
                                Zone VIP
                            </strong>

                            <span>
                                Tribunes centrales + boissons
                            </span>

                        </div>


                        <div className="ticket-actions">

                            <strong>
                                {Number(prixVip).toLocaleString("fr-FR")}
                                {" "}
                                FCFA
                            </strong>


                            <div className="quantity-control">

                                <button
                                    type="button"
                                    onClick={() =>
                                        updateTicket(
                                            "vip",
                                            -1
                                        )
                                    }
                                >
                                    <Minus size={10} />
                                </button>


                                <span>
                                    {tickets.vip}
                                </span>


                                <button
                                    type="button"
                                    onClick={() =>
                                        updateTicket(
                                            "vip",
                                            1
                                        )
                                    }
                                >
                                    <Plus size={10} />
                                </button>

                            </div>

                        </div>

                    </div>


                    {/* STANDARD */}

                    <div className="ticket-item ticket-standard">

                        <div className="ticket-info">

                            <strong>
                                Zone Standard
                            </strong>

                            <span>
                                Gradins latéraux
                            </span>

                        </div>


                        <div className="ticket-actions">

                            <strong>
                                {Number(prixStandard).toLocaleString("fr-FR")}
                                {" "}
                                FCFA
                            </strong>


                            <div className="quantity-control">

                                <button
                                    type="button"
                                    onClick={() =>
                                        updateTicket(
                                            "standard",
                                            -1
                                        )
                                    }
                                >
                                    <Minus size={10} />
                                </button>


                                <span>
                                    {tickets.standard}
                                </span>


                                <button
                                    type="button"
                                    onClick={() =>
                                        updateTicket(
                                            "standard",
                                            1
                                        )
                                    }
                                >
                                    <Plus size={10} />
                                </button>

                            </div>

                        </div>

                    </div>


                    {/* PMR */}

                    <div className="ticket-item">

                        <div className="ticket-info">

                            <strong>
                                Zone PMR
                            </strong>

                            <span>
                                Accès facilité + accompagnant
                            </span>

                        </div>


                        <div className="ticket-actions">

                            <strong>
                                {Number(prixPmr).toLocaleString("fr-FR")}
                                {" "}
                                FCFA
                            </strong>


                            <div className="quantity-control">

                                <button
                                    type="button"
                                    onClick={() =>
                                        updateTicket(
                                            "pmr",
                                            -1
                                        )
                                    }
                                >
                                    <Minus size={10} />
                                </button>


                                <span>
                                    {tickets.pmr}
                                </span>


                                <button
                                    type="button"
                                    onClick={() =>
                                        updateTicket(
                                            "pmr",
                                            1
                                        )
                                    }
                                >
                                    <Plus size={10} />
                                </button>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        TOTAL
                    ================================================= */}

                    <div className="reservation-total">

                        <div>

                            <span>
                                Total (
                                {totalTickets}
                                {" "}
                                billet
                                {totalTickets > 1 ? "s" : ""}
                                )
                            </span>

                            <small>
                                TVA incluse, frais de réservation offerts
                            </small>

                        </div>


                        <strong>
                            {totalPrice.toLocaleString("fr-FR")}
                            {" "}
                            FCFA
                        </strong>

                    </div>


                    {/* =================================================
                        FORMULAIRE
                    ================================================= */}

                    <form
                        className="reservation-form"
                        onSubmit={(e) => {
                            e.preventDefault();
                        }}
                    >

                        <label>
                            E-mail
                        </label>

                        <input
                            type="email"
                            placeholder="Entrer votre email"
                        />


                        <label>
                            Nom
                        </label>

                        <input
                            type="text"
                            placeholder="Entrer votre nom"
                        />


                        <label>
                            Prénom
                        </label>

                        <input
                            type="text"
                            placeholder="Entrer votre prénom"
                        />


                        <button
                            type="submit"
                            className="reserve-button"
                            disabled={totalTickets === 0}
                        >
                            Réserver mon billet
                        </button>

                    </form>

                </aside>

            </main>

        </div>
    );
}


export default EventDetail;