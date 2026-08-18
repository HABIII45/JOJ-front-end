function HeaderVente() {
  return (
    <header className="h-[70px] bg-white border-b border-[#e7e8eb]">
      <div className="h-full px-[28px] flex items-center justify-between">

        {/* Recherche */}
        <div className="w-[270px] h-[38px] rounded-full bg-[#f4f5f7] flex items-center px-[15px]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
          </svg>
          <span className="ml-[10px] list-style-none text-[14px] text-[#a0a5ad]">
              <input
                type="text"
                placeholder="Rechercher..."
                className="text-[14px] text-[#a0a5ad] outline-none bg-transparent"
              />
          </span>
        </div>

        {/* Partie droite */}
        <div className="flex items-center">

          {/* Notification */}
          <div className="relative mr-[24px]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9298a1" strokeWidth="1.8">
              <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
              <path d="M13.7 21a2 2 0 0 1-3.4 0" />
            </svg>
            <span className="absolute right-[-1px] top-[-2px] w-[5px] h-[5px] rounded-full bg-[#e86b16]" />
          </div>

          <div className="h-[32px] w-px bg-[#e5e7eb]" />

          {/* Admin */}
          <div className="flex items-center ml-[18px]">
            <div className="text-right mr-[10px]">
              <p className="text-[14px] font-semibold text-[#171717] leading-[15px]">Admin JOJ</p>
              <p className="text-[11px] text-[#8b919c] mt-[2px]">Super Administrateur</p>
            </div>
            <img
              src="https://i.pravatar.cc/80?img=12"
              alt="Admin"
              className="w-[34px] h-[34px] rounded-full object-cover border-[2px] border-[#e86b16]"
            />
          </div>

        </div>
      </div>
    </header>
  );
}

export default HeaderVente;
