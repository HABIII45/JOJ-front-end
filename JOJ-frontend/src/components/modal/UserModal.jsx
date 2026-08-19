import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import apiClient, { isBackendConnected } from "../../lib/api";

// Fallback sécurisé au cas où react-hot-toast ne soit pas installé
let toast = {
  success: (m) => console.log("SUCCÈS :", m),
  error: (m) => console.error("ERREUR :", m),
};

try {
  const hotToast = require("react-hot-toast");
  toast = hotToast.toast || hotToast.default || toast;
} catch (e) {
  // react-hot-toast non présent, utilisation du fallback console
}

const DROITS = [
  { valeur: "EVENEMENTS", libelle: "Gestion des Evenement" },
  { valeur: "SITES", libelle: "Gestion des Sites" },
  { valeur: "ACTUALITES", libelle: "Gestion des Actualités" },
  { valeur: "BILLETS", libelle: "Gestion des Billets" },
  { valeur: "PAIEMENTS", libelle: "Gestion des Paiements" },
  { valeur: "RESULTATS", libelle: "Gestion des Résultats" },
  { valeur: "NOTIFICATIONS", libelle: "Gestion des Notifications" },
  { valeur: "DISCIPLINES", libelle: "Gestion des Disciplines" },
  { valeur: "UTILISATEURS", libelle: "Gestion des Utilisateurs" },
  { valeur: "TOUT", libelle: "Toutes les permissions" },
];

const STYLE_CHAMP =
  "w-full rounded-2xl bg-[#F8FAFC] py-3 px-4 text-xs font-medium text-gray-700 outline-none placeholder:text-gray-400 border border-transparent focus:border-gray-200 transition-all";

function emailValide(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function UserModal({ ouvert, fermer, onCree }) {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [compteActif, setCompteActif] = useState(true);
  const [droit, setDroit] = useState(DROITS[0].valeur);
  const [envoi, setEnvoi] = useState(false);
  const [erreurs, setErreurs] = useState({});
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

  useEffect(() => {
    if (!ouvert) return;
    const avant = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = avant;
    };
  }, [ouvert]);

  function reinitialiser() {
    setNom("");
    setEmail("");
    setTelephone("");
    setCompteActif(true);
    setDroit(DROITS[0].valeur);
    setErreurs({});
  }

  async function creer() {
    const nouvellesErreurs = {};
    if (!nom.trim()) nouvellesErreurs.nom = "Le nom complet est requis.";
    if (!email.trim() || !emailValide(email))
      nouvellesErreurs.email = "Adresse email invalide.";
    if (!telephone.trim()) nouvellesErreurs.telephone = "Le téléphone est requis.";
    setErreurs(nouvellesErreurs);
    if (Object.keys(nouvellesErreurs).length > 0) return;

    setEnvoi(true);
    try {
      if (isBackendConnected()) {
        await apiClient.post("/api/utilisateurs/creer-admin/", {
          username: email,
          email,
          nom_complet: nom.trim(),
          tel: telephone.trim(),
          est_actif: compteActif,
          permissions: [droit],
        });
        toast.success(`${nom.trim()} a été créé comme administrateur.`);
      } else {
        toast.success("Administrateur créé (mode démo).");
      }

      if (typeof onCree === "function") {
        onCree({
          id: Math.floor(Math.random() * 10000),
          username: email,
          email,
          nom_complet: nom.trim(),
          tel: telephone.trim(),
          is_active: compteActif,
          role: "ADMIN",
          permissions_app: [droit],
        });
      }
      reinitialiser();
      fermer();
    } catch (erreur) {
      const code = erreur?.response?.status;
      const donnees = erreur?.response?.data;
      if (code === 400 && donnees) {
        const messages = Object.values(donnees)
          .flat()
          .filter((m) => typeof m === "string");
        toast.error(messages[0] || "Vérifiez les informations saisies.");
      } else if (code === 401 || code === 403) {
        toast.error("Seul un Super Administrateur peut créer un compte.");
      } else {
        toast.error("Impossible de créer l'administrateur.");
      }
    } finally {
      setEnvoi(false);
    }
  }

  if (!ouvert) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Fond sombre */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={fermer}
        aria-hidden="true"
      />

      {/* Conteneur de la modale */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="titre-popup-admin"
        className="relative w-full max-w-2xl bg-white rounded-[2.5rem] p-6 sm:p-8 shadow-2xl border border-gray-100/50 z-10"
      >
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-100">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              ADMINISTRATION
            </p>
            <h2
              id="titre-popup-admin"
              className="text-xl font-extrabold text-gray-900 tracking-tight mt-0.5"
            >
              Nouvel Administrateur
            </h2>
          </div>
          <button
            onClick={fermer}
            className="p-2 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer rounded-full hover:bg-gray-100"
            aria-label="Fermer le popup"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-5">
          {/* Nom complet */}
          <div>
            <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-gray-400">
              NOM COMPLET *
            </label>
            <input
              ref={premierChamp}
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Prénom et Nom"
              className={STYLE_CHAMP}
            />
            {erreurs.nom && (
              <p className="mt-1 text-[11px] text-red-500 font-medium">{erreurs.nom}</p>
            )}
          </div>

          {/* Email & Téléphone */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                ADRESSE EMAIL *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@dakar2026.sn"
                className={STYLE_CHAMP}
              />
              {erreurs.email && (
                <p className="mt-1 text-[11px] text-red-500 font-medium">{erreurs.email}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                NUMÉRO DE TÉLÉPHONE *
              </label>
              <input
                type="tel"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                placeholder="+221 7X XXX XX XX"
                className={STYLE_CHAMP}
              />
              {erreurs.telephone && (
                <p className="mt-1 text-[11px] text-red-500 font-medium">
                  {erreurs.telephone}
                </p>
              )}
            </div>
          </div>

          {/* Permissions & Statut */}
          <div className="grid gap-5 sm:grid-cols-2 items-end pt-1">
            <div>
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                PERMISSIONS / DROIT
              </label>
              <select
                value={droit}
                onChange={(e) => setDroit(e.target.value)}
                className="w-full rounded-2xl bg-[#F8FAFC] py-3 px-4 text-xs font-medium text-gray-700 outline-none border border-transparent focus:border-gray-200 cursor-pointer"
              >
                {DROITS.map((d) => (
                  <option key={d.valeur} value={d.valeur}>
                    {d.libelle}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3 py-3 px-4 bg-[#F8FAFC] rounded-2xl">
              <button
                type="button"
                onClick={() => setCompteActif(!compteActif)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${
                  compteActif ? "bg-[#D96B27]" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                    compteActif ? "translate-x-4.5" : "translate-x-1"
                  }`}
                />
              </button>
              <span className="text-xs font-bold text-gray-700 select-none">
                {compteActif ? "Compte Actif" : "Compte Inactif"}
              </span>
            </div>
          </div>
        </div>

        {/* Pied / Actions */}
        <div className="mt-8 pt-5 border-t border-gray-100 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              reinitialiser();
              fermer();
            }}
            className="w-full sm:w-auto rounded-2xl border border-gray-200 px-6 py-3 text-xs font-bold text-gray-600 transition hover:bg-gray-50 cursor-pointer"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={creer}
            disabled={envoi}
            className="w-full sm:w-auto rounded-2xl bg-black hover:bg-gray-800 px-6 py-3 text-xs font-bold text-white shadow-sm transition disabled:opacity-50 cursor-pointer"
          >
            {envoi ? "Création..." : "Créer l'Administrateur"}
          </button>
        </div>
      </div>
    </div>
  );
}