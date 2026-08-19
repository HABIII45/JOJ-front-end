import { useState } from "react";
import { Header } from "../../components/layout/Header";
import { Footer } from "../../components/layout/Footer";
import ContainerImg  from "../../assets/images/Container.jpg";
import atletismeImg  from "../../assets/images/atletisme100m.svg";
import footballImg   from "../../assets/images/football.svg";
import handballImg   from "../../assets/images/handball.svg";
import basketballImg from "../../assets/images/basketball.svg";

// ── Données des événements ────────────────────────────────────────────────────
const EVENEMENTS = [
  {
    id: 1,
    titre:    "Athlétisme — Épreuves 100m hommes",
    site:     "Iba Mar Diop - Dakar",
    date:     "12 Mai 2026 • 18:00 — Finale",
    image:    atletismeImg,
    alt:      "Athlétisme",
  },
  {
    id: 2,
    titre:    "Football — Phase de groupes",
    site:     "Stade Iba Mar - Dakar",
    date:     "9 Mai 2026 • 16:00 — Groupe A",
    image:    footballImg,
    alt:      "Football",
  },
  {
    id: 3,
    titre:    "Basketball — Demi-finales",
    site:     "Mbour (Saly)",
    date:     "10 Mai 2026 • 21:00 — Match 12",
    image:    basketballImg,
    alt:      "Basketball",
  },
  {
    id: 4,
    titre:    "Handball — Tournoi masculin",
    site:     "Diamniadio",
    date:     "Aujourd'hui • 18:00 — Journée 3",
    image:    handballImg,
    alt:      "Handball",
  },
  {
    id: 5,
    titre:    "Athlétisme — Épreuves 100m hommes",
    site:     "Iba Mar Diop - Dakar",
    date:     "12 Mai 2026 • 18:00 — Finale",
    image:    atletismeImg,
    alt:      "Athlétisme",
  },
  {
    id: 6,
    titre:    "Football — Phase de groupes",
    site:     "Stade Iba Mar - Dakar",
    date:     "9 Mai 2026 • 16:00 — Groupe A",
    image:    footballImg,
    alt:      "Football",
  },
];

const CATEGORIES  = ["VIP", "Standard", "Presse"];
const SITES       = ["Tous les sites", "Arena (Dakar)", "Stade Iba Mar", "Mbour (Saly)", "Diamniadio"];
const PERIODES    = ["En cours", "Cette semaine", "Aujourd'hui", "À venir"];
const ONGLETS     = ["En cours", "À venir", "Tous"];

// ── Sous-composant carte événement ────────────────────────────────────────────
function CarteEvenement({ evenement }) {
  return (
    <article className="rounded-2xl bg-white p-6 sm:p-7 lg:p-8
                        shadow-[0_0.4rem_1.5rem_rgba(0,0,0,.08)]
                        transition-transform duration-200 hover:-translate-y-1
                        hover:shadow-[0_1rem_2rem_rgba(0,0,0,.08)]">

      <div className="flex justify-center">
        <img
          src={evenement.image}
          alt={evenement.alt}
          className="h-24 w-24 sm:h-28 sm:w-28 rounded-full object-cover border border-[#eadfd9]"
        />
      </div>

      <h3 className="mt-6 text-center text-lg sm:text-xl lg:text-2xl font-extrabold">
        {evenement.titre}
      </h3>

      <p className="mt-1 text-center text-sm sm:text-base text-[#d85d16]">
        {evenement.site}
      </p>

      <div className="mt-5 rounded-lg border border-[#f2ddd4] bg-[#fffaf8] py-3
                      text-center text-sm sm:text-base font-semibold">
        {evenement.date}
      </div>

      <button className="mt-5 w-full rounded-lg bg-black py-3.5
                         text-sm sm:text-base font-bold text-white
                         hover:bg-[#222] transition-colors">
        Réserver maintenant
      </button>
    </article>
  );
}

// ── Bouton filtre pill ─────────────────────────────────────────────────────────
function BoutonFiltre({ label, actif, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-xs sm:text-sm transition-colors ${
        actif
          ? "bg-[#d85d16] font-semibold text-white"
          : "bg-[#fff2ec] text-gray-800"
      }`}
    >
      {label}
    </button>
  );
}

// ── Composant principal ───────────────────────────────────────────────────────
function Events() {
  const [onglet,     setOnglet]     = useState("En cours");
  const [recherche,  setRecherche]  = useState("");
  const [categorie,  setCategorie]  = useState("VIP");
  const [site,       setSite]       = useState("Tous les sites");
  const [periode,    setPeriode]    = useState("Cette semaine");
  const [page,       setPage]       = useState(1);

  const reinitialiser = () => {
    setRecherche("");
    setCategorie("VIP");
    setSite("Tous les sites");
    setPeriode("Cette semaine");
  };

  return (
    <>
      <Header />

      <div className="bg-white text-black">

        {/* Espace sous le header fixe */}


        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section
          className="w-full min-h-[24rem] sm:min-h-[27rem] lg:min-h-[30rem]
                     flex items-center justify-center text-white"
          style={{
            backgroundImage:
              `linear-gradient(rgba(0,0,0,.60),rgba(0,0,0,.60)), url(${ContainerImg})`,
            backgroundSize:     "cover",
            backgroundPosition: "center",
          }}
        >
        <div className="w-full max-w-6xl mx-auto px-5 sm:px-8 lg:px-12 text-center">

          <h1 className="font-extrabold leading-none tracking-tight
                         text-4xl sm:text-5xl lg:text-6xl xl:text-7xl">
            Choisissez votre
            <span className="block text-[#ff6500]">événement</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg lg:text-xl
                        leading-relaxed text-white/90">
            Accédez aux épreuves en cours et à venir. Sélectionnez votre billet
            et vivez l'émotion du sport en direct sur les sites olympiques.
          </p>

          {/* Onglets hero */}
          <div className="mt-8 inline-flex items-center rounded-lg bg-[#1f2937]/90 p-1.5 shadow-lg">
            {ONGLETS.map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => setOnglet(o)}
                className={`rounded-md px-6 py-3 text-sm sm:text-base transition-colors ${
                  onglet === o
                    ? "bg-[#d85d16] font-semibold text-white"
                    : "font-medium text-white"
                }`}
              >
                {o}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTENU PRINCIPAL ─────────────────────────────────────────────── */}
      <main className="w-full">

        {/* FILTRES */}
        <section className="w-full px-5 py-16 sm:px-8 lg:px-12 xl:px-16 sm:py-20 lg:py-24">
          <div className="mx-auto w-full max-w-7xl">

            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
                Filtrer &amp; sélectionner
              </h2>
              <p className="mt-4 text-sm sm:text-base lg:text-lg text-gray-500">
                Trouvez rapidement votre épreuve sur Dakar, Mbour (Saly) ou Diamniadio.
              </p>
            </div>

            <div className="mt-12 border-t border-[#eadfd9] pt-8">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-x-16">

                {/* Recherche */}
                <div>
                  <h3 className="text-lg sm:text-xl font-bold">Rechercher</h3>
                  <input
                    type="text"
                    value={recherche}
                    onChange={(e) => setRecherche(e.target.value)}
                    placeholder="Ex: Football, Athlétisme, Basketball..."
                    className="mt-3 w-full rounded-lg border border-[#f0d8cd] bg-white
                               px-4 py-3 text-sm sm:text-base outline-none
                               placeholder:text-gray-400 focus:border-[#d85d16] transition-colors"
                  />
                  <p className="mt-2 text-xs sm:text-sm text-gray-400">
                    Astuce : tapez un sport, une discipline ou un nom d'équipe.
                  </p>
                </div>

                {/* Catégorie */}
                <div>
                  <h3 className="text-lg sm:text-xl font-bold">Catégorie d'accès</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {CATEGORIES.map((c) => (
                      <BoutonFiltre
                        key={c}
                        label={c}
                        actif={categorie === c}
                        onClick={() => setCategorie(c)}
                      />
                    ))}
                  </div>
                  <p className="mt-2 text-xs sm:text-sm text-gray-400">
                    Privilégiez les avantages selon votre type de billet.
                  </p>
                </div>

                {/* Site */}
                <div>
                  <h3 className="text-lg sm:text-xl font-bold">Site d'épreuve</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {SITES.map((s) => (
                      <BoutonFiltre
                        key={s}
                        label={s}
                        actif={site === s}
                        onClick={() => setSite(s)}
                      />
                    ))}
                  </div>
                  <p className="mt-2 text-xs sm:text-sm text-gray-400">
                    Filtre selon la localisation des zones (grandes, loges, presse).
                  </p>
                </div>

                {/* Période */}
                <div>
                  <h3 className="text-lg sm:text-xl font-bold">Période</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {PERIODES.map((p) => (
                      <BoutonFiltre
                        key={p}
                        label={p}
                        actif={periode === p}
                        onClick={() => setPeriode(p)}
                      />
                    ))}
                  </div>
                </div>

              </div>

              {/* Réinitialiser */}
              <div className="mt-10 flex justify-center">
                <button
                  type="button"
                  onClick={reinitialiser}
                  className="rounded-lg border-2 border-black bg-white px-8 py-3
                             text-sm sm:text-base font-bold
                             hover:bg-black hover:text-white transition-colors"
                >
                  Réinitialiser
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ÉVÉNEMENTS */}
        <section className="w-full px-5 pb-16 sm:px-8 lg:px-12 xl:px-16 sm:pb-20 lg:pb-24">
          <div className="mx-auto w-full max-w-7xl">

            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
                Événements populaires
              </h2>
              <p className="mt-3 text-sm sm:text-base lg:text-lg text-gray-500">
                Cliquez sur un événement pour afficher les billets et les zones d'accès disponibles.
              </p>
            </div>

            {/* Grille */}
            <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2">
              {EVENEMENTS.map((evt) => (
                <CarteEvenement key={evt.id} evenement={evt} />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-16 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="flex h-9 w-9 items-center justify-center rounded-full
                           border border-gray-200 text-gray-400 hover:border-[#d85d16]
                           hover:text-[#d85d16] transition-colors"
              >
                ‹
              </button>

              {[1, 2, 3].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPage(n)}
                  className={`flex h-9 w-9 items-center justify-center rounded-full
                              text-sm font-bold transition-colors ${
                    page === n
                      ? "bg-[#d85d16] text-white"
                      : "text-gray-500 hover:text-[#d85d16]"
                  }`}
                >
                  {n}
                </button>
              ))}

              <span className="text-sm text-gray-400">...</span>

              <button
                type="button"
                onClick={() => setPage(8)}
                className="text-sm text-gray-500 hover:text-[#d85d16] transition-colors"
              >
                8
              </button>

              <button
                type="button"
                onClick={() => setPage((p) => Math.min(8, p + 1))}
                className="flex h-9 w-9 items-center justify-center rounded-full
                           border border-gray-200 text-gray-400 hover:border-[#d85d16]
                           hover:text-[#d85d16] transition-colors"
              >
                ›
              </button>
            </div>

          </div>
        </section>

      </main>

      {/* Espace footer */}
      <div className="h-40 sm:h-48 lg:h-56" />

    </div>

    <Footer />
    </>
  );
}

export default Events;
