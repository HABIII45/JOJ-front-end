// src/components/billets/CarouselIndicateur.jsx

const CarouselIndicateur = ({ total, actif, onPrecedent, onSuivant }) => {
  if (total <= 1) return null;

  return (
    <div className="flex items-center justify-between mb-6">
      {/* Compteur */}
      <span className="text-sm font-medium text-gray-500">
        {actif + 1} / {total}
      </span>

      {/* Flèches */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPrecedent}
          disabled={actif === 0}
          aria-label="Billet précédent"
          className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center
                     hover:bg-orange-50 hover:border-[#C45D1E] transition-colors
                     disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          type="button"
          onClick={onSuivant}
          disabled={actif === total - 1}
          aria-label="Billet suivant"
          className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center
                     hover:bg-orange-50 hover:border-[#C45D1E] transition-colors
                     disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CarouselIndicateur;
