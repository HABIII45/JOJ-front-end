import { useState } from "react";

function FormulaireConnexion() {
  const [motDePasse, setMotDePasse] = useState("");
  const [souvenirDeMoi, setSouvenirDeMoi] = useState(false);

  return (
    <div className="w-[350px] -translate-y-[2px]">
      <h1 className="m-0 text-[35px] text-center font-[800] leading-[42px] tracking-[-0.8px] text-[#080808]">
        CONNEXION
      </h1>

      <p className="mt-[11px] mb-0 text-[16px] font-[400] leading-[22px] text-[#777777]">
        Bon retour ! Veuillez saisir vos coordonnées.
      </p>

      {/* Email */}
      <div className="mt-[28px]">
        <label
          htmlFor="email"
          className="mb-[7px] block text-[15px] font-[500] leading-[20px] text-[#171717]"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="Entrer votre email"
          className="box-border h-[40px] w-full rounded-[9px] border border-[#cccccc] bg-white px-[10px] text-[14px] text-[#333333] outline-none placeholder:text-[#999999]"
        />
      </div>

      {/* Mot de passe */}
      <div className="mt-[25px]">
        <label
          htmlFor="password"
          className="mb-[7px] block text-[15px] font-[500] leading-[20px] text-[#171717]"
        >
          Mot de passe
        </label>
        <input
          id="password"
          type="password"
          placeholder="........"
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
          className="box-border h-[40px] w-full rounded-[9px] border border-[#cccccc] bg-white px-[10px] text-[14px] tracking-[1px] text-[#333333] outline-none"
        />
      </div>

      {/* Options */}
      <div className="mt-[28px] flex w-full items-center justify-between">
        <label className="flex cursor-pointer items-center gap-[8px]">
          <input
            type="checkbox"
            checked={souvenirDeMoi}
            onChange={(e) => setSouvenirDeMoi(e.target.checked)}
            className="m-0 h-[14px] w-[14px] rounded-[3px] border border-[#cccccc]"
          />
          <span className="text-[14px] font-[400] leading-[18px] text-[#222222]">
            Se souvenir de moi
          </span>
        </label>

        <a
          href="#"
          className="text-[14px] font-[400] leading-[18px] text-[#222222] no-underline"
        >
          Mot de passe oublié
        </a>
      </div>

      {/* Bouton */}
      <button
        type="button"
        className="mt-[28px] h-[50px] w-full rounded-[12px] border-0 bg-[#cf5b0c] text-[16px] font-[700] text-white shadow-[0_5px_9px_rgba(207,91,12,0.20)]"
      >
        Se connecter
      </button>
    </div>
  );
}

export default FormulaireConnexion;
