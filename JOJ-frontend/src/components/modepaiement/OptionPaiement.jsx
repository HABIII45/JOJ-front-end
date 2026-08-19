// src/components/modepaiement/OptionPaiement.jsx
import React from 'react';

const OptionPaiement = ({ id, icone, label, selectionne, onSelectionner }) => {
  return (
    <button
      type="button"
      onClick={() => onSelectionner(id)}
      className={`flex h-[54px] w-full max-w-[245px] shrink-0 items-center justify-between rounded-[10px] border px-[13px] transition-none ${
        selectionne
          ? 'border-[#e36b2c] bg-[#fff9f6]'
          : 'border-[#e8e8e8] bg-white'
      }`}
    >
      <div className="flex items-center gap-[13px]">
        <img
          src={icone}
          alt={label}
          className="h-[25px] w-[25px] object-contain"
        />
        <span className="text-[14px] font-bold leading-[17px] text-[#111111]">
          {label}
        </span>
      </div>

      {/* Radio */}
      {selectionne ? (
        <span className="flex h-[13px] w-[13px] items-center justify-center rounded-full bg-[#d26928]">
          <span className="h-[5px] w-[5px] rounded-full bg-white"></span>
        </span>
      ) : (
        <span className="h-[13px] w-[13px] rounded-full border border-[#777777]"></span>
      )}
    </button>
  );
};

export default OptionPaiement;
