// src/pages/public/PaymentSummary.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TitreRecap from '../../components/recapepaiement/TitreRecap';
import CarteRecap from '../../components/recapepaiement/CarteRecap';
import BoutonsRecap from '../../components/recapepaiement/BoutonsRecap';
import ModePaiement from '../../components/modepaiement';
import ChargementPaiement from '../../components/chargementpaiement';
import ConfirmePaiement from '../../components/confirmepaiement';
import Billets from '../../components/billets';
import evenementIcon from '../../assets/images/evenement.svg';
import billetIcon from '../../assets/images/billet.svg';
import avantageIcon from '../../assets/images/avantage.svg';

// Étapes du flux de paiement
const ETAPES = {
  RECAP: 'recap',
  POPUP: 'popup',
  CHARGEMENT: 'chargement',
  CONFIRMATION: 'confirmation',
  BILLET: 'billet',
};

const PaymentSummary = () => {
  const navigate = useNavigate();
  const [etape, setEtape] = useState(ETAPES.RECAP);
  const [modePaiement, setModePaiement] = useState(null);

  const handleSelectionPaiement = (mode) => {
    setModePaiement(mode);
    setEtape(ETAPES.CHARGEMENT);
  };

  // Chargement en cours → plein écran, on cache le reste
  if (etape === ETAPES.CHARGEMENT) {
    return (
      <ChargementPaiement onTermine={() => setEtape(ETAPES.CONFIRMATION)} />
    );
  }

  // Billet → plein écran
  if (etape === ETAPES.BILLET) {
    return <Billets />;
  }

  // Confirmation → plein écran
  if (etape === ETAPES.CONFIRMATION) {
    return (
      <ConfirmePaiement
        modePaiement={modePaiement}
        onRetour={() => setEtape(ETAPES.RECAP)}
        onVoirBillet={() => setEtape(ETAPES.BILLET)}
      />
    );
  }

  return (
    <main className="min-h-screen bg-[#faf7fb] p-[10px] font-sans">

      <div className="min-h-[568px] w-full bg-white px-[25px] pt-[52px] max-md:px-[15px] max-md:pt-[35px]">

        {/* TITRE */}
        <TitreRecap
          titre="Récapitulatif"
          sousTitre="Veuillez vérifier les détails avant de procéder au paiement."
        />

        {/* CARTES */}
        <div className="mx-auto mt-[22px] grid max-w-[1025px] grid-cols-2 gap-x-[40px] gap-y-[18px] max-lg:grid-cols-1 max-lg:gap-x-0 max-lg:gap-y-[18px]">

          <CarteRecap
            icone={evenementIcon}
            titre="Événement"
            sousTitre="Sport • Athlétisme"
            description="Athlétisme — Iba Mar Diop — Ven 12 Mai • 18:00"
          />

          <CarteRecap
            icone={billetIcon}
            titre="Billets"
            sousTitre="Type • Quantité"
            description="VIP — 1 billet • Accès loges/zone premium"
          />

          <CarteRecap
            icone={avantageIcon}
            titre="Avantages"
            sousTitre="Inclus dans votre offre"
            description="Entrée dédiée, zone premium, assistance sur place"
          />

          <CarteRecap
            estTotal={true}
            titre="Total à payer"
            sousTitre="Montant TTC"
            montantTotal="48 000 FCFA"
            taxes="(incl. taxes)"
          />

        </div>

        {/* SÉPARATEUR */}
        <div className="mx-auto mt-[27px] max-w-[1100px] border-t-[2px] border-[#999999] max-md:mt-[22px]"></div>

        {/* BOUTONS */}
        <BoutonsRecap
          onAnnuler={() => navigate(-1)}
          onPayer={() => setEtape(ETAPES.POPUP)}
        />

      </div>

      {/* POPUP MODE DE PAIEMENT */}
      {etape === ETAPES.POPUP && (
        <ModePaiement
          onFermer={() => setEtape(ETAPES.RECAP)}
          onSelectionner={handleSelectionPaiement}
        />
      )}

    </main>
  );
};

export default PaymentSummary;
