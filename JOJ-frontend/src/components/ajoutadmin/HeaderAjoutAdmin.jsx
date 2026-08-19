import { useAuth } from "../../contexts/useAuth";

export function HeaderAjoutAdmin() {
  const { utilisateur } = useAuth();

  const nomAffiche = utilisateur
    ? `${utilisateur.first_name ?? ""} ${utilisateur.last_name ?? ""}`.trim() || utilisateur.username || "Super Administrateur"
    : "Super Administrateur";

  const roleAffiche = utilisateur?.role
    ?? (utilisateur?.is_superuser ? "Super Admin" : utilisateur?.is_staff ? "Administrateur" : "Utilisateur");

  const avatarUrl = utilisateur?.avatar ?? null;

  const initiales = nomAffiche
    .split(" ")
    .map((m) => m[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="h-[4.3rem] border-b border-[#e5e7eb] bg-white sticky top-0 z-20">
      <div className="flex h-full items-center justify-between px-5 sm:px-8 lg:px-[2.8%]">
        <div>
          <p className="m-0 text-[0.7rem] font-medium uppercase tracking-[0.08em] text-[#687386]">Administration</p>
          <h1 className="m-0 mt-1 text-[1.25rem] font-bold leading-none tracking-[-0.02em] sm:text-[1.35rem]">
            Nouvel Administrateur
          </h1>
        </div>

        <div className="flex items-center gap-4 sm:gap-5">
          {/* Notifications */}
          <button type="button" className="relative p-1 text-[#929ba8] hover:text-[#d56817] transition-colors cursor-pointer" aria-label="Notifications">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"></path>
              <path d="M13.7 21a2 2 0 0 1-3.4 0"></path>
            </svg>
            <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-[#d56817]"></span>
          </button>

          {/* Profil */}
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-full overflow-hidden border border-[#f0e3dd] bg-[#fff0e7] flex items-center justify-center shrink-0">
              {avatarUrl ? (
                <img src={avatarUrl} alt={nomAffiche} className="h-full w-full object-cover" />
              ) : (
                <span className="text-xs font-bold text-[#d56817]">{initiales || "SA"}</span>
              )}
            </div>
            <div className="hidden sm:block text-left">
              <p className="m-0 text-[0.75rem] font-bold leading-tight text-gray-900">{nomAffiche}</p>
              <p className="m-0 mt-1 text-[0.65rem] text-[#9aa2ad] font-medium">{roleAffiche}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default HeaderAjoutAdmin;
