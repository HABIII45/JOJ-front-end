// src/components/recapepaiement/CarteRecap.jsx
import React from 'react';

const CarteRecap = ({ 
  icone, 
  titre, 
  sousTitre, 
  description, 
  estTotal = false,
  montantTotal = null,
  taxes = null,
  couleurFond = 'bg-white'
}) => {
  return (
    <div className={`flex h-[118px] min-w-0 items-center rounded-[13px] border ${estTotal ? 'border-[#f2d8c8]' : 'border-[#e2e2e2]'} ${estTotal ? 'bg-[#fffaf7]' : couleurFond} px-[18px] shadow-[0_1px_2px_rgba(0,0,0,0.02)] max-md:h-auto max-md:min-h-[118px] max-md:px-[14px]`}>
      
      {/* Icône */}
      {estTotal ? (
        <div className="flex h-[78px] w-[78px] shrink-0 items-center justify-center rounded-[10px] bg-[#f5dac8] max-sm:h-[65px] max-sm:w-[65px]">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6.5C4 5.67 4.67 5 5.5 5H18C19.1 5 20 5.9 20 7V18C20 19.1 19.1 20 18 20H6C4.9 20 4 19.1 4 18V6.5Z" stroke="#d05b0c" stroke-width="2"/>
            <path d="M4 8H18.5C19.33 8 20 8.67 20 9.5V13H16C14.9 13 14 12.1 14 11C14 9.9 14.9 9 16 9H20" fill="#d05b0c"/>
            <circle cx="16.5" cy="11" r="1" fill="white"/>
          </svg>
        </div>
      ) : (
        <img
          src={icone}
          alt=""
          className="h-[78px] w-[78px] shrink-0 rounded-[10px] object-cover max-sm:h-[65px] max-sm:w-[65px]"
        />
      )}

      {/* Contenu */}
      <div className="ml-[19px] min-w-0 max-sm:ml-[14px]">
        <h2 className="m-0 text-[16px] font-[700] leading-[20px] text-[#111111]">
          {titre}
        </h2>
        
        <p className="mt-[3px] mb-0 text-[12px] font-[400] leading-[16px] text-[#e15d0b]">
          {sousTitre}
        </p>

        {estTotal ? (
          <div className="mt-[3px] flex flex-wrap items-baseline">
            <span className="text-[21px] font-[800] leading-[25px] text-[#050505] max-sm:text-[19px]">
              {montantTotal}
            </span>
            <span className="ml-[3px] text-[11px] font-[400] text-[#777777]">
              {taxes}
            </span>
          </div>
        ) : (
          <p className="mt-[5px] mb-0 text-[13px] font-[400] leading-[17px] text-[#222222] max-md:whitespace-normal">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default CarteRecap;