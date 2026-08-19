// src/components/billets/index.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBillets } from "../../hooks/useBillets";
import EnteteBillet from "./EnteteBillet";
import CarteBillet from "./CarteBillet";
import CarteQR from "./CarteQR";
import CarouselIndicateur from "./CarouselIndicateur";

const Billets = () => {
  const navigate = useNavigate();
  const { billets, chargement, erreur, recharger } = useBillets();
  const [billetActif, setBilletActif] = useState(0);

  const allerAuPrecedent = () => setBilletActif((i) => Math.max(i - 1, 0));
  const allerAuSuivant   = () => setBilletActif((i) => Math.min(i + 1, billets.length - 1));

  // ── États de chargement ──────────────────────────────────────────────────
  if (chargement) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#C45D1E] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm font-medium">Chargement de vos billets…</p>
        </div>
      </div>
    );
  }

  if (erreur) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow p-8 max-w-md text-center">
          <p className="text-red-500 font-semibold text-base mb-2">Impossible de charger les billets</p>
          <p className="text-gray-400 text-sm mb-6">{erreur}</p>
          <button
            onClick={recharger}
            className="bg-[#C45D1E] text-white px-6 py-2.5 rounded-xl font-medium hover:bg-[#A84D18] transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (billets.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow p-8 max-w-md text-center">
          <p className="text-gray-600 font-semibold text-base mb-2">Aucun billet trouvé</p>
          <p className="text-gray-400 text-sm">Vous n'avez pas encore de billets réservés.</p>
        </div>
      </div>
    );
  }

  const billet = billets[billetActif];

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans antialiased">
      <div className="max-w-6xl mx-auto">

        <EnteteBillet />

        {/* Flèches de navigation au-dessus des colonnes */}
        <CarouselIndicateur
          total={billets.length}
          actif={billetActif}
          onPrecedent={allerAuPrecedent}
          onSuivant={allerAuSuivant}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Colonne gauche — image du site + infos du billet */}
          <CarteBillet
            billet={billet}
            onTelechargerTous={() => console.log("Télécharger tous les billets PDF")}
          />

          {/* Colonne droite — QR réel + boutons */}
          <CarteQR
            billet={billet}
            onTelecharger={() => console.log(`Télécharger PDF — ${billet.codeUnique}`)}
            onAccueil={() => navigate("/")}
          />

        </div>
      </div>
    </div>
  );
};

export default Billets;
