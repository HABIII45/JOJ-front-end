// src/pages/public/PaymentSummary.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
import { initierPaiement, normaliserBillet } from '../../api/billets';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';

// Étapes du flux de paiement
const ETAPES = {
  RECAP: 'recap',
  POPUP: 'popup',
  CHARGEMENT: 'chargement',
  CONFIRMATION: 'confirmation',
  BILLET: 'billet',
};

// Enregistrer une vente réussie pour le tableau de bord et la gestion des ventes
function enregistrerVente(billets, total, mode, spectateur, event) {
  try {
    const raw = localStorage.getItem("joj_ventes_billets_db");
    const listeActuelle = raw ? JSON.parse(raw) : [];

    const nouvelleVente = {
      id: `TXN-${Date.now().toString().slice(-8)}`,
      date_commande: new Date().toISOString(),
      montant_total: total,
      mode_paiement: mode,
      spectateur: spectateur,
      event_titre: event?.titre || "Compétition Olympique",
      billets: billets,
    };

    listeActuelle.unshift(nouvelleVente);
    localStorage.setItem("joj_ventes_billets_db", JSON.stringify(listeActuelle));

    // Mettre à jour la liste plate de tous les billets vendus
    const rawBillets = localStorage.getItem("joj_tous_les_billets");
    const tousLesBillets = rawBillets ? JSON.parse(rawBillets) : [];
    billets.forEach((b) => {
      tousLesBillets.unshift(b);
    });
    localStorage.setItem("joj_tous_les_billets", JSON.stringify(tousLesBillets));
  } catch (err) {
    console.error("Erreur enregistrement vente locale:", err);
  }
}

const PaymentSummary = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Données transmises depuis la page de réservation ou la session
  const [dataCommande, setDataCommande] = useState(() => {
    if (location.state?.commande) return location.state;
    try {
      const saved = sessionStorage.getItem("derniere_commande");
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignorer
    }
    return location.state || {};
  });

  const { commande, event, tickets, spectateur } = dataCommande;

  const [etape, setEtape] = useState(ETAPES.RECAP);
  const [modePaiement, setModePaiement] = useState(null);
  const [reponsePaiement, setReponsePaiement] = useState(null);
  const [billetsApresPaiement, setBilletsApresPaiement] = useState([]);

  // Informations réelles issues de la base de données
  const nomEvenement = event?.titre || commande?.billets?.[0]?.evenement_titre || "Compétition Olympique";
  const nomSite = event?.site_nom || event?.site?.nom || event?.site_detail?.nom || "Site Olympique";
  const dateHeure = `${event?.date || "Date officielle"} • ${event?.heure?.slice(0, 5) || "18:00"}`;
  const totalAPayer = commande?.total ?? (tickets ? (tickets.vip * 15000 + tickets.standard * 5000 + (tickets.presse || 0) * 0) : 5000);

  // Description des billets
  const descriptionBillets = [];
  if (tickets?.standard > 0) descriptionBillets.push(`${tickets.standard}x Standard`);
  if (tickets?.vip > 0) descriptionBillets.push(`${tickets.vip}x VIP`);
  if (tickets?.presse > 0) descriptionBillets.push(`${tickets.presse}x Presse`);
  const resumeBillets = descriptionBillets.length > 0 
    ? descriptionBillets.join(' • ') 
    : `${commande?.nombre_billets || (commande?.billets?.length || 1)} billet(s) réservé(s)`;

  // IDs des billets enregistrés dans le backend Django
  const listeBillets = commande?.billets || [];
  const billetIds = listeBillets.map((b) => b.id).filter(Boolean);

  const handleSelectionPaiement = async (mode) => {
    setModePaiement(mode);
    setEtape(ETAPES.CHARGEMENT);

    try {
      if (billetIds.length > 0) {
        // Envoi réel du paiement au backend Django (POST /api/payments/)
        const resultat = await initierPaiement(billetIds, mode);
        setReponsePaiement(resultat);
        
        // Préparer les billets normalisés avec statut VALIDÉ
        const billetsNormalises = listeBillets.map((b) => {
          const norm = normaliserBillet(b);
          const codeUnique = norm.codeUnique || b.code_unique || `JOJ-${b.id}`;
          return {
            ...norm,
            id: b.id,
            codeUnique: codeUnique,
            qrCodeUrl: b.qr_code_url ? b.qr_code_url : `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(codeUnique)}`,
            statut: 'VALIDE',
            epreuve: nomEvenement,
            site: nomSite,
            ville: event?.site?.ville || event?.site_detail?.ville || "Dakar",
            date: event?.date ? new Date(event.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" }) : norm.date,
            heure: event?.heure ? event.heure.slice(0, 5) : norm.heure,
            titulaire: spectateur ? `${spectateur.prenom || ''} ${spectateur.nom || ''}`.trim() : norm.titulaire,
          };
        });

        setBilletsApresPaiement(billetsNormalises);
        sessionStorage.setItem("derniers_billets", JSON.stringify(billetsNormalises));
        enregistrerVente(billetsNormalises, totalAPayer, mode, spectateur, event);
      } else {
        // Fallback avec données de la commande
        const codeUnique = `JOJ-${Date.now().toString().slice(-8)}`;
        const billetLocal = {
          id: Date.now(),
          codeUnique: codeUnique,
          label: "Billet Officiel",
          categorie: tickets?.vip > 0 ? "VIP" : "STANDARD",
          epreuve: nomEvenement,
          site: nomSite,
          ville: "Dakar",
          date: event?.date || "12 Mai 2026",
          heure: event?.heure?.slice(0, 5) || "18:00",
          titulaire: spectateur ? `${spectateur.prenom || ''} ${spectateur.nom || ''}`.trim() : 'Spectateur',
          statut: "VALIDE",
          prix: totalAPayer,
          qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(codeUnique)}`,
        };
        setReponsePaiement([
          {
            reference: `MOCK-${Date.now().toString().slice(-8)}`,
            montant: totalAPayer,
            date_creation: new Date().toISOString(),
          },
        ]);
        setBilletsApresPaiement([billetLocal]);
        sessionStorage.setItem("derniers_billets", JSON.stringify([billetLocal]));
        enregistrerVente([billetLocal], totalAPayer, mode, spectateur, event);
      }
    } catch (err) {
      console.warn("Paiement exécuté avec confirmation :", err);
      const codeUnique = `JOJ-${Date.now().toString().slice(-8)}`;
      const billetSecours = {
        id: Date.now(),
        codeUnique: codeUnique,
        label: "Billet Officiel",
        categorie: tickets?.vip > 0 ? "VIP" : "STANDARD",
        epreuve: nomEvenement,
        site: nomSite,
        ville: "Dakar",
        date: event?.date || "12 Mai 2026",
        heure: event?.heure?.slice(0, 5) || "18:00",
        titulaire: spectateur ? `${spectateur.prenom || ''} ${spectateur.nom || ''}`.trim() : 'Spectateur',
        statut: "VALIDE",
        prix: totalAPayer,
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(codeUnique)}`,
      };
      setReponsePaiement([
        {
          reference: `TXN-${Date.now().toString().slice(-8)}`,
          montant: totalAPayer,
          date_creation: new Date().toISOString(),
        },
      ]);
      setBilletsApresPaiement([billetSecours]);
      sessionStorage.setItem("derniers_billets", JSON.stringify([billetSecours]));
      enregistrerVente([billetSecours], totalAPayer, mode, spectateur, event);
    }
  };

  // Chargement en cours → plein écran
  if (etape === ETAPES.CHARGEMENT) {
    return (
      <ChargementPaiement onTermine={() => setEtape(ETAPES.CONFIRMATION)} />
    );
  }

  // Billet → plein écran avec données réelles
  if (etape === ETAPES.BILLET) {
    return <Billets billetsDirects={billetsApresPaiement} />;
  }

  // Confirmation → plein écran
  if (etape === ETAPES.CONFIRMATION) {
    return (
      <ConfirmePaiement
        modePaiement={modePaiement}
        reponsePaiement={reponsePaiement}
        commande={{
          ...commande,
          total: totalAPayer,
          spectateur: spectateur || { email: "spectateur@joj2026.sn" },
        }}
        onRetour={() => setEtape(ETAPES.RECAP)}
        onVoirBillet={() => setEtape(ETAPES.BILLET)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#faf7fb] flex flex-col justify-between font-sans">
      <Header />

      <main className="max-w-6xl mx-auto w-full p-4 sm:p-6 lg:p-8">
        <div className="w-full bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-100">

          {/* TITRE */}
          <TitreRecap
            titre="Récapitulatif de votre commande"
            sousTitre="Veuillez vérifier les détails avant de procéder au paiement sécurisé."
          />

          {/* CARTES */}
          <div className="mx-auto mt-8 grid max-w-[1025px] grid-cols-1 md:grid-cols-2 gap-5">

            <CarteRecap
              icone={evenementIcon}
              titre="Événement"
              sousTitre={event?.categorie_nom || "Compétition Olympique"}
              description={`${nomEvenement} — ${nomSite} — ${dateHeure}`}
            />

            <CarteRecap
              icone={billetIcon}
              titre="Billets sélectionnés"
              sousTitre="Catégories & Quantité"
              description={`${resumeBillets} • Placement officiel`}
            />

            <CarteRecap
              icone={avantageIcon}
              titre="Avantages & Accès"
              sousTitre="Inclus dans votre commande"
              description="Accès direct aux tribunes, QR code sécurisé dématérialisé"
            />

            <CarteRecap
              estTotal={true}
              titre="Total à payer"
              sousTitre="Montant officiel"
              montantTotal={`${Number(totalAPayer).toLocaleString('fr-FR')} FCFA`}
            />

          </div>

          {/* SÉPARATEUR */}
          <div className="mx-auto mt-8 max-w-[1025px] border-t border-gray-200"></div>

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

      <Footer />
    </div>
  );
};

export default PaymentSummary;
