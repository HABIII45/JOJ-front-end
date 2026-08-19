import { ListeDiscipline } from "../../services/listeDisciplines";
import { useState, useEffect } from "react";
import AdminLayout from "../../components/layouts/AdminLayout";

import JudoFight from "../../assets/images/JudoFight.png";

import {
    FiSearch,
    FiSliders,
    FiMapPin,
    FiCalendar,
    FiChevronLeft,
    FiChevronRight,
} from "react-icons/fi";


export function DisciplinesGame() {

    const [jeux, setJeux] = useState([]);
    const [message, setMessage] = useState("");
    const [recherche, setRecherche] = useState("");
    const [page, setPage] = useState(1);

    const jeuxParPage = 8;


    // =========================================================
    // RECUPERATION DES DISCIPLINES
    // =========================================================

    useEffect(() => {

        const recupererData = async () => {

            try {

                const data = await ListeDiscipline();

                console.log("Disciplines reçues :", data);

                // Protection contre une réponse qui n'est pas un tableau
                if (Array.isArray(data)) {
                    setJeux(data);
                } else if (Array.isArray(data?.results)) {
                    setJeux(data.results);
                } else {
                    setJeux([]);
                }

            } catch (error) {

                console.error("Erreur :", error);

                setMessage(
                    "Impossible de récupérer les disciplines."
                );

                setJeux([]);
            }
        };

        recupererData();

    }, []);


    // =========================================================
    // RECHERCHE
    // =========================================================

    const jeuxFiltres = jeux.filter((jeu) =>
        jeu.nom
            ?.toLowerCase()
            .includes(recherche.toLowerCase())
    );


    // =========================================================
    // PAGINATION
    // =========================================================

    const indexDernierJeu = page * jeuxParPage;
    const indexPremierJeu = indexDernierJeu - jeuxParPage;

    const jeuxActuels = jeuxFiltres.slice(
        indexPremierJeu,
        indexDernierJeu
    );

    const nombrePages = Math.ceil(
        jeuxFiltres.length / jeuxParPage
    );


    // Quand on recherche, on revient à la première page
    const handleRecherche = (e) => {
        setRecherche(e.target.value);
        setPage(1);
    };


    // =========================================================
    // IMAGE PAR DEFAUT
    // =========================================================

    const getImage = (jeu) => {

        if (jeu.image) {
            return jeu.image;
        }

        if (jeu.image_url) {
            return jeu.image_url;
        }

        return JudoFight;
    };


    return (

        <AdminLayout>

            <div className="min-h-screen bg-[#f5f5f5]">


                {/* =====================================================
                    HERO
                ====================================================== */}

                <section className="relative overflow-hidden bg-[#202020]">

                    <div className="mx-auto grid min-h-[360px] max-w-[1500px] grid-cols-1 items-center px-6 md:grid-cols-2 lg:px-14">

                        {/* TEXTE HERO */}

                        <div className="relative z-10 py-14 md:py-20">

                            <span className="inline-block rounded-full bg-[#ed6b0c] px-4 py-2 text-xs font-bold uppercase tracking-wide text-white">
                                Dakar 2026
                            </span>


                            <h1 className="mt-5 text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">

                                Les Disciplines

                                <span className="block text-[#ed6b0c]">
                                    DES JOJ
                                </span>

                            </h1>


                            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm font-medium text-white">

                                <div className="flex items-center gap-2">
                                    <span className="text-lg">⚝</span>
                                    <span>
                                        {jeux.length || 8} sports
                                    </span>
                                </div>


                                <span className="text-gray-500">
                                    •
                                </span>


                                <div className="flex items-center gap-2">

                                    <FiMapPin className="text-base" />

                                    <span>
                                        3 sites
                                    </span>

                                </div>

                            </div>

                        </div>


                        {/* IMAGE HERO */}

                        <div className="relative flex h-full min-h-[320px] items-end justify-center md:justify-end">

                            {/* Halo derrière l'image */}

                            <div className="absolute right-0 top-1/2 h-[320px] w-[320px] -translate-y-1/2 rounded-full bg-[#ed6b0c]/10 blur-3xl" />


                            <img
                                src={JudoFight}
                                alt="Judo Dakar 2026"
                                className="relative z-10 max-h-[380px] w-full object-contain object-bottom md:max-h-[430px]"
                            />

                        </div>

                    </div>

                </section>


                {/* =====================================================
                    CONTENU SPORTS
                ====================================================== */}

                <main className="mx-auto max-w-[1400px] px-5 py-14 md:px-10 lg:py-16">


                    {/* TITRE */}

                    <div className="mx-auto max-w-2xl text-center">

                        <h2 className="text-3xl font-extrabold text-black md:text-4xl">
                            Sports
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-gray-500 md:text-base">
                            Explorez les différentes disciplines qui feront
                            vibrer Dakar lors des Jeux Olympiques de la
                            Jeunesse.
                        </p>

                    </div>


                    {/* =================================================
                        RECHERCHE + FILTRE
                    ================================================== */}

                    <div className="mt-10 flex flex-col gap-4 md:flex-row md:items-center">


                        {/* FILTRE */}

                        <button
                            type="button"
                            className="flex h-12 items-center justify-center gap-2 rounded-lg bg-black px-7 text-sm font-medium text-white transition duration-200 hover:bg-[#ed6b0c]"
                        >

                            <FiSliders size={16} />

                            <span>
                                Filtrer
                            </span>

                        </button>


                        {/* RECHERCHE */}

                        <div className="relative flex-1">

                            <FiSearch
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                size={18}
                            />

                            <input
                                type="text"
                                value={recherche}
                                onChange={handleRecherche}
                                placeholder="Rechercher..."
                                className="h-12 w-full rounded-lg border-2 border-[#ed6b0c] bg-white pl-11 pr-5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:ring-2 focus:ring-[#ed6b0c]/20"
                            />

                        </div>

                    </div>


                    {/* MESSAGE ERREUR */}

                    {message && (

                        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-center text-sm text-red-600">
                            {message}
                        </div>

                    )}


                    {/* =================================================
                        CARTES DES DISCIPLINES
                    ================================================== */}

                    <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">


                        {jeuxActuels.map((jeu) => (

                            <div
                                key={jeu.id}
                                className="group rounded-2xl border border-transparent bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#ed6b0c] hover:shadow-lg"
                            >

                                {/* IMAGE */}

                                <div className="mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-[#ed6b0c] bg-[#fff7f0] p-1 shadow-sm">

                                    <img
                                        src={getImage(jeu)}
                                        alt={jeu.nom || "Discipline sportive"}
                                        className="h-full w-full rounded-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.src = JudoFight;
                                        }}
                                    />

                                </div>


                                {/* NOM */}

                                <h3 className="mt-5 text-xl font-extrabold text-black">
                                    {jeu.nom}
                                </h3>


                                {/* REGLE */}

                                <p className="mt-2 line-clamp-2 min-h-[40px] text-sm text-gray-400">
                                    {jeu.regle || "Discipline sportive des JOJ"}
                                </p>


                                {/* ACCESSIBILITE */}

                                <div className="mt-2 flex items-center justify-center gap-1 text-xs text-gray-400">

                                    <FiMapPin size={20} />

                                    <span>
                                        {jeu.accessibilite || "Arena Dakar"}
                                    </span>

                                </div>


                                {/* DATE */}

                                <div className="mt-2 flex items-center justify-center gap-1 text-sm font-medium text-[#ed6b0c]">

                                    <FiCalendar size={14} />

                                    <span>
                                        15 - 18 Mai 2026
                                    </span>

                                </div>

                            </div>

                        ))}


                        {/* AUCUNE DISCIPLINE */}

                        {jeuxActuels.length === 0 && !message && (

                            <div className="col-span-full py-16 text-center">

                                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-3xl">
                                    ⚽
                                </div>

                                <h3 className="mt-5 text-xl font-bold text-gray-800">
                                    Aucune discipline trouvée
                                </h3>

                                <p className="mt-2 text-sm text-gray-500">
                                    Essayez une autre recherche.
                                </p>

                            </div>

                        )}

                    </div>


                    {/* =================================================
                        PAGINATION
                    ================================================== */}

                    {nombrePages > 1 && (

                        <div className="mt-12 flex items-center justify-center gap-2">


                            {/* PRECEDENT */}

                            <button
                                type="button"
                                disabled={page === 1}
                                onClick={() =>
                                    setPage((anciennePage) =>
                                        anciennePage - 1
                                    )
                                }
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400 transition hover:border-[#ed6b0c] hover:text-[#ed6b0c] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <FiChevronLeft size={18} />
                            </button>


                            {/* NUMEROS */}

                            {Array.from(
                                { length: nombrePages },
                                (_, index) => index + 1
                            ).map((numero) => (

                                <button
                                    key={numero}
                                    type="button"
                                    onClick={() => setPage(numero)}
                                    className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition ${
                                        page === numero
                                            ? "bg-[#ed6b0c] text-white shadow-md"
                                            : "bg-transparent text-gray-500 hover:bg-white hover:text-[#ed6b0c]"
                                    }`}
                                >
                                    {numero}
                                </button>

                            ))}


                            {/* SUIVANT */}

                            <button
                                type="button"
                                disabled={page === nombrePages}
                                onClick={() =>
                                    setPage((anciennePage) =>
                                        anciennePage + 1
                                    )
                                }
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400 transition hover:border-[#ed6b0c] hover:text-[#ed6b0c] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <FiChevronRight size={18} />
                            </button>

                        </div>

                    )}

                </main>



               

            </div>

        </AdminLayout>
    );
}