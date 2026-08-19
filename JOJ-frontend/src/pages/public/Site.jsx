import { useState, useEffect } from "react";
import SiteCard from "../../components/SiteCard";
import { getSites } from "../../services/sites";
import Pagination from "../../components/Pagination";


const Sites = () => {
  const [sites, setSites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 2;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await getSites(currentPage); 
        setSites(response.results);
        setTotalItems(response.count);
      } catch (err) {
        console.error("Erreur lors du chargement des sites :", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="relative text-white w-full">
        <div className="w-full">
          <img src="public/image hero site.svg" alt="Stade olympique" className="w-full h-auto rounded-lg shadow-xl"/>
        </div>

        <div className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 flex items-center z-10">
          <div className="grid md:grid-cols-2 gap-8 items-center w-full">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Les Sites <span className="text-orange-500">Olympiques</span>
              </h1>
              <p className="text-lg mb-6">Dakar - Diamniadio - Saly</p>
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-semibold transition-colors duration-300">
                Explorer tous les sites
              </button>
            </div>
            <div className="hidden md:block">
              <img src="public/site au dessus.svg" alt="Centre International de Conférence Abdou DIOUF" className="rounded-lg shadow-xl"/>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Sites</h2>
          <div className="w-16 h-1 bg-orange-500 rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Sélectionnez un site pour obtenir la localisation et les informations clés.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sites.map((site) => (
            <SiteCard key={site.id} id={site.id} nom={site.nom} region={site.region} ville={site.ville} image={site.image}/>          
          ))}
        </div>

        <Pagination currentPage={currentPage} totalItems={totalItems} itemsPerPage={itemsPerPage} onPageChange={(page) => setCurrentPage(page)}/>
      </div>
    </div>
  );
};

export default Sites;