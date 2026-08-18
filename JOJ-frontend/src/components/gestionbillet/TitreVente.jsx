function TitreVente() {
  return (
    <section className="flex items-end justify-between">
      <div>
        <h1 className="text-[30px] leading-[34px] font-extrabold tracking-[-0.8px] text-[#101216]">
          Gestion des Ventes de Billets
        </h1>
        <p className="mt-[5px] text-[15px] leading-[17px] text-[#707782]">
          Suivez les revenus et l'engagement de vos participants en temps réel.
        </p>
      </div>

      <div className="flex items-center gap-[10px]">
        {/* Filtrer */}
        <button className="h-[38px] cursor-pointer px-[16px] rounded-[7px] bg-[#f0f1f3] text-[13px] font-medium text-[#4b5563] flex items-center gap-[8px]">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="text-[#68717d]">
            <path d="M3 5h18l-7 8v5l-4 2v-7L3 5z" />
          </svg>
          Filtrer par événement
        </button>

        {/* Exporter */}
        <button className="h-[38px] px-[17px] cursor-pointer rounded-[7px] bg-[#e86b16] text-white text-[13px] font-semibold flex items-center gap-[8px]">
          <span className="text-[18px] leading-none">+</span>
          Exporter les ventes
        </button>
      </div>
    </section>
  );
}

export default TitreVente;
