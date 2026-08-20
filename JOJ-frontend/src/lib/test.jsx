
export function drapeauEmoji(code) {
  if (!code || typeof code !== "string" || code.length !== 2) return "🏳️";
  const OFFSET = 127397; // décalage vers les "regional indicator symbols"
  const points = [...code.toUpperCase()].map((c) => c.charCodeAt(0) + OFFSET);
  try {
    return String.fromCodePoint(...points);
  } catch {
    return "🏳️";
  }
}

/** Pastilles de filtre : « Tous » + disciplines du backend (fallback démo) */
export function pastillesInitiales(categorieNames) {
  const ordonne = ["Football", "Basketball", "Athlétisme", "Natation", "Handball", "Judo"];
  const reste = (categorieNames || []).filter(
    (n) => !ordonne.includes(n) && !["Sports Collectifs", "Sports de Combat"].includes(n)
  );
  return ["Tous", ...ordonne, ...reste];
}


export function BadgeStatut({ statut }) {
  const config = {
    termine: { label: "Terminé", classe: "text-emerald-600", point: "bg-emerald-500" },
    en_cours: { label: "En direct", classe: "text-red-600", point: "bg-red-500 animate-pulse" },
    a_venir: { label: "À venir", classe: "text-gray-500", point: "bg-gray-400" },
  };
  const { label, classe, point } = config[statut] || config.termine;
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold ${classe}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${point}`} />
      {label}
    </span>
  );
}

export function scindeScore(score) {
  const m = String(score || "").trim().match(/^(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)$/);
  return m ? [m[1], m[2]] : null;
}

/** Carte match : deux compétiteurs de part et d'autre du score central.
 *  Un "match" est déterminé par la présence d'un adversaire — pas par le
 *  format du score, qui peut varier énormément d'une discipline à l'autre. */
export function CarteMatch({ res }) {
  const c = res.competiteur || {};
  const adv = res.adversaire || {};
  const paire = scindeScore(res.score);
  return (
    <article className="bg-white rounded-2xl shadow-sm">
      <div className="flex items-center justify-between gap-3 px-5 py-3 border-b border-gray-100 bg-gray-50/70">
        <span className="text-sm font-medium text-gray-500 truncate">{res.evenement?.titre}</span>
        <BadgeStatut statut={res.evenement?.statut} />
      </div>
      <div className="flex items-center justify-between px-5 py-5 gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-lg shrink-0">{drapeauEmoji(c.pays)}</span>
          <span className="truncate font-semibold text-gray-900">{c.prenom}</span>
        </div>

        {paire ? (
          <div className="flex items-baseline gap-3 font-display text-2xl font-bold text-gray-900 px-4 shrink-0">
            <span>{paire[0]}</span>
            <span className="text-gray-300 text-base">-</span>
            <span>{paire[1]}</span>
          </div>
        ) : (
          <div className="px-4 shrink-0 max-w-[40%]">
            <span className="block text-center font-display text-sm font-bold text-gray-900 truncate">
              {res.score}
            </span>
          </div>
        )}

        <div className="flex items-center gap-2.5 min-w-0 justify-end">
          <span className="truncate text-right font-semibold text-gray-900">{adv.prenom}</span>
          <span className="text-lg shrink-0">{drapeauEmoji(adv.pays)}</span>
        </div>
      </div>
    </article>
  );
}

/** Une carte "course" = le podium d'UN SEUL événement (evenement.id).
 *  Plusieurs courses de la même discipline (ex. 100m et 200m) donnent
 *  chacune leur propre carte, jamais mélangées. */
export function CarteCourse({ titre, statut, resultats }) {
  const ordonne = [...resultats].sort((a, b) => (a.position || 99) - (b.position || 99));
  return (
    <article className="bg-white rounded-2xl shadow-sm">
      <div className="flex items-center justify-between gap-3 px-5 py-3 border-b border-gray-100 bg-gray-50/70">
        <span className="text-sm font-medium text-gray-500 truncate">{titre}</span>
        <BadgeStatut statut={statut} />
      </div>
      <div className="px-5 py-3">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 text-left">
              <th className="pb-3 pr-4 w-10">Pos</th>
              <th className="pb-3">Athlète</th>
              <th className="pb-3 text-right w-24">Temps</th>
            </tr>
          </thead>
          <tbody>
            {ordonne.map((r) => {
              const c = r.competiteur || {};
              const pos = r.position || 0;
              return (
                <tr key={r.id} className="border-t border-gray-50 last:border-0">
                  <td className="py-3 pr-4 font-display font-bold">
                    <span
                      className={
                        pos === 1
                          ? "text-joj-orange"
                          : pos === 2
                          ? "text-gray-400"
                          : pos === 3
                          ? "text-orange-700"
                          : "text-gray-400"
                      }
                    >
                      {pos || "–"}
                    </span>
                  </td>
                  <td className="py-3 min-w-0">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-base shrink-0">{drapeauEmoji(c.pays)}</span>
                      <span className="font-medium text-gray-900 truncate">{c.prenom}</span>
                    </div>
                  </td>
                  <td className="py-3 text-right font-semibold tabular-nums text-gray-900">
                    {r.score}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </article>
  );
}

// ---------------------------------------------------------------------------
// Page Principale : Resultats
// ---------------------------------------------------------------------------
