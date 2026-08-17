// src/components/billets/CarteQR.jsx
import React, { useState } from 'react';
import CarouselIndicateur from './CarouselIndicateur';

// Billets mockés pour simuler plusieurs billets
const BILLETS = [
  { id: 1, label: 'Billet #1 — VIP' },
  { id: 2, label: 'Billet #2 — VIP' },
  { id: 3, label: 'Billet #3 — Tribunes' },
];

const CarteQR = ({ onTelecharger, onAccueil }) => {
  const [billetActif, setBilletActif] = useState(0);

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 flex flex-col items-center">

      {/* Carousel indicateur — visible seulement si plusieurs billets */}
      <CarouselIndicateur
        total={BILLETS.length}
        actif={billetActif}
        onChange={setBilletActif}
      />

      {/* QR Code SVG */}
      <div className="bg-white p-4 mb-6">
        <svg viewBox="0 0 200 200" className="w-48 h-48">
          <rect x="0" y="0" width="200" height="200" fill="white"/>
          {/* Patterns de détection */}
          <rect x="10" y="10" width="50" height="50" fill="black"/>
          <rect x="15" y="15" width="40" height="40" fill="white"/>
          <rect x="20" y="20" width="30" height="30" fill="black"/>
          <rect x="140" y="10" width="50" height="50" fill="black"/>
          <rect x="145" y="15" width="40" height="40" fill="white"/>
          <rect x="150" y="20" width="30" height="30" fill="black"/>
          <rect x="10" y="140" width="50" height="50" fill="black"/>
          <rect x="15" y="145" width="40" height="40" fill="white"/>
          <rect x="20" y="150" width="30" height="30" fill="black"/>
          {/* Modules de données */}
          <rect x="70" y="10" width="10" height="10" fill="black"/>
          <rect x="90" y="10" width="10" height="10" fill="black"/>
          <rect x="110" y="10" width="10" height="10" fill="black"/>
          <rect x="70" y="30" width="10" height="10" fill="black"/>
          <rect x="100" y="30" width="10" height="10" fill="black"/>
          <rect x="120" y="30" width="10" height="10" fill="black"/>
          <rect x="80" y="50" width="10" height="10" fill="black"/>
          <rect x="110" y="50" width="10" height="10" fill="black"/>
          <rect x="10" y="70" width="10" height="10" fill="black"/>
          <rect x="30" y="70" width="10" height="10" fill="black"/>
          <rect x="50" y="70" width="10" height="10" fill="black"/>
          <rect x="10" y="90" width="10" height="10" fill="black"/>
          <rect x="40" y="90" width="10" height="10" fill="black"/>
          <rect x="10" y="110" width="10" height="10" fill="black"/>
          <rect x="30" y="110" width="10" height="10" fill="black"/>
          <rect x="50" y="110" width="10" height="10" fill="black"/>
          <rect x="70" y="70" width="10" height="10" fill="black"/>
          <rect x="90" y="70" width="10" height="10" fill="black"/>
          <rect x="110" y="70" width="10" height="10" fill="black"/>
          <rect x="130" y="70" width="10" height="10" fill="black"/>
          <rect x="80" y="80" width="10" height="10" fill="black"/>
          <rect x="100" y="80" width="10" height="10" fill="black"/>
          <rect x="120" y="80" width="10" height="10" fill="black"/>
          <rect x="70" y="90" width="10" height="10" fill="black"/>
          <rect x="100" y="90" width="10" height="10" fill="black"/>
          <rect x="140" y="90" width="10" height="10" fill="black"/>
          <rect x="80" y="100" width="10" height="10" fill="black"/>
          <rect x="110" y="100" width="10" height="10" fill="black"/>
          <rect x="130" y="100" width="10" height="10" fill="black"/>
          <rect x="70" y="110" width="10" height="10" fill="black"/>
          <rect x="90" y="110" width="10" height="10" fill="black"/>
          <rect x="120" y="110" width="10" height="10" fill="black"/>
          <rect x="140" y="70" width="10" height="10" fill="black"/>
          <rect x="160" y="70" width="10" height="10" fill="black"/>
          <rect x="180" y="70" width="10" height="10" fill="black"/>
          <rect x="150" y="80" width="10" height="10" fill="black"/>
          <rect x="170" y="80" width="10" height="10" fill="black"/>
          <rect x="140" y="90" width="10" height="10" fill="black"/>
          <rect x="160" y="90" width="10" height="10" fill="black"/>
          <rect x="180" y="90" width="10" height="10" fill="black"/>
          <rect x="150" y="100" width="10" height="10" fill="black"/>
          <rect x="170" y="100" width="10" height="10" fill="black"/>
          <rect x="140" y="110" width="10" height="10" fill="black"/>
          <rect x="160" y="110" width="10" height="10" fill="black"/>
          <rect x="180" y="110" width="10" height="10" fill="black"/>
          <rect x="70" y="130" width="10" height="10" fill="black"/>
          <rect x="90" y="130" width="10" height="10" fill="black"/>
          <rect x="110" y="130" width="10" height="10" fill="black"/>
          <rect x="130" y="130" width="10" height="10" fill="black"/>
          <rect x="80" y="140" width="10" height="10" fill="black"/>
          <rect x="100" y="140" width="10" height="10" fill="black"/>
          <rect x="120" y="140" width="10" height="10" fill="black"/>
          <rect x="70" y="150" width="10" height="10" fill="black"/>
          <rect x="100" y="150" width="10" height="10" fill="black"/>
          <rect x="140" y="150" width="10" height="10" fill="black"/>
          <rect x="80" y="160" width="10" height="10" fill="black"/>
          <rect x="110" y="160" width="10" height="10" fill="black"/>
          <rect x="130" y="160" width="10" height="10" fill="black"/>
          <rect x="70" y="170" width="10" height="10" fill="black"/>
          <rect x="90" y="170" width="10" height="10" fill="black"/>
          <rect x="120" y="170" width="10" height="10" fill="black"/>
          <rect x="140" y="130" width="10" height="10" fill="black"/>
          <rect x="160" y="130" width="10" height="10" fill="black"/>
          <rect x="180" y="130" width="10" height="10" fill="black"/>
          <rect x="150" y="140" width="10" height="10" fill="black"/>
          <rect x="170" y="140" width="10" height="10" fill="black"/>
          <rect x="140" y="150" width="10" height="10" fill="black"/>
          <rect x="160" y="150" width="10" height="10" fill="black"/>
          <rect x="180" y="150" width="10" height="10" fill="black"/>
          <rect x="150" y="160" width="10" height="10" fill="black"/>
          <rect x="170" y="160" width="10" height="10" fill="black"/>
          <rect x="140" y="170" width="10" height="10" fill="black"/>
          <rect x="160" y="170" width="10" height="10" fill="black"/>
          <rect x="180" y="170" width="10" height="10" fill="black"/>
          <rect x="10" y="130" width="10" height="10" fill="black"/>
          <rect x="30" y="130" width="10" height="10" fill="black"/>
          <rect x="50" y="130" width="10" height="10" fill="black"/>
          <rect x="10" y="150" width="10" height="10" fill="black"/>
          <rect x="40" y="150" width="10" height="10" fill="black"/>
          <rect x="10" y="170" width="10" height="10" fill="black"/>
          <rect x="30" y="170" width="10" height="10" fill="black"/>
          <rect x="50" y="170" width="10" height="10" fill="black"/>
        </svg>
      </div>

      {/* Titre QR */}
      <h3 className="text-xl font-bold text-gray-900 mb-1">Votre QR Code</h3>
      <p className="text-[#C45D1E] text-sm font-semibold mb-2">{BILLETS[billetActif].label}</p>
      <p className="text-gray-400 text-sm text-center mb-6 max-w-xs">
        Présentez ce code à la borne de contrôle dès votre arrivée.
      </p>

      {/* Badge statut */}
      <div className="flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2 mb-8">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2"/>
        </svg>
        <span className="text-gray-600 text-sm font-medium">Code prêt • Scan à l'entrée</span>
      </div>

      {/* Bouton télécharger */}
      <button
        type="button"
        onClick={onTelecharger}
        className="w-full bg-[#C45D1E] cursor-pointer hover:bg-[#A84D18] text-white font-semibold py-4 rounded-xl flex items-center justify-between px-6 transition-colors shadow-md mb-3"
      >
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Télécharger le billet (PDF)
        </div>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Bouton accueil */}
      <button
        type="button"
        onClick={onAccueil}
        className="w-full bg-white cursor-pointer border-2 border-gray-900 text-gray-900 font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
        Retour à l'accueil
      </button>

    </div>
  );
};

export default CarteQR;
