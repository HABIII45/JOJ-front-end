import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AdminLayout from "../../components/layouts/AdminLayout";
import FormEventIndividuel from "./EventsIndividuel";
import FormEventCollectif from "./EventsCollectif";
import "./Events.css";

export function FormEvent() {
  const [typeEvenement, setTypeEvenement] = useState("individuel");
  const navigate = useNavigate();

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <button
          type="button"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={15} /> Retour aux événements
        </button>

        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Créer un nouvel événement
          </h2>
          <p className="text-xs text-gray-400 mt-1 mb-6">
            Configurez les détails, le site, la date et les participants de l'épreuve.
          </p>

          {/* SÉLECTEUR TYPE D'ÉVÉNEMENT */}
          <div className="inline-flex p-1 rounded-2xl bg-gray-100 mb-8">
            <button
              type="button"
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                typeEvenement === "individuel"
                  ? "bg-[#C25B1E] text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setTypeEvenement("individuel")}
            >
              Épreuve Individuelle
            </button>

            <button
              type="button"
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                typeEvenement === "collectif"
                  ? "bg-[#C25B1E] text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setTypeEvenement("collectif")}
            >
              Épreuve Collective
            </button>
          </div>

          {/* FORMULAIRE INDIVIDUEL OU COLLECTIF */}
          {typeEvenement === "individuel" ? (
            <FormEventIndividuel />
          ) : (
            <FormEventCollectif />
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default FormEvent;