function CartesKPI() {
  return (
    <section className="grid grid-cols-4 gap-[16px] mt-[23px]">

      {/* Carte 1 — Total Billets Vendus */}
      <div className="h-[145px] rounded-[19px] border border-[#e3e5e8] bg-white px-[19px] pt-[18px]">
        <div className="flex items-start justify-between">
          <div className="w-[34px] h-[34px] rounded-[8px] bg-[#fee5e3] flex items-center justify-center">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#e75d38" strokeWidth="2">
              <path d="M8 21h8" />
              <path d="M12 17v4" />
              <path d="M7 4h10v5a5 5 0 0 1-10 0V4Z" />
              <path d="M7 7H4a3 3 0 0 0 3 3" />
              <path d="M17 7h3a3 3 0 0 1-3 3" />
            </svg>
          </div>
          <span className="text-[13px] font-semibold text-[#15a95b] mt-[5px]">+15.2%</span>
        </div>
        <p className="mt-[14px] text-[13px] text-[#707782]">Total Billets Vendus</p>
        <p className="mt-[3px] text-[20px] font-semibold text-[#111111]">1.250</p>
      </div>

      {/* Carte 2 — Chiffre d'Affaires */}
      <div className="h-[145px] rounded-[19px] border border-[#e3e5e8] bg-white px-[19px] pt-[18px]">
        <div className="flex items-start justify-between">
          <div className="w-[34px] h-[34px] rounded-[8px] bg-[#fff0df] flex items-center justify-center">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#e67820" strokeWidth="2">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="M7 9h4" />
              <path d="M7 13h2" />
            </svg>
          </div>
          <span className="text-[13px] font-semibold text-[#15a95b] mt-[5px]">+8.4%</span>
        </div>
        <p className="mt-[14px] text-[13px] text-[#707782]">Chiffre d'Affaires Total</p>
        <p className="mt-[3px] text-[19px] font-semibold text-[#111111]">25.400.000</p>
        <p className="text-[14px] font-medium text-[#111111]">FCFA</p>
      </div>

      {/* Carte 3 — Panier Moyen */}
      <div className="h-[145px] rounded-[19px] border border-[#e3e5e8] bg-white px-[19px] pt-[18px]">
        <div className="flex items-start justify-between">
          <div className="w-[34px] h-[34px] rounded-[8px] bg-[#eaf2ff] flex items-center justify-center">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="#0969d7">
              <path d="M12 21s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12Z" />
              <circle cx="12" cy="9" r="2.2" fill="white" />
            </svg>
          </div>
          <span className="text-[13px] font-medium text-[#9ca3af] mt-[5px]">Stable</span>
        </div>
        <p className="mt-[14px] text-[13px] text-[#707782]">Panier Moyen</p>
        <p className="mt-[3px] text-[19px] font-semibold text-[#111111]">20.320 FCFA</p>
      </div>

      {/* Carte 4 — Taux de Remplissage */}
      <div className="h-[145px] rounded-[19px] border border-[#e3e5e8] bg-white px-[19px] pt-[18px]">
        <div className="flex items-start justify-between">
          <div className="w-[34px] h-[34px] rounded-[8px] bg-[#eef0f3] flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="1.8">
              <path d="M7 3h8l4 4v14H7z" />
              <path d="M15 3v5h5" />
              <path d="M10 13h6" />
              <path d="M10 17h6" />
              <path d="M10 9h2" />
            </svg>
          </div>
          <span className="text-[13px] font-semibold text-[#df651b] mt-[5px]">78%</span>
        </div>
        <p className="mt-[14px] text-[13px] text-[#707782]">Taux de Remplissage</p>
        <div className="mt-[11px] h-[7px] rounded-full bg-[#f0f1f3] overflow-hidden">
          <div className="h-full w-[78%] bg-[#e86b16] rounded-full" />
        </div>
      </div>

    </section>
  );
}

export default CartesKPI;
