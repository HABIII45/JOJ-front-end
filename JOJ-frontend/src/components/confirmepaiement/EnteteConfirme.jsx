// src/components/confirmepaiement/EnteteConfirme.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const EnteteConfirme = ({ onRetour }) => {
  const navigate = useNavigate();

  const handleRetour = () => {
    if (onRetour) {
      onRetour();
    } else {
      navigate(-1);
    }
  };

  return (
    <section className="relative flex flex-col items-center">

      {/* Bouton retour */}
      <button
        type="button"
        onClick={handleRetour}
        className="absolute left-[30px] cursor-pointer top-[21px] flex h-[28px] w-[28px] items-center justify-center text-[#111111]"
        aria-label="Retour"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="27"
          height="27"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5" />
          <path d="M12 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Cercle de validation */}
      <div className="mt-[5px] flex h-[80px] w-[80px] items-center justify-center rounded-full bg-[#cf6417] shadow-[0_10px_18px_rgba(42,168,203,0.22)]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="45"
          height="45"
          viewBox="0 0 45 45"
          fill="none"
        >
          <path
            d="M11 23.5L19.5 32L35 16"
            stroke="white"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Titre */}
      <h1 className="m-0 mt-[27px] text-center text-[32px] font-bold leading-[39px] tracking-[-0.5px] text-[#050505]">
        Paiement réussi
      </h1>

      {/* Sous-titre */}
      <p className="m-0 mt-[6px] text-center text-[15px] font-normal leading-[19px] text-[#555555]">
        Votre billet est prêt.
      </p>

    </section>
  );
};

export default EnteteConfirme;
