// src/components/billets/CarteBillet.jsx
import React from "react";
import { Download, MapPin, User, Calendar, Clock, Sparkles } from "lucide-react";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1518605348400-437a4a7761c4?w=800&q=80";

const CarteBillet = ({ billet, onTelechargerTous, totalBillets = 1, telechargementEnCours = false }) => {
  return (
    <div className="flex flex-col gap-6">

      {/* Image du site de l'épreuve + informations */}
      <div className="relative rounded-3xl overflow-hidden shadow-lg bg-gray-900 h-84 border border-gray-100">

        <img
          src={billet.imageUrl || FALLBACK_IMAGE}
          alt={billet.site}
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
        />

        {/* Badge type de billet */}
        <div className="absolute top-4 right-4">
          <span className={`text-white text-xs font-extrabold px-4 py-1.5 rounded-full tracking-wider uppercase shadow-md ${
            billet.categorie === "VIP" ? "bg-amber-600" : billet.categorie === "PRESSE" ? "bg-emerald-600" : "bg-[#C45D1E]"
          }`}>
            {billet.categorie}
          </span>
        </div>

        {/* Overlay bas */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/75 to-transparent p-6 pt-20">
          <div className="flex justify-between items-end">

            <div>
              <h2 className="text-white text-xl font-extrabold mb-1 tracking-tight">{billet.epreuve}</h2>
              <div className="flex items-center gap-2 text-gray-300 text-xs mb-1 font-medium">
                <MapPin size={14} className="text-[#C45D1E] shrink-0" />
                <span>{billet.site}{billet.ville !== "—" ? `, ${billet.ville}` : ""}</span>
              </div>
              {billet.siege && billet.siege !== "—" && (
                <p className="text-gray-400 text-xs font-semibold">{billet.siege}</p>
              )}
            </div>

            <div className="text-right shrink-0 ml-4">
              <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-1">DATE & HEURE</p>
              <p className="text-white font-bold text-sm">{billet.date}</p>
              <p className="text-[#F28C28] font-extrabold text-sm">{billet.heure} GMT</p>
            </div>

          </div>

          {/* Titulaire + code unique */}
          <div className="mt-3 pt-3 border-t border-white/20 flex items-center gap-2">
            <User size={14} className="text-gray-400 shrink-0" />
            <span className="text-gray-300 text-xs font-medium">{billet.titulaire}</span>
            <span className="ml-auto text-gray-400 text-xs font-mono truncate max-w-[130px] bg-black/40 px-2 py-0.5 rounded">
              {billet.codeUnique || billet.id}
            </span>
          </div>
        </div>
      </div>

      {/* Bouton télécharger tous les billets un par un */}
      <button
        type="button"
        disabled={telechargementEnCours}
        onClick={onTelechargerTous}
        className="w-full bg-[#C45D1E] hover:bg-[#A84D18] disabled:opacity-60 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2.5 transition-all shadow-md active:scale-98 cursor-pointer"
      >
        <Download size={18} />
        {telechargementEnCours
          ? "Téléchargement séquentiel en cours..."
          : `Télécharger tous les billets (${totalBillets}) sous forme d'image`}
      </button>

    </div>
  );
};

export default CarteBillet;
