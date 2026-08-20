import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Trophy,
  ShieldAlert,
  Accessibility,
  Pencil,
} from "lucide-react";
import AdminLayout from "../../components/layouts/AdminLayout";
import api, { getImageUrl, ENDPOINTS } from "../../api/api";

export default function DisciplineDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [discipline, setDiscipline] = useState(null);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    async function chargerDetails() {
      setChargement(true);
      try {
        const baseUrl = ENDPOINTS.disciplines.liste.replace(/\/$/, "");
        const { data } = await api.get(`${baseUrl}/${id}/`);
        setDiscipline(data);
      } catch (err) {
        console.error("Erreur lors de la récupération de la discipline:", err);
        setDiscipline(null);
      } finally {
        setChargement(false);
      }
    }
    chargerDetails();
  }, [id]);

  if (chargement) {
    return (
      <AdminLayout>
        <div className="py-20 text-center text-gray-400">
          <div className="w-8 h-8 border-3 border-[#C25B1E] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Chargement de la fiche de la discipline...
        </div>
      </AdminLayout>
    );
  }

  if (!discipline) {
    return (
      <AdminLayout>
        <div className="py-20 text-center text-gray-500">
          <p className="text-base font-bold text-gray-700">Discipline introuvable.</p>
          <button
            onClick={() => navigate("/admin/disciplines")}
            className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold"
          >
            Retour aux disciplines
          </button>
        </div>
      </AdminLayout>
    );
  }

  const imageUrl = getImageUrl ? getImageUrl(discipline.image) : discipline.image;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Navigation & Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/admin/disciplines")}
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} /> Retour à la liste
          </button>

          <button
            onClick={() => navigate(`/admin/disciplines/${discipline.id}/modifier`)}
            className="inline-flex items-center gap-2 bg-[#D96B27] hover:bg-[#c25b1e] text-white rounded-xl px-4 py-2.5 text-xs font-bold transition-colors shadow-sm cursor-pointer"
          >
            <Pencil size={14} /> Modifier cette discipline
          </button>
        </div>

        {/* Bannière Hero de la Discipline */}
        <div className="relative h-64 md:h-80 rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm bg-gray-900">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={discipline.nom}
              className="w-full h-full object-cover opacity-80"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gradient-to-br from-gray-800 to-gray-950">
              <Trophy size={64} className="text-gray-600" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-8 text-white">
            <span className="bg-orange-500/90 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full self-start mb-3">
              Discipline Olympique • Dakar 2026
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              {discipline.nom}
            </h1>
          </div>
        </div>

        {/* Grille des Caractéristiques (Règles & Accessibilité) */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Règles de l'événement */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#D96B27] flex items-center justify-center shrink-0">
              <ShieldAlert size={22} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Règles de l'événement
              </p>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed">
                {discipline.regle || "—"}
              </p>
            </div>
          </div>

          {/* Accessibilité */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Accessibility size={22} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Accessibilité
              </p>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed">
                {discipline.accessibilite || "—"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}