import React from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

function GraphiqueVentes({ donneesVentes = [] }) {
  const aDesVentes = Array.isArray(donneesVentes) && donneesVentes.some((d) => (Number(d.montant) || 0) > 0);

  return (
    <section className="mt-6 w-full rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
      {/* En-tête */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            Évolution des ventes journalières / mensuelles
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Volume réel de billets et chiffre d'affaires enregistré en base
          </p>
        </div>
        <span className="bg-gray-100 text-xs font-semibold text-gray-700 rounded-lg px-3 py-1.5">
          Année 2026
        </span>
      </div>

      {/* Zone graphique */}
      <div className="h-[280px] w-full">
        {!aDesVentes ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 text-xs border border-dashed border-gray-200 rounded-2xl p-6">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-2 text-gray-300">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
            <p className="font-semibold text-gray-600 text-sm">0 FCFA de ventes enregistrées</p>
            <p className="text-[11px] text-gray-400 mt-1">
              Les courbes de vente s'adapteront automatiquement dès les premières réservations en base de données.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={donneesVentes} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="gradientBillet" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C25B1E" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#C25B1E" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "#94A3B8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#94A3B8" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => (v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`)}
              />
              <Tooltip
                formatter={(value) => [`${Number(value).toLocaleString("fr-FR")} FCFA`, "Ventes"]}
                contentStyle={{ borderRadius: 12, border: "1px solid #E2E8F0", fontSize: 12 }}
              />
              <Area
                type="monotone"
                dataKey="montant"
                stroke="#C25B1E"
                strokeWidth={3}
                fill="url(#gradientBillet)"
                dot={{ r: 3.5, fill: "#C25B1E", stroke: "#FFFFFF", strokeWidth: 1.5 }}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}

export default GraphiqueVentes;
