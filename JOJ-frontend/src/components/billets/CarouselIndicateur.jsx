// src/components/billets/CarouselIndicateur.jsx
import React from 'react';

const CarouselIndicateur = ({ total, actif, onChange }) => {
  // N'affiche rien s'il n'y a qu'un seul billet
  if (total <= 1) return null;

  return (
    <div className="flex gap-2 mb-6">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          aria-label={`Billet ${i + 1}`}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            i === actif
              ? 'w-8 bg-[#C45D1E]'
              : 'w-8 bg-gray-200'
          }`}
        />
      ))}
    </div>
  );
};

export default CarouselIndicateur;
