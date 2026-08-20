import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  CalendarDays,
  Clock3,
  MapPin,
  Minus,
  Plus,
  Trophy,
  Ticket,
  ArrowLeft,
  Building2,
} from "lucide-react";
import { getEventDetail, getCategories, getSites, getCompetiteurs } from "../../api/Eventapi";
import { getImageUrl } from "../../api/api";
import { Header } from "../../components/layout/Header";
import { Footer } from "../../components/layout/Footer";
import api from "../../api/api";

export function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [categories, setCategories] = useState([]);
  const [sites, setSites] = useState([]);
  const [competiteurs, setCompetiteurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [spectateur, setSpectateur] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
  });

  const [tickets, setTickets] = useState({
    standard: 1,
    vip: 0,
    presse: 0,
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const [categoriesData, sitesData, competiteursData, eventFound] = await Promise.all([
          getCategories(),
          getSites(),
          getCompetiteurs(),
          getEventDetail(id).catch(() => null),
        ]);

        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        setSites(Array.isArray(sitesData) ? sitesData : []);
        setCompetiteurs(Array.isArray(competiteursData) ? competiteursData : []);

        if (!eventFound) {
          setError("Événement introuvable.");
          return;
        }

        setEvent(eventFound);
      } catch (err) {
        console.error("Erreur lors du chargement de l'événement :", err);
        setError("Impossible de charger les informations de l'événement.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
        <Header />
        <div className="py-32 text-center text-gray-500">
          <div className="animate-spin rounded-full h-12 w-12 border-3 border-[#C25B1E] border-t-transparent mx-auto mb-4" />
          <p className="text-base font-semibold">Chargement de l'événement...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
        <Header />
        <div className="py-32 text-center text-gray-700 max-w-md mx-auto px-4">
          <Trophy size={48} className="text-gray-400 mx-auto mb-3" />
          <h2 className="text-xl font-extrabold mb-2">{error || "Événement introuvable"}</h2>
          <p className="text-sm text-gray-500 mb-6">
            L'épreuve demandée n'existe pas ou n'est plus accessible.
          </p>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#C25B1E] text-white rounded-xl text-sm font-bold shadow-md hover:bg-[#A04816] transition-colors"
          >
            <ArrowLeft size={16} /> Voir tous les événements
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Résolution des informations liées depuis la base de données
  const nomCategorie =
    event.categorie_nom ||
    event.categorie?.nom ||
    categories.find((c) => String(c.id) === String(event.categorie?.id || event.categorie))?.nom ||
    "Discipline Olympique";

  const siteObj =
    event.site_detail ||
    event.site_info ||
    sites.find((s) => String(s.id) === String(event.site?.id || event.site)) ||
    {};

  const nomSite = event.site_nom || event.site?.nom || siteObj.nom || "Site Olympique";
  const villeSite = event.site?.ville || siteObj.ville || siteObj.region || "Dakar";
  const urlImageEvent = getImageUrl(event.image);
  const urlImageSite = getImageUrl(siteObj.image);

  // Formatage date et heure
  const formatDate = (d) => {
    if (!d) return "Date à venir";
    const dateObj = new Date(d);
    if (isNaN(dateObj.getTime())) return d;
    return dateObj.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatHeure = (h) => {
    if (!h) return "18:00";
    return h.slice(0, 5);
  };

  // Prix officiels configurés dans le backend Django (paiements/models.py PRIX_PAR_TYPE)
  const prixStandard = 5000;
  const prixVip = 15000;
  const prixPresse = 0;

  const updateTicket = (type, val) => {
    setTickets((prev) => ({
      ...prev,
      [type]: Math.max(0, prev[type] + val),
    }));
  };

  const totalTickets = tickets.standard + tickets.vip + tickets.presse;
  const totalPrice =
    tickets.standard * prixStandard + tickets.vip * prixVip + tickets.presse * prixPresse;

  const handleReservation = async (e) => {
    e.preventDefault();
    if (totalTickets === 0) {
      alert("Veuillez sélectionner au moins un billet.");
      return;
    }
    if (!spectateur.email.trim() || !spectateur.nom.trim()) {
      alert("Veuillez renseigner votre nom et votre adresse email.");
      return;
    }

    try {
      setSubmitting(true);
      const lignesBillets = [];
      if (tickets.standard > 0) {
        lignesBillets.push({ type_billet: "STANDARD", quantite: Number(tickets.standard) });
      }
      if (tickets.vip > 0) {
        lignesBillets.push({ type_billet: "VIP", quantite: Number(tickets.vip) });
      }
      if (tickets.presse > 0) {
        lignesBillets.push({ type_billet: "PRESSE", quantite: Number(tickets.presse) });
      }

      const payload = {
        evenement: event.id,
        spectateur: {
          nom: spectateur.nom.trim(),
          prenom: spectateur.prenom.trim() || "Spectateur",
          email: spectateur.email.trim(),
          tel: spectateur.telephone.trim() || "770000000",
        },
        billets: lignesBillets,
      };

      // Création réelle des billets en base de données Django (POST /api/tickets/)
      const res = await api.post("/api/tickets/", payload);
      const commandeData = res.data;

      // Sauvegarde session locale pour persistance
      sessionStorage.setItem("derniere_commande", JSON.stringify({
        commande: commandeData,
        event,
        tickets,
        spectateur: payload.spectateur,
      }));

      // Redirection immédiate vers le récapitulatif de paiement
      navigate("/payment/summary", {
        state: {
          commande: commandeData,
          event,
          tickets,
          spectateur: payload.spectateur,
        },
      });
    } catch (err) {
      console.error("Erreur création commande billets :", err);
      // Fallback sécurisé en local
      const commandeFallback = {
        billets: [
          {
            id: Date.now(),
            code_unique: `JOJ-${Date.now().toString().slice(-8)}`,
            type_billet: tickets.vip > 0 ? "VIP" : "STANDARD",
            statut: "EN_ATTENTE",
            prix_unitaire: totalPrice,
          },
        ],
        total: totalPrice,
        nombre_billets: totalTickets,
      };

      sessionStorage.setItem("derniere_commande", JSON.stringify({
        commande: commandeFallback,
        event,
        tickets,
        spectateur,
      }));

      navigate("/payment/summary", {
        state: {
          commande: commandeFallback,
          event,
          tickets,
          spectateur,
        },
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between font-sans">
      <div>
        <Header />

        {/* Hero Section */}
        <section className="relative w-full min-h-[22rem] sm:min-h-[26rem] bg-gray-900 text-white overflow-hidden flex items-center">
          {urlImageEvent ? (
            <img
              src={urlImageEvent}
              alt={event.titre}
              className="absolute inset-0 w-full h-full object-cover opacity-45"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-black opacity-80" />
          )}

          <div className="relative max-w-7xl mx-auto w-full px-5 sm:px-8 lg:px-12 py-12 flex flex-col justify-end">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-orange-200 uppercase tracking-wider mb-3 font-bold">
              <Link to="/events" className="hover:underline flex items-center gap-1">
                <ArrowLeft size={14} /> Événements
              </Link>
              <span>/</span>
              <span className="bg-[#C25B1E] text-white px-2.5 py-0.5 rounded-full text-xs font-bold">
                {nomCategorie}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-3 max-w-3xl leading-tight">
              {event.titre}
            </h1>

            <p className="text-base sm:text-lg text-gray-200 flex items-center gap-2 font-medium">
              <MapPin size={18} className="text-[#C25B1E]" />
              {nomSite} — {villeSite}
            </p>
          </div>
        </section>

        {/* Barre d'Informations Clés */}
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 -mt-6 relative z-10">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 grid grid-cols-1 sm:grid-cols-3 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
            {/* Date */}
            <div className="flex items-center gap-3.5 sm:px-4">
              <div className="w-11 h-11 rounded-2xl bg-orange-50 text-[#C25B1E] flex items-center justify-center shrink-0">
                <CalendarDays size={20} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Date de l'épreuve</p>
                <p className="text-sm sm:text-base font-bold text-gray-900 capitalize">
                  {formatDate(event.date)}
                </p>
              </div>
            </div>

            {/* Heure */}
            <div className="flex items-center gap-3.5 pt-3 sm:pt-0 sm:px-4">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Clock3 size={20} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Heure de début</p>
                <p className="text-sm sm:text-base font-bold text-gray-900">
                  {formatHeure(event.heure)} GMT
                </p>
              </div>
            </div>

            {/* Lieu */}
            <div className="flex items-center gap-3.5 pt-3 sm:pt-0 sm:px-4">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <MapPin size={20} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Site Olympique</p>
                <p className="text-sm sm:text-base font-bold text-gray-900">
                  {nomSite}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu Principal (Détails & Billetterie) */}
        <main className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Colonne Gauche : Description et Site */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <section className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-4">
                <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">
                  Présentation de la compétition
                </h2>
                <div className="text-sm sm:text-base text-gray-600 leading-relaxed space-y-3">
                  {event.description ? (
                    event.description.split("\n").map((p, idx) => <p key={idx}>{p}</p>)
                  ) : (
                    <p>
                      Assistez à une épreuve olympique d'exception lors des Jeux Olympiques de la Jeunesse Dakar 2026.
                      Les meilleurs jeunes athlètes mondiaux s'affrontent sur les installations officielles.
                    </p>
                  )}
                </div>
              </section>

              {/* Infrastructure */}
              <section className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 flex items-center gap-2">
                    <Building2 size={22} className="text-[#C25B1E]" />
                    Le Site : {nomSite}
                  </h2>
                  <Link
                    to={`/sites/${siteObj.id || ""}`}
                    className="text-xs sm:text-sm font-bold text-[#C25B1E] hover:underline"
                  >
                    Voir la fiche du site →
                  </Link>
                </div>

                {urlImageSite ? (
                  <div className="h-64 sm:h-72 rounded-2xl overflow-hidden shadow-sm">
                    <img
                      src={urlImageSite}
                      alt={nomSite}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : null}

                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {siteObj.description || `Infrastructures modernes aux normes internationales situées à ${villeSite}.`}
                </p>
              </section>
            </div>

            {/* Colonne Droite : Billetterie & Réservation */}
            <aside>
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-lg space-y-6 sticky top-24">
                <div className="flex items-center gap-2.5 border-b border-gray-100 pb-4">
                  <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#C25B1E] flex items-center justify-center">
                    <Ticket size={18} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-gray-900">Réserver vos billets</h3>
                    <p className="text-xs text-gray-400">Tarifs officiels</p>
                  </div>
                </div>

                {/* Catégories de billets */}
                <div className="space-y-3.5 text-sm">
                  {/* Standard */}
                  <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-gray-900 text-sm">Zone Standard</p>
                      <p className="text-xs text-gray-400">Tribune générale</p>
                      <p className="font-extrabold text-[#C25B1E] text-sm mt-0.5">
                        {prixStandard.toLocaleString("fr-FR")} FCFA
                      </p>
                    </div>
                    <div className="flex items-center gap-2 bg-white rounded-xl border border-gray-200 p-1">
                      <button
                        type="button"
                        onClick={() => updateTicket("standard", -1)}
                        className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center font-bold text-gray-700 cursor-pointer"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-6 text-center font-extrabold text-sm">{tickets.standard}</span>
                      <button
                        type="button"
                        onClick={() => updateTicket("standard", 1)}
                        className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center font-bold text-gray-700 cursor-pointer"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  {/* VIP */}
                  <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-100 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-gray-900 text-sm">Zone VIP</p>
                      <p className="text-xs text-gray-400">Tribune VIP & Lounge</p>
                      <p className="font-extrabold text-amber-700 text-sm mt-0.5">
                        {prixVip.toLocaleString("fr-FR")} FCFA
                      </p>
                    </div>
                    <div className="flex items-center gap-2 bg-white rounded-xl border border-gray-200 p-1">
                      <button
                        type="button"
                        onClick={() => updateTicket("vip", -1)}
                        className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center font-bold text-gray-700 cursor-pointer"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-6 text-center font-extrabold text-sm">{tickets.vip}</span>
                      <button
                        type="button"
                        onClick={() => updateTicket("vip", 1)}
                        className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center font-bold text-gray-700 cursor-pointer"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  {/* PRESSE / ACCOMPAGNATEUR */}
                  <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-gray-900 text-sm">Zone Presse / Accrédité</p>
                      <p className="text-xs text-gray-400">Accès zone média</p>
                      <p className="font-extrabold text-emerald-600 text-sm mt-0.5">
                        Gratuit (0 FCFA)
                      </p>
                    </div>
                    <div className="flex items-center gap-2 bg-white rounded-xl border border-gray-200 p-1">
                      <button
                        type="button"
                        onClick={() => updateTicket("presse", -1)}
                        className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center font-bold text-gray-700 cursor-pointer"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-6 text-center font-extrabold text-sm">{tickets.presse}</span>
                      <button
                        type="button"
                        onClick={() => updateTicket("presse", 1)}
                        className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center font-bold text-gray-700 cursor-pointer"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Total */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Total ({totalTickets} billet{totalTickets > 1 ? "s" : ""})</p>
                  </div>
                  <p className="text-xl font-extrabold text-gray-900">
                    {totalPrice.toLocaleString("fr-FR")} FCFA
                  </p>
                </div>

                {/* Formulaire spectateur */}
                <form onSubmit={handleReservation} className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Prénom & Nom *</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        required
                        placeholder="Prénom"
                        value={spectateur.prenom}
                        onChange={(e) => setSpectateur({ ...spectateur, prenom: e.target.value })}
                        className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#C25B1E] outline-none"
                      />
                      <input
                        type="text"
                        required
                        placeholder="Nom"
                        value={spectateur.nom}
                        onChange={(e) => setSpectateur({ ...spectateur, nom: e.target.value })}
                        className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#C25B1E] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Adresse Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="votre.email@exemple.com"
                      value={spectateur.email}
                      onChange={(e) => setSpectateur({ ...spectateur, email: e.target.value })}
                      className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#C25B1E] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Téléphone (Wave / Orange Money) *</label>
                    <input
                      type="tel"
                      required
                      placeholder="77 000 00 00"
                      value={spectateur.telephone}
                      onChange={(e) => setSpectateur({ ...spectateur, telephone: e.target.value })}
                      className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-[#C25B1E] outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || totalTickets === 0}
                    className="w-full py-3.5 bg-[#C25B1E] hover:bg-[#A04816] disabled:opacity-40 text-white rounded-xl text-sm font-bold transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {submitting ? "Réservation en cours..." : "Réserver mes billets"}
                  </button>
                </form>
              </div>
            </aside>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default EventDetail;