import React from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

function GraphiqueVentes({ donnees, donneesVentes, data = [], totalCA = 0 }) {
  const chartData = donnees || donneesVentes || data || [];

  return (
    <section className="mt-6 w-full rounded-3xl border border-gray-100 bg-white p-6 md:p-8 shadow-sm">
      {/* En-tête */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            Évolution des ventes de billets
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Données réelles des réservations (FCFA)
          </p>
        </div>
        <div className="flex items-center gap-2">
          {totalCA > 0 && (
            <span className="bg-orange-50 text-[#C25B1E] border border-orange-200 text-xs font-bold rounded-lg px-3 py-1.5">
              Total : {Number(totalCA).toLocaleString("fr-FR")} FCFA
            </span>
          )}
          <span className="bg-gray-100 text-xs font-semibold text-gray-700 rounded-lg px-3 py-1.5">
            Année 2026
          </span>
        </div>
      </div>

      {/* Zone graphique */}
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 15, left: 10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="gradientBillet" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C25B1E" stopOpacity={0.28} />
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
              tickFormatter={(v) =>
                v >= 1000000
                  ? `${(v / 1000000).toFixed(1)}M`
                  : v >= 1000
                  ? `${(v / 1000).toFixed(0)}k`
                  : `${v}`
              }
            />
            <Tooltip
              formatter={(value) => [`${Number(value).toLocaleString("fr-FR")} FCFA`, "Ventes"]}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #E2E8F0",
                fontSize: 12,
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
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
      </div>
    </section>
  );
}

export default GraphiqueVentes;
