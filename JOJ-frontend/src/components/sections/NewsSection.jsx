/**
 * Section Actualités : grille 2x2 de cartes (image pleine largeur, tags pill,
 * titre bold, signature "JOJ" rond marron + "JOJ_Events").
 * Données : API /api/actualites/ ou démonstration.
 * @module NewsSection
 */
import { Link } from "react-router-dom";

function CarteActualite({ act }) {
  return (
    <article className="bg-white rounded-[28px] border border-gray-200/80 overflow-hidden shadow-xs flex flex-col justify-between">
      <div>
        {act.image ? (
          <img
            src={act.image}
            alt={act.titre}
            className="w-full h-44 object-cover"
          />
        ) : (
          <div className="w-full h-44 bg-gray-100" />
        )}

        <div className="p-5">
          <div className="flex flex-wrap gap-2 mb-2">
            {(act.tags || ["Résultats"]).map((tag) => (
              <span
                key={tag}
                className="bg-gray-100 text-gray-600 text-[10px] font-semibold px-2.5 py-1 rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>

          <h3 className="font-bold text-sm text-black leading-snug">
            {act.titre}
          </h3>
        </div>
      </div>

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
  return (
    <section className="bg-white py-16">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-extrabold text-black">Actualités</h2>
          <p className="mt-2 text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
            Les dernières informations officielles et publications du comité.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {actualites.slice(0, 4).map((act) => (
            <CarteActualite key={act.id || act.titre} act={act} />
          ))}
        </div>
      </div>
    </section>
  );
}