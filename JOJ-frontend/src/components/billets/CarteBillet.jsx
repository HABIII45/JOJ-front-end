// src/components/billets/CarteBillet.jsx

const CarteBillet = ({ billet, onTelechargerTous }) => {
  return (
    <div className="flex flex-col gap-6">

      {/* Image du site + infos propres au billet */}
      <div className="relative rounded-3xl overflow-hidden shadow-lg bg-gray-900 h-80">

        {/* Image du site de l'épreuve */}
        <img
          src={billet.imageUrl}
          alt={billet.site}
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />

        {/* Badge catégorie */}
        <div className="absolute top-4 right-4">
          <span className="bg-[#C45D1E] text-white text-xs font-bold px-4 py-1.5 rounded-full tracking-wide uppercase">
            {billet.categorie}
          </span>
        </div>

        {/* Overlay bas */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-6 pt-20">
          <div className="flex justify-between items-end">

            <div>
              <h2 className="text-white text-xl font-bold mb-1">{billet.epreuve}</h2>
              <div className="flex items-center gap-2 text-gray-300 text-sm mb-1">
                <svg className="w-4 h-4 text-[#C45D1E] shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span>{billet.site}, {billet.ville}</span>
              </div>
              <p className="text-gray-400 text-xs">{billet.siege}</p>
            </div>

            <div className="text-right shrink-0 ml-4">
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">DATE & HEURE</p>
              <p className="text-white font-bold">{billet.date}</p>
              <p className="text-[#C45D1E] font-bold">{billet.heure}</p>
            </div>

          </div>

          {/* Titulaire + ID */}
          <div className="mt-3 pt-3 border-t border-white/20 flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-gray-300 text-xs">{billet.titulaire}</span>
            <span className="ml-auto text-gray-400 text-xs font-mono">{billet.id}</span>
          </div>
        </div>
      </div>

      {/* Bouton télécharger tous */}
      <button
        type="button"
        onClick={onTelechargerTous}
        className="w-full bg-[#C45D1E] cursor-pointer hover:bg-[#A84D18] text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Télécharger tous les billets (PDF)
      </button>

    </div>
  );
};

export default CarteBillet;
