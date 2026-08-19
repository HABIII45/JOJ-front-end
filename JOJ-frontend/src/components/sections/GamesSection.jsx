import { Link } from "react-router-dom";

function CarteDiscipline({ disc }) {
  const isJudo = disc.nom?.toLowerCase().includes("judo");
  const isFootball = disc.nom?.toLowerCase().includes("football");

  return (
    <article className="bg-white rounded-[24px] border border-gray-200/80 p-4 flex gap-4 items-center shadow-xs">
      <img
        src={disc.image}
        alt={disc.nom}
        className="w-24 h-24 rounded-2xl object-cover shrink-0"
      />
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-base text-black">{disc.nom}</h3>

        {isFootball ? (
          <span className="inline-block mt-1 px-2 py-0.5 bg-[#FDF0E9] text-[#D95D27] text-[10px] font-extrabold tracking-wider uppercase rounded-md">
            Phases éliminatoires
          </span>
        ) : isJudo ? (
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#1E40AF] mt-1">
            Catégories de poids
          </p>
        ) : (
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#D95D27] mt-1">
            {disc.sousTitre || "Sprints • Sauts • Lancers"}
          </p>
        )}

        <p className="text-xs text-gray-400 mt-2 leading-relaxed line-clamp-3">
          {disc.description ||
            "Consultez le programme complet, les classements actualisés et les résultats détaillés par épreuve."}
        </p>
      </div>
    </article>
  );
}

export default function GamesSection({ disciplines = [] }) {
  return (
    <section className="bg-gray-50/60 py-16">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-extrabold text-black">Les Jeux</h2>
          <p className="mt-2 text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
            Explorez les disciplines officielles et utilisez les filtres pour accéder rapidement aux informations clés.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {disciplines.slice(0, 4).map((disc) => (
            <CarteDiscipline key={disc.id || disc.nom} disc={disc} />
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <Link
            to="/jeux"
            className="bg-black hover:bg-neutral-800 text-white rounded-full px-8 py-2.5 text-xs font-semibold transition-colors"
          >
            Voir tous les jeux
          </Link>
        </div>
      </div>
    </section>
  );
}