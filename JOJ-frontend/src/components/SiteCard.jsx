import {useNavigate} from 'react-router-dom';


const SiteCard = ({ id, image, nom, region, ville, boutonDetail = "Voir plus détail" }) =>  {
    const navigate = useNavigate();

return (<div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100">
    <div className="relative">
      <img src={image} alt={nom} className="w-full h-48 object-cover" />
      {ville && (
        <div className="absolute top-2 left-2 bg-white px-2 py-1 rounded text-xs font-semibold">
          {ville}
        </div>
      )}
    </div>
    <div className="p-4">
      <h3 className="font-bold text-lg mb-2">{nom}</h3>
      <p className="text-sm text-orange-600 mb-4 font-bold">Adresse : {region}</p>
      <button className="w-full border border-black rounded-full py-2 px-4 hover:bg-black hover:text-white transition-colors duration-300 font-bold" onClick={() => navigate(`/sites/${id}`)}>
        {boutonDetail} 
      </button>
    </div>
  </div>
)
};


export default SiteCard;