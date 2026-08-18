// src/components/confirmepaiement/index.jsx
import React from 'react';
import EnteteConfirme from './EnteteConfirme';
import BadgePaiement from './BadgePaiement';
import ChampInfo from './ChampInfo';
import BoutonsConfirme from './BoutonsConfirme';

const ConfirmePaiement = ({ modePaiement = 'wave', onVoirBillet, onRetour }) => {
  return (
    <main className="min-h-screen w-full bg-white px-5 py-[4px] font-sans">

      {/* Header */}
      <EnteteConfirme onRetour={onRetour} />

      {/* Séparateur */}
      <div className="mx-auto mt-[47px] h-px w-full max-w-[876px] bg-[#a9a9a9]"></div>

      {/* Contenu */}
      <section className="mx-auto mt-[43px] grid w-full max-w-[817px] grid-cols-1 gap-[45px] md:grid-cols-[375px_1fr] md:gap-[45px]">

        {/* Colonne gauche */}
        <div className="pt-[40px]">
          <h2 className="m-0 text-[30px] font-bold leading-[37px] tracking-[-0.5px] text-[#050505]">
            Récapitulatif Wave
          </h2>
          <p className="m-0 mt-[16px] max-w-[300px] text-[14px] font-normal leading-[20px] text-[#666666]">
            Conservez ces informations pour tout besoin d'assistance.
          </p>
          <BadgePaiement modePaiement={modePaiement} />
        </div>

        {/* Colonne droite */}
        <div className="w-full max-w-[399px]">

          <ChampInfo
            label="Numéro de transaction Wave"
            valeur="WX-8472910475-2026"
            note="Identifiant unique de votre transaction."
          />

          <div className="mt-[22px]">
            <ChampInfo
              label="Montant payé"
              valeur="48 000XOF"
              note="Devise : Franc CFA BCEAO"
              accent={true}
            />
          </div>

          <div className="mt-[22px]">
            <ChampInfo
              label="Date & heure de validation"
              valeur="05 mai 2026 — 14:42"
            />
          </div>

          <div className="mt-[22px]">
            <ChampInfo
              label="E-mail / Téléphone"
              valeur="adjiaissatouawadesamb@gmail.com"
              note="Pour l'envoi du billet (si configuré)."
            />
          </div>

          <BoutonsConfirme onVoirBillet={onVoirBillet} />

        </div>

      </section>

    </main>
  );
};

export default ConfirmePaiement;
