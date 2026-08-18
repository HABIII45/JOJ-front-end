import React from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function VentesChart({ data = [] }) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
        <div>
          <h3 className="font-display text-lg font-bold text-gray-900">Évolution des ventes</h3>
          <p className="text-xs text-gray-400 mt-0.5">Données mensuelles (Millions FCFA)</p>
        </div>
        <span className="bg-gray-100 text-xs font-semibold text-gray-700 rounded-lg px-3 py-1.5">
          Année 2026
        </span>
      </div>
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gradientVentes" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C25B1E" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#C25B1E" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis
              dataKey="mois"
              tick={{ fontSize: 11, fill: "#94A3B8" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#94A3B8" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}M`}
              domain={[0, 8]}
              ticks={[0, 2, 4, 6, 8]}
            />
            <Tooltip
              formatter={(value) => [`${Number(value).toFixed(1)} M FCFA`, "Ventes"]}
              contentStyle={{ borderRadius: 12, border: "1px solid #E2E8F0", fontSize: 12 }}
            />
            <Area
              type="monotone"
              dataKey="millionsFcfa"
              stroke="#C25B1E"
              strokeWidth={3}
              fill="url(#gradientVentes)"
              dot={{ r: 3.5, fill: "#C25B1E", stroke: "#FFFFFF", strokeWidth: 1.5 }}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}