import { useState } from "react";

const adminsInitiaux = [
  {
    id: 1,
    nom:         "Babacar Faye",
    email:       "babacar.f@joj.sn",
    avatar:      "https://i.pravatar.cc/50?img=12",
    droits:      "Éditeur Événements",
    connexion:   "Il y a 10 min",
  },
  {
    id: 2,
    nom:         "Fatou Sow",
    email:       "fatou.s@joj.sn",
    avatar:      "https://i.pravatar.cc/50?img=47",
    droits:      "Modérateur News",
    connexion:   "Hier, 15:45",
  },
];

const IconEditer = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
  </svg>
);

const IconSupprimer = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="9" />
    <path d="m8 8 8 8" />
  </svg>
);

function AdminsSecondaires() {
  const [admins,     setAdmins]     = useState(adminsInitiaux);
  const [aSupprimer, setASupprimer] = useState(null);

  const confirmerSuppression = () => {
    setAdmins((prev) => prev.filter((a) => a.id !== aSupprimer));
    setASupprimer(null);
  };

  return (
    <>
      <section className="w-[37rem] mt-[21px] bg-white border border-[#e1e4e8] rounded-[20px] overflow-hidden">

        {/* En-tête */}
        <div className="h-[67px] px-[20px] flex items-center justify-between">
          <div className="flex items-center gap-[9px]">
            <div className="w-[28px] h-[28px] rounded-[8px] bg-[#edf4ff] flex items-center justify-center">
              <svg width="15" height="15" viewBox="0 0 24 24"
                fill="none" stroke="#2875db" strokeWidth="2">
                <circle cx="9"  cy="8" r="2.5" />
                <circle cx="17" cy="8" r="2.5" />
                <path d="M4 19c.5-3 2-5 5-5s4.5 2 5 5" />
                <path d="M13 15c2.7-.2 4.7 1.3 5 4" />
              </svg>
            </div>
            <h2 className="m-0 text-lg font-semibold">Admins secondaires</h2>
          </div>

          <button className="flex items-center gap-[6px] text-sm text-[#d96814] font-semibold hover:underline cursor-pointer">
            <span className="w-[14px] h-[14px] rounded-full bg-[#d96814] text-white flex items-center justify-center text-xs font-bold">
              +
            </span>
            Ajouter un administrateur
          </button>
        </div>

        {/* Header colonnes */}
        <div className="h-[40px] bg-[#fafbfc] border-y border-[#edf0f2] grid grid-cols-[1.6fr_1fr_1fr_.75fr] items-center px-[20px] text-xs tracking-[1.3px] text-[#9199a5] uppercase">
          <span>Utilisateur</span>
          <span>Droits</span>
          <span>Connexion</span>
          <span>Actions</span>
        </div>

        {/* Lignes */}
        {admins.length === 0 && (
          <div className="h-[50px] flex items-center justify-center text-sm text-[#9ca3af]">
            Aucun administrateur secondaire
          </div>
        )}

        {admins.map((admin, idx) => (
          <div
            key={admin.id}
            className={`h-[50px] grid grid-cols-[1.6fr_1fr_1fr_.75fr] items-center px-[20px] ${
              idx < admins.length - 1 ? "border-b border-[#edf0f2]" : ""
            }`}
          >
            {/* Utilisateur */}
            <div className="flex items-center gap-[7px]">
              <img src={admin.avatar} className="w-[25px] h-[25px] rounded-full object-cover" alt="" />
              <div>
                <p className="m-0 text-sm font-semibold">{admin.nom}</p>
                <p className="m-0 text-xs text-[#7b8490]">{admin.email}</p>
              </div>
            </div>

            {/* Droits */}
            <span className="w-fit px-[7px] h-[22px] flex items-center rounded-[5px] bg-[#f0f2f5] text-xs text-[#4b5563]">
              {admin.droits}
            </span>

            {/* Connexion */}
            <span className="text-sm text-[#68717e]">{admin.connexion}</span>

            {/* Actions */}
            <div className="flex items-center gap-[9px] text-[#9ba3ad]">
              <button type="button" className="hover:text-gray-700 cursor-pointer transition-colors">
                <IconEditer />
              </button>
              <button
                type="button"
                onClick={() => setASupprimer(admin.id)}
                className="hover:text-red-500 cursor-pointer transition-colors"
              >
                <IconSupprimer />
              </button>
            </div>
          </div>
        ))}

      </section>

      {/* Modale confirmation suppression */}
      {aSupprimer !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setASupprimer(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="mt-5 text-xl font-bold text-gray-900">Confirmer la suppression</h3>
              <p className="mt-2 text-sm text-gray-600">
                Êtes-vous sûr de vouloir supprimer cet administrateur ? Cette action est irréversible.
              </p>
            </div>
            <div className="flex gap-4 bg-gray-50 px-8 py-4 rounded-b-2xl">
              <button
                type="button"
                onClick={() => setASupprimer(null)}
                className="w-full cursor-pointer py-2.5 rounded-lg border border-gray-300 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={confirmerSuppression}
                className="w-full py-2.5 cursor-pointer rounded-lg bg-red-600 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminsSecondaires;
