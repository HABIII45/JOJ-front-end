import { useEffect, useRef, useState } from "react";
import { Upload, Link2, Loader2, Accessibility, X } from "lucide-react";
import toast from "react-hot-toast";
import apiClient, { isBackendConnected } from "../../lib/api";

export default function DisciplineModal({ discipline, isOpen, onClose, onSuccess }) {
  const estEdition = Boolean(discipline?.id);

  const [envoi, setEnvoi] = useState(false);
  const [nom, setNom] = useState("");
  const [regle, setRegle] = useState("");
  const [accessibilite, setAccessibilite] = useState("");
  const [lienLocalisation, setLienLocalisation] = useState("");
  const [image, setImage] = useState(null);
  const [imageApercu, setImageApercu] = useState(null);
  const [active, setActive] = useState(true);
  const [erreurs, setErreurs] = useState({});
  const inputFichierRef = useRef(null);

  // Synchronisation des champs à l'ouverture de la modal
  useEffect(() => {
    if (discipline) {
      setNom(discipline.nom || "");
      setRegle(discipline.regle || "");
      setAccessibilite(discipline.accessibilite || "");
      setActive(discipline.actif ?? true);
    } else {
      setNom("");
      setRegle("");
      setAccessibilite("");
      setLienLocalisation("");
      setImage(null);
      setImageApercu(null);
      setActive(true);
    }
    setErreurs({});
  }, [discipline, isOpen]);

  if (!isOpen) return null;

  const choisirImage = (fichier) => {
    if (!fichier) return;
    if (!["image/svg+xml", "image/png", "image/jpeg"].includes(fichier.type)) {
      toast.error("Format non accepté : SVG, PNG ou JPG uniquement");
      return;
    }
    if (fichier.size > 5 * 1024 * 1024) {
      toast.error("Fichier trop volumineux (max. 5 Mo)");
      return;
    }
    setImage(fichier);
    setImageApercu(URL.createObjectURL(fichier));
  };

  const valider = () => {
    const nouvellesErreurs = {};
    const nomNettoye = nom.trim();

    if (!nomNettoye) {
      nouvellesErreurs.nom = ["Le nom de la discipline ne peut pas être vide."];
    } else if (nomNettoye.length < 2 || nomNettoye.length > 100) {
      nouvellesErreurs.nom = ["Le nom doit contenir entre 2 et 100 caractères."];
    }

    setErreurs(nouvellesErreurs);
    return Object.keys(nouvellesErreurs).length === 0;
  };

  const envoyer = async (e) => {
    e.preventDefault();
    if (!valider()) {
      toast.error("Veuillez corriger les erreurs du formulaire.");
      return;
    }
    setEnvoi(true);

    const payload = {
      nom: nom.trim(),
      regle: regle.trim(),
      accessibilite: accessibilite.trim(),
    };

    try {
      if (isBackendConnected()) {
        if (estEdition) {
          await apiClient.patch(`/api/disciplines/${discipline.id}/`, payload);
        } else {
          await apiClient.post("/api/disciplines/", payload);
        }
      }
      toast.success(
        estEdition
          ? `Discipline « ${nom.trim()} » modifiée.`
          : `Discipline « ${nom.trim()} » enregistrée.`
      );
      onSuccess();
      onClose();
    } catch (erreur) {
      const reponse = erreur?.response;
      if (reponse && reponse.data) {
        setErreurs(reponse.data);
        const premierChamp = Object.keys(reponse.data)[0];
        const premierMessage = Array.isArray(reponse.data[premierChamp])
          ? reponse.data[premierChamp][0]
          : String(reponse.data[premierChamp]);
        toast.error(premierMessage);
      } else {
        toast.error("Impossible d'enregistrer la discipline.");
      }
    } finally {
      setEnvoi(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden my-8 border border-gray-100">
        
        {/* En-tête Modal */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="font-display text-xl font-extrabold text-gray-900">
              {estEdition ? `Modifier : ${discipline?.nom}` : "Nouvelle Discipline"}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Renseignez les détails de la discipline olympique pour Dakar 2026.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corps du Formulaire */}
        <form onSubmit={envoyer} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          <div>
            <label htmlFor="nom" className="block text-xs font-semibold text-gray-900 mb-1">
              Nom de la discipline
            </label>
            <input
              id="nom"
              type="text"
              value={nom}
              onChange={(e) => {
                setNom(e.target.value);
                setErreurs((prev) => ({ ...prev, nom: undefined }));
              }}
              placeholder="Ex: Athlétisme, Natation..."
              className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm outline-none transition-shadow focus:ring-2 focus:ring-[#f28c28]/30 ${
                erreurs.nom ? "border-red-300" : "border-gray-200 focus:border-[#f28c28]"
              }`}
            />
            {erreurs.nom && (
              <p className="text-red-600 text-xs mt-1">
                {Array.isArray(erreurs.nom) ? erreurs.nom.join(" ") : String(erreurs.nom)}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="regle" className="block text-xs font-semibold text-gray-900 mb-1">
              Règles de l'événement
            </label>
            <textarea
              id="regle"
              value={regle}
              onChange={(e) => setRegle(e.target.value)}
              placeholder="Décrivez le déroulement de l'épreuve..."
              rows={3}
              className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[#f28c28] focus:ring-2 focus:ring-[#f28c28]/30 resize-y"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-gray-200 bg-gray-50/60 p-4">
              <div className="flex items-center gap-2 mb-1">
                <Accessibility className="w-4 h-4 text-gray-500" />
                <p className="text-xs font-semibold text-gray-900">Accessibilité</p>
              </div>
              <textarea
                value={accessibilite}
                onChange={(e) => setAccessibilite(e.target.value)}
                rows={2}
                placeholder="Ex: Accès PMR garanti..."
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs outline-none focus:border-[#f28c28] resize-y"
              />
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50/60 p-4">
              <div className="flex items-center gap-2 mb-1">
                <Link2 className="w-4 h-4 text-[#f28c28]" />
                <p className="text-xs font-semibold text-gray-900">Localisation</p>
              </div>
              <input
                type="url"
                value={lienLocalisation}
                onChange={(e) => setLienLocalisation(e.target.value)}
                placeholder="https://..."
                className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs outline-none focus:border-[#f28c28]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-gray-200 bg-gray-50/60 p-4">
              <p className="text-xs font-semibold text-gray-900 mb-2">Icône / Image</p>
              <button
                type="button"
                onClick={() => inputFichierRef.current?.click()}
                className="w-full rounded-lg border-2 border-dashed border-gray-200 bg-white p-4 flex flex-col items-center gap-1 hover:border-[#f28c28] transition-colors"
              >
                {imageApercu ? (
                  <img src={imageApercu} alt="Aperçu" className="w-16 h-16 object-contain rounded-lg" />
                ) : (
                  <>
                    <Upload className="w-5 h-5 text-[#f28c28]" />
                    <p className="text-xs font-medium text-[#f28c28]">Charger une image</p>
                  </>
                )}
              </button>
              <input
                ref={inputFichierRef}
                type="file"
                accept=".svg,.png,.jpg,.jpeg"
                className="hidden"
                onChange={(e) => choisirImage(e.target.files?.[0])}
              />
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50/60 p-4 flex flex-col justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-900 mb-1">Statut</p>
                <p className="text-[11px] text-gray-400">Visibilité publique immédiate.</p>
              </div>
              <label className="mt-3 inline-flex items-center gap-2 cursor-pointer select-none">
                <span className="text-xs font-medium text-gray-700">
                  {active ? "Active" : "Inactive"}
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={active}
                  onClick={() => setActive((a) => !a)}
                  className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${
                    active ? "bg-[#f28c28]" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                      active ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </label>
            </div>
          </div>

          {/* Pied de la Modal */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-gray-200 bg-white px-5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={envoi}
              className="inline-flex items-center gap-2 rounded-full bg-gray-900 text-white px-5 py-2 text-xs font-semibold hover:bg-gray-800 disabled:opacity-60 transition-colors"
            >
              {envoi && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {estEdition ? "Enregistrer" : "Créer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}