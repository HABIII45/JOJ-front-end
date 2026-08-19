import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { updateProfil, uploadAvatar } from "../../api/auth";

function ProfilAdmin() {
  const { utilisateur, setUtilisateur } = useAuth();
  const inputFichierRef = useRef(null);

  const [form, setForm] = useState({
    nom:         "",
    email:       "",
    role:        "",
    departement: "",
  });

  // Preview locale (blob URL) — null = pas de changement, on affiche l'avatar du backend
  const [previewLocale,    setPreviewLocale]    = useState(null);
  const [fichierAvatar,    setFichierAvatar]    = useState(null);
  const [uploadEnCours,    setUploadEnCours]    = useState(false);
  const [erreurAvatar,     setErreurAvatar]     = useState("");

  const [chargement, setChargement] = useState(false);
  const [erreur,     setErreur]     = useState("");
  const [succes,     setSucces]     = useState(false);

  // Synchronise le formulaire quand l'utilisateur est chargé depuis le backend
  useEffect(() => {
    if (utilisateur) {
      setForm({
        nom:         utilisateur.nom_complet ?? utilisateur.username ?? "",
        email:       utilisateur.email       ?? "",
        role:        utilisateur.role        ?? (utilisateur.is_staff ? "Administrateur" : "Utilisateur"),
        departement: utilisateur.departement ?? "",
      });
    }
  }, [utilisateur]);

  // Nettoyage du blob URL pour éviter les fuites mémoire
  useEffect(() => {
    return () => {
      if (previewLocale) URL.revokeObjectURL(previewLocale);
    };
  }, [previewLocale]);

  /* ── Gestion du champ texte ── */
  const handleChange = (champ) => (e) => {
    setForm((prev) => ({ ...prev, [champ]: e.target.value }));
    setErreur("");
    setSucces(false);
  };

  /* ── Sélection d'un fichier image ── */
  const handleFichierChange = (e) => {
    const fichier = e.target.files?.[0];
    if (!fichier) return;

    // Validation côté client
    const typesAcceptes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!typesAcceptes.includes(fichier.type)) {
      setErreurAvatar("Format non supporté. Utilisez JPG, PNG, WEBP ou GIF.");
      return;
    }
    if (fichier.size > 5 * 1024 * 1024) {
      setErreurAvatar("La photo ne doit pas dépasser 5 Mo.");
      return;
    }

    setErreurAvatar("");
    setFichierAvatar(fichier);

    // Preview immédiate sans attendre le backend
    if (previewLocale) URL.revokeObjectURL(previewLocale);
    setPreviewLocale(URL.createObjectURL(fichier));
  };

  /* ── Upload immédiat dès la sélection du fichier ── */
  useEffect(() => {
    if (!fichierAvatar) return;

    const envoyer = async () => {
      setUploadEnCours(true);
      setErreurAvatar("");
      try {
        const profilMaj = await uploadAvatar(fichierAvatar);
        setUtilisateur(profilMaj);
        // La preview locale reste affichée ; on efface le fichier en attente
        setFichierAvatar(null);
      } catch (err) {
        const msg =
          err?.response?.data?.avatar?.[0] ||
          err?.response?.data?.detail ||
          "Échec de l'upload. Veuillez réessayer.";
        setErreurAvatar(msg);
        // Annule la preview si l'upload échoue
        setPreviewLocale(null);
        setFichierAvatar(null);
      } finally {
        setUploadEnCours(false);
      }
    };

    envoyer();
  }, [fichierAvatar, setUtilisateur]);

  /* ── Sauvegarde du profil texte ── */
  const handleSauvegarder = async (e) => {
    e.preventDefault();
    setChargement(true);
    setErreur("");
    setSucces(false);
    try {
      const profilMaj = await updateProfil({
        nom_complet:  form.nom,
        email:        form.email,
        departement:  form.departement,
      });
      setUtilisateur(profilMaj);
      setSucces(true);
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.non_field_errors?.[0] ||
        "Une erreur est survenue. Veuillez réessayer.";
      setErreur(msg);
    } finally {
      setChargement(false);
    }
  };

  /* ── Avatar affiché : preview locale > avatar backend > initiales ── */
  const avatarAffiche = previewLocale
    ?? utilisateur?.avatar
    ?? utilisateur?.photo
    ?? null;

  const initiales = form.nom
    ? form.nom.split(" ").map((m) => m[0]).slice(0, 2).join("").toUpperCase()
    : "A";

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

            {/* ── Zone photo ── */}
            <div className="w-[103px] shrink-0 flex flex-col items-center pt-[1px] gap-[6px]">
              <div className="relative">
                {/* Cercle avatar */}
                <div className="w-[75px] h-[75px] rounded-full border-[2px] border-[#e66a18] bg-white p-[2px] flex items-center justify-center overflow-hidden">
                  {avatarAffiche ? (
                    <img
                      src={avatarAffiche}
                      className="w-full h-full rounded-full object-cover"
                      alt={form.nom}
                    />
                  ) : (
                    <span className="text-xl font-bold text-[#d96814]">{initiales}</span>
                  )}

                  {/* Overlay de chargement pendant l'upload */}
                  {uploadEnCours && (
                    <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
                      <svg className="animate-spin" width="22" height="22" viewBox="0 0 24 24"
                        fill="none" stroke="white" strokeWidth="2.5">
                        <path d="M12 2v4" strokeLinecap="round" />
                        <path d="M12 18v4" strokeLinecap="round" opacity=".4" />
                        <path d="M4.93 4.93l2.83 2.83" strokeLinecap="round" opacity=".7" />
                        <path d="M16.24 16.24l2.83 2.83" strokeLinecap="round" opacity=".2" />
                        <path d="M2 12h4" strokeLinecap="round" opacity=".9" />
                        <path d="M18 12h4" strokeLinecap="round" opacity=".3" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Bouton appareil photo */}
                <button
                  type="button"
                  onClick={() => inputFichierRef.current?.click()}
                  disabled={uploadEnCours}
                  title="Changer la photo"
                  className="absolute right-[-3px] bottom-[-2px] w-[23px] h-[23px] rounded-full bg-[#d96814] border-[2px] border-white flex items-center justify-center cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed hover:bg-[#b85610] transition-colors"
                >
                  <svg width="11" height="11" viewBox="0 0 24 24"
                    fill="none" stroke="white" strokeWidth="2">
                    <path d="M4 7h3l2-2h6l2 2h3v11H4z" />
                    <circle cx="12" cy="13" r="3" />
                  </svg>
                </button>
              </div>

              {/* Input fichier caché */}
              <input
                ref={inputFichierRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={handleFichierChange}
              />

              {/* Erreur avatar */}
              {erreurAvatar && (
                <p className="text-[10px] text-red-500 text-center leading-tight mt-[2px]">
                  {erreurAvatar}
                </p>
              )}
            </div>

            {/* ── Champs texte ── */}
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

          {/* Messages feedback formulaire */}
          {erreur && (
            <p className="mt-[10px] text-xs text-red-500 font-medium text-center">{erreur}</p>
          )}
          {succes && (
            <p className="mt-[10px] text-xs text-green-600 font-medium text-center">
              Profil mis à jour avec succès.
            </p>
          )}

          <div className="flex justify-center mt-[24px]">
            <button
              type="submit"
              disabled={chargement || uploadEnCours}
              className="w-[211px] cursor-pointer h-[40px] rounded-[7px] bg-black text-white text-sm font-medium shadow-[0_2px_4px_rgba(0,0,0,.2)] hover:bg-[#222] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {chargement ? "Sauvegarde…" : "Sauvegarder les modifications"}
            </button>
          </div>
        </form>

      </div>
    </section>
  );
}

export default ProfilAdmin;
