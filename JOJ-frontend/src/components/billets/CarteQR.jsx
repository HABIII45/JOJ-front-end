// src/components/billets/CarteQR.jsx
import React from 'react';

const CarteQR = ({ billet, onTelecharger, onAccueil }) => {
  const codeUnique = billet.codeUnique || billet.code_unique || `JOJ-${billet.id || "TICKET"}`;
  
  // URL de l'image QR Code récupérée depuis le backend ou générée à partir du code_unique
  const qrSource = billet.qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(codeUnique)}`;

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 flex flex-col items-center">

      {/* QR Code officiel pour ce billet */}
      <div className="bg-white p-4 mb-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center">
        <img
          src={qrSource}
          alt={`QR Code Billet ${codeUnique}`}
          className="w-48 h-48 object-contain"
        />
      </div>

      {/* Informations du billet */}
      <h3 className="text-xl font-bold text-gray-900 mb-1">Votre QR Code</h3>
      <p className="text-[#C45D1E] text-sm font-semibold mb-1">
        {billet.label || `Billet #${billet.id}`} — {billet.categorie}
      </p>
      <p className="text-gray-700 text-sm font-medium mb-1">{billet.epreuve}</p>
      <p className="text-gray-500 text-xs font-mono mb-2 text-center break-all max-w-[240px] bg-gray-50 px-3 py-1 rounded-lg border border-gray-200">
        {codeUnique}
      </p>
      <p className="text-gray-400 text-sm text-center mb-6 max-w-xs">
        Présentez ce code à la borne de contrôle dès votre arrivée.
      </p>

      {/* Badge statut */}
      <div className="flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2 mb-8">
        <span className={`w-2.5 h-2.5 rounded-full inline-block ${
          billet.statut === "VALIDE"  ? "bg-emerald-500"  :
          billet.statut === "UTILISE" ? "bg-gray-400"   :
          billet.statut === "EXPIRE"  ? "bg-red-400"    :
          billet.statut === "ANNULE"  ? "bg-red-600"    :
                                        "bg-yellow-400"
        }`} />
        <span className="text-gray-700 text-sm font-semibold">
          {billet.statut === "VALIDE"    ? "Code prêt • Scan à l'entrée"   :
           billet.statut === "UTILISE"   ? "Billet déjà utilisé"            :
           billet.statut === "EN_ATTENTE"? "En attente de paiement"         :
           billet.statut === "EXPIRE"    ? "Billet expiré"                  :
           billet.statut === "ANNULE"    ? "Billet annulé"                  :
                                           billet.statut}
        </span>
      </div>

      {/* Bouton télécharger ce billet */}
      <button
        type="button"
        onClick={onTelecharger}
        className="w-full bg-[#C45D1E] cursor-pointer hover:bg-[#A84D18] text-white font-semibold py-4 rounded-xl flex items-center justify-between px-6 transition-colors shadow-md mb-3"
      >
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Télécharger ce billet (PDF)
        </div>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Bouton retour accueil */}
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
