
import React from "react";
import { Plus, Pencil, FileText, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

const CONFIG_PAR_TYPE = {
  creation: { icone: Plus, fond: "bg-[#E3F8EC]", ic: "text-[#10B981]" },
  modification: { icone: Pencil, fond: "bg-[#E4EDFD]", ic: "text-[#3B6FE0]" },
  publication: { icone: FileText, fond: "bg-[#FDEBD6]", ic: "text-[#D98A2B]" },
  suppression: { icone: Trash2, fond: "bg-[#FDE7E3]", ic: "text-[#EF4444]" },
};

export function ActivitesCard({ activites = [] }) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm fade-up flex flex-col justify-between">
      <div>
        <h3 className="font-display text-lg font-bold text-gray-900 mb-6">
          Activités Récentes
        </h3>
        <div className="space-y-5">
          {activites.map((act) => {
            const conf = CONFIG_PAR_TYPE[act.type] ?? CONFIG_PAR_TYPE.publication;
            const Icon = conf.icone;
            return (
              <div key={act.id} className="flex items-start gap-4">
                <span className={`w-10 h-10 rounded-full ${conf.fond} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-4 h-4 ${conf.ic}`} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-gray-900 leading-snug">
                    {act.titre}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">
                    {act.detail}
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mt-1">
                    {act.ilYA}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="border-t border-gray-100 mt-6 pt-4 text-center">
        <Link 
          to="#historique" 
          className="text-xs font-bold text-[#C25B1E] hover:text-[#A04816] transition-colors inline-block"
        >
          Voir tout l'historique
        </Link>
      </div>
    </div>
  );
}