import { useState, useEffect } from "react";
import { fetchResultats } from "../../api/resultats";

function CartesStatResultat() {
  const [stats,      setStats]      = useState(null);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    const charger = async () => {
      setChargement(true);
      try {
        const tous = await fetchResultats();

        // Le modèle Resultat n'a pas de champ statut en base —
        // on calcule depuis les données disponibles
        const total = tous.length;

        // Dernière création : tri par id décroissant
        const dernier = tous.length > 0
          ? tous.reduce((a, b) => (b.id > a.id ? b : a), tous[0])
          : null;

        const derniereMaj = dernier
          ? new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
          : "—";

        // Événements distincts ayant au moins un résultat
        const evenementsAvecResultats = new Set(tous.map((r) => r.evenement)).size;

        setStats({
          totalResultats:          total,
          evenementsAvecResultats,
          derniereMaj,
        });
      } catch {
        setStats({ totalResultats: "—", evenementsAvecResultats: "—", derniereMaj: "—" });
      } finally {
        setChargement(false);
      }
    };
    charger();
  }, []);

  const val = (v) => (chargement ? "…" : v);

  return (
    <section className="grid grid-cols-3 gap-[16px] mt-[23px]">

      {/* Carte 1 — Total Résultats */}
      <div className="h-[130px] bg-white border border-[#e2e5e8] rounded-[19px] px-[22px] pt-[20px]">
        <div className="flex items-start justify-between">
          <div className="w-[34px] h-[34px] rounded-[9px] bg-[#fee2e2] flex items-center justify-center">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2">
              <path d="M8 21h8" />
              <path d="M12 17v4" />
              <path d="M7 4h10v5a5 5 0 0 1-10 0V4Z" />
              <path d="M7 7H4a3 3 0 0 0 3 3" />
              <path d="M17 7h3a3 3 0 0 1-3 3" />
            </svg>
          </div>
        </div>
        <p className="mt-[12px] text-[13px] text-[#68717e]">Total Résultats</p>
        <p className="mt-[3px] text-xl font-semibold text-[#15171a]">
          {val(stats?.totalResultats)}
        </p>
      </div>

      {/* Carte 2 — Épreuves avec résultats */}
      <div className="h-[130px] bg-white border border-[#e2e5e8] rounded-[19px] px-[22px] pt-[20px]">
        <div className="flex items-start justify-between">
          <div className="w-[34px] h-[34px] rounded-[9px] bg-[#fff0dd] flex items-center justify-center">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="M7 9h10" />
              <path d="M7 13h5" />
            </svg>
          </div>
        </div>
        <p className="mt-[12px] text-[13px] text-[#68717e]">Épreuves avec résultats</p>
        <p className="mt-[3px] text-xl font-semibold text-[#15171a]">
          {val(stats?.evenementsAvecResultats)}
        </p>
      </div>

      {/* Carte 3 — Dernière mise à jour */}
      <div className="h-[130px] bg-white border border-[#e2e5e8] rounded-[19px] px-[22px] pt-[20px]">
        <div className="flex items-start justify-between">
          <div className="w-[34px] h-[34px] rounded-[9px] bg-[#edf4ff] flex items-center justify-center">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="#0868bd">
              <path d="M12 21s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12Z" />
              <circle cx="12" cy="9" r="2.2" fill="white" />
            </svg>
          </div>
          <span className="text-[13px] text-[#9299a4] mt-[5px]">Aujourd'hui</span>
        </div>
        <p className="mt-[12px] text-[13px] text-[#68717e]">Dernière mise à jour</p>
        <p className="mt-[3px] text-xl font-semibold text-[#15171a]">
          {val(stats?.derniereMaj)}
        </p>
      </div>

    </section>
  );
}

export default CartesStatResultat;
