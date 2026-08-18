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
  const [ongletActif, setOngletActif] = useState("individuel");
  const [searchParams] = useSearchParams();
  const modeEdition = searchParams.get("mode") === "edition";

  // État partagé remontés ici pour que ApercuBoutons puisse les lire
  const [epreuve, setEpreuve] = useState("");
  const [statut,  setStatut]  = useState(modeEdition ? "publie" : "");

  // Référence vers les données de saisie (participants ou matchs)
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
              <EpreuveSelectionnee
                ongletActif={ongletActif}
                modeEdition={modeEdition}
                epreuve={epreuve}
                setEpreuve={setEpreuve}
                statut={statut}
                setStatut={setStatut}
              />

              {ongletActif === "individuel" ? (
                <SaisieIndividuel onDonneesChange={setDonneesIndividuel} />
              ) : (
                <SaisieCollectif onDonneesChange={setDonneesCollectif} />
              )}
            </div>

            <ApercuBoutons
              modeEdition={modeEdition}
              epreuve={epreuve}
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
