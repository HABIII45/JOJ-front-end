

import { getActualites } from "../../api/Eventapi";
import { getImageUrl } from "../../api/api";

import "./Actualitees.css";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";


import { Header } from "../../components/layout/Header";
import { Footer } from "../../components/layout/Footer";
import Background from "../../assets/images/Background.jpg";



export default function Actualitees() {
  const [actualites, setActualites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    const chargerActualites = async () => {
      try {
        setLoading(true);

        const data = await getActualites();

        const liste = Array.isArray(data)
          ? data
          : data.results || [];

        setActualites(liste);
      } catch (error) {
        console.error(
          "Erreur lors du chargement des actualités :",
          error
        );
        setErreur("Impossible de charger les actualités.");
      } finally {
        setLoading(false);
      }
    };

    chargerActualites();
  }, []);

  return (
    <div className="actualites-page">

      {/* NAVBAR */}
      <Header />

      {/* CONTENU */}
      <main className="actualites-container"
    //    style={{
    //       backgroundImage: `url(${Background})`,
    //        }}
           >
          
        <section className="actualites-header">
          <h1>Actualités</h1>

          <p>
            Découvrez les dernières actualités des Jeux Olympiques
            de la Jeunesse Dakar 2026.
          </p>
        </section>

        {loading && (
          <div className="actualites-message">
            Chargement des actualités...
          </div>
        )}

        {!loading && erreur && (
          <div className="actualites-message error">
            {erreur}
          </div>
        )}

        {!loading && !erreur && actualites.length === 0 && (
          <div className="actualites-message">
            Aucune actualité disponible pour le moment.
          </div>
        )}

        {!loading && !erreur && actualites.length > 0 && (
          <section className="actualites-grid">

            {actualites.map((actualite) => (
              <article
                key={actualite.id}
                className="actualite-card"
              >

                {/* IMAGE */}
                <div className="actualite-image-container">
                  {actualite.image ? (
                    <img
                      src={getImageUrl(actualite.image)}
                      alt={actualite.titre}
                      className="actualite-image"
                    />
                  ) : (
                    <div className="actualite-image-placeholder">
                      JOJ Dakar 2026
                    </div>
                  )}
                </div>

                {/* CONTENU */}
                <div className="actualite-content">

                  <span className="actualite-date">
                    {actualite.date_publication
                      ? new Date(
                          actualite.date_publication
                        ).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : "Date non disponible"}
                  </span>

                  <h2>
                    {actualite.titre}
                  </h2>

                  <p
                    dangerouslySetInnerHTML={{
                      __html: actualite.description || "",
                    }}
                  />

                  <Link
                    to={`/actualites/${actualite.id}`}
                    className="actualite-button"
                  >
                    Lire l'article
                  </Link>

                </div>

              </article>
            ))}

          </section>
        )}

      </main>

      {/* FOOTER */}
      <Footer />

    </div>
  );
}