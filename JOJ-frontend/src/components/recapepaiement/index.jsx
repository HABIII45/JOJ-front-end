// src/components/recapepaiement/index.jsx
import React from 'react';
import TitreRecap from './TitreRecap';
import CarteRecap from './CarteRecap';
import BoutonsRecap from './BoutonsRecap';
import evenementIcon from '../../assets/images/evenement.svg';
import billetIcon from '../../assets/images/billet.svg';
import avantageIcon from '../../assets/images/avantage.svg';

const RecapePaiement = ({ 
  donnees, 
  onAnnuler, 
  onPayer,
  titre = "Récapitulatif",
  sousTitre = "Veuillez vérifier les détails avant de procéder au paiement."
}) => {
  // Données par défaut si aucune donnée n'est fournie
  const donneesParDefaut = {
    cartes: [
      {
        icone: evenementIcon,
        titre: "Événement",
        sousTitre: "Sport • Athlétisme",
        description: "Athlétisme — Iba Mar Diop — Ven 12 Mai • 18:00"
      },
      {
        icone: billetIcon,
        titre: "Billets",
        sousTitre: "Type • Quantité",
        description: "VIP — 1 billet • Accès loges/zone premium"
      },
      {
        icone: avantageIcon,
        titre: "Avantages",
        sousTitre: "Inclus dans votre offre",
        description: "Entrée dédiée, zone premium, assistance sur place"
      },
      {
        estTotal: true,
        titre: "Total à payer",
        sousTitre: "Montant TTC",
        montantTotal: "48 000 FCFA",
        taxes: "(incl. taxes)"
      }
    ]
  };

  const donneesUtilisees = donnees || donneesParDefaut;

  return (
    <div className="min-h-[568px] w-full bg-white px-[25px] pt-[52px] max-md:px-[15px] max-md:pt-[35px]">
      
      {/* Titre */}
      <TitreRecap 
        titre={titre}
        sousTitre={sousTitre}
      />

      {/* Cartes */}
      <div className="mx-auto mt-[22px] grid max-w-[1025px] grid-cols-2 gap-x-[40px] gap-y-[18px] max-lg:grid-cols-1 max-lg:gap-x-0 max-lg:gap-y-[18px]">
        
        {donneesUtilisees.cartes.map((carte, index) => (
          <CarteRecap
            key={index}
            icone={carte.icone}
            titre={carte.titre}
            sousTitre={carte.sousTitre}
            description={carte.description}
            estTotal={carte.estTotal || false}
            montantTotal={carte.montantTotal}
            taxes={carte.taxes}
          />
        ))}

      </div>

      {/* Séparateur */}
      <div className="mx-auto mt-[27px] max-w-[1100px] border-t-[2px] border-[#999999] max-md:mt-[22px]"></div>

      {/* Boutons */}
      <BoutonsRecap 
        onAnnuler={onAnnuler}
        onPayer={onPayer}
      />

    </div>
  );
};

export default RecapePaiement;