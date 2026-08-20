// src/components/confirmepaiement/index.jsx
import React from 'react';
import EnteteConfirme from './EnteteConfirme';
import BadgePaiement from './BadgePaiement';
import ChampInfo from './ChampInfo';
import BoutonsConfirme from './BoutonsConfirme';

const TITRES_METHODES = {
  wave: "Récapitulatif Wave",
  orange: "Récapitulatif Orange Money",
  card: "Récapitulatif Carte Bancaire",
  WAVE: "Récapitulatif Wave",
  ORANGE_MONEY: "Récapitulatif Orange Money",
  CARTE: "Récapitulatif Carte Bancaire",
};

const LABELS_TRANSACTION = {
  wave: "Numéro de transaction Wave",
  orange: "Numéro de transaction Orange Money",
  card: "Référence transaction bancaire",
  WAVE: "Numéro de transaction Wave",
  ORANGE_MONEY: "Numéro de transaction Orange Money",
  CARTE: "Référence transaction bancaire",
};

const ConfirmePaiement = ({
  modePaiement = 'wave',
  reponsePaiement = null,
  commande = null,
  onVoirBillet,
  onRetour
}) => {
  const premierPaiement = Array.isArray(reponsePaiement) ? reponsePaiement[0] : reponsePaiement;
  const reference = premierPaiement?.reference_prestataire || premierPaiement?.reference || `JOJ-${Date.now().toString().slice(-8)}`;
  const montant = premierPaiement?.montant || commande?.total || 0;
  const dateStr = premierPaiement?.date_creation
    ? new Date(premierPaiement.date_creation).toLocaleString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : new Date().toLocaleString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

  const contactInfo = commande?.spectateur?.email || commande?.spectateur?.tel || "contact@joj2026.sn";
  const titreMethode = TITRES_METHODES[modePaiement] || "Récapitulatif Paiement";
  const labelTx = LABELS_TRANSACTION[modePaiement] || "Numéro de transaction";

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
            {titreMethode}
          </h2>
          <p className="m-0 mt-[16px] max-w-[300px] text-[14px] font-normal leading-[20px] text-[#666666]">
            Conservez ces informations pour tout besoin d'assistance.
          </p>
          <BadgePaiement modePaiement={modePaiement} />
        </div>

        {/* Colonne droite */}
        <div className="w-full max-w-[399px]">

          <ChampInfo
            label={labelTx}
            valeur={reference}
            note="Identifiant unique de votre transaction."
          />

          <div className="mt-[22px]">
            <ChampInfo
              label="Montant payé"
              valeur={`${Number(montant).toLocaleString('fr-FR')} FCFA`}
              note="Devise : Franc CFA BCEAO"
              accent={true}
            />
          </div>

          <div className="mt-[22px]">
            <ChampInfo
              label="Date & heure de validation"
              valeur={dateStr}
            />
          </div>

          <div className="mt-[22px]">
            <ChampInfo
              label="E-mail / Téléphone"
              valeur={contactInfo}
              note="Pour l'envoi du billet officiel."
            />
          </div>

          <BoutonsConfirme onVoirBillet={onVoirBillet} />

        </div>

      </section>

    </main>
  );
};

export default ConfirmePaiement;
