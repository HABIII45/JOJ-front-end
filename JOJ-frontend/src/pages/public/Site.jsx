import { useState, useEffect, useMemo } from "react";
import SiteCard from "../../components/SiteCard";
import { getAllSites } from "../../services/sites";
import Pagination from "../../components/Pagination";
import { Header } from "../../components/layout/Header";
import { Footer } from "../../components/layout/Footer";
import ContainerImg from "../../assets/images/Container.jpg";
import { MapPin, Building2, Search } from "lucide-react";

const Sites = () => {
  const [sites, setSites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [recherche, setRecherche] = useState("");
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const all = await getAllSites();
        setSites(all);
      } catch (err) {
        console.error("Erreur lors du chargement des sites :", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const sitesFiltres = useMemo(() => {
    if (!recherche.trim()) return sites;
    const q = recherche.toLowerCase().trim();
    return sites.filter((s) => {
      const nom = (s.nom || "").toLowerCase();
      const ville = (s.ville || "").toLowerCase();
      const region = (s.region || "").toLowerCase();
      return nom.includes(q) || ville.includes(q) || region.includes(q);
    });
  }, [sites, recherche]);

  const totalItems = sitesFiltres.length;
  const nbPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const pageCourante = Math.min(currentPage, nbPages);
  const debut = (pageCourante - 1) * itemsPerPage;
  const sitesAffiches = sitesFiltres.slice(debut, debut + itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <div>
        {/* Header public JOJ */}
        <Header />

        {/* Hero Section */}
        <section
          className="relative w-full min-h-[22rem] sm:min-h-[26rem] flex items-center justify-center text-white"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url(${ContainerImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-16 text-center">
            <h1 className="font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight">
              Les Sites <span className="text-[#ff6500]">Olympiques</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-white/90">
              Découvrez les {sites.length} infrastructures sportives officielles à Dakar, Diamniadio et Saly pour les JOJ 2026.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Infrastructures & Stades ({totalItems})
            </h2>
            <div className="w-16 h-1.5 bg-[#C25B1E] rounded-full mx-auto mt-3 mb-4"></div>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
              Sélectionnez un site pour obtenir la localisation détaillée, la capacité et les épreuves programmées.
            </p>

            {/* Barre de recherche */}
            <div className="mt-8 max-w-md mx-auto relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={recherche}
                onChange={(e) => {
                  setRecherche(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Rechercher par nom, ville ou région..."
                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:border-[#C25B1E] outline-none shadow-sm transition-all"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="py-20 text-center text-gray-500">
              <div className="animate-spin rounded-full h-10 w-10 border-3 border-[#C25B1E] border-t-transparent mx-auto mb-4"></div>
              <p className="text-sm font-semibold">Chargement de tous les sites...</p>
            </div>
          ) : sitesFiltres.length === 0 ? (
            <div className="py-16 text-center text-gray-400 border border-dashed border-gray-200 rounded-3xl bg-white">
              <Building2 size={40} className="text-gray-300 mx-auto mb-2" />
              <p className="text-base font-bold text-gray-700">Aucun site trouvé</p>
              <p className="text-xs text-gray-400 mt-1">Modifiez vos mots-clés de recherche.</p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {sitesAffiches.map((site) => (
                  <SiteCard
                    key={site.id}
                    id={site.id}
                    nom={site.nom}
                    region={site.region}
                    ville={site.ville}
                    image={site.image}
                  />
                ))}
              </div>

              {totalItems > itemsPerPage && (
                <div className="mt-12">
                  <Pagination
                    currentPage={pageCourante}
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    onPageChange={(page) => setCurrentPage(page)}
                  />
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Footer public JOJ */}
      <Footer />
    </div>
  );
};

export default Sites;