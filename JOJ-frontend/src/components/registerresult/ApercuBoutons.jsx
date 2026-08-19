import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { publierResultats } from "../../api/resultats";
import avantage from "../../assets/images/avantage.svg";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

/** Construit l'URL absolue d'une image Django (qui peut être relative ou absolue) */
function urlImage(chemin) {
  if (!chemin) return null;
  if (chemin.startsWith("http")) return chemin;
  return `${BASE_URL}${chemin.startsWith("/") ? "" : "/"}${chemin}`;
}

function ApercuBoutons({
  modeEdition = false,
  evenementId,
  evenementObjet,
  statut,
  ongletActif,
  donneesIndividuel,
  donneesCollectif,
}) {
  const navigate = useNavigate();
  const [chargement, setChargement] = useState(false);
  const [succes,     setSucces]     = useState(false);
  const [erreur,     setErreur]     = useState("");

  const handleSoumettre = async () => {
    // ── Validation ──────────────────────────────────────────────────────────
    if (!evenementId) {
      setErreur("Veuillez sélectionner une épreuve.");
      return;
    }
    if (!statut) {
      setErreur("Veuillez choisir un statut.");
      return;
    }

    setChargement(true);
    setErreur("");

    try {
      if (ongletActif === "individuel") {
        // Prépare les lignes : uniquement celles avec un score renseigné
        const lignes = (donneesIndividuel ?? [])
          .filter((p) => p.score?.toString().trim() !== "")
          .map((p) => ({
            competiteurId: p.id,
            score:         p.score,
            resultatId:    p.resultatId ?? null,
          }));

        if (lignes.length === 0) {
          setErreur("Veuillez saisir au moins un score avant de publier.");
          setChargement(false);
          return;
        }

        await publierResultats(evenementId, lignes);

      } else {
        // Mode collectif : chaque équipe dans chaque match est une ligne séparée
        const lignes = (donneesCollectif ?? []).flatMap((m) => [
          {
            competiteurId: m.equipeA.id,
            score:         m.scoreA,
            resultatId:    m.resultatIdA ?? null,
          },
          {
            competiteurId: m.equipeB.id,
            score:         m.scoreB,
            resultatId:    m.resultatIdB ?? null,
          },
        ]);

        if (lignes.length === 0) {
          setErreur("Aucun match à publier.");
          setChargement(false);
          return;
        }

        await publierResultats(evenementId, lignes);
      }

      setSucces(true);
      // Retour vers /resultats après 1.2 s
      setTimeout(() => navigate("/resultats"), 1200);

    } catch (err) {
      const data = err?.response?.data;
      const msg =
        data?.detail                 ||
        data?.non_field_errors?.[0]  ||
        data?.score?.[0]             ||
        "Une erreur est survenue lors de la publication.";
      setErreur(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setChargement(false);
    }
  };

  return (
    <div className="w-[373px]">
      {/* Aperçu recommandé */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-3 mb-6">
        <div className="text-xs font-medium text-gray-500 tracking-[0.60px] mb-2">
          APERÇU RECOMMANDÉ
        </div>

        {/* Titre de l'événement si sélectionné */}
        {evenementObjet && (
          <p className="text-xs font-semibold text-gray-700 truncate mb-2 px-1">
            {evenementObjet.titre}
          </p>
        )}

        <div className="h-[140px] bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
          {urlImage(evenementObjet?.image) ? (
            <img
              src={urlImage(evenementObjet.image)}
              alt={evenementObjet.titre ?? "Aperçu"}
              className="w-full h-full object-cover"
            />
          ) : (
            /* Fallback : image par défaut tant qu'aucun événement n'est sélectionné */
            <img
              src={avantage}
              alt="aperçu"
              className="w-full h-full object-cover"
            />
          )}
        </div>
      </div>

      {/* Message erreur */}
      {erreur && (
        <p className="mb-3 text-sm text-red-500 font-medium">{erreur}</p>
      )}

      {/* Message succès */}
      {succes && (
        <p className="mb-3 text-sm text-green-600 font-medium">
          {modeEdition ? "Modifications enregistrées !" : "Résultats publiés !"} Redirection…
        </p>
      )}

      {/* Résumé de ce qui va être publié */}
      {evenementId && !succes && (
        <div className="mb-4 text-xs text-gray-400 bg-gray-50 rounded-xl px-4 py-3">
          <p className="font-semibold text-gray-600 mb-1">Résumé</p>
          <p>Épreuve : {evenementObjet?.titre ?? `#${evenementId}`}</p>
          <p>
            Participants avec score :{" "}
            {ongletActif === "individuel"
              ? (donneesIndividuel ?? []).filter((p) => p.score?.toString().trim() !== "").length
              : (donneesCollectif ?? []).length * 2}
          </p>
          <p>Statut : {statut || "—"}</p>
        </div>
      )}

      {/* Boutons */}
      <div className="flex gap-4">
        <button
          onClick={() => navigate("/resultats")}
          disabled={chargement}
          className="px-8 py-3 bg-white rounded-xl border-2 border-[#c85f18] cursor-pointer hover:bg-orange-50 transition-colors disabled:opacity-60"
        >
          <span className="text-[#c85f18] font-medium text-base tracking-[0.27px]">
            Annuler
          </span>
        </button>

        <button
          onClick={handleSoumettre}
          disabled={chargement || succes}
          className="px-8 py-3.5 bg-[#c85f18] rounded-xl cursor-pointer hover:bg-[#b35216] transition-colors disabled:opacity-60"
        >
          <span className="text-white font-medium text-base tracking-[0.02px]">
            {chargement
              ? "Publication…"
              : modeEdition
              ? "Modifier"
              : "Publier les résultats"}
          </span>
        </button>
      </div>
    </div>
  );
}

export default ApercuBoutons;
