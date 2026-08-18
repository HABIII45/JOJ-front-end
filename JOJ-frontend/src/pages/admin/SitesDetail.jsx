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
  AlertTriangle,
  Clock,
} from "lucide-react";
import AdminLayout from "../../components/layouts/AdminLayout";
import apiClient, { isBackendConnected } from "../../lib/api";

const DEMO_SITES_DETAILS = {
  1: {
    id: 1,
    nom: "Dakar Arena",
    ville: "Diamniadio",
    adresse: "Autoroute à Péage, Sortie 10",
    capacite: 15000,
    description: "Complexe sportif multifonctionnel de dernière génération, conçu pour accueillir les compétitions de basketball, handball et sports de combat.",
    statut: "OPERATIONNEL",
    responsable: "Amadou Diallo",
    contact: "+221 33 800 00 00",
    image: "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=800&q=80",
    evenements: [
      { id: 101, nom: "Tournoi de Basketball 3x3", date: "12 Octobre 2026", participants: 16 },
      { id: 102, nom: "Championnat de Handball", date: "15 Octobre 2026", participants: 8 },
    ],
  },
  2: {
    id: 2,
    nom: "Stade Abdoulaye Wade",
    ville: "Diamniadio",
    adresse: "Zone Pôle Urbain Diamniadio",
    capacite: 50000,
    description: "Stade olympique moderne principal recevant les grands tournois de football et d'athlétisme.",
    statut: "OPERATIONNEL",
    responsable: "Fatou Sow",
    contact: "+221 33 811 11 11",
    image: "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800&q=80",
    evenements: [
      { id: 103, nom: "Finale d'Athlétisme 100m", date: "18 Octobre 2026", participants: 24 },
    ],
  },
};

export default function SiteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [site, setSite] = useState(null);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    async function chargerDetails() {
      setChargement(true);
      try {
        const estConnecte = typeof isBackendConnected === "function" ? isBackendConnected() : false;

        if (!estConnecte) {
          setSite(DEMO_SITES_DETAILS[id] || DEMO_SITES_DETAILS[1]);
          return;
        }

        const res = await apiClient.get(`/api/sites/${id}/`);
        setSite(res.data);
      } catch (err) {
        console.warn("Erreur API, bascule sur la démo", err);
        setSite(DEMO_SITES_DETAILS[id] || DEMO_SITES_DETAILS[1]);
      } finally {
        setChargement(false);
      }
    }
    chargerDetails();
  }, [id]);

  if (chargement) {
    return (
      <AdminLayout>
        <div className="p-8 text-center text-gray-400">Chargement de la fiche du site...</div>
      </AdminLayout>
    );
  }

  if (!site) {
    return (
      <AdminLayout>
        <div className="p-8 text-center text-gray-500">Site non trouvé.</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Navigation & Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/sites")}
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} /> Retour à la liste
          </button>

          <button
            onClick={() => navigate(`/admin/sites/${site.id}/modifier`)}
            className="inline-flex items-center gap-2 bg-black hover:bg-gray-800 text-white rounded-2xl px-5 py-2.5 text-xs font-bold transition-colors cursor-pointer"
          >
            <Pencil size={14} /> Modifier le site
          </button>
        </div>

        {/* En-tête du site avec image de couverture */}
        <div className="relative rounded-[2.5rem] overflow-hidden bg-gray-900 text-white h-64 md:h-80">
          <img
            src={site.image}
            alt={site.nom}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-8 flex flex-col justify-end">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-[#D96B27] text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full">
                {site.ville}
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full">
                <CheckCircle2 size={12} className="text-emerald-400" />
                {site.statut || "OPÉRATIONNEL"}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{site.nom}</h1>
            <p className="text-gray-300 text-xs md:text-sm mt-1 max-w-2xl">{site.description}</p>
          </div>
        </div>

        {/* Grille d'informations */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Métriques clés */}
          <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">Spécifications</h3>
            
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <Users size={20} />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase">Capacité d'accueil</p>
                <p className="text-lg font-extrabold text-gray-900">{(site.capacite || 0).toLocaleString("fr-FR")} places</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                <MapPin size={20} />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase">Adresse exacte</p>
                <p className="text-xs font-bold text-gray-800">{site.adresse || "Non renseignée"}</p>
              </div>
            </div>
          </div>

          {/* Contact / Gestionnaire */}
          <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">Gestion & Contact</h3>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase">Responsable du site</p>
              <p className="text-sm font-extrabold text-gray-900">{site.responsable || "Non assigné"}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase">Ligne directe / Urgence</p>
              <p className="text-sm font-bold text-gray-700">{site.contact || "—"}</p>
            </div>
          </div>

          {/* Programme d'événements affichés */}
          <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">Événements liés</h3>
            <div className="space-y-3">
              {(site.evenements || []).length > 0 ? (
                site.evenements.map((ev) => (
                  <div key={ev.id} className="p-3 bg-gray-50 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-gray-800">{ev.nom}</p>
                      <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                        <Calendar size={10} /> {ev.date}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold bg-white px-2 py-1 rounded-md border border-gray-100 text-gray-600">
                      {ev.participants} équipes
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-400">Aucune compétition programmée.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}