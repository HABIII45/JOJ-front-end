// src/components/chargementpaiement/index.jsx
import React, { useEffect } from 'react';

const ChargementPaiement = ({ onTermine }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onTermine();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onTermine]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white font-sans">

      {/* Spinner */}
      <div className="relative flex h-[90px] w-[90px] items-center justify-center">
        <svg
          className="animate-spin"
          width="90"
          height="90"
          viewBox="0 0 90 90"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="45"
            cy="45"
            r="38"
            stroke="#f0e0d6"
            strokeWidth="6"
          />
          <path
            d="M45 7 a38 38 0 0 1 38 38"
            stroke="#cf6417"
            strokeWidth="6"
            strokeLinecap="round"
          />
        </svg>

        {/* Icône centrale */}
        <div className="absolute flex h-[44px] w-[44px] items-center justify-center rounded-full bg-[#cf6417]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
          >
            <rect x="2" y="5" width="20" height="14" rx="3" stroke="white" strokeWidth="2" />
            <path d="M2 10h20" stroke="white" strokeWidth="2" />
            <path d="M6 15h4" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* Texte */}
      <p className="mt-[28px] text-[16px] font-bold text-[#111111]">
        Traitement en cours…
      </p>
      <p className="mt-[8px] text-center text-[13px] font-normal text-[#888888]">
        Veuillez patienter, votre paiement est en cours de traitement.
      </p>

      {/* Barre de progression */}
      <div className="mt-[32px] h-[4px] w-[220px] overflow-hidden rounded-full bg-[#f0e0d6]">
        <div
          className="h-full rounded-full bg-[#cf6417]"
          style={{ animation: 'progression 5s linear forwards' }}
        />
      </div>

      <style>{`
        @keyframes progression {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>

    </div>
  );
};

export default ChargementPaiement;
