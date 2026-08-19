import { DRAPEAUX } from "./demoData";
// ---------------------------------------------------------------------------
export function estMatch(score) {
  return /^(\d+)-(\d+)$/.test(String(score || ""));
}

export function CarteMatch({ res }) {
  const [s1, s2] = String(res.score).split("-");
  const c = res.competiteur || {};
  const adv = res.adversaire || {};
  return (
    <article className="bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50/70">
        <span className="text-sm font-medium text-gray-500">{res.evenement?.titre}</span>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Terminé
        </span>
      </div>
      <div className="flex items-center justify-between px-5 py-5">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-lg">{DRAPEAUX[c.pays] || "🏳️"}</span>
          <span className="truncate font-semibold text-gray-900">{c.prenom}</span>
        </div>
        <div className="flex items-baseline gap-3 font-display text-2xl font-bold text-gray-900 px-4">
          <span>{s1}</span>
          <span className="text-gray-300 text-base">-</span>
          <span>{s2}</span>
        </div>
        <div className="flex items-center gap-2.5 min-w-0 justify-end">
          <span className="truncate text-right font-semibold text-gray-900">{adv.prenom}</span>
          <span className="text-lg">{DRAPEAUX[adv.pays] || "🏳️"}</span>
        </div>
      </div>
    </article>
  );
}

export function CarteCourse({ titre, resultats }) {
  const ordonne = [...resultats].sort((a, b) => (a.position || 9) - (b.position || 9));
  return (
    <article className="bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50/70">
        <span className="text-sm font-medium text-gray-500">{titre}</span>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Terminé
        </span>
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
                          ? "text-[#D95D27]"
                          : pos === 2
                          ? "text-gray-400"
                          : pos === 3
                          ? "text-orange-700"
                          : "text-gray-400"
                      }
                    >
                      {pos}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{DRAPEAUX[c.pays] || "🏳️"}</span>
                      <span className="font-medium text-gray-900">{c.prenom}</span>
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
