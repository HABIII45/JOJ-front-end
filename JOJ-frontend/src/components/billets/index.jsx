// src/components/billets/index.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EnteteBillet from './EnteteBillet';
import CarteBillet from './CarteBillet';
import CarteQR from './CarteQR';
import CarouselIndicateur from './CarouselIndicateur';
import { BILLETS } from './donnesBillets';

const Billets = () => {
  const navigate = useNavigate();
  const [billetActif, setBilletActif] = useState(0);

  const billet = BILLETS[billetActif];

  const allerAuPrecedent = () => setBilletActif((i) => Math.max(i - 1, 0));
  const allerAuSuivant   = () => setBilletActif((i) => Math.min(i + 1, BILLETS.length - 1));

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans antialiased">
      <div className="max-w-6xl mx-auto">

        <EnteteBillet />

        {/* Flèches de navigation — au-dessus des deux colonnes */}
        <CarouselIndicateur
          total={BILLETS.length}
          actif={billetActif}
          onPrecedent={allerAuPrecedent}
          onSuivant={allerAuSuivant}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Colonne gauche — image du site + infos du billet */}
          <CarteBillet
            billet={billet}
            onTelechargerTous={() => console.log('Télécharger tous les billets PDF')}
          />

          {/* Colonne droite — QR unique + boutons */}
          <CarteQR
            billet={billet}
            onTelecharger={() => console.log(`Télécharger PDF — ${billet.id}`)}
            onAccueil={() => navigate('/')}
          />

        </div>
      </div>
    </div>
  );
};

export default Billets;
