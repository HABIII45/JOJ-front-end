import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../api/api';
import { Building2, MapPin } from 'lucide-react';

const SiteCard = ({ id, image, nom, region, ville, boutonDetail = "Voir plus de détails" }) => {
  const navigate = useNavigate();
  const urlImage = getImageUrl(image);

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col justify-between">
      <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
        {urlImage ? (
          <img
            src={urlImage}
            alt={nom}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              e.currentTarget.nextSibling.style.display = "flex";
            }}
          />
        ) : null}
        <div
          className={`w-full h-full ${urlImage ? "hidden" : "flex"} items-center justify-center bg-gradient-to-br from-orange-100 via-orange-50 to-gray-100 text-[#C25B1E]`}
        >
          <Building2 size={48} className="opacity-80" />
        </div>
        {ville && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-gray-800 shadow-sm flex items-center gap-1">
            <MapPin size={12} className="text-[#C25B1E]" />
            {ville}
          </div>
        )}
      </div>
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-extrabold text-xl text-gray-900 mb-1">{nom}</h3>
          <p className="text-sm text-[#C25B1E] font-semibold mb-4 flex items-center gap-1">
            {region || ville || "Sénégal"}
          </p>
        </div>
        <button
          className="w-full border-2 border-black rounded-xl py-2.5 px-4 text-sm hover:bg-black hover:text-white transition-colors duration-300 font-bold cursor-pointer"
          onClick={() => navigate(`/sites/${id}`)}
        >
          {boutonDetail}
        </button>
      </div>
    </div>
  );
};

export default SiteCard;