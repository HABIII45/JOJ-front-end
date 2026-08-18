import { useState } from "react";
import { Sidebar } from "../layout/Sidebar";
import FilAriane from "./FilAriane";
import OngletsBascule from "./OngletsBascule";
import EpreuveSelectionnee from "./EpreuveSelectionnee";
import SaisieIndividuel from "./SaisieIndividuel";
import SaisieCollectif from "./SaisieCollectif";
import ApercuBoutons from "./ApercuBoutons";

function RegisterResult() {
  const [ongletActif, setOngletActif] = useState("individuel");

  return (
    <div className="flex min-h-screen bg-[#f4f4f4]">
      {/* Sidebar fixe */}
      <Sidebar />

      {/* Contenu principal décalé de la largeur du sidebar (240px) */}
      <main className="flex-1 ml-[240px] p-20">
        <div className="max-w-screen-xl mx-auto">
          <FilAriane />

          <OngletsBascule
            ongletActif={ongletActif}
            setOngletActif={setOngletActif}
          />

          <div className="flex gap-8">
            {/* Colonne gauche — min-w-0 empêche le flex de déborder */}
            <div className="flex-1 min-w-0">
              <EpreuveSelectionnee ongletActif={ongletActif} />

              {ongletActif === "individuel" ? (
                <SaisieIndividuel />
              ) : (
                <SaisieCollectif />
              )}
            </div>

            {/* Colonne droite */}
            <ApercuBoutons />
          </div>
        </div>
      </main>
    </div>
  );
}

export default RegisterResult;
