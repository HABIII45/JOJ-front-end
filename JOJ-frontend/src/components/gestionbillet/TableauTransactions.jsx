import React, { useState, useMemo } from "react";
import { Search, Filter, Trash2, Eye, QrCode, X, Ticket } from "lucide-react";
import api from "../../api/api";

const STYLE_STATUT = {
  VALIDE: "bg-emerald-100/60 text-emerald-600 font-bold",
  UTILISE: "bg-blue-100/60 text-blue-600 font-bold",
  EN_ATTENTE: "bg-amber-100/60 text-amber-600 font-bold",
  EXPIRE: "bg-gray-100 text-gray-600 font-bold",
  ANNULE: "bg-rose-100/60 text-rose-600 font-bold",
};

const LIBELLE_STATUT = {
  VALIDE: "Confirmé",
  UTILISE: "Utilisé",
  EN_ATTENTE: "En attente",
  EXPIRE: "Expiré",
  ANNULE: "Annulé",
};

function TableauTransactions({ billets = [], onRafraichir }) {
  const [recherche, setRecherche] = useState("");
  const [filtreStatut, setFiltreStatut] = useState("tous");
  const [billetSelectionne, setBilletSelectionne] = useState(null);

  const billetsFiltres = useMemo(() => {
    return billets.filter((b) => {
      if (filtreStatut !== "tous" && b.statut !== filtreStatut) {
        return false;
      }
      if (recherche.trim()) {
        const q = recherche.toLowerCase().trim();
        const client = (b.spectateur_nom || `${b.spectateur?.prenom ?? ""} ${b.spectateur?.nom ?? ""}`).toLowerCase();
        const ev = (b.evenement_titre || b.evenement?.titre || "").toLowerCase();
        const code = (b.code_unique || "").toLowerCase();
        return client.includes(q) || ev.includes(q) || code.includes(q);
      }
      return true;
    });
  }, [billets, recherche, filtreStatut]);

  const supprimerBillet = async (b) => {
    if (!window.confirm(`Supprimer le billet #${b.id} ? Cette action est irréversible.`)) {
      return;
    }
    try {
      await api.delete(`/api/tickets/${b.id}/`);
      if (onRafraichir) onRafraichir();
    } catch (err) {
      console.error("Erreur suppression billet:", err);
      alert("Erreur lors de la suppression du billet.");
    }
  };

  return (
    <section className="mt-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm overflow-hidden">
      {/* En-tête du tableau */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            Dernières Transactions de Billetterie
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Historique des commandes et réservations ({billetsFiltres.length} affichée{billetsFiltres.length > 1 ? "s" : ""})
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Recherche */}
          <div className="relative w-full sm:w-60">
            <Search size={14} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              placeholder="Rechercher client, code..."
              className="w-full pl-9 pr-3 py-2 bg-[#F8FAFC] rounded-xl border border-transparent focus:border-gray-200 text-xs text-gray-800 outline-none"
            />
          </div>

          {/* Filtre Statut */}
          <select
            value={filtreStatut}
            onChange={(e) => setFiltreStatut(e.target.value)}
            className="px-3 py-2 bg-[#F8FAFC] rounded-xl text-xs font-semibold text-gray-700 outline-none cursor-pointer"
          >
            <option value="tous">Tous statuts</option>
            <option value="VALIDE">Confirmé</option>
            <option value="EN_ATTENTE">En attente</option>
            <option value="UTILISE">Utilisé</option>
            <option value="ANNULE">Annulé</option>
          </select>
        </div>
      </div>

      {/* Tableau */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-gray-100 text-[10px] font-bold uppercase tracking-wider text-gray-400">
              <th className="pb-3 px-3">CLIENT</th>
              <th className="pb-3 px-3">ÉVÉNEMENT</th>
              <th className="pb-3 px-3">CATÉGORIE</th>
              <th className="pb-3 px-3">PRIX</th>
              <th className="pb-3 px-3">DATE COMMANDE</th>
              <th className="pb-3 px-3">STATUT</th>
              <th className="pb-3 px-3 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {billetsFiltres.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-gray-400">
                  <Ticket size={28} className="text-gray-300 mx-auto mb-2" />
                  <p className="font-semibold text-gray-600">Aucune réservation de billet enregistrée</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">Les commandes apparaîtront ici dès les premiers achats.</p>
                </td>
              </tr>
            ) : (
              billetsFiltres.map((b) => {
                const nomClient = b.spectateur_nom || `${b.spectateur?.prenom ?? ""} ${b.spectateur?.nom ?? ""}`.trim() || "Spectateur";
                const titreEv = b.evenement_titre || b.evenement?.titre || `Événement #${b.evenement}`;
                const statut = b.statut || "EN_ATTENTE";
                const prix = b.prix || (b.type_billet === "VIP" ? 15000 : 5000);

                return (
                  <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                    {/* Client */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-orange-50 text-[#C25B1E] flex items-center justify-center font-bold text-[10px] shrink-0 border border-orange-200">
                          {nomClient.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 leading-tight">{nomClient}</p>
                          <p className="text-[10px] text-gray-400">{b.spectateur?.email || `ID #${b.id}`}</p>
                        </div>
                      </div>
                    </td>

                    {/* Événement */}
                    <td className="py-3 px-3 font-semibold text-gray-800">
                      {titreEv}
                    </td>

                    {/* Catégorie */}
                    <td className="py-3 px-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        b.type_billet === "VIP" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-700"
                      }`}>
                        {b.type_billet || "Standard"}
                      </span>
                    </td>

                    {/* Prix */}
                    <td className="py-3 px-3 font-bold text-gray-900">
                      {Number(prix).toLocaleString("fr-FR")} FCFA
                    </td>

                    {/* Date */}
                    <td className="py-3 px-3 text-gray-600">
                      {b.date_commande
                        ? new Date(b.date_commande).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })
                        : "—"}
                    </td>

                    {/* Statut */}
                    <td className="py-3 px-3">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-[9px] uppercase tracking-wider ${
                        STYLE_STATUT[statut] || STYLE_STATUT.EN_ATTENTE
                      }`}>
                        {LIBELLE_STATUT[statut] || statut}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3">
                      <div className="flex items-center justify-end gap-1 text-gray-400">
                        <button
                          onClick={() => setBilletSelectionne(b)}
                          className="p-1 hover:text-gray-700 transition-colors cursor-pointer"
                          title="Détail du billet & QR"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => supprimerBillet(b)}
                          className="p-1 hover:text-red-500 transition-colors cursor-pointer"
                          title="Supprimer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modale de Détail d'un Billet */}
      {billetSelectionne && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-base">
                Détail du Billet #{billetSelectionne.id}
              </h3>
              <button
                onClick={() => setBilletSelectionne(null)}
                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center cursor-pointer"
              >
                <X size={14} />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Titulaire :</span>
                <span className="font-bold text-gray-900">
                  {billetSelectionne.spectateur_nom || `${billetSelectionne.spectateur?.prenom ?? ""} ${billetSelectionne.spectateur?.nom ?? ""}`.trim() || "Spectateur"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Événement :</span>
                <span className="font-bold text-gray-900">
                  {billetSelectionne.evenement_titre || billetSelectionne.evenement?.titre || `Épreuve #${billetSelectionne.evenement}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Type de billet :</span>
                <span className="font-bold text-[#C25B1E]">{billetSelectionne.type_billet || "Standard"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Place / Siège :</span>
                <span className="font-semibold text-gray-800">{billetSelectionne.place || "Tribune générale"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Code Unique (UUID) :</span>
                <span className="font-mono text-[11px] text-gray-600 bg-gray-50 px-2 py-0.5 rounded">
                  {billetSelectionne.code_unique || "—"}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setBilletSelectionne(null)}
                className="px-4 py-2 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default TableauTransactions;
