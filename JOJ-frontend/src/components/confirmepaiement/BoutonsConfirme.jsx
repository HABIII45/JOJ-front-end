// src/components/confirmepaiement/BoutonsConfirme.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const BoutonsConfirme = ({ onVoirBillet }) => {
  const navigate = useNavigate();

  return (
    <div className="mt-[33px] flex flex-col gap-[10px]">

      {/* Voir le billet */}
      <button
        type="button"
        onClick={onVoirBillet}
        className="flex h-[44px] cursor-pointer w-full items-center justify-center rounded-[8px] bg-[#cf6417] text-[13px] font-bold text-white shadow-[0_3px_5px_rgba(0,0,0,0.18)]"
      >
        Voir le billet
      </button>

      {/* Retour à l'accueil */}
      <button
        type="button"
        onClick={() => navigate('/')}
        className="flex h-[42px] cursor-pointer w-full items-center justify-center rounded-[8px] border-[1.5px] border-[#111111] bg-white text-[12px] font-bold text-[#111111]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="mr-[7px]"
        >
          <path d="M12 3 3 10v10h6v-6h6v6h6V10l-9-7Z" />
        </svg>
        Retour à l'accueil
      </button>

    </div>
  );
};

export default BoutonsConfirme;
