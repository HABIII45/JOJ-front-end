// src/components/billets/index.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import EnteteBillet from './EnteteBillet';
import CarteBillet from './CarteBillet';
import CarteQR from './CarteQR';

const Billets = () => {
  const navigate = useNavigate();

  const handleTelecharger = () => {
    console.log('Téléchargement du billet PDF');
  };

  const handleTelechargerTous = () => {
    console.log('Téléchargement de tous les billets PDF');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans antialiased">
      <div className="max-w-6xl mx-auto">

        <EnteteBillet />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Colonne gauche */}
          <CarteBillet onTelechargerTous={handleTelechargerTous} />

          {/* Colonne droite */}
          <div className="flex flex-col gap-4">
            <CarteQR
              onTelecharger={handleTelecharger}
              onAccueil={() => navigate('/')}
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Billets;
