// src/components/confirmepaiement/ChampInfo.jsx
import React from 'react';

const ChampInfo = ({ label, valeur, note, accent = false }) => {
  return (
    <div>
      <label className="block text-[11px] font-bold leading-[14px] text-[#111111]">
        {label}
      </label>

      <div
        className={`mt-[7px] flex items-center overflow-hidden rounded-[9px] border px-[12px] ${
          accent
            ? 'h-[39px] border-[#f1ded6] bg-[#fffdfc] text-[14px] font-bold text-[#cf6417]'
            : 'h-[37px] border-[#eeeeee] bg-[#f8f8f8] text-[12px] font-normal text-[#222222]'
        }`}
      >
        {valeur}
      </div>

      {note && (
        <p className="m-0 mt-[5px] text-[9px] leading-[12px] text-[#999999]">
          {note}
        </p>
      )}
    </div>
  );
};

export default ChampInfo;
