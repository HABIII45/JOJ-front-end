// src/components/billets/index.jsx
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useBillets } from "../../hooks/useBillets";
import { normaliserBillet } from "../../api/billets";
import EnteteBillet from "./EnteteBillet";
import CarteBillet from "./CarteBillet";
import CarteQR from "./CarteQR";
import CarouselIndicateur from "./CarouselIndicateur";

const Billets = ({ billetsDirects = null }) => {
  const navigate = useNavigate();
  const { billets: billetsApi, chargement, erreur, recharger } = useBillets();
  const [billetActif, setBilletActif] = useState(0);

  // Récupérer depuis les props, ou le sessionStorage, ou l'API
  const billets = useMemo(() => {
    if (billetsDirects && billetsDirects.length > 0) return billetsDirects;

    try {
      const savedBillets = sessionStorage.getItem("derniers_billets");
      if (savedBillets) {
        const parsed = JSON.parse(savedBillets);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }

      const savedCommande = sessionStorage.getItem("derniere_commande");
      if (savedCommande) {
        const parsed = JSON.parse(savedCommande);
        const liste = parsed.commande?.billets || [];
        if (Array.isArray(liste) && liste.length > 0) {
          return liste.map((b) => {
            const norm = normaliserBillet(b);
            return {
              ...norm,
              statut: "VALIDE",
              epreuve: parsed.event?.titre || norm.epreuve,
              site: parsed.event?.site_nom || parsed.event?.site?.nom || norm.site,
              date: parsed.event?.date || norm.date,
              heure: parsed.event?.heure?.slice(0, 5) || norm.heure,
              titulaire: parsed.spectateur ? `${parsed.spectateur.prenom || ''} ${parsed.spectateur.nom || ''}`.trim() : norm.titulaire,
            };
          });
        }
      }
    } catch {
      // Ignorer
    }

    return billetsApi || [];
  }, [billetsDirects, billetsApi]);

  const isLoading = (billetsDirects || billets.length > 0) ? false : chargement;
  const isError = (billetsDirects || billets.length > 0) ? null : erreur;

  const allerAuPrecedent = () => setBilletActif((i) => Math.max(i - 1, 0));
  const allerAuSuivant   = () => setBilletActif((i) => Math.min(i + 1, (billets?.length || 1) - 1));

  // ── États de chargement ──────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#C45D1E] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm font-medium">Chargement de vos billets…</p>
        </div>
      </div>
    );
  }

  if (isError && (!billets || billets.length === 0)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow p-8 max-w-md text-center">
          <p className="text-red-500 font-semibold text-base mb-2">Impossible de charger les billets</p>
          <p className="text-gray-400 text-sm mb-6">{isError}</p>
          <button
            onClick={recharger}
            className="bg-[#C45D1E] text-white px-6 py-2.5 rounded-xl font-medium hover:bg-[#A84D18] transition-colors cursor-pointer"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (!billets || billets.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow p-8 max-w-md text-center">
          <p className="text-gray-600 font-semibold text-base mb-2">Aucun billet trouvé</p>
          <p className="text-gray-400 text-sm mb-4">Vous n'avez pas encore de billets réservés.</p>
          <button
            onClick={() => navigate("/events")}
            className="bg-[#C45D1E] text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-[#A84D18] transition-colors cursor-pointer"
          >
            Découvrir les épreuves
          </button>
        </div>
      </div>
    );
  }

  const billet = billets[billetActif] || billets[0];

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans antialiased">
      <div className="max-w-6xl mx-auto">

        <EnteteBillet />

        {/* Flèches de navigation au-dessus des colonnes */}
        {billets.length > 1 && (
          <CarouselIndicateur
            total={billets.length}
            actif={billetActif}
            onPrecedent={allerAuPrecedent}
            onSuivant={allerAuSuivant}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Colonne gauche — image du site + infos du billet */}
          <CarteBillet
            billet={billet}
            onTelechargerTous={() => window.print()}
          />

          {/* Colonne droite — QR réel + boutons */}
          <CarteQR
            billet={billet}
            onTelecharger={() => window.print()}
            onAccueil={() => navigate("/")}
          />

        </div>
      </div>
    </div>
  );
};

export default Billets;
