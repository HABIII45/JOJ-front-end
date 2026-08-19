import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { supprimerResultat, fetchEvenements } from "../../api/resultats";

const IconVoir = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
    <circle cx="12" cy="12" r="2.5" />
  </svg>
);

const IconSupprimer = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 7h16" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M6 7l1 14h10l1-14" />
    <path d="M9 7V4h6v3" />
  </svg>
);

const colsGrid = "grid-cols-[2fr_1.3fr_1fr_.6fr]";

/** Formate une date ISO en "12 oct 2026, 14:30" */
function formaterDate(dateStr) {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleString("fr-FR", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

function ListeResultats() {
  const navigate = useNavigate();

  const [resultats,        setResultats]        = useState([]);
  const [evenements,       setEvenements]        = useState([]);
  const [chargement,       setChargement]        = useState(true);
  const [erreur,           setErreur]            = useState("");
  const [filtreEvenement,  setFiltreEvenement]   = useState("");
  const [aSupprimer,       setASupprimer]        = useState(null);
  const [suppressionEnCours, setSuppressionEnCours] = useState(false);
  const [voirTous,         setVoirTous]          = useState(false);

  const charger = useCallback(async () => {
    setChargement(true);
    setErreur("");
    try {
      // Charge en parallèle les résultats et les événements (pour le filtre)
      const [{ data: dataRes }, evts] = await Promise.all([
        api.get("/api/resultats/"),
        fetchEvenements(),
      ]);
      const tous = Array.isArray(dataRes) ? dataRes : dataRes.results ?? [];
      setResultats(tous);
      setEvenements(evts);
    } catch {
      setErreur("Impossible de charger les résultats.");
    } finally {
      setChargement(false);
    }
  }, []);

  useEffect(() => { charger(); }, [charger]);

  /* ── Filtrage ── */
  const affichees = resultats.filter((r) => {
    if (filtreEvenement === "") return true;
    return String(r.evenement) === String(filtreEvenement);
  });

  const aAfficher = voirTous ? affichees : affichees.slice(0, 10);

  /* ── Suppression réelle en base ── */
  const confirmerSuppression = async () => {
    setSuppressionEnCours(true);
    try {
      await supprimerResultat(aSupprimer);
      setResultats((prev) => prev.filter((r) => r.id !== aSupprimer));
    } catch (err) {
      setErreur(
        err?.response?.data?.detail ?? "Échec de la suppression. Veuillez réessayer."
      );
    } finally {
      setSuppressionEnCours(false);
      setASupprimer(null);
    }
  };

  /** Nom de l'événement depuis son ID */
  const nomEvenement = (evenementId) => {
    const ev = evenements.find((e) => String(e.id) === String(evenementId));
    return ev?.titre ?? `Épreuve #${evenementId}`;
  };

  /** Nom du compétiteur depuis info_competiteur */
  const nomCompetiteur = (r) => r.info_competiteur?.nom_complet ?? "—";

  return (
    <>
      <section className="mt-[22px] bg-white border border-[#e1e4e7] rounded-[21px] overflow-hidden">

        {/* En-tête */}
        <div className="h-[64px] px-[27px] flex items-center justify-between">
          <h2 className="text-[18px] font-semibold text-[#15171a]">
            Liste des Résultats
            {!chargement && (
              <span className="ml-2 text-[14px] font-normal text-[#9ca3af]">
                ({affichees.length})
              </span>
            )}
          </h2>

          <div className="flex items-center gap-[8px]">
            {/* Filtre par événement */}
            <select
              value={filtreEvenement}
              onChange={(e) => setFiltreEvenement(e.target.value)}
              disabled={chargement}
              className="h-[32px] px-[11px] rounded-[6px] border border-[#e5e7eb] bg-[#fafbfc] text-[13px] text-[#4b5563] outline-none cursor-pointer disabled:opacity-60"
            >
              <option value="">Par événement</option>
              {evenements.map((ev) => (
                <option key={ev.id} value={ev.id}>{ev.titre}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Header colonnes */}
        <div className={`h-[44px] bg-[#fafbfc] border-y border-[#edf0f2] grid ${colsGrid} items-center px-[27px] text-[13px] font-medium text-[#727a86]`}>
          <span>Événement</span>
          <span>Compétiteur</span>
          <span>Score</span>
          <span>Actions</span>
        </div>

        {/* État chargement */}
        {chargement && (
          <div className="h-[80px] flex items-center justify-center text-[14px] text-[#9ca3af]">
            Chargement…
          </div>
        )}

        {/* Erreur */}
        {!chargement && erreur && (
          <div className="h-[62px] flex items-center justify-center gap-4">
            <span className="text-[14px] text-red-500">{erreur}</span>
            <button onClick={charger} className="text-[13px] text-[#d96814] hover:underline">
              Réessayer
            </button>
          </div>
        )}

        {/* Aucun résultat */}
        {!chargement && !erreur && affichees.length === 0 && (
          <div className="h-[62px] flex items-center justify-center text-[14px] text-[#9ca3af]">
            Aucun résultat trouvé
          </div>
        )}

        {/* Lignes */}
        {!chargement && !erreur && aAfficher.map((r) => (
          <div
            key={r.id}
            className={`h-[66px] grid ${colsGrid} items-center px-[27px] border-b border-[#edf0f2]`}
          >
            <div className="min-w-0">
              <p className="text-[15px] text-[#303846] truncate">{nomEvenement(r.evenement)}</p>
            </div>

            <span className="text-[14px] text-[#303846]">{nomCompetiteur(r)}</span>

            <span className="text-[15px] font-semibold text-[#15171a]">{r.score ?? "—"}</span>

            <div className="flex items-center gap-[13px] text-[#9aa2ad]">
              {/* Voir / Éditer */}
              <button
                onClick={() => navigate(`/register-result?id=${r.evenement}&mode=edition`)}
                className="hover:text-[#d96814] transition-colors"
                title="Voir / Modifier l'épreuve"
              >
                <IconVoir />
              </button>
              {/* Supprimer */}
              <button
                onClick={() => setASupprimer(r.id)}
                className="hover:text-red-500 transition-colors"
                title="Supprimer ce résultat"
              >
                <IconSupprimer />
              </button>
            </div>
          </div>
        ))}

        {/* Footer — voir tous / réduire */}
        {!chargement && !erreur && affichees.length > 10 && (
          <div className="h-[52px] flex items-center justify-center">
            <button
              onClick={() => setVoirTous((v) => !v)}
              className="text-[15px] font-medium text-[#d96814] hover:underline"
            >
              {voirTous
                ? "Réduire la liste"
                : `Voir tous les résultats (${affichees.length})`}
            </button>
          </div>
        )}

        {/* Footer vide pour garder la hauteur */}
        {(!chargement && !erreur && affichees.length <= 10) && (
          <div className="h-[52px]" />
        )}

      </section>

      {/* Modale confirmation suppression */}
      {aSupprimer !== null && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-[360px] shadow-xl">
            <h3 className="text-[18px] font-bold text-[#111214] mb-2">
              Supprimer ce résultat ?
            </h3>
            <p className="text-[14px] text-[#68717e] mb-6">
              Cette action est irréversible. Le résultat sera définitivement supprimé de la base de données.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setASupprimer(null)}
                disabled={suppressionEnCours}
                className="px-5 py-2 rounded-lg border border-[#e5e7eb] text-[14px] text-[#4b5563] hover:bg-gray-50 disabled:opacity-60"
              >
                Annuler
              </button>
              <button
                onClick={confirmerSuppression}
                disabled={suppressionEnCours}
                className="px-5 py-2 rounded-lg bg-red-500 text-white text-[14px] font-semibold hover:bg-red-600 disabled:opacity-60"
              >
                {suppressionEnCours ? "Suppression…" : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ListeResultats;
