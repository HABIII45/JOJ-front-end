import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Users,
  Trophy,
  Pencil,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import AdminLayout from "../../components/layouts/AdminLayout";
import api from "../../api/api";

export default function SiteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [site, setSite] = useState(null);
  const [evenementsSite, setEvenementsSite] = useState([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    async function chargerDetails() {
      setChargement(true);
      try {
        const [resSite, resEvents] = await Promise.allSettled([
          api.get(`/api/sites/${id}/`),
          api.get(`/api/events/?site=${id}`),
        ]);

        if (resSite.status === "fulfilled") {
          setSite(resSite.value.data);
        } else {
          setSite(null);
        }

        if (resEvents.status === "fulfilled") {
          const evData = resEvents.value.data;
          setEvenementsSite(Array.isArray(evData) ? evData : evData.results ?? []);
        }
      } catch (err) {
        console.error("Erreur lors de la récupération du site:", err);
        setSite(null);
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
          Chargement de la fiche du site...
        </div>
      </AdminLayout>
    );
  }

  if (!site) {
    return (
      <AdminLayout>
        <div className="py-20 text-center text-gray-500">
          <p className="text-base font-bold text-gray-700">Site olympique introuvable.</p>
          <button
            onClick={() => navigate("/admin/sites")}
            className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold"
          >
            Retour aux sites
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Navigation & Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/admin/sites")}
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} /> Retour à la liste
          </button>

          <button
            onClick={() => navigate(`/sites/${site.id}/modifier`)}
            className="inline-flex items-center gap-2 bg-[#D96B27] hover:bg-[#c25b1e] text-white rounded-xl px-4 py-2.5 text-xs font-bold transition-colors shadow-sm cursor-pointer"
          >
            <Pencil size={14} /> Modifier ce site
          </button>
        </div>

        {/* Bannière Hero du Site */}
        <div className="relative h-64 md:h-80 rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm bg-gray-900">
          {site.image ? (
            <img
              src={site.image}
              alt={site.nom}
              className="w-full h-full object-cover opacity-80"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <Building2 size={64} className="text-gray-600" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-8 text-white">
            <span className="bg-emerald-500/90 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full self-start mb-3">
              Site Olympique Officiel
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              {site.nom}
            </h1>
            <p className="text-xs md:text-sm text-gray-200 mt-1 flex items-center gap-2">
              <MapPin size={14} className="text-[#D96B27]" />
              {site.ville || site.region || "Sénégal"}
            </p>
          </div>
        </div>

        {/* Grille Informations & Caractéristiques */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Capacité Totale */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Users size={22} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Capacité</p>
              <p className="font-display text-xl font-extrabold text-gray-900 mt-0.5">
                {(Number(site.capacite) || 0).toLocaleString("fr-FR")} places
              </p>
            </div>
          </div>

          {/* Ville / Région */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <MapPin size={22} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Localisation</p>
              <p className="font-display text-xl font-extrabold text-gray-900 mt-0.5">
                {site.ville || site.region || "Dakar"}
              </p>
            </div>
          </div>

          {/* Compétitions programmées */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Trophy size={22} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Compétitions</p>
              <p className="font-display text-xl font-extrabold text-gray-900 mt-0.5">
                {evenementsSite.length} épreuve{evenementsSite.length > 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>

        {/* Description & Détails */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-3">À propos de cette infrastructure</h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            {site.description || site.service || "Aucune description détaillée n'a été renseignée pour ce site."}
          </p>

          {/* Événements programmés sur ce site */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar size={16} className="text-[#D96B27]" />
              Événements programmés sur ce site ({evenementsSite.length})
            </h3>

            {evenementsSite.length === 0 ? (
              <p className="text-xs text-gray-400">Aucun événement n'est actuellement programmé sur ce site.</p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3">
                {evenementsSite.map((ev) => (
                  <div key={ev.id} className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-xs text-gray-900">{ev.titre}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{ev.date || "Date à venir"}</p>
                    </div>
                    <CheckCircle2 size={16} className="text-emerald-500" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}