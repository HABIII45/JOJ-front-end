import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Sidebar } from "../layout/Sidebar";
import FilAriane from "./FilAriane";
import OngletsBascule from "./OngletsBascule";
import EpreuveSelectionnee from "./EpreuveSelectionnee";
import SaisieIndividuel from "./SaisieIndividuel";
import SaisieCollectif from "./SaisieCollectif";
import ApercuBoutons from "./ApercuBoutons";

function RegisterResult() {
  const [searchParams] = useSearchParams();
  const modeEdition = searchParams.get("mode") === "edition";

  const [ongletActif, setOngletActif] = useState("individuel");

  // ID de l'événement sélectionné dans le dropdown — partagé avec les enfants
  const [evenementId,     setEvenementId]     = useState("");
  const [evenementObjet,  setEvenementObjet]  = useState(null); // objet complet { id, titre, image, … }
  const [statut,          setStatut]          = useState(modeEdition ? "publie" : "");

  // Données de saisie remontées par les composants enfants
  const [donneesIndividuel, setDonneesIndividuel] = useState(null);
  const [donneesCollectif,  setDonneesCollectif]  = useState(null);

  return (
    <div className="flex min-h-screen bg-[#f4f4f4]">
      <Sidebar />

      <main className="flex-1 ml-[240px] p-20">
        <div className="max-w-screen-xl mx-auto">
          <FilAriane modeEdition={modeEdition} />

          <OngletsBascule
            ongletActif={ongletActif}
            setOngletActif={setOngletActif}
          />

          <div className="flex gap-8">
            <div className="flex-1 min-w-0">
              {/* Sélection de l'épreuve — contrôlée par evenementId */}
              <EpreuveSelectionnee
                ongletActif={ongletActif}
                modeEdition={modeEdition}
                evenementId={evenementId}
                setEvenementId={setEvenementId}
                setEvenementObjet={setEvenementObjet}
                statut={statut}
                setStatut={setStatut}
              />

              {/* Saisie : individuel ou collectif — reçoit l'evenementId pour pré-charger les résultats existants */}
              {ongletActif === "individuel" ? (
                <SaisieIndividuel
                  evenementId={evenementId}
                  onDonneesChange={setDonneesIndividuel}
                />
              ) : (
                <SaisieCollectif
                  evenementId={evenementId}
                  onDonneesChange={setDonneesCollectif}
                />
              )}
            </div>

            {/* Panneau droite : résumé + boutons de publication */}
            <ApercuBoutons
              modeEdition={modeEdition}
              evenementId={evenementId}
              evenementObjet={evenementObjet}
              statut={statut}
              ongletActif={ongletActif}
              donneesIndividuel={donneesIndividuel}
              donneesCollectif={donneesCollectif}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default RegisterResult;
