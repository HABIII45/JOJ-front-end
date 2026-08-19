import React from "react";
import { Ticket, Wallet, ShoppingCart, TrendingUp } from "lucide-react";

function CartesKPI({ totalVendus = 0, chiffreAffaires = 0, panierMoyen = 0, tauxRemplissage = 0 }) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
      {/* Carte 1 — Total Billets Vendus */}
      <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="w-10 h-10 rounded-2xl bg-orange-50 text-[#C25B1E] flex items-center justify-center">
            <Ticket size={18} />
          </div>
          <span className="text-xs font-semibold text-emerald-600">
            {totalVendus > 0 ? "En direct" : "0"}
          </span>
        </div>
        <p className="mt-3 text-xs font-medium text-gray-500">Total Billets Vendus</p>
        <p className="mt-1 text-2xl font-extrabold text-gray-900">
          {totalVendus.toLocaleString("fr-FR")}
        </p>
      </div>

      {/* Carte 2 — Chiffre d'Affaires */}
      <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Wallet size={18} />
          </div>
          <span className="text-xs font-semibold text-emerald-600">
            {chiffreAffaires > 0 ? "FCFA" : "0 FCFA"}
          </span>
        </div>
        <p className="mt-3 text-xs font-medium text-gray-500">Chiffre d'Affaires Total</p>
        <p className="mt-1 text-2xl font-extrabold text-gray-900">
          {chiffreAffaires.toLocaleString("fr-FR")}{" "}
          <span className="text-sm font-medium text-gray-400">FCFA</span>
        </p>
      </div>

      {/* Carte 3 — Panier Moyen */}
      <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <ShoppingCart size={18} />
          </div>
          <span className="text-xs font-semibold text-gray-400">Moyenne</span>
        </div>
        <p className="mt-3 text-xs font-medium text-gray-500">Panier Moyen</p>
        <p className="mt-1 text-2xl font-extrabold text-gray-900">
          {panierMoyen.toLocaleString("fr-FR")}{" "}
          <span className="text-sm font-medium text-gray-400">FCFA</span>
        </p>
      </div>

      {/* Carte 4 — Taux de Remplissage */}
      <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <TrendingUp size={18} />
          </div>
          <span className="text-xs font-bold text-[#C25B1E]">{tauxRemplissage}%</span>
        </div>
        <p className="mt-3 text-xs font-medium text-gray-500">Taux de Remplissage Estimé</p>
        <div className="mt-3 h-2 rounded-full bg-gray-100 overflow-hidden">
          <div
            className="h-full bg-[#C25B1E] rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, Math.max(0, tauxRemplissage))}%` }}
          />
        </div>
      </div>
    </section>
  );
}

export default CartesKPI;
