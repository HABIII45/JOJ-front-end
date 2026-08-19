// src/components/confirmepaiement/BadgePaiement.jsx
import React from 'react';
import waveIcon from '../../assets/images/wave.svg';

const BadgePaiement = ({ modePaiement = 'wave' }) => {
  const labels = {
    wave: { texte: 'PAYÉ AVEC WAVE', icone: waveIcon },
    orange: { texte: 'PAYÉ AVEC ORANGE MONEY', icone: null },
    card: { texte: 'PAYÉ PAR CARTE', icone: null },
  };

  const { texte, icone } = labels[modePaiement] || labels.wave;

  return (
    <div className="mt-[37px] flex h-[60px] w-[226px] items-center rounded-[10px] border border-[#ffcfc0] bg-[#fffdfc] px-[15px]">

      {/* Icône portefeuille */}
      <div className="flex h-[28px] w-[28px] items-center justify-center rounded-[6px] bg-[#cf6417]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="17"
          viewBox="0 0 15 17"
          fill="none"
        >
          <rect
            x="3"
            y="1"
            width="9"
            height="15"
            rx="1.5"
            stroke="white"
            strokeWidth="1.4"
          />
          <path
            d="M6 13.5H9"
            stroke="white"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <span className="ml-[9px] whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.7px] text-[#cf6417]">
        {texte}
      </span>

      {icone && (
        <img
          src={icone}
          alt={modePaiement}
          className="ml-[10px] h-[25px] w-[25px] object-contain"
        />
      )}

    </div>
  );
};

export default BadgePaiement;
