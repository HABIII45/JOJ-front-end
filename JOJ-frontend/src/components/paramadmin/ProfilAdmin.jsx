import { useState } from "react";

function ProfilAdmin() {
  const [form, setForm] = useState({
    nom:         "Admin JOJ",
    email:       "admin@jojdakar2026.sn",
    role:        "Super Administrateur",
    departement: "Communication & Médias",
  });

  const handleChange = (champ) => (e) =>
    setForm((prev) => ({ ...prev, [champ]: e.target.value }));

  const handleSauvegarder = (e) => {
    e.preventDefault();
    console.log("Modifications sauvegardées :", form);
  };

  return (
    <section className="w-[37rem] bg-white border border-[#e1e4e8] mr-6 rounded-[20px] pb-6">
      <div className="px-[30px] pt-[20px]">

        {/* En-tête section */}
        <div className="flex items-center gap-[9px]">
          <div className="w-[28px] h-[28px] rounded-[8px] bg-[#fff0e7] flex items-center justify-center">
            <svg width="15" height="15" viewBox="0 0 24 24"
              fill="none" stroke="#d96814" strokeWidth="2">
              <circle cx="9" cy="8" r="3" />
              <path d="M3.5 19c.6-3 2.4-5 5.5-5s4.9 2 5.5 5" />
              <path d="M18 5v6" />
              <path d="M15 8h6" />
            </svg>
          </div>
          <h2 className="m-0 text-lg font-semibold leading-[20px]">
            Profil de l'administrateur
          </h2>
        </div>

        <form onSubmit={handleSauvegarder}>
          <div className="flex mt-[13px]">

            {/* Photo */}
            <div className="w-[103px] shrink-0 flex justify-center pt-[1px]">
              <div className="relative">
                <div className="w-[75px] h-[75px] rounded-full border-[2px] border-[#e66a18] bg-white p-[2px]">
                  <img
                    src="https://i.pravatar.cc/100?img=12"
                    className="w-full h-full rounded-full object-cover"
                    alt=""
                  />
                </div>
                <button
                  type="button"
                  className="absolute right-[-3px] cursor-pointer bottom-[-2px] w-[23px] h-[23px] rounded-full bg-[#d96814] border-[2px] border-white flex items-center justify-center"
                >
                  <svg width="11" height="11" viewBox="0 0 24 24"
                    fill="none" stroke="white" strokeWidth="2">
                    <path d="M4 7h3l2-2h6l2 2h3v11H4z" />
                    <circle cx="12" cy="13" r="3" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Formulaire */}
            <div className="flex-1 grid grid-cols-2 gap-x-[16px] gap-y-[14px]">

              <div>
                <label className="block mb-[6px] text-xs leading-[12px] text-[#626c79]">
                  Nom complet
                </label>
                <input
                  value={form.nom}
                  onChange={handleChange("nom")}
                  className="w-full h-[40px] box-border rounded-[9px] border border-[#e0e4e8] bg-[#f8f9fa] px-[12px] text-sm text-[#171717] outline-none focus:border-[#d96814] transition-colors"
                />
              </div>

              <div>
                <label className="block mb-[6px] text-xs leading-[12px] text-[#626c79]">
                  Adresse Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={handleChange("email")}
                  className="w-full h-[40px] box-border rounded-[9px] border border-[#e0e4e8] bg-[#f8f9fa] px-[12px] text-sm text-[#171717] outline-none focus:border-[#d96814] transition-colors"
                />
              </div>

              <div>
                <label className="block mb-[6px] text-xs leading-[12px] text-[#626c79]">
                  Rôle
                </label>
                <input
                  value={form.role}
                  readOnly
                  className="w-full h-[40px] box-border rounded-[9px] border border-[#e0e4e8] bg-[#f0f1f3] px-[12px] text-sm text-[#30343a] outline-none cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block mb-[6px] text-xs leading-[12px] text-[#626c79]">
                  Département
                </label>
                <input
                  value={form.departement}
                  onChange={handleChange("departement")}
                  className="w-full h-[40px] box-border rounded-[9px] border border-[#e0e4e8] bg-[#f8f9fa] px-[12px] text-sm text-[#171717] outline-none focus:border-[#d96814] transition-colors"
                />
              </div>

            </div>
          </div>

          <div className="flex justify-center mt-[24px]">
            <button
              type="submit"
              className="w-[211px] cursor-pointer h-[40px] rounded-[7px] bg-black text-white text-sm font-medium shadow-[0_2px_4px_rgba(0,0,0,.2)] hover:bg-[#222] transition-colors"
            >
              Sauvegarder les modifications
            </button>
          </div>
        </form>

      </div>
    </section>
  );
}

export default ProfilAdmin;
