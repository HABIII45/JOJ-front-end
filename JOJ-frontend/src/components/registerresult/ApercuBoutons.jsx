import { useState } from "react";
import { useNavigate } from "react-router-dom";
import avantage from "../../assets/images/avantage.svg";

function ApercuBoutons({ modeEdition = false, epreuve, statut, ongletActif, donneesIndividuel, donneesCollectif }) {
  const navigate = useNavigate();
  const [succes,  setSucces]  = useState(false);
  const [erreur,  setErreur]  = useState("");

  const handleSoumettre = () => {
    // Validation minimale
    if (!epreuve) {
      setErreur("Veuillez sélectionner une épreuve.");
      return;
    }
    if (!statut) {
      setErreur("Veuillez choisir un statut.");
      return;
    }

    // Résumé des données (console pour l'instant — à brancher sur une API)
    const donnees = {
      epreuve,
      statut,
      type: ongletActif,
      resultats: ongletActif === "individuel" ? donneesIndividuel : donneesCollectif,
    };
    console.log(modeEdition ? "Modification enregistrée :" : "Publication :", donnees);

    setErreur("");
    setSucces(true);

    // Retour vers /resultats après 1.2 s
    setTimeout(() => navigate("/resultats"), 1200);
  };

  return (
    <div className="w-[373px]">
      {/* Aperçu recommandé */}
      <div className="bg-white h-[13rem] rounded-3xl border border-gray-100 shadow-sm p-3 mb-6">
        <div className="text-xs font-medium text-gray-500 tracking-[0.60px] mb-4">
          APERÇU RECOMMANDÉ
        </div>
        <div className="h-[120px] bg-gray-200 rounded-xl overflow-hidden">
          <img src={avantage} alt="aperçu" className="w-full h-full object-cover rounded-xl" />
        </div>
      </div>

      {/* Message d'erreur */}
      {erreur && (
        <p className="mb-3 text-sm text-red-500 font-medium">{erreur}</p>
      )}

      {/* Message de succès */}
      {succes && (
        <p className="mb-3 text-sm text-green-600 font-medium">
          {modeEdition ? "Modifications enregistrées !" : "Résultats publiés !"} Redirection…
        </p>
      )}

      {/* Boutons */}
      <div className="flex gap-4">
        {/* Annuler — retour vers /resultats sans enregistrer */}
        <button
          onClick={() => navigate("/resultats")}
          className="px-8 py-3 bg-white rounded-xl border-2 border-[#c85f18] cursor-pointer hover:bg-orange-50 transition-colors"
        >
          <span className="text-[#c85f18] font-medium text-base tracking-[0.27px]">
            Annuler
          </span>
        </button>

        {/* Modifier / Publier */}
        <button
          onClick={handleSoumettre}
          disabled={succes}
          className="px-8 py-3.5 bg-[#c85f18] rounded-xl cursor-pointer hover:bg-[#b35216] transition-colors disabled:opacity-60"
        >
          <span className="text-white font-medium text-base tracking-[0.02px]">
            {modeEdition ? "Modifier" : "Publier les résultats"}
          </span>
        </button>
      </div>
    </div>
  );
}

export default ApercuBoutons;
