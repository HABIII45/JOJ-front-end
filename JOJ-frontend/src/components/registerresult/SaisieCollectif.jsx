import { useState } from "react";

const matchsInitiaux = [
  {
    id: 1,
    joueurA:  "Jean Dupont",
    avatarA:  "https://i.pravatar.cc/50?img=11",
    joueurB:  "Thomas Bernard",
    avatarB:  "https://i.pravatar.cc/50?img=17",
    scoreA: 0,
    scoreB: 0,
  },
  {
    id: 2,
    joueurA:  "Marc Leroy",
    avatarA:  "https://i.pravatar.cc/50?img=14",
    joueurB:  "Lucas Morel",
    avatarB:  "https://i.pravatar.cc/50?img=21",
    scoreA: 0,
    scoreB: 0,
  },
];

function SaisieCollectif({ onDonneesChange }) {
  const [matchs, setMatchs] = useState(matchsInitiaux);

  const handleScore = (id, cote, valeur) => {
    const maj = matchs.map((m) =>
      m.id === id ? { ...m, [cote === "A" ? "scoreA" : "scoreB"]: valeur } : m
    );
    setMatchs(maj);
    onDonneesChange?.(maj);
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">

      {/* En-tête */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#fef3eb] rounded-xl flex items-center justify-center">
          <svg className="w-3.5 h-3.5 text-[#c85f18]" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="9" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 2" />
          </svg>
        </div>
        <span className="text-xl font-medium text-black">Affrontement</span>
      </div>

      {/* En-têtes colonnes */}
      <div className="grid grid-cols-[1fr_120px_1fr] gap-4 mb-4">
        <span className="text-xs font-semibold text-[#c85f18] tracking-[0.60px]">Équipe ou joueur A</span>
        <span className="text-xs font-semibold text-[#c85f18] tracking-[0.60px] text-center">SCORE</span>
        <span className="text-xs font-semibold text-[#c85f18] tracking-[0.60px]">Équipe ou joueur B</span>
      </div>

      {/* Matchs */}
      {matchs.map((m) => (
        <div key={m.id} className="grid grid-cols-[1fr_120px_1fr] gap-4 items-center mb-3 last:mb-0">

          {/* Joueur A */}
          <div className="flex items-center gap-3 bg-gray-50 rounded-xl border border-gray-200 px-3 py-2">
            <img
              src={m.avatarA}
              alt={m.joueurA}
              className="w-8 h-8 rounded-full object-cover border border-gray-200"
            />
            <span className="text-sm font-medium text-black">{m.joueurA}</span>
          </div>

          {/* Score */}
          <div className="flex items-center justify-center gap-2 bg-gray-50 rounded-xl border border-gray-200 px-3 py-2">
            <input
              type="number"
              value={m.scoreA}
              onChange={(e) => handleScore(m.id, "A", e.target.value)}
              className="w-8 bg-transparent text-center text-xl font-bold text-[#c85f18] outline-none border-none p-0"
            />
            <span className="text-sm text-gray-400">-</span>
            <input
              type="number"
              value={m.scoreB}
              onChange={(e) => handleScore(m.id, "B", e.target.value)}
              className="w-8 bg-transparent text-center text-xl font-bold text-gray-500 outline-none border-none p-0"
            />
          </div>

          {/* Joueur B */}
          <div className="flex items-center gap-3 bg-gray-50 rounded-xl border border-gray-200 px-3 py-2">
            <img
              src={m.avatarB}
              alt={m.joueurB}
              className="w-8 h-8 rounded-full object-cover border border-gray-200"
            />
            <span className="text-sm font-medium text-black">{m.joueurB}</span>
          </div>

        </div>
      ))}
    </div>
  );
}

export default SaisieCollectif;
