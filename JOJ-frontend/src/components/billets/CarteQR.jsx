// src/components/billets/CarteQR.jsx
import React from 'react';
import { Download, ArrowLeft, CheckCircle2 } from 'lucide-react';

const CarteQR = ({ billet, onTelecharger, onAccueil, telechargementEnCours = false }) => {
  const codeUnique = billet.codeUnique || billet.code_unique || `JOJ-${billet.id || "TICKET"}`;
  
  // URL de l'image QR Code récupérée depuis le backend ou générée à partir du code_unique
  const qrSource = billet.qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(codeUnique)}`;

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 flex flex-col items-center border border-gray-100">

      {/* QR Code officiel pour ce billet */}
      <div className="bg-white p-4 mb-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center">
        <img
          src={qrSource}
          alt={`QR Code Billet ${codeUnique}`}
          className="w-48 h-48 object-contain"
        />
      </div>

      {/* Informations du billet */}
      <h3 className="text-xl font-extrabold text-gray-900 mb-1">Votre QR Code</h3>
      <p className="text-[#C45D1E] text-sm font-bold mb-1">
        {billet.label || `Billet #${billet.id}`} — {billet.categorie}
      </p>
      <p className="text-gray-700 text-sm font-semibold mb-1">{billet.epreuve}</p>
      <p className="text-gray-500 text-xs font-mono mb-2 text-center break-all max-w-[240px] bg-gray-50 px-3 py-1 rounded-lg border border-gray-200">
        {codeUnique}
      </p>
      <p className="text-gray-400 text-xs text-center mb-6 max-w-xs font-medium">
        Présentez ce code à la borne de contrôle dès votre arrivée.
      </p>

      {/* Badge statut */}
      <div className="flex items-center gap-2 border border-emerald-100 bg-emerald-50/50 rounded-full px-4 py-2 mb-8">
        <span className="w-2.5 h-2.5 rounded-full inline-block bg-emerald-500" />
        <span className="text-emerald-800 text-xs font-bold">
          {billet.statut === "VALIDE" ? "Code prêt • Scan à l'entrée" : (billet.statut || "Validé")}
        </span>
      </div>

      {/* Bouton télécharger ce billet spécifique sous forme d'image */}
      <button
        type="button"
        disabled={telechargementEnCours}
        onClick={onTelecharger}
        className="w-full bg-[#C45D1E] cursor-pointer hover:bg-[#A84D18] disabled:opacity-60 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 px-6 transition-all shadow-md active:scale-98 mb-3"
      >
        <Download size={18} />
        {telechargementEnCours ? "Génération de l'image..." : "Télécharger ce billet (Image)"}
      </button>

      {/* Bouton retour accueil */}
      <button
        type="button"
        onClick={onAccueil}
        className="w-full bg-white cursor-pointer border-2 border-gray-900 text-gray-900 font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
      >
        <ArrowLeft size={16} />
        Retour à l'accueil
      </button>

    </div>
  );
};

export default CarteQR;
