import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";

function FormulaireConnexion() {
  const navigate = useNavigate();
  const { connecter } = useAuth();

  const [username,     setUsername]     = useState("");
  const [motDePasse,   setMotDePasse]   = useState("");
  const [souvenirDeMoi,setSouvenirDeMoi]= useState(false);
  const [erreur,       setErreur]       = useState("");
  const [chargement,   setChargement]   = useState(false);

  const handleSoumettre = async (e) => {
    e.preventDefault();
    setErreur("");

    if (!username.trim())      { setErreur("Veuillez saisir votre Nom d'utilisateur."); return; }
    if (!motDePasse.trim()) { setErreur("Veuillez saisir votre mot de passe."); return; }

    setChargement(true);
    try {
      // Le backend Django utilise "username" pour l'authentification JWT
      await connecter(username.trim(), motDePasse);

      // Option "se souvenir" : on garde le refresh token plus longtemps (géré en localStorage)
      if (!souvenirDeMoi) {
        // Si non coché, on utilisera sessionStorage au lieu de localStorage à terme
      }

      navigate("/ventbillet");
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (detail) {
        setErreur(detail);
      } else if (err.response?.status === 401) {
        setErreur("username ou mot de passe incorrect.");
      } else {
        setErreur("Une erreur est survenue. Veuillez réessayer.");
      }
    } finally {
      setChargement(false);
    }
  };

  return (
    <div className="w-[350px] -translate-y-[2px]">
      <h1 className="m-0 text-[35px] text-center font-[800] leading-[42px] tracking-[-0.8px] text-[#080808]">
        CONNEXION
      </h1>

      <p className="mt-[11px] mb-0 text-[16px] font-[400] leading-[22px] text-[#777777]">
        Bon retour ! Veuillez saisir vos coordonnées.
      </p>

      <form onSubmit={handleSoumettre} noValidate>

        {/* Message d'erreur */}
        {erreur && (
          <div className="mt-[20px] rounded-[9px] bg-red-50 border border-red-200 px-[12px] py-[10px]">
            <p className="text-[13px] text-red-600 font-[500] m-0">{erreur}</p>
          </div>
        )}

        {/* username */}
        <div className="mt-[28px]">
          <label
            htmlFor="texte"
            className="mb-[7px] block text-[15px] font-[500] leading-[20px] text-[#171717]"
          >
            Nom d'utilisateur
          </label>
          <input
            id="username"
            type="username"
            placeholder="Entrer votre username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            className="box-border h-[40px] w-full rounded-[9px] border border-[#cccccc] bg-white px-[10px] text-[14px] text-[#333333] outline-none placeholder:text-[#999999] focus:border-[#cf5b0c] transition-colors"
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
            placeholder="••••••••••"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            autoComplete="current-password"
            className="box-border h-[40px] w-full rounded-[9px] border border-[#cccccc] bg-white px-[10px] text-[14px] tracking-[1px] text-[#333333] outline-none focus:border-[#cf5b0c] transition-colors"
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
            className="text-[14px] font-[400] leading-[18px] text-[#222222] no-underline hover:text-[#cf5b0c] transition-colors"
          >
            Mot de passe oublié
          </a>
        </div>

        {/* Bouton */}
        <button
          type="submit"
          disabled={chargement}
          className="mt-[28px] h-[50px] w-full rounded-[12px] border-0 bg-[#cf5b0c] text-[16px] font-[700] text-white shadow-[0_5px_9px_rgba(207,91,12,0.20)] hover:bg-[#b35216] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {chargement ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Connexion en cours…
            </>
          ) : (
            "Se connecter"
          )}
        </button>

      </form>
    </div>
  );
}

export default FormulaireConnexion;
