import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSpecificSite } from '../../services/sites';
import { getImageUrl } from '../../api/api';
import Maps from '../../components/maps';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { MapPin, Users, Clock, Building2 } from 'lucide-react';

export default function DetailSite() {
  const { id } = useParams();
  const [site, setSite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchSiteData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const data = await getSpecificSite(id);
        if (isMounted) {
          setSite(data);
        }
      } catch (err) {
        if (isMounted) {
          setError("Impossible de charger les détails du site.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchSiteData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
        <Header />
        <div className="py-32 text-center text-gray-500">
          <div className="animate-spin rounded-full h-10 w-10 border-3 border-[#C25B1E] border-t-transparent mx-auto mb-4"></div>
          <p className="text-sm font-semibold">Chargement des informations du site...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !site) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
        <Header />
        <div className="py-32 text-center text-gray-700">
          <Building2 size={48} className="text-gray-400 mx-auto mb-3" />
          <p className="text-lg font-bold">{error || "Aucun site trouvé."}</p>
          <Link to="/sites" className="mt-4 inline-block px-5 py-2.5 bg-black text-white rounded-xl text-xs font-bold">
            Retourner aux sites
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const urlImage = getImageUrl(site.image);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col justify-between">
      <div>
        <Header />

        {/* Hero Banner */}
        <section className="relative h-80 w-full overflow-hidden bg-black text-white">
          {urlImage ? (
            <img
              src={urlImage}
              alt={site.nom}
              className="absolute inset-0 h-full w-full object-cover opacity-50"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-black opacity-80" />
          )}
          <div className="relative max-w-7xl mx-auto h-full px-6 flex flex-col justify-end pb-8">
            <div className="flex items-center space-x-2 text-xs text-gray-300 uppercase tracking-wider mb-2 font-semibold">
              <Link to="/" className="hover:underline text-orange-300">Accueil</Link>
              <span>&gt;</span>
              <Link to="/sites" className="hover:underline text-orange-300">Sites</Link>
              <span>&gt;</span>
              <span className="text-white">{site.nom}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">
              {site.nom}
            </h1>
            <p className="text-sm text-orange-200">
              Découvrez le cœur battant des compétitions à {site.ville || "Dakar"}.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-10">
              <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-4">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">{site.nom}</h2>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {site.description || site.service || "Site olympique officiel préparé pour accueillir les Jeux Olympiques de la Jeunesse Dakar 2026."}
                </p>
              </section>
            </div>

            {/* Aside Information */}
            <aside>
              <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-6 sticky top-24">
                <h3 className="font-extrabold text-lg text-gray-900 border-b border-gray-100 pb-3">Informations Site</h3>

                <div className="space-y-4">
                  {/* Adresse */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#C25B1E] flex items-center justify-center shrink-0">
                      <MapPin size={16} />
                    </div>
                    <div className="text-xs">
                      <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider">ADRESSE</span>
                      <span className="font-bold text-gray-800 text-sm">{site.ville || site.region || "Dakar, Sénégal"}</span>
                    </div>
                  </div>

                  {/* Capacité */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <Users size={16} />
                    </div>
                    <div className="text-xs">
                      <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider">CAPACITÉ</span>
                      <span className="font-bold text-gray-800 text-sm">{(Number(site.capacite) || 0).toLocaleString("fr-FR")} places assises</span>
                    </div>
                  </div>

                  {/* Horaires */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <Clock size={16} />
                    </div>
                    <div className="text-xs">
                      <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider">HORAIRES D'OUVERTURE</span>
                      <span className="font-bold text-gray-800 text-sm">{site.horaires || "08:00 — 23:00"}</span>
                    </div>
                  </div>
                </div>

                {/* Map */}
                {(site.latitude && site.longitude) && (
                  <div className="w-full h-36 bg-gray-100 rounded-2xl overflow-hidden relative border border-gray-200">
                    <Maps latitude={site.latitude} longitude={site.longitude} />
                  </div>
                )}
              </div>
            </aside>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}