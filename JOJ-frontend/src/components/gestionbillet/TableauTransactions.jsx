const IconEditer = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
  </svg>
);

const IconVoir = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
    <circle cx="12" cy="12" r="2.5" />
  </svg>
);

const IconSupprimer = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 7h16" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M6 7l1 14h10l1-14" />
    <path d="M9 7V4h6v3" />
  </svg>
);

const colsGrid = "grid-cols-[1.55fr_1.45fr_.75fr_.9fr_1.2fr_1fr_.7fr]";

const transactions = [
  {
    id: 1,
    avatar: "https://i.pravatar.cc/50?img=47",
    nomLigne1: "Aminata",
    nomLigne2: "Diallo",
    evenement: "Basketball — Finale",
    type: "VIP",
    typeCouleur: "bg-[#edf4ff] text-[#3678c9]",
    typeW: "w-[34px]",
    prix: ["50.000", "FCFA"],
    date: ["12 oct 2026,", "14:30"],
    statut: "Confirmé",
    statutCouleur: "bg-[#dff8e8] text-[#23a45c]",
    statutW: "w-[62px]",
  },
  {
    id: 2,
    avatar: "https://i.pravatar.cc/50?img=44",
    nomLigne1: "Fatou Ndiaye",
    nomLigne2: null,
    evenement: "Tournoi amical U15",
    type: "Standard",
    typeCouleur: "bg-[#f1f2f4] text-[#555b63]",
    typeW: "w-[51px]",
    prix: ["5.000 FCFA"],
    date: ["11 oct 2026, 18:45"],
    statut: "En attente",
    statutCouleur: "bg-[#fff0df] text-[#e88127]",
    statutW: "w-[72px]",
  },
];

function TableauTransactions() {
  return (
    <section className="mt-[21px] rounded-[21px] border border-[#e3e5e8] bg-white overflow-hidden">

      {/* Titre */}
      <div className="h-[60px] px-[23px] flex items-center justify-between">
        <h2 className="text-[18px] font-semibold text-[#191b20]">Dernières Transactions</h2>
        <button className="h-[30px] px-[13px] rounded-[6px] bg-[#f2f3f5] text-[12px] text-[#4b5563] flex items-center gap-[6px]">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
            <path d="M3 5h18l-7 8v5l-4 2v-7L3 5z" />
          </svg>
          Filtrer
        </button>
      </div>

      {/* Header colonnes */}
      <div className={`h-[42px] bg-[#fafbfc] border-y border-[#eceef0] grid ${colsGrid} items-center px-[23px] text-[11px] font-medium text-[#737983]`}>
        <span>Client</span>
        <span>Événement</span>
        <span>Type</span>
        <span>Prix</span>
        <span>Date</span>
        <span>Statut</span>
        <span>Actions</span>
      </div>

      {/* Lignes */}
      {transactions.map((t) => (
        <div
          key={t.id}
          className={`h-[64px] grid ${colsGrid} items-center px-[23px] border-b border-[#edf0f2]`}
        >
          {/* Client */}
          <div className="flex items-center gap-[9px]">
            <img src={t.avatar} className="w-[28px] h-[28px] rounded-full object-cover" alt="" />
            <div>
              <p className="text-[12px] font-medium text-[#25282d]">{t.nomLigne1}</p>
              {t.nomLigne2 && <p className="text-[12px] font-medium text-[#25282d]">{t.nomLigne2}</p>}
            </div>
          </div>

          {/* Événement */}
          <span className="text-[12px] text-[#30343a]">{t.evenement}</span>

          {/* Type */}
          <span className={`${t.typeW} h-[18px] rounded-full ${t.typeCouleur} flex items-center justify-center text-[10px]`}>
            {t.type}
          </span>

          {/* Prix */}
          <div className="text-[12px] text-[#30343a]">
            {t.prix.map((ligne, i) => <p key={i}>{ligne}</p>)}
          </div>

          {/* Date */}
          <div className="text-[12px] text-[#30343a]">
            {t.date.map((ligne, i) => <p key={i}>{ligne}</p>)}
          </div>

          {/* Statut */}
          <span className={`${t.statutW} h-[18px] rounded-full ${t.statutCouleur} flex items-center justify-center text-[10px]`}>
            {t.statut}
          </span>

          {/* Actions */}
          <div className="flex items-center gap-[10px] text-[#8c949f]">
            <button><IconEditer /></button>
            <button><IconVoir /></button>
            <button><IconSupprimer /></button>
          </div>
        </div>
      ))}

      {/* Footer */}
      <div className="h-[48px] flex items-center justify-center">
        <button className="text-[13px] font-medium text-[#e86b16]">
          Voir tous les détails des ventes
        </button>
      </div>

    </section>
  );
}

export default TableauTransactions;
