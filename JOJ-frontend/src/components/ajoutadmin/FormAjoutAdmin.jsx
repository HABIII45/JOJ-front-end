import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { creerAdmin } from "../../api/auth";
import { PERMISSIONS, PERMISSION_OPTIONS, saveUserPermissions } from "../../utils/permissions";

export function FormAjoutAdmin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nomComplet: "",
    username: "",
    email: "",
    telephone: "",
    password: "",
    password2: "",
    compteActif: true,
  });

  // Gestion des permissions multiples (par défaut : JEUX ou sélection libre)
  const [droitsSelectionnes, setDroitsSelectionnes] = useState([PERMISSIONS.JEUX]);
  const [toutSelectionne, setToutSelectionne] = useState(false);

  const [afficherMdp, setAfficherMdp] = useState(false);
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState("");
  const [succes, setSucces] = useState("");

  const handleChange = (champ) => (e) => {
    const val = e.target.value;
    setForm((prev) => {
      const next = { ...prev, [champ]: val };
      if (champ === "nomComplet" && !prev.usernameTouched) {
        const clean = val.toLowerCase().replace(/[^a-z0-9]/g, "");
        next.username = clean ? clean : "";
      }
      return next;
    });
    setErreur("");
  };

  const handleUsernameChange = (e) => {
    setForm((prev) => ({ ...prev, username: e.target.value, usernameTouched: true }));
    setErreur("");
  };

  const toggleCompteActif = () => {
    setForm((prev) => ({ ...prev, compteActif: !prev.compteActif }));
  };

  // Bascule pour une permission spécifique
  const togglePermission = (permValue) => {
    setToutSelectionne(false);
    setDroitsSelectionnes((prev) => {
      if (prev.includes(permValue)) {
        const next = prev.filter((p) => p !== permValue);
        return next.length > 0 ? next : [permValue]; // Garde au moins une permission
      } else {
        return [...prev, permValue];
      }
    });
    setErreur("");
  };

  // Bascule pour "Toutes les permissions"
  const handleSelectAllPermissions = () => {
    if (toutSelectionne) {
      setToutSelectionne(false);
      setDroitsSelectionnes([PERMISSIONS.JEUX]);
    } else {
      setToutSelectionne(true);
      setDroitsSelectionnes(PERMISSION_OPTIONS.map((p) => p.value));
    }
    setErreur("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur("");
    setSucces("");

    if (!form.nomComplet.trim()) {
      setErreur("Veuillez renseigner le nom complet.");
      return;
    }
    if (!form.email.trim()) {
      setErreur("Veuillez renseigner une adresse email valide.");
      return;
    }
    if (!form.password) {
      setErreur("Veuillez saisir un mot de passe.");
      return;
    }
    if (form.password !== form.password2) {
      setErreur("Les deux mots de passe ne correspondent pas.");
      return;
    }

    const permissionsFinales = toutSelectionne
      ? [PERMISSIONS.TOUT]
      : droitsSelectionnes.length > 0
      ? droitsSelectionnes
      : [PERMISSIONS.JEUX];

    // Découpage prénom / nom
    const partiesNom = form.nomComplet.trim().split(" ");
    const first_name = partiesNom.slice(0, -1).join(" ") || partiesNom[0] || "";
    const last_name = partiesNom.length > 1 ? partiesNom[partiesNom.length - 1] : "";
    const usernameFinal = form.username.trim() || form.email.split("@")[0] || "admin_" + Date.now();

    setChargement(true);
    try {
      const reponse = await creerAdmin({
        username: usernameFinal,
        email: form.email.trim(),
        first_name,
        last_name,
        tel: form.telephone.trim(),
        password: form.password,
        password2: form.password2,
        permissions_app: permissionsFinales,
      });

      // Sauvegarde des permissions dans le registre persistant local
      saveUserPermissions(usernameFinal, permissionsFinales);
      saveUserPermissions(form.email.trim(), permissionsFinales);
      if (reponse?.utilisateur?.id) {
        saveUserPermissions(reponse.utilisateur.id, permissionsFinales);
      }

      setSucces("Administrateur créé avec succès ! Redirection en cours...");
      setTimeout(() => {
        navigate("/parametres");
      }, 1200);
    } catch (err) {
      const data = err?.response?.data;
      if (data) {
        const premierMessage =
          data.password?.[0] ||
          data.password2?.[0] ||
          data.email?.[0] ||
          data.username?.[0] ||
          data.permissions_app?.[0] ||
          data.erreur ||
          data.detail ||
          data.non_field_errors?.[0] ||
          "Une erreur est survenue lors de la création.";
        setErreur(Array.isArray(premierMessage) ? premierMessage[0] : premierMessage);
      } else {
        setErreur("Impossible de contacter le serveur. Veuillez réessayer.");
      }
    } finally {
      setChargement(false);
    }
  };

  return (
    <main className="px-4 py-8 sm:px-8 sm:py-10 lg:px-[3.4%] lg:py-[3%]">
      <section className="mx-auto w-full max-w-[54rem] rounded-[1.25rem] border border-[#f0e3dd] bg-white px-6 py-8 sm:px-8 sm:py-9 shadow-sm">
        <h2 className="m-0 text-[1.05rem] font-bold sm:text-[1.15rem] text-[#111]">Informations de Profil</h2>
        <p className="m-0 mt-2 text-[0.75rem] leading-relaxed text-[#737d8d] sm:text-[0.8rem]">
          Saisissez les coordonnées et choisissez un ou plusieurs droits d'accès pour ce compte administrateur.
        </p>

        {/* Message d'erreur */}
        {erreur && (
          <div className="mt-5 rounded-[0.6rem] bg-red-50 border border-red-200 px-4 py-3 text-[0.8rem] text-red-600 font-medium">
            {erreur}
          </div>
        )}

        {/* Message de succès */}
        {succes && (
          <div className="mt-5 rounded-[0.6rem] bg-green-50 border border-green-200 px-4 py-3 text-[0.8rem] text-green-700 font-medium">
            {succes}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-7 sm:mt-8">
          {/* Nom complet */}
          <div>
            <label htmlFor="nom" className="block text-[0.72rem] font-bold text-[#3d4657] sm:text-[0.75rem]">
              Nom complet
            </label>
            <input
              id="nom"
              type="text"
              required
              value={form.nomComplet}
              onChange={handleChange("nomComplet")}
              placeholder="Prénom et Nom"
              className="mt-2 h-11 w-full rounded-[0.6rem] border border-[#f4ddd3] bg-white px-3.5 text-[0.8rem] outline-none placeholder:text-[#a2abb8] focus:border-[#d56817] transition-colors"
            />
          </div>

          {/* Nom d'utilisateur (Username) */}
          <div className="mt-5">
            <label htmlFor="username" className="block text-[0.72rem] font-bold text-[#3d4657] sm:text-[0.75rem]">
              Nom d'utilisateur (Identifiant de connexion)
            </label>
            <input
              id="username"
              type="text"
              required
              value={form.username}
              onChange={handleUsernameChange}
              placeholder="ex: amadou.diop"
              className="mt-2 h-11 w-full rounded-[0.6rem] border border-[#f4ddd3] bg-white px-3.5 text-[0.8rem] outline-none placeholder:text-[#a2abb8] focus:border-[#d56817] transition-colors"
            />
          </div>

          {/* Email & Téléphone */}
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="email" className="block text-[0.72rem] font-bold text-[#3d4657] sm:text-[0.75rem]">
                Adresse Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange("email")}
                placeholder="admin@dakar2026.sn"
                className="mt-2 h-11 w-full rounded-[0.6rem] border border-[#f4ddd3] bg-white px-3.5 text-[0.8rem] outline-none placeholder:text-[#a2abb8] focus:border-[#d56817] transition-colors"
              />
            </div>
            <div>
              <label htmlFor="telephone" className="block text-[0.72rem] font-bold text-[#3d4657] sm:text-[0.75rem]">
                Numéro de Téléphone
              </label>
              <input
                id="telephone"
                type="tel"
                value={form.telephone}
                onChange={handleChange("telephone")}
                placeholder="+221 7X XXX XX XX"
                className="mt-2 h-11 w-full rounded-[0.6rem] border border-[#f4ddd3] bg-white px-3.5 text-[0.8rem] outline-none placeholder:text-[#a2abb8] focus:border-[#d56817] transition-colors"
              />
            </div>
          </div>

          {/* Mots de passe */}
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-[0.72rem] font-bold text-[#3d4657] sm:text-[0.75rem]">
                  Mot de passe
                </label>
                <button
                  type="button"
                  onClick={() => setAfficherMdp(!afficherMdp)}
                  className="text-[0.68rem] text-[#d56817] font-semibold hover:underline cursor-pointer"
                >
                  {afficherMdp ? "Masquer" : "Afficher"}
                </button>
              </div>
              <input
                id="password"
                type={afficherMdp ? "text" : "password"}
                required
                value={form.password}
                onChange={handleChange("password")}
                placeholder="••••••••••••"
                className="mt-2 h-11 w-full rounded-[0.6rem] border border-[#f4ddd3] bg-white px-3.5 text-[0.8rem] outline-none placeholder:text-[#a2abb8] focus:border-[#d56817] transition-colors"
              />
            </div>

            <div>
              <label htmlFor="password2" className="block text-[0.72rem] font-bold text-[#3d4657] sm:text-[0.75rem]">
                Confirmer le mot de passe
              </label>
              <input
                id="password2"
                type={afficherMdp ? "text" : "password"}
                required
                value={form.password2}
                onChange={handleChange("password2")}
                placeholder="••••••••••••"
                className="mt-2 h-11 w-full rounded-[0.6rem] border border-[#f4ddd3] bg-white px-3.5 text-[0.8rem] outline-none placeholder:text-[#a2abb8] focus:border-[#d56817] transition-colors"
              />
            </div>
          </div>

          {/* Statut du compte */}
          <div className="mt-6">
            <label className="block text-[0.72rem] font-bold text-[#3d4657] sm:text-[0.75rem]">
              Statut du compte
            </label>
            <div className="mt-2 flex h-[4.35rem] items-center justify-between rounded-[0.7rem] bg-[#f8f9fa] px-4 sm:px-5 border border-gray-100">
              <div>
                <p className="m-0 text-[0.75rem] font-bold text-[#111]">
                  {form.compteActif ? "Compte Actif" : "Compte Inactif"}
                </p>
                <p className="m-0 mt-1 text-[0.6rem] text-[#a1a9b5] sm:text-[0.63rem]">
                  {form.compteActif
                    ? "L'administrateur pourra se connecter immédiatement"
                    : "Le compte sera désactivé à la création"}
                </p>
              </div>
              <button
                type="button"
                onClick={toggleCompteActif}
                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors cursor-pointer ${
                  form.compteActif ? "bg-[#d56817]" : "bg-gray-300"
                }`}
                aria-label="Statut du compte"
              >
                <span
                  className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                    form.compteActif ? "right-1" : "left-1"
                  }`}
                ></span>
              </button>
            </div>
          </div>

          {/* Section Choix des Droits / Permissions Multiples */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <label className="block text-[0.72rem] font-bold uppercase text-[#3d4657] sm:text-[0.75rem]">
                Droits d'accès et Permissions ({toutSelectionne ? "Tous les modules" : `${droitsSelectionnes.length} sélectionné(s)`})
              </label>
              <button
                type="button"
                onClick={handleSelectAllPermissions}
                className="text-[0.72rem] font-semibold text-[#d56817] hover:underline cursor-pointer"
              >
                {toutSelectionne ? "Désélectionner Tout" : "Accorder Tout (Superadmin)"}
              </button>
            </div>

            <p className="mt-1 text-[0.68rem] text-[#8892a0]">
              Cochez les modules auxquels cet administrateur doit avoir accès. Vous pouvez en sélectionner plusieurs.
            </p>

            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {PERMISSION_OPTIONS.map((opt) => {
                const estCoche = toutSelectionne || droitsSelectionnes.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => togglePermission(opt.value)}
                    className={`flex items-start gap-2.5 p-3 rounded-[0.7rem] border text-left transition-all cursor-pointer ${
                      estCoche
                        ? "bg-[#fff7f2] border-[#d56817] shadow-xs"
                        : "bg-[#fbfcfd] border-[#e8ecf1] hover:border-[#d56817]/40 hover:bg-white"
                    }`}
                  >
                    <div
                      className={`mt-0.5 w-4 h-4 rounded-[4px] border flex items-center justify-center shrink-0 transition-colors ${
                        estCoche ? "bg-[#d56817] border-[#d56817] text-white" : "border-[#ccc] bg-white"
                      }`}
                    >
                      {estCoche && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className={`m-0 text-[0.78rem] font-semibold leading-tight ${estCoche ? "text-[#d56817]" : "text-[#2d3748]"}`}>
                        {opt.label}
                      </p>
                      <p className="m-0 mt-0.5 text-[0.63rem] text-[#8f9aa8] line-clamp-1">
                        {opt.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8 border-t border-[#f0e2dc]"></div>

          {/* Boutons d'action */}
          <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate("/parametres")}
              disabled={chargement}
              className="h-12 rounded-[0.65rem] border border-[#dfe3e8] bg-white px-7 text-[0.8rem] font-bold text-[#596476] shadow-sm hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={chargement}
              className="h-12 rounded-[0.65rem] bg-black px-8 text-[0.8rem] font-bold text-white shadow-[0_0.35rem_0.7rem_rgba(0,0,0,.15)] hover:bg-[#222] transition-colors cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {chargement ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Création en cours…
                </>
              ) : (
                "Créer l'Administrateur"
              )}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default FormAjoutAdmin;
