import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiCalendar, FiTag, FiShare2 } from "react-icons/fi";
import api, { getImageUrl } from "../../api/api";
import { Header } from "../../components/layout/Header";
import { Footer } from "../../components/layout/Footer";

export default function ActualiteDetailPublic() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [actualite, setActualite] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function chargerActualite() {
      setLoading(true);
      try {
        const { data } = await api.get(`/api/actualites/${id}/`);
        setActualite(data);
      } catch (error) {
        console.error("Erreur lors de la récupération de l'actualité :", error);
        setActualite(null);
      } finally {
        setLoading(false);
      }
    }

    chargerActualite();
  }, [id]);

  // Formatage de la date de publication issue du formulaire
  const dateFormatee = actualite?.date_publication
    ? new Date(actualite.date_publication).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  const imageUrl = actualite
    ? getImageUrl
      ? getImageUrl(actualite.image)
      : actualite.image
    : null;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {loading ? (
          <div className="min-h-[60vh] flex flex-col items-center justify-center text-gray-400">
            <div className="w-8 h-8 border-3 border-[#C25B1E] border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm font-medium">Chargement de l'article...</p>
          </div>
        ) : !actualite ? (
          <div className="min-h-[60vh] flex flex-col items-center justify-center text-gray-500 py-20 px-4">
            <p className="text-base font-bold text-gray-700">
              Cet article n'existe pas ou n'est plus disponible.
            </p>
            <button
              onClick={() => navigate("/actualites")}
              className="mt-4 px-5 py-2.5 bg-[#D96B27] text-white rounded-xl text-xs font-bold hover:bg-[#c25b1e] transition-colors cursor-pointer"
            >
              Retour aux actualités
            </button>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 space-y-8">
            {/* Bouton retour */}
            <div>
              <button
                onClick={() => navigate("/actualites")}
                className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
              >
                <FiArrowLeft size={16} /> Retour aux actualités
              </button>
            </div>

            {/* En-tête de l'article */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-xs text-gray-400">
                {dateFormatee && (
                  <span className="flex items-center gap-1">
                    <FiCalendar className="text-[#D96B27]" />
                    {dateFormatee}
                  </span>
                )}

                {actualite.evenement_lie && (
                  <span className="flex items-center gap-1 font-semibold text-gray-600">
                    <FiTag className="text-[#D96B27]" />
                    {actualite.evenement_lie.nom ||
                      actualite.evenement_lie.titre ||
                      actualite.evenement_lie}
                  </span>
                )}
              </div>

              <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 leading-tight">
                {actualite.titre}
              </h1>
            </div>

            {/* Image à la une */}
            {imageUrl && (
              <div className="relative h-64 md:h-[420px] rounded-3xl overflow-hidden shadow-sm bg-gray-100">
                <img
                  src={imageUrl}
                  alt={actualite.titre}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Contenu HTML rédigé dans le formulaire */}
            <div className="bg-white rounded-3xl p-6 md:p-10 border border-gray-100 shadow-sm">
              <div
                className="prose max-w-none text-gray-800 text-sm md:text-base leading-relaxed"
                dangerouslySetInnerHTML={{ __html: actualite.description }}
              />

              {/* Pied de l'article / Partage */}
              <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                <span>Jeux Olympiques de la Jeunesse 2026</span>
                <button
                  onClick={() =>
                    navigator.clipboard?.writeText(window.location.href)
                  }
                  className="inline-flex items-center gap-1.5 text-gray-600 hover:text-[#D96B27] font-semibold transition-colors cursor-pointer"
                >
                  <FiShare2 size={14} /> Partager
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}