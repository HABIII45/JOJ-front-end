import { Link } from "react-router-dom";

function CarteSite({ site }) {
  // Helper pour traiter 'site.zones' s'il s'agit d'un objet, d'un tableau ou d'un texte
  const renderZones = () => {
    if (typeof site.zones === "string") {
      return site.zones;
    }
    if (Array.isArray(site.zones)) {
      return `Zones : ${site.zones.map((z) => z.nom || z.type_zone || z).join(" • ")}`;
    }
    if (typeof site.zones === "object" && site.zones !== null) {
      return `Zone : ${site.zones.nom || site.zones.type_zone || "Gradins • Loges • Presse"}`;
    }
    return "Zones : Gradins • Loges • Presse";
  };

  return (
    <article className="bg-white rounded-[28px] border border-gray-200/80 overflow-hidden shadow-xs flex flex-col">
      <img
        src={site.image}
        alt={site.nom}
        className="w-full h-48 object-cover"
      />
      <div className="p-5">
        <h3 className="font-bold text-base text-black">{site.nom}</h3>
        
        {/* ✅ CORRECT : On affiche une chaîne de caractères issue du rendu sécurisé */}
        <p className="text-[11px] font-bold text-[#D95D27] mt-1">
          {renderZones()}
        </p>
      </div>
    </article>
  );
}

export default function SitesSection({ sites = [] }) {
  return (
    <section className="bg-white py-16">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-extrabold text-black">Différents Sites</h2>
          <p className="mt-2 text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
            Choisissez le lieu et accédez aux zones spécifiques : gradins, loges et espaces presse.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sites.slice(0, 3).map((site) => (
            <CarteSite key={site.id || site.nom} site={site} />
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <Link
            to="/sites"
            className="border border-black text-black hover:bg-black hover:text-white rounded-full px-8 py-2.5 text-xs font-semibold transition-colors"
          >
            Voir plus
          </Link>
        </div>
      </div>
    </section>
  );
}