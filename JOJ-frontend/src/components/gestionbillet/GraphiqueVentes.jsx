const points = [
  [0, 180], [73, 169], [145, 193], [218, 143], [291, 118],
  [364, 131], [436, 89], [509, 63], [582, 72], [655, 31],
  [727, 5], [800, 17],
];

const dates = [
  "01 Jun","02 Jun","03 Jun","04 Jun","05 Jun","06 Jun",
  "07 Jun","08 Jun","09 Jun","10 Jun","11 Jun","12 Jun",
];

const ligneD = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x} ${y}`).join(" ");
const zoneD  = `${ligneD} L800 245 L0 245 Z`;

function GraphiqueVentes() {
  return (
    <section className="mt-[22px] w-full h-[30em] rounded-[21px] border border-[#e3e5e8] bg-white px-[22px] pt-[21px]">

      {/* En-tête */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-[18px] font-bold text-[#17191d]">
            Évolution des ventes journalières
          </h2>
          <p className="text-[13px] text-[#858b95] mt-[4px]">
            Volume de billets vendus sur les 12 derniers jours
          </p>
        </div>
        <button className="h-[30px] px-[14px] rounded-[6px] bg-[#f2f3f5] text-[12px] text-[#33363b]">
          Octobre 2026
        </button>
      </div>

      {/* Zone graphique */}
      <div className="relative mt-[20px] h-[275px]">

        {/* Grille horizontale */}
        <div className="absolute left-[34px] right-[12px] top-0 bottom-[30px] flex flex-col justify-between">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="border-t border-[#f0f1f3]" />
          ))}
        </div>

        {/* Valeurs Y */}
        <div className="absolute left-0 top-[-5px] bottom-[30px] flex flex-col justify-between text-[10px] text-[#606771]">
          {["160","140","120","100","80","60","40","20","0"].map((v) => (
            <span key={v}>{v}</span>
          ))}
        </div>

        {/* Grille verticale */}
        <div className="absolute left-[62px] right-[12px] top-0 bottom-[30px] flex justify-between">
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} className="border-l border-[#f5f5f6]" />
          ))}
        </div>

        {/* Courbe SVG */}
        <svg
          className="absolute left-[38px] right-[5px] top-0 h-[245px]"
          style={{ width: "calc(100% - 43px)" }}
          viewBox="0 0 800 245"
          preserveAspectRatio="none"
        >
          <path d={zoneD} fill="#e86b16" fillOpacity="0.10" />
          <path
            d={ligneD}
            fill="none"
            stroke="#df6213"
            strokeWidth="2.5"
            vectorEffect="non-scaling-stroke"
          />
          <g fill="#df6213">
            {points.map(([x, y]) => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r="3" />
            ))}
          </g>
        </svg>

        {/* Dates */}
        <div className="absolute left-[38px] right-[5px] bottom-0 flex justify-between text-[10px] text-[#555b64]">
          {dates.map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>

      </div>
    </section>
  );
}

export default GraphiqueVentes;
