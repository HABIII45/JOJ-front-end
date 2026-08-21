import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FiArrowLeft, FiCalendar, FiShare2, FiTag, FiUser } from "react-icons/fi";
import { getActualite, getActualites } from "../../api/Eventapi";
import api, { getImageUrl } from "../../api/api";
import { Header } from "../../components/layout/Header";
import { Footer } from "../../components/layout/Footer";
import "./Actualitees.css";

function formaterDate(valeur) {
  if (!valeur) return null;
  const date = new Date(valeur);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function extraireTexte(html, max = 90) {
  const texte = String(html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!texte) return "";
  return texte.length > max ? `${texte.slice(0, max).trim()}…` : texte;
}

function idEvenement(evenementLie) {
  if (evenementLie == null) return null;
  if (typeof evenementLie === "object") return evenementLie.id ?? null;
  return evenementLie;
}

export default function ActualiteDetailPublic() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [actualite, setActualite] = useState(null);
  const [evenement, setEvenement] = useState(null);
  const [autres, setAutres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copie, setCopie] = useState(false);

  useEffect(() => {
    let actif = true;

    async function charger() {
      setLoading(true);
      try {
        const data = await getActualite(id);
        if (!actif) return;
        setActualite(data);

        const evId = idEvenement(data.evenement_lie);
        if (data.evenement_lie && typeof data.evenement_lie === "object") {
          setEvenement(data.evenement_lie);
        } else if (evId) {
          try {
            const { data: ev } = await api.get(`/api/events/${evId}/`);
            if (actif) setEvenement(ev);
          } catch {
            if (actif) setEvenement(null);
          }
        } else {
          setEvenement(null);
        }

        const liste = await getActualites().catch(() => []);
        const publiees = (Array.isArray(liste) ? liste : liste?.results || [])
          .filter((item) => item && String(item.id) !== String(id) && item.brouillon !== true)
          .slice(0, 3);
        if (actif) setAutres(publiees);
      } catch (error) {
        console.error("Erreur lors de la récupération de l'actualité :", error);
        if (actif) {
          setActualite(null);
          setEvenement(null);
        }
      } finally {
        if (actif) setLoading(false);
      }
    }

    charger();
    return () => {
      actif = false;
    };
  }, [id]);

  const dateFormatee = formaterDate(actualite?.date_publication);
  const imageUrl = actualite ? getImageUrl(actualite.image) : null;
  const nomEvenement = useMemo(() => {
    if (!evenement) return null;
    return evenement.titre || evenement.nom || null;
  }, [evenement]);
  const nomAuteur =
    actualite?.auteur_detail?.username ||
    actualite?.auteur_nom ||
    (typeof actualite?.auteur === "object"
      ? actualite.auteur.username || actualite.auteur.first_name
      : null) ||
    "Comité JOJ";

  const partager = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopie(true);
      setTimeout(() => setCopie(false), 1800);
    } catch {
      setCopie(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#faf7f4]">
      <Header />

      <main className="flex-1">
        {loading ? (
          <div className="flex min-h-[60vh] flex-col items-center justify-center text-gray-400">
            <div className="mb-3 h-8 w-8 animate-spin rounded-full border-3 border-[#C25B1E] border-t-transparent" />
            <p className="text-sm font-medium">Chargement de l'article...</p>
          </div>
        ) : !actualite ? (
          <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-20 text-gray-500">
            <p className="text-base font-bold text-gray-700">
              Cet article n'existe pas ou n'est plus disponible.
            </p>
            <button
              onClick={() => navigate("/actualites")}
              className="mt-4 cursor-pointer rounded-xl bg-[#D96B27] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#c25b1e]"
            >
              Retour aux actualités
            </button>
          </div>
        ) : (
          <article>
            {imageUrl ? (
              <div className="relative h-64 w-full overflow-hidden md:h-[420px]">
                <img
                  src={imageUrl}
                  alt={actualite.titre}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 mx-auto max-w-4xl px-4 pb-8 md:px-6">
                  {nomEvenement && (
                    <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-[#D96B27] px-3 py-1 text-[11px] font-bold text-white">
                      <FiTag size={12} />
                      {nomEvenement}
                    </span>
                  )}
                  <h1 className="text-2xl font-extrabold leading-tight text-white md:text-4xl">
                    {actualite.titre}
                  </h1>
                </div>
              </div>
            ) : (
              <div className="mx-auto max-w-4xl px-4 pt-10 md:px-6">
                <h1 className="text-3xl font-extrabold leading-tight text-gray-900 md:text-4xl">
                  {actualite.titre}
                </h1>
              </div>
            )}

            <div className="mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-12">
              <button
                onClick={() => navigate("/actualites")}
                className="mb-6 inline-flex cursor-pointer items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-900"
              >
                <FiArrowLeft size={16} /> Retour aux actualités
              </button>

              <div className="mb-8 flex flex-wrap items-center gap-4 text-xs text-gray-500">
                {dateFormatee && (
                  <span className="inline-flex items-center gap-1.5 font-semibold">
                    <FiCalendar className="text-[#D96B27]" />
                    {dateFormatee}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 font-semibold">
                  <FiUser className="text-[#D96B27]" />
                  {nomAuteur}
                </span>
                {nomEvenement && !imageUrl && (
                  <span className="inline-flex items-center gap-1.5 font-semibold text-gray-700">
                    <FiTag className="text-[#D96B27]" />
                    {nomEvenement}
                  </span>
                )}
              </div>

              <div className="rounded-3xl border border-[#eadfd9] bg-white p-6 shadow-sm md:p-10">
                {actualite.description ? (
                  <div
                    className="article-contenu"
                    dangerouslySetInnerHTML={{ __html: actualite.description }}
                  />
                ) : (
                  <p className="text-sm text-gray-500">Aucun contenu pour cet article.</p>
                )}

                <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6 text-xs text-gray-400">
                  <span>Jeux Olympiques de la Jeunesse 2026</span>
                  <button
                    onClick={partager}
                    className="inline-flex cursor-pointer items-center gap-1.5 font-semibold text-gray-600 hover:text-[#D96B27]"
                  >
                    <FiShare2 size={14} />
                    {copie ? "Lien copié" : "Partager"}
                  </button>
                </div>
              </div>

              {autres.length > 0 && (
                <section className="mt-14">
                  <h2 className="text-xl font-extrabold text-gray-900">À lire aussi</h2>
                  <div className="mt-5 grid gap-4 sm:grid-cols-3">
                    {autres.map((item) => (
                      <Link
                        key={item.id}
                        to={`/actualites/${item.id}`}
                        className="overflow-hidden rounded-2xl border border-[#eadfd9] bg-white transition-transform hover:-translate-y-0.5"
                      >
                        <div className="h-28 bg-[#fff2ec]">
                          {getImageUrl(item.image) ? (
                            <img
                              src={getImageUrl(item.image)}
                              alt={item.titre}
                              className="h-full w-full object-cover"
                            />
                          ) : null}
                        </div>
                        <div className="p-4">
                          <p className="line-clamp-2 text-sm font-bold text-gray-900">
                            {item.titre}
                          </p>
                          <p className="mt-1 line-clamp-2 text-xs text-gray-500">
                            {extraireTexte(item.description)}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </article>
        )}
      </main>

      <Footer />
    </div>
  );
}
