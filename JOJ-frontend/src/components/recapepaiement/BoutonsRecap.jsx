// src/components/recapepaiement/BoutonsRecap.jsx
import React from 'react';

const BoutonsRecap = ({ 
  onAnnuler, 
  onPayer, 
  texteAnnuler = "Annuler", 
  textePayer = "Payer maintenant" 
}) => {
  return (
    <div className="mt-[21px] flex items-center justify-center gap-[10px] max-sm:flex-col">
      <button
        type="button"
        onClick={onAnnuler}
        className="h-[47px] w-[128px] cursor-pointer rounded-[10px] border-[2px] border-[#111111] bg-white text-[13px] font-[700] text-[#111111] max-sm:w-full max-sm:max-w-[320px] hover:bg-gray-50 transition-colors"
      >
        {texteAnnuler}
      </button>

      <button
        type="button"
        onClick={onPayer}
        className="h-[48px] cursor-pointer w-[188px] rounded-[10px] bg-black text-[13px] font-[700] text-white shadow-[0_5px_8px_rgba(0,0,0,0.15)] max-sm:w-full max-sm:max-w-[320px] hover:bg-gray-800 transition-colors"
      >
        {textePayer}
      </button>
    </div>
  );
};

export default BoutonsRecap;