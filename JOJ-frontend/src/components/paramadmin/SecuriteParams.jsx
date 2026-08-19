import { useState } from "react";

function SecuriteParams() {
  const [form, setForm] = useState({
    actuel:    "",
    nouveau:   "",
  });
  const [erreur,  setErreur]  = useState("");
  const [succes,  setSucces]  = useState(false);

  const handleChange = (champ) => (e) => {
    setForm((prev) => ({ ...prev, [champ]: e.target.value }));
    setErreur("");
    setSucces(false);
  };

  const handleSoumettre = (e) => {
    e.preventDefault();
    if (!form.actuel)  { setErreur("Veuillez saisir votre mot de passe actuel."); return; }
    if (!form.nouveau) { setErreur("Veuillez saisir un nouveau mot de passe."); return; }
    if (form.nouveau.length < 8) {
      setErreur("Le nouveau mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    console.log("Changement de mot de passe :", form);
    setSucces(true);
    setForm({ actuel: "", nouveau: "" });
  };

  return (
    <section className="w-[20rem] bg-white border border-[#e1e4e8] rounded-[20px] pb-10">
      <div className="px-[20px] pt-[20px]">

        {/* En-tête */}
        <div className="flex items-center gap-[9px]">
          <div className="w-[28px] h-[28px] rounded-[8px] bg-[#fff0f1] flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#ed3941">
              <path d="M12 3 20 6v5c0 5-3.2 8.4-8 10-4.8-1.6-8-5-8-10V6l8-3Z" />
              <path d="M12 7v10" stroke="white" strokeWidth="2" />
            </svg>
          </div>
          <h2 className="m-0 text-lg font-semibold">Sécurité</h2>
        </div>

        <form onSubmit={handleSoumettre}>

          {/* Message erreur */}
          {erreur && (
            <p className="mt-[10px] text-xs text-red-500 font-medium">{erreur}</p>
          )}
          {succes && (
            <p className="mt-[10px] text-xs text-green-600 font-medium">
              Mot de passe modifié avec succès.
            </p>
          )}

          {/* Mot de passe actuel */}
          <div className="mt-[14px]">
            <label className="block mb-[6px] text-xs tracking-[1.5px] text-[#8e97a3] uppercase">
              Mot de passe actuel
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.actuel}
              onChange={handleChange("actuel")}
              className="w-full h-[38px] box-border rounded-[8px] border border-[#e0e4e8] bg-[#f8f9fa] px-[10px] text-sm outline-none focus:border-[#d96814] transition-colors"
            />
          </div>

          {/* Nouveau mot de passe */}
          <div className="mt-[12px]">
            <label className="block mb-[6px] text-xs tracking-[1.5px] text-[#8e97a3] uppercase">
              Nouveau mot de passe
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.nouveau}
              onChange={handleChange("nouveau")}
              className="w-full h-[38px] box-border rounded-[8px] border border-[#e0e4e8] bg-[#f8f9fa] px-[10px] text-sm outline-none focus:border-[#d96814] transition-colors"
            />
          </div>

          <button
            type="submit"
            className="mt-[12px] cursor-pointer w-full h-[38px] rounded-[7px] border border-[#ffb9b9] bg-white text-sm font-semibold text-[#ed3038] hover:bg-red-50 transition-colors"
          >
            Changer le mot de passe
          </button>

        </form>
      </div>
    </section>
  );
}

export default SecuriteParams;
