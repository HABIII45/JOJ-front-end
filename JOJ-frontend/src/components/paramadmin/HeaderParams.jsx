function HeaderParams() {
  return (
    <header className="h-[69px] bg-white border-b border-[#e8eaed]">
      <div className="h-full px-[27px] flex items-center justify-between">

        {/* Recherche */}
        <div className="w-[267px] h-[38px] rounded-full bg-[#f1f3f6] flex items-center px-[14px]">
          <svg className="shrink-0" width="15" height="15" viewBox="0 0 24 24"
            fill="none" stroke="#98a1ad" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
          </svg>
          <input
            type="text"
            placeholder="Rechercher un article..."
            className="ml-[9px] w-full bg-transparent border-0 outline-none text-sm text-[#596270] placeholder:text-[#9aa2ad]"
          />
        </div>

        {/* Droite */}
        <div className="flex items-center">

          {/* Notification */}
          <button type="button" className="relative mr-[19px]">
            <svg width="17" height="17" viewBox="0 0 24 24"
              fill="none" stroke="#9aa2ad" strokeWidth="1.8">
              <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
              <path d="M13.7 21a2 2 0 0 1-3.4 0" />
            </svg>
            <span className="absolute top-[-1px] right-[-1px] w-[5px] h-[5px] rounded-full bg-[#d96814]" />
          </button>

          <div className="h-[30px] w-px bg-[#e6e8eb]" />

          {/* Admin */}
          <div className="ml-[16px] flex items-center">
            <div className="text-right mr-[10px]">
              <p className="m-0 text-sm font-semibold leading-[14px]">Admin JOJ</p>
              <p className="m-0 text-xs leading-[12px] text-[#747c88]">Super Administrateur</p>
            </div>
            <img
              src="https://i.pravatar.cc/80?img=12"
              className="w-[34px] h-[34px] rounded-full object-cover border-[2px] border-[#e56818]"
              alt="Admin JOJ"
            />
          </div>

        </div>
      </div>
    </header>
  );
}

export default HeaderParams;
