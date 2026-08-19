import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSpecificSite } from '../../services/sites';
import Maps from '../../components/maps';

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

  if (loading) return <div className="p-8 text-center text-gray-500">Chargement...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!site) return <div className="p-8 text-center text-gray-500">Aucun site trouvé.</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <section className="relative h-80 w-full overflow-hidden bg-black text-white">
        <img src={site.image} alt={site.nom} className="absolute inset-0 h-full w-full object-cover opacity-50"/>
        <div className="relative max-w-7xl mx-auto h-full px-6 flex flex-col justify-end pb-8">
          <div className="flex items-center space-x-2 text-xs text-gray-300 uppercase tracking-wider mb-2">
            <Link to="/" className="hover:underline">Accueil</Link>
            <span>&gt;</span>
            <Link to="/sites" className="hover:underline">Sites</Link>
            <span>&gt;</span>
            <span className="text-white font-semibold">{site.nom}</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">
            JOJ EVENT — Détail du site
          </h1>
          <p className="text-sm text-orange-200">
            Découvrez le cœur battant des compétitions à Dakar.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-12">
            <section className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold mb-3">{site.nom}</h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {site.description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 bg-white rounded-xl border border-gray-100 shadow-sm space-y-2">
                  <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs">
                    i
                  </div>
                  <h3 className="font-bold text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-info-icon lucide-info"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                    À propos
                  </h3>
                  <p className="text-xs text-gray-500 leading-normal">
                    Complexe sportif polyvalent de dernière génération, optimisé pour les retransmissions internationales et le confort des athlètes.
                  </p>
                </div>

                <div className="p-5 bg-white rounded-xl border border-gray-100 shadow-sm space-y-2">
                  <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs">
                    ★
                  </div>
                  <h3 className="font-bold text-sm">Sports pratiqués</h3>
                  {/* <div className="flex flex-wrap gap-1.5 pt-1">
                    {(site.sports).map((sport) => (
                      <span key={sport} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-[10px] font-semibold rounded">
                        {sport}
                      </span>
                    ))}
                  </div> */}
                </div>

                <div className="p-5 bg-white rounded-xl border border-gray-100 shadow-sm space-y-2">
                  <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="orange" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-ticket-minus-icon lucide-ticket-minus"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M9 12h6"/></svg>
                  </div>
                  <h3 className="font-bold text-sm">
                    Zones & Accès
                  </h3>
                  <p className="text-xs text-gray-500 leading-normal">
                    Accès différenciés selon le type de billet (Standard, VIP, Presse).
                  </p>
                </div>

                <div className="p-5 bg-white rounded-xl border border-gray-100 shadow-sm space-y-2">
                  <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="orange" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar-check-icon lucide-calendar-check -orange-600"><path d="M8 2v3"/><path d="M16 2v3"/><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="m9 15 2 2 4-4"/></svg>
                  </div>
                  <h3 className="font-bold text-sm">Calendrier Local</h3>
                  <p className="text-xs text-gray-500 leading-normal">
                    Planification dynamique des compétitions majeures accueillies sur ce site spécifique.
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold">Zones de Spectateurs</h2>
                <p className="text-xs text-gray-500">Choisissez votre expérience pour les JOJ 2026</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-6 bg-white hover:bg-black rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center space-y-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center font-bold">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="gray" stroke="none" strokeWidth="2" stroke-Linecap="round" strokeLinejoin="round" className="lucide lucide-users-icon lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><path d="M16 3.128a4 4 0 0 1 0 7.744"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="7" r="4"/></svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">Standard</h3>
                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">ACCÈS : GRADINS</p>
                  </div>
                  <p className="text-xs font-bold text-orange-600">5 000 — 10 000 FCFA</p>
                </div>

                <div className="p-6 bg-white hover:bg-black text-white rounded-xl shadow-md flex flex-col items-center text-center space-y-3 relative overflow-hidden">
                  <div className="w-10 h-10 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="orange" stroke="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-crown-icon lucide-crown"><path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"/><path d="M5 21h14"/></svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">VIP</h3>
                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">ACCÈS : TRIBUNE VIP</p>
                  </div>
                  <p className="text-xs font-bold text-orange-400">15 000 — 30 000 FCFA</p>
                </div>

                <div className="p-6 bg-white hover:bg-black rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center space-y-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center font-bold">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="gray" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-camera-icon lucide-camera"><path d="M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z"/><circle cx="12" cy="13" r="3"/></svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">Presse</h3>
                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">ACCÈS : ACCRÉDITATION</p>
                  </div>
                  <p className="text-xs font-bold text-orange-600">0 — 5 000 FCFA</p>
                </div>
              </div>
            </section>
          </div>

          <aside>
            <div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm space-y-6 sticky top-6">
              <h3 className="font-bold text-base">Informations Site</h3>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <span className="text-orange-500 text-sm"></span>
                  <div className="text-xs">
                    <span className="block text-[10px] text-gray-400 font-semibold uppercase"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="orange" stroke="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-map-pin-icon lucide-map-pin"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>ADRESSE</span>
                    <span className="font-medium text-gray-800 gray">{site.ville}</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <span className="text-orange-500 text-sm">                    
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="orange" stroke="none" strokeWidth="2" stroke-Linecap="round" strokeLinejoin="round" className="lucide lucide-users-icon lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><path d="M16 3.128a4 4 0 0 1 0 7.744"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="7" r="4"/></svg>
                  </span>
                  <div className="text-xs">
                    <span className="block text-[10px] text-gray-400 font-semibold uppercase">CAPACITÉ</span>
                    <span className="font-medium text-gray-800">{site.capacite} places assises</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <span className="text-orange-500 text-sm"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="orange" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clock-icon lucide-clock"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg></span>
                  <div className="text-xs">
                    <span className="block text-[10px] text-gray-400 font-semibold uppercase">HORAIRES D'OUVERTURE</span>
                    <span className="font-medium text-gray-800">{site.horaires || "08:00 — 23:00"}</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <span className="text-orange-500 text-sm"></span>
                  <div className="text-xs">
                    <span className="block text-[10px] text-gray-400 font-semibold uppercase">TRANSPORT</span>
                    <span className="font-medium text-gray-800"></span>
                  </div>
                </div>
              </div>

              <div className="w-full h-32 bg-gray-200 rounded-lg overflow-hidden relative flex items-center justify-center">
                <span className="text-2xl text-orange-500 z-10"></span>
                <div className="absolute inset-0 bg-gray-300 opacity-60">
                <Maps latitude={site.latitude} longitude={site.longitude}></Maps>
                </div>
              </div>

              <button className="w-full py-2.5 border border-gray-900 rounded-lg text-xs font-semibold hover:bg-black hover:text-white transition-colors">
                Itinéraire
              </button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}