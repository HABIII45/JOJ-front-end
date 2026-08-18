import { useState } from "react";

const participantsInitiaux = [
  { id: 1, nom: "Jean Dupont",    avatar: "https://i.pravatar.cc/50?img=11", temps: "10.5"  },
  { id: 2, nom: "Marc Leroy",     avatar: "https://i.pravatar.cc/50?img=14", temps: "10.12" },
  { id: 3, nom: "Thomas Bernard", avatar: "https://i.pravatar.cc/50?img=17", temps: "10.18" },
  { id: 4, nom: "Lucas Morel",    avatar: "https://i.pravatar.cc/50?img=21", temps: ""      },
];

/* Convertit "1:02.35" ou "10.5" en secondes pour un tri correct */
function enSecondes(str) {
  if (!str) return Infinity;
  const propre = str.trim();
  // format mm:ss.cc
  if (propre.includes(":")) {
    const [min, reste] = propre.split(":");
    return parseFloat(min) * 60 + parseFloat(reste || 0);
  }
  return parseFloat(propre);
}

/* Icône crayon (éditer) */
function IconEditer() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 1 1 3.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  );
}

function SaisieIndividuel({ onDonneesChange }) {
  const [participants, setParticipants] = useState(participantsInitiaux);
  const [calcule, setCalcule]           = useState(false);

  const handleTemps = (id, valeur) => {
    const maj = participants.map((p) => (p.id === id ? { ...p, temps: valeur } : p));
    setParticipants(maj);
    setCalcule(false);
    onDonneesChange?.(maj);
  };

  /* Classement trié uniquement après clic sur "Calculer" */
  const classes = calcule
    ? [...participants].sort((a, b) => enSecondes(a.temps) - enSecondes(b.temps))
    : participants;

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">

      {/* En-tête */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#fef3eb] rounded-xl flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-[#c85f18]" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <span className="text-xl font-medium text-black">Saisie des résultats</span>
        </div>

        <button
          onClick={() => setCalcule(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 hover:bg-[#fef3eb] hover:border-[#c85f18] transition-colors"
        >
          <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span className="text-sm font-medium text-gray-500">Calculer le classement</span>
        </button>
      </div>

      {/* En-têtes tableau */}
      <div className="flex items-center border-b border-gray-100 pb-2 mb-2 px-4">
        <div className="w-[60px] text-xs font-medium text-gray-500 tracking-[0.60px]">RANG</div>
        <div className="flex-1  text-xs font-medium text-gray-500 tracking-[0.60px]">JOUEUR / PARTICIPANT</div>
        <div className="w-[120px] text-xs font-medium text-gray-500 tracking-[0.60px] text-center">TEMPS</div>
        <div className="w-[80px]  text-xs font-medium text-gray-500 tracking-[0.60px] text-right">ACTIONS</div>
      </div>

      {/* Lignes */}
      {classes.map((p, index) => {
        const aUnTemps  = p.temps.trim() !== "";
        const rang      = calcule && aUnTemps ? String(index + 1).padStart(2, "0") : "--";
        const estPremier = calcule && aUnTemps && index === 0;

        return (
          <div
            key={p.id}
            className="flex items-center bg-gray-50 rounded-xl border border-gray-200 px-4 py-3 mb-2 last:mb-0"
          >
            {/* Rang */}
            <div className="w-[60px]">
              <span className={`font-bold text-base ${estPremier ? "text-[#c85f18]" : "text-gray-400"}`}>
                {rang}
              </span>
            </div>

            {/* Joueur */}
            <div className="flex-1 flex items-center gap-3">
              <img
                src={p.avatar}
                alt={p.nom}
                className="w-8 h-8 rounded-full object-cover border border-gray-200"
              />
              <span className="text-[15px] font-medium text-black">{p.nom}</span>
            </div>

            {/* Temps */}
            <div className="w-[120px] flex justify-center">
              <div className="bg-white rounded-lg border border-gray-200 px-3 py-2 w-[90px] text-center">
                <input
                  type="text"
                  value={p.temps}
                  onChange={(e) => handleTemps(p.id, e.target.value)}
                  placeholder="temps"
                  className="w-full bg-transparent text-base font-medium text-black text-center outline-none border-none p-0 placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Action */}
            <div className="w-[80px] flex justify-end">
              <button className="text-gray-400 hover:text-[#c85f18] transition-colors">
                <IconEditer />
              </button>
            </div>
          </div>
        );
      })}

      {/* Message après calcul */}
      {calcule && (
        <p className="mt-3 text-xs text-center text-gray-400">
          Classement calculé du temps le plus court au plus long.
        </p>
      )}
    </div>
  );
}

export default SaisieIndividuel;
