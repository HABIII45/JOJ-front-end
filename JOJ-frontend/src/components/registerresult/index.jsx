import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Sidebar } from "../layout/Sidebar";
import FilAriane from "./FilAriane";
import OngletsBascule from "./OngletsBascule";
import EpreuveSelectionnee from "./EpreuveSelectionnee";
import SaisieIndividuel from "./SaisieIndividuel";
import SaisieCollectif from "./SaisieCollectif";
import ApercuBoutons from "./ApercuBoutons";
import { fetchEvenement } from "../../api/resultats";

function RegisterResult() {
  const [searchParams] = useSearchParams();
  const idParam = searchParams.get("id");
  const modeEdition = searchParams.get("mode") === "edition";

  const [ongletActif, setOngletActif] = useState("individuel");

  // Épreuve & Catégorie
  const [evenementId,     setEvenementId]     = useState(idParam || "");
  const [categorieId,     setCategorieId]     = useState("");
  const [evenementObjet,  setEvenementObjet]  = useState(null);
  const [statut,          setStatut]          = useState(modeEdition ? "publie" : "brouillon");

  // Données de saisie
  const [donneesIndividuel, setDonneesIndividuel] = useState([]);
  const [donneesCollectif,  setDonneesCollectif]  = useState([]);

  // Si un paramètre d'URL est fourni, précharge l'événement et sa catégorie
  useEffect(() => {
    if (idParam) {
      setEvenementId(idParam);
      fetchEvenement(idParam)
        .then((ev) => {
          setEvenementObjet(ev);
          if (ev?.categorie) {
            const catId = typeof ev.categorie === "object" ? ev.categorie.id : ev.categorie;
            setCategorieId(String(catId));
          }
        })
        .catch(() => {});
    }
  }, [idParam]);

  return (
    <div className="flex min-h-screen bg-[#f4f4f4]">
      <Sidebar />

      <main className="flex-1 ml-[240px] p-10 lg:p-14">
        <div className="max-w-screen-xl mx-auto">
          <FilAriane modeEdition={modeEdition} />

          <OngletsBascule
            ongletActif={ongletActif}
            setOngletActif={setOngletActif}
          />

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 min-w-0">
              {/* Sélection épreuve & catégorie */}
              <EpreuveSelectionnee
                ongletActif={ongletActif}
                modeEdition={modeEdition}
                evenementId={evenementId}
                setEvenementId={setEvenementId}
                categorieId={categorieId}
                setCategorieId={setCategorieId}
                setEvenementObjet={setEvenementObjet}
                statut={statut}
                setStatut={setStatut}
              />

              {/* Saisie des joueurs / équipes — visible uniquement si les deux sont sélectionnés */}
              {ongletActif === "individuel" ? (
                <SaisieIndividuel
                  evenementId={evenementId}
                  categorieId={categorieId}
                  onDonneesChange={setDonneesIndividuel}
                />
              ) : (
                <SaisieCollectif
                  evenementId={evenementId}
                  categorieId={categorieId}
                  onDonneesChange={setDonneesCollectif}
                />
              )}
            </div>

            {/* Panneau droite : aperçu & publication */}
            <div className="w-full lg:w-[360px] shrink-0">
              <ApercuBoutons
                modeEdition={modeEdition}
                evenementId={evenementId}
                categorieId={categorieId}
                evenementObjet={evenementObjet}
                statut={statut}
                ongletActif={ongletActif}
                donneesIndividuel={donneesIndividuel}
                donneesCollectif={donneesCollectif}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default RegisterResult;
