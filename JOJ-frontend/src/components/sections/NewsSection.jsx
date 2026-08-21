/**
 * Section Actualités : cartes issues uniquement des articles publiés en base.
 * @module NewsSection
 */
import { Link } from "react-router-dom";
import { Newspaper } from "lucide-react";
import { getImageUrl } from "../../api/api";

function extraireTexte(html, max = 110) {
  const texte = String(html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!texte) return "";
  return texte.length > max ? `${texte.slice(0, max).trim()}…` : texte;
}

function tagEvenement(act) {
  const ev = act?.evenement_lie;
  if (ev && typeof ev === "object") return ev.titre || ev.nom || null;
  return null;
}

function CarteActualite({ act }) {
  const image = getImageUrl(act.image);
  const tag = tagEvenement(act);

  return (
    <article className="bg-white rounded-[28px] border border-gray-200/80 overflow-hidden shadow-xs flex flex-col justify-between">
      <Link to={`/actualites/${act.id}`} className="block">
        {image ? (
          <img
            src={image}
            alt={act.titre}
            className="w-full h-44 object-cover"
          />
        ) : (
          <div className="w-full h-44 bg-gray-100 flex items-center justify-center text-gray-300">
            <Newspaper size={36} />
          </div>
        )}

        <div className="p-5">
          {tag && (
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="bg-gray-100 text-gray-600 text-[10px] font-semibold px-2.5 py-1 rounded-md">
                {tag}
              </span>
            </div>
          )}

          <h3 className="font-bold text-sm text-black leading-snug">
            {act.titre}
          </h3>
          {act.description && (
            <p className="mt-2 text-xs text-gray-500 leading-relaxed line-clamp-2">
              {extraireTexte(act.description)}
            </p>
          )}
        </div>
      </Link>

      <div className="px-5 pb-5 pt-2 border-t border-gray-100/60 flex items-center gap-2">
        <span className="w-6 h-6 rounded-full bg-[#5A2D0C] text-white text-[8px] font-extrabold flex items-center justify-center shrink-0">
          JOJ
        </span>
        <span className="text-xs font-bold text-black">JOJ_Events</span>
      </div>
    </article>
  );
}

export default function NewsSection({ actualites = [] }) {
  const publiees = actualites.slice(0, 4);

  return (
    <section className="bg-white py-16">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-extrabold text-black">Actualités</h2>
          <p className="mt-2 text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
            Les dernières informations officielles et publications du comité.
          </p>
        </div>

        {publiees.length === 0 ? (
          <p className="text-center text-sm text-gray-400">
            Aucune actualité publiée pour le moment.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-6">
            {publiees.map((act) => (
              <CarteActualite key={act.id || act.titre} act={act} />
            ))}
          </div>
        )}

        <div className="flex justify-center mt-10">
          <Link
            to="/actualites"
            className="border border-black text-black hover:bg-black hover:text-white rounded-full px-8 py-2.5 text-xs font-semibold transition-colors"
          >
            Toutes les actualités
          </Link>
        </div>
      </div>
    </section>
  );
}