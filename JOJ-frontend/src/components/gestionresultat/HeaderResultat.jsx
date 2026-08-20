import { useAuth } from "../../contexts/useAuth";

function HeaderResultat() {
  const { utilisateur } = useAuth();

  const nomAffiche = utilisateur
    ? `${utilisateur.first_name ?? ""} ${utilisateur.last_name ?? ""}`.trim() ||
      utilisateur.username ||
      "Administrateur"
    : "Administrateur";

  const roleAffiche =
    utilisateur?.role ??
    (utilisateur?.is_superuser
      ? "Super Administrateur"
      : utilisateur?.is_staff
      ? "Administrateur"
      : "Utilisateur");

  const avatarUrl = utilisateur?.avatar ?? null;

  const initiales = nomAffiche
    .split(" ")
    .map((m) => m[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="h-[72px] bg-white border-b border-[#e8e9ec]">
      <div className="h-full px-[28px] flex items-center justify-between">

        {/* Recherche */}
        <div className="w-[278px] h-[38px] rounded-full bg-[#f3f4f6] flex items-center px-[15px]">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
          </svg>
          <input
            type="text"
            placeholder="Rechercher..."
            className="ml-[10px] w-full bg-transparent outline-none border-none text-[14px] text-[#6b7280] placeholder:text-[#9ca3af]"
          />
        </div>

        {/* Droite */}
        <div className="flex items-center">

          {/* Notif */}
          <div className="relative mr-[22px]">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.8">
              <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
              <path d="M13.7 21a2 2 0 0 1-3.4 0" />
            </svg>
            <span className="absolute top-[-1px] right-0 w-[5px] h-[5px] rounded-full bg-[#e66a16]" />
          </div>

          <div className="h-[32px] w-px bg-[#e5e7eb]" />

          {/* Utilisateur connecté */}
          <div className="ml-[18px] flex items-center">
            <div className="text-right mr-[10px]">
              <p className="text-[14px] font-semibold text-[#171717] leading-[14px]">{nomAffiche}</p>
              <p className="text-[12px] text-[#777f8a] mt-[2px]">{roleAffiche}</p>
            </div>
            <div className="w-[34px] h-[34px] rounded-full overflow-hidden border-[2px] border-[#e66a16] bg-[#fff0e7] flex items-center justify-center shrink-0">
              {avatarUrl ? (
                <img src={avatarUrl} alt={nomAffiche} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs font-bold text-[#d96814]">{initiales}</span>
              )}
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}

export default HeaderResultat;
