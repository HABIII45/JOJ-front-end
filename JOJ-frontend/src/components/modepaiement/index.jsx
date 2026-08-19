// src/components/modepaiement/index.jsx
import React, { useState } from 'react';
import TitreModeP from './TitreModeP';
import OptionPaiement from './OptionPaiement';
import DescriptionModeP from './DescriptionModeP';
import waveIcon from '../../assets/images/wave.svg';
import orangeMoneyIcon from '../../assets/images/orange money.svg';
import carteBancaireIcon from '../../assets/images/carte bancaire.svg';

const ModePaiement = ({ onFermer, onSelectionner }) => {
  const [selectionne, setSelectionne] = useState(null);

  const choisir = (id) => {
    setSelectionne(id);
    // Court délai pour que l'utilisateur voit la sélection avant la fermeture
    setTimeout(() => {
      onSelectionner(id);
    }, 300);
  };

  const options = [
    { id: 'wave', icone: waveIcon, label: 'Wave' },
    { id: 'orange', icone: orangeMoneyIcon, label: 'Orange Money' },
  ];

  return (
    // Overlay
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onFermer}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Contenu popup */}
      <div
        className="relative w-full max-w-[643px] overflow-hidden bg-[#fbf7ff] p-[4px] font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex min-h-[282px] w-full flex-col items-center bg-white px-4 pt-[47px] pb-6">

          {/* Titre */}
          <TitreModeP />

          {/* Options Wave + Orange Money (côte à côte) */}
          <div className="mt-[17px] flex w-full flex-col items-center gap-[12px] sm:flex-row sm:justify-center sm:gap-[13px]">
            {options.map((option) => (
              <OptionPaiement
                key={option.id}
                id={option.id}
                icone={option.icone}
                label={option.label}
                selectionne={selectionne === option.id}
                onSelectionner={choisir}
              />
            ))}
          </div>

          {/* Carte Bancaire (seule en dessous) */}
          <div className="mt-[12px]">
            <OptionPaiement
              id="card"
              icone={carteBancaireIcon}
              label="Carte Bancaire"
              selectionne={selectionne === 'card'}
              onSelectionner={choisir}
            />
          </div>

          {/* Description */}
          <DescriptionModeP />

        </div>
      </div>
    </div>
  );
};

export default ModePaiement;
