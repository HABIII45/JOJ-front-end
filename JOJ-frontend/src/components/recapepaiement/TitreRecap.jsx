// src/components/recapepaiement/TitreRecap.jsx
import React from 'react';

const TitreRecap = ({ titre, sousTitre }) => {
  return (
    <div className="text-center">
      <h1 className="m-0 text-[30px] font-[800] leading-[36px] tracking-[-0.8px] text-[#050505] max-md:text-[26px] max-md:leading-[32px]">
        {titre}
      </h1>
      <p className="mt-[9px] mb-0 text-[13px] font-[400] leading-[18px] text-[#777777] max-md:px-[10px] max-md:text-[12px]">
        {sousTitre}
      </p>
    </div>
  );
};

export default TitreRecap;