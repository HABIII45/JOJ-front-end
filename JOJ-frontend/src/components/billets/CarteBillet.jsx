// src/components/billets/CarteBillet.jsx
import React from 'react';

const CarteBillet = ({ onTelechargerTous }) => {
  return (
    <div className="flex flex-col gap-6">

      {/* Card événement */}
      <div className="relative rounded-3xl overflow-hidden shadow-lg bg-gray-900 h-80">

        {/* Image de fond */}
        <img
          src="https://images.unsplash.com/photo-1518605348400-437a4a7761c4?w=800&q=80"
          alt="Stade"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />

        {/* Badge VIP */}
        <div className="absolute top-4 right-4">
          <span className="bg-[#C45D1E] text-white text-xs font-bold px-4 py-1.5 rounded-full tracking-wide uppercase">
            VIP ACCESS
          </span>
        </div>

        {/* Overlay bas */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-6 pt-20">
          <div className="flex justify-between items-end">

            <div>
              <h2 className="text-white text-2xl font-bold mb-2">
                Athlétisme - Finales 100m
              </h2>
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <svg className="w-4 h-4 text-[#C45D1E]" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Stade Iba Mar Diop, Dakar</span>
              </div>
            </div>

            <div className="text-right">
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">DATE & HEURE</p>
              <p className="text-white font-bold text-lg">12 Mai 2026</p>
              <p className="text-[#C45D1E] font-bold text-lg">18:00</p>
            </div>

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
