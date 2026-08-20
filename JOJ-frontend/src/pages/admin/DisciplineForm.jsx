/**
 * PAGE — AJOUT / MODIFICATION D'UNE DISCIPLINE
 * ==============================================
 */

import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Upload, Link2, Loader2, Accessibility } from "lucide-react";
import toast from "react-hot-toast";
import api, { ENDPOINTS } from "../../api/api";
import AdminLayout from "../../components/layouts/AdminLayout";

const ROUTE_LISTE = "/admin/disciplines";

export default function DisciplineForm() {
  const navigate = useNavigate();
  const { id: idEdition } = useParams();
  const estEdition = Boolean(idEdition);

  const [chargementDiscipline, setChargementDiscipline] = useState(estEdition);
  const [nomDisciplineChargee, setNomDisciplineChargee] = useState("");
  const [envoi, setEnvoi] = useState(false);
  const [nom, setNom] = useState("");
  const [regle, setRegle] = useState("");
  const [accessibilite, setAccessibilite] = useState("");
  const [image, setImage] = useState(null);
  const [imageApercu, setImageApercu] = useState(null);
  const [erreurs, setErreurs] = useState({});
  const inputFichierRef = useRef(null);

  // Chargement de la discipline en mode édition
  useEffect(() => {
    if (!estEdition) {
      setNom("");
      setRegle("");
      setAccessibilite("");
      setImage(null);
      setImageApercu(null);
      setErreurs({});
      setChargementDiscipline(false);
      return;
    }

    let ignore = false;
    setChargementDiscipline(true);

    async function chargerDiscipline() {
      try {
        const urlDetail = `${ENDPOINTS.disciplines.liste}${idEdition}/`;
        const { data } = await api.get(urlDetail);

        if (ignore) return;
        setNom(data.nom || "");
        setRegle(data.regle || "");
        setAccessibilite(data.accessibilite || "");
        setNomDisciplineChargee(data.nom || "");
      } catch {
        if (!ignore) {
          toast.error("Discipline introuvable.");
          navigate(ROUTE_LISTE);
        }
      } finally {
        if (!ignore) setChargementDiscipline(false);
      }
    }

    chargerDiscipline();
    return () => {
      ignore = true;
    };
  }, [estEdition, idEdition, navigate]);

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

  // Construction dynamique des données
  let body;
  if (image) {
    body = new FormData();
    body.append("nom", nom.trim());
    body.append("regle", regle.trim());
    body.append("accessibilite", accessibilite.trim());
    body.append("image", image);
  } else {
    body = {
      nom: nom.trim(),
      regle: regle.trim(),
      accessibilite: accessibilite.trim(),
      // 'actif' a été retiré car non déclaré dans le composant
    };
  }

  try {
    const baseUrl = ENDPOINTS.disciplines.liste.replace(/\/$/, "");

    if (estEdition) {
      const urlDetail = `${baseUrl}/${idEdition}/`;
      await api.patch(urlDetail, body);
    } else {
      await api.post(ENDPOINTS.disciplines.creer, body);
    }

    toast.success(
      estEdition
        ? `Discipline « ${nom.trim()} » modifiée.`
        : `Discipline « ${nom.trim()} » enregistrée.`
    );
    navigate(ROUTE_LISTE);
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
    <AdminLayout>
      <div className="min-h-screen bg-[#F8FAFC] -m-6 p-6 md:p-10">
        <div className="max-w-3xl mx-auto">
          {/* Bouton retour */}
          <button
            onClick={() => navigate(ROUTE_LISTE)}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-[#D96B27] transition-colors mb-5"
          >
            <ChevronLeft className="w-4 h-4" />
            Retour aux disciplines
          </button>

          <div className="bg-white rounded-[2rem] border border-gray-100/80 shadow-sm overflow-hidden">
            {/* En-tête */}
            <div className="flex items-center justify-between px-6 md:px-8 py-6 border-b border-gray-100">
              <div>
                <h1 className="font-display text-xl md:text-2xl font-extrabold text-gray-900">
                  {estEdition ? `Modifier : ${nomDisciplineChargee}` : "Nouvelle Discipline"}
                </h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  Renseignez les détails de la discipline olympique pour Dakar 2026.
                </p>
              </div>
            </div>

            {/* Formulaire */}
            <form onSubmit={envoyer} className="p-6 md:p-8 space-y-5">
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
                  {/* Section Image */}
                <div className="rounded-xl border border-gray-200 bg-gray-50/60 p-4">
                  <p className="text-xs font-semibold text-gray-900 mb-2">Icône / Image</p>
                  <button
                    type="button"
                    onClick={() => inputFichierRef.current?.click()}
                    className="w-full rounded-lg border-2 border-dashed border-gray-200 bg-white p-4 flex flex-col items-center justify-center gap-1 hover:border-[#f28c28] transition-colors"
                  >
                    {imageApercu ? (
                      <img
                        src={imageApercu}
                        alt="Aperçu"
                        className="h-16 w-16 object-contain rounded-md"
                      />
                    ) : (
                      <>
                        <Upload className="w-5 h-5 text-gray-400" />
                        <span className="text-xs text-gray-500 font-medium">
                          Charger une image
                        </span>
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
                
              </div>

              

              {/* Actions du pied de page */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => navigate(ROUTE_LISTE)}
                  className="rounded-full border border-gray-200 bg-white px-5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={envoi}
                  className="inline-flex items-center gap-2 rounded-full bg-[#f28c28] px-5 py-2 text-xs font-semibold text-white hover:bg-[#d96b27] transition-colors disabled:opacity-50"
                >
                  {envoi && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {estEdition ? "Enregistrer" : "Créer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}