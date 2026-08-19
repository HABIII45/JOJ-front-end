// src/components/billets/CarteQR.jsx
// Affiche le QR code réel généré par Django (image PNG depuis /media/qr_codes/).
// Si le backend n'a pas encore généré le QR, affiche un QR SVG de substitution.

// ── QR SVG de substitution (affiché si qrCodeUrl est null) ──────────────────
const POSITIONS_BASE = [
  [70,10],[90,10],[110,10],[130,10],
  [70,30],[100,30],[120,30],
  [80,50],[110,50],[130,50],
  [70,70],[90,70],[110,70],[130,70],
  [80,80],[100,80],[120,80],
  [70,90],[100,90],
  [80,100],[110,100],[130,100],
  [70,110],[90,110],[120,110],
  [140,70],[160,70],[180,70],
  [150,80],[170,80],
  [140,90],[160,90],[180,90],
  [150,100],[170,100],
  [140,110],[160,110],[180,110],
  [70,130],[90,130],[110,130],[130,130],
  [80,140],[100,140],[120,140],
  [70,150],[100,150],[140,150],
  [80,160],[110,160],[130,160],
  [70,170],[90,170],[120,170],
  [140,130],[160,130],[180,130],
  [150,140],[170,140],
  [140,150],[160,150],[180,150],
  [150,160],[170,160],
  [140,170],[160,170],[180,170],
];

function genererModulesSVG(id) {
  // Seed déterministe basé sur l'id du billet
  const seed = String(id).split("").map(Number);
  return POSITIONS_BASE.filter((_, i) => seed[i % seed.length] !== 0);
}

function QRCodeSVG({ billet }) {
  const modules = genererModulesSVG(billet.id ?? 1);
  return (
    <svg viewBox="0 0 200 200" className="w-48 h-48">
      <rect x="0" y="0" width="200" height="200" fill="white" />
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
      {modules.map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="10" height="10" fill="black" />
      ))}
    </svg>
  );
}

// ── Composant principal ──────────────────────────────────────────────────────
const CarteQR = ({ billet, onTelecharger, onAccueil }) => {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 flex flex-col items-center">

      {/* QR Code : image réelle du backend ou SVG de substitution */}
      <div className="bg-white p-4 mb-6">
        {billet.qrCodeUrl ? (
          <img
            src={billet.qrCodeUrl}
            alt={`QR Code — ${billet.codeUnique}`}
            className="w-48 h-48 object-contain"
          />
        ) : (
          <QRCodeSVG billet={billet} />
        )}
      </div>

      {/* Informations du billet */}
      <h3 className="text-xl font-bold text-gray-900 mb-1">Votre QR Code</h3>
      <p className="text-[#C45D1E] text-sm font-semibold mb-1">
        {billet.label} — {billet.categorie}
      </p>
      <p className="text-gray-700 text-sm font-medium mb-1">{billet.epreuve}</p>
      <p className="text-gray-400 text-xs font-mono mb-2 text-center break-all max-w-[220px]">
        {billet.codeUnique || billet.id}
      </p>
      <p className="text-gray-400 text-sm text-center mb-6 max-w-xs">
        Présentez ce code à la borne de contrôle dès votre arrivée.
      </p>

      {/* Badge statut */}
      <div className="flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2 mb-8">
        <span className={`w-2 h-2 rounded-full inline-block ${
          billet.statut === "VALIDE"  ? "bg-green-400"  :
          billet.statut === "UTILISE" ? "bg-gray-400"   :
          billet.statut === "EXPIRE"  ? "bg-red-400"    :
          billet.statut === "ANNULE"  ? "bg-red-600"    :
                                        "bg-yellow-400"
        }`} />
        <span className="text-gray-600 text-sm font-medium">
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
