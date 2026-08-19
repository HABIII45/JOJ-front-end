import { Link } from "react-router-dom";

function CarteEvenement({ ev }) {
  const isBientot = ev.titre?.toLowerCase().includes("boxe") || ev.isBientot;

  return (
    <article className="bg-white rounded-[28px] border border-gray-200/80 p-6 flex flex-col items-center text-center shadow-xs hover:shadow-md transition-shadow">
      <img
        src={ev.image}
        alt={ev.titre}
        className="w-20 h-20 rounded-full object-cover border border-gray-100"
      />

      <h3 className="font-bold text-sm text-black mt-4 px-2 leading-snug min-h-[40px] flex items-center justify-center">
        {ev.titre}
      </h3>

      <div className="mt-2 flex flex-col items-center justify-center h-8">
        {isBientot ? (
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#D95D27]">
            Bientôt
          </span>
        ) : (
          <Link
            to="/evenements"
            className="text-[11px] font-extrabold uppercase tracking-wider text-[#D95D27] hover:underline"
          >
            Acheter un billet
          </Link>
        )}
      </div>

      <div className="w-full h-px bg-gray-100 my-4" />

      <p className="text-xs font-bold text-black">
        Aujourd'hui · {ev.heure || "15:30"}
      </p>
      <p className="text-[11px] text-gray-400 mt-1 font-medium">
        {ev.lieu || "Stade du Dakar Arena"}
      </p>
    </article>
  );
}

export default function EventsSection({ evenements = [] }) {
  return (
    <section className="bg-gray-50/60 py-16">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-extrabold text-black">Événements</h2>
          <p className="mt-2 text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
            Ne manquez aucun moment fort des compétitions actuelles à travers les différents sites olympiques.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {evenements.slice(0, 3).map((ev) => (
            <CarteEvenement key={ev.id || ev.titre} ev={ev} />
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <Link
            to="/evenements"
            className="bg-black hover:bg-neutral-800 text-white rounded-full px-8 py-2.5 text-xs font-semibold transition-colors"
          >
            Voir plus
          </Link>
        </div>
      </div>
    </section>
  );
}