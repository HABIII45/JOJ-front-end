import { useEffect, useRef, useState } from "react";
import { X, Lock, ShieldCheck, Mail, User, Phone, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { creerAdmin } from "../../api/auth";
import { PERMISSION_OPTIONS } from "../../utils/permissions";

const STYLE_CHAMP =
  "w-full rounded-2xl bg-[#F8FAFC] py-3 px-4 text-xs font-medium text-gray-700 outline-none placeholder:text-gray-400 border border-gray-200 focus:border-[#C25B1E] transition-all";

function emailValide(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function UserModal({ ouvert, fermer, onCree }) {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [compteActif, setCompteActif] = useState(true);
  const [droit, setDroit] = useState(PERMISSION_OPTIONS[0].value);
  const [envoi, setEnvoi] = useState(false);
  const [erreurs, setErreurs] = useState({});
  const [messageErreur, setMessageErreur] = useState("");
  const [messageSucces, setMessageSucces] = useState("");
  const premierChamp = useRef(null);

  useEffect(() => {
    if (ouvert) {
      setTimeout(() => premierChamp.current?.focus(), 60);
    }
  }, [ouvert]);

  useEffect(() => {
    if (!ouvert) return;
    const onKey = (e) => e.key === "Escape" && fermer();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ouvert, fermer]);

  function reinitialiser() {
    setNom("");
    setEmail("");
    setTelephone("");
    setPassword("");
    setPassword2("");
    setCompteActif(true);
    setDroit(PERMISSION_OPTIONS[0].value);
    setErreurs({});
    setMessageErreur("");
    setMessageSucces("");
  }

  async function creer(e) {
    if (e) e.preventDefault();
    const nouvellesErreurs = {};
    setMessageErreur("");
    setMessageSucces("");

    if (!nom.trim()) nouvellesErreurs.nom = "Le nom complet est requis.";
    if (!email.trim() || !emailValide(email))
      nouvellesErreurs.email = "Adresse email valide requise.";
    if (!password) nouvellesErreurs.password = "Le mot de passe est requis.";
    if (password !== password2)
      nouvellesErreurs.password2 = "Les mots de passe ne correspondent pas.";

    setErreurs(nouvellesErreurs);
    if (Object.keys(nouvellesErreurs).length > 0) return;

    setEnvoi(true);
    try {
      const partiesNom = nom.trim().split(" ");
      const first_name = partiesNom.slice(0, -1).join(" ") || partiesNom[0] || "";
      const last_name = partiesNom.length > 1 ? partiesNom[partiesNom.length - 1] : "";
      const username = email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "") || `admin_${Date.now()}`;

      const payload = {
        username,
        email: email.trim(),
        first_name,
        last_name,
        tel: telephone.trim() || "770000000",
        password,
        password2,
        permissions_app: [droit],
      };

      const res = await creerAdmin(payload);
      setMessageSucces(`${nom.trim()} a été créé avec succès.`);

      if (typeof onCree === "function") {
        onCree({
          id: res?.id || Date.now(),
          username,
          email: email.trim(),
          first_name,
          last_name,
          nom_complet: nom.trim(),
          tel: telephone.trim(),
          role: "ADMIN",
          permissions_app: [droit],
          is_active: compteActif,
        });
      }

      setTimeout(() => {
        reinitialiser();
        fermer();
      }, 1000);
    } catch (err) {
      console.error("Erreur création utilisateur:", err);
      const data = err?.response?.data;
      if (data) {
        const errorMsg = Object.values(data).flat().join(" ");
        setMessageErreur(errorMsg || "Impossible de créer l'administrateur.");
      } else {
        setMessageErreur("Erreur réseau lors de la création.");
      }
    } finally {
      setEnvoi(false);
    }
  }

  if (!ouvert) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-extrabold text-gray-900 tracking-tight">
              Créer un Administrateur
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Renseignez les accès et la permission applicative.
            </p>
          </div>
          <button
            onClick={() => {
              reinitialiser();
              fermer();
            }}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {messageSucces && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
            <CheckCircle2 size={16} />
            {messageSucces}
          </div>
        )}

        {messageErreur && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-800 text-xs font-bold rounded-xl flex items-center gap-2">
            <AlertCircle size={16} />
            {messageErreur}
          </div>
        )}

        <form onSubmit={creer} className="space-y-4 mt-5">
          {/* Nom complet */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Nom complet *
            </label>
            <input
              ref={premierChamp}
              type="text"
              required
              placeholder="Ex: Fatou Ndiaye"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className={STYLE_CHAMP}
            />
            {erreurs.nom && <p className="text-xs text-red-500 mt-1">{erreurs.nom}</p>}
          </div>

          {/* Email & Téléphone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Adresse Email *
              </label>
              <input
                type="email"
                required
                placeholder="f.ndiaye@joj2026.sn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={STYLE_CHAMP}
              />
              {erreurs.email && <p className="text-xs text-red-500 mt-1">{erreurs.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Téléphone
              </label>
              <input
                type="tel"
                placeholder="+221 77 000 00 00"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                className={STYLE_CHAMP}
              />
            </div>
          </div>

          {/* Mots de passe */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Mot de passe *
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={STYLE_CHAMP}
              />
              {erreurs.password && <p className="text-xs text-red-500 mt-1">{erreurs.password}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Confirmer mot de passe *
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                className={STYLE_CHAMP}
              />
              {erreurs.password2 && <p className="text-xs text-red-500 mt-1">{erreurs.password2}</p>}
            </div>
          </div>

          {/* Permission applicative alignée sur le modèle Django */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Permission attribuée *
            </label>
            <select
              value={droit}
              onChange={(e) => setDroit(e.target.value)}
              className="w-full rounded-2xl bg-[#F8FAFC] py-3 px-4 text-xs font-semibold text-gray-800 outline-none border border-gray-200 focus:border-[#C25B1E] cursor-pointer"
            >
              {PERMISSION_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label} ({opt.value})
                </option>
              ))}
            </select>
          </div>

          {/* Boutons d'action */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                reinitialiser();
                fermer();
              }}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={envoi}
              className="px-6 py-2.5 rounded-xl bg-[#C25B1E] hover:bg-[#A04816] disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-2"
            >
              {envoi ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Création...
                </>
              ) : (
                "Créer l'administrateur"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}