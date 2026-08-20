import { useEffect, useState, useCallback } from "react";
import api from "../api/api";
import { fetchEvenements, fetchResultats } from "../api/resultats";
import { fetchProfil } from "../api/auth";

function libelleIlYa(dateISO) {
  if (!dateISO) return "Aujourd'hui";
  const diffMin = Math.floor((Date.now() - new Date(dateISO).getTime()) / 60000);
  if (isNaN(diffMin) || diffMin < 0) return "À venir";
  if (diffMin < 1) return "À l'instant";
  if (diffMin < 60) return `Il y a ${diffMin} min`;
  const heures = Math.floor(diffMin / 60);
  if (heures < 24) return `Il y a ${heures} h`;
  const jours = Math.floor(heures / 24);
  return `Il y a ${jours} j`;
}

const NOMS_MOIS = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sept", "Oct", "Nov", "Déc"];

export function useAdminData() {
  const [data, setData] = useState({
    chargement: true,
    kpi: {
      totalEvenements: 0,
      variationEvenements: "0",
      revenusBillets: 0,
      variationRevenus: "0 FCFA",
      sitesActifs: 0,
      actualitesPubliees: 0,
    },
    ventes: NOMS_MOIS.map((mois) => ({ mois, montant: 0 })),
    activites: [],
    toutesActivites: [],
    utilisateur: null,
    source: "backend_reel",
  });

  const chargerDonnees = useCallback(async () => {
    try {
      // Chargement direct des entités depuis la base de données Django
      const [
        profilRes,
        evenementsRes,
        resultatsRes,
        sitesRes,
        actualitesRes,
        ticketsRes,
        paiementsRes,
      ] = await Promise.allSettled([
        fetchProfil(),
        fetchEvenements(true),
        fetchResultats(),
        api.get("/api/sites/").then((r) => r.data),
        api.get("/api/actualites/").then((r) => r.data),
        api.get("/api/tickets/").then((r) => r.data),
        api.get("/api/payments/").then((r) => r.data),
      ]);

      const profil = profilRes.status === "fulfilled" ? profilRes.value : null;
      const evenements = evenementsRes.status === "fulfilled" && Array.isArray(evenementsRes.value) ? evenementsRes.value : [];
      const resultats = resultatsRes.status === "fulfilled" && Array.isArray(resultatsRes.value) ? resultatsRes.value : [];
      
      const sitesBruts = sitesRes.status === "fulfilled" ? sitesRes.value : [];
      const sites = Array.isArray(sitesBruts) ? sitesBruts : sitesBruts?.results ?? [];

      const actBrutes = actualitesRes.status === "fulfilled" ? actualitesRes.value : [];
      const actualites = Array.isArray(actBrutes) ? actBrutes : actBrutes?.results ?? [];

      const ticketsBruts = ticketsRes.status === "fulfilled" ? ticketsRes.value : [];
      let tickets = Array.isArray(ticketsBruts) ? ticketsBruts : ticketsBruts?.results ?? [];

      const paiementsBruts = paiementsRes.status === "fulfilled" ? paiementsRes.value : [];
      let paiements = Array.isArray(paiementsBruts) ? paiementsBruts : paiementsBruts?.results ?? [];

      // Fusion avec les ventes enregistrées
      try {
        const rawBilletsLocaux = localStorage.getItem("joj_tous_les_billets");
        if (rawBilletsLocaux) {
          const parsed = JSON.parse(rawBilletsLocaux);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const idsExistants = new Set(tickets.map((t) => String(t.id || t.code_unique || t.codeUnique)));
            parsed.forEach((bLocal) => {
              const idCle = String(bLocal.id || bLocal.code_unique || bLocal.codeUnique);
              if (!idsExistants.has(idCle)) {
                tickets.push({
                  id: bLocal.id,
                  type_billet: bLocal.categorie || bLocal.type_billet || "STANDARD",
                  prix: bLocal.prix || (bLocal.categorie === "VIP" ? 15000 : 5000),
                  date_commande: bLocal.date_commande || new Date().toISOString(),
                });
                idsExistants.add(idCle);
              }
            });
          }
        }
      } catch (e) {
        console.warn("Lecture billets locaux dashboard:", e);
      }

      // ── 1. Total Événements & Sites Réels ──
      const totalEvenements = evenements.totalCount ?? evenements.length;
      const sitesActifs = typeof sitesBruts?.count === "number" ? sitesBruts.count : sites.length;
      const actualitesPubliees = typeof actBrutes?.count === "number" 
        ? actBrutes.count 
        : (actualites.length > 0 ? actualites.length : resultats.length);

      // ── 2. Calcul Réel des Revenus Billets ──
      let revenusBillets = 0;
      const ventesParMois = {};
      NOMS_MOIS.forEach((m) => { ventesParMois[m] = 0; });

      if (tickets.length > 0) {
        tickets.forEach((t) => {
          let prix = 0;
          if (t.type_billet === "VIP") prix = 15000;
          else if (t.type_billet === "STANDARD") prix = 5000;
          else if (t.prix) prix = Number(t.prix);

          revenusBillets += prix;

          const dStr = t.date_commande || t.created_at;
          if (dStr) {
            const date = new Date(dStr);
            const idxMois = date.getMonth();
            if (idxMois >= 0 && idxMois < 12) {
              ventesParMois[NOMS_MOIS[idxMois]] += prix;
            }
          } else {
            const idxMois = new Date().getMonth();
            ventesParMois[NOMS_MOIS[idxMois]] += prix;
          }
        });
      } else if (paiements.length > 0) {
        paiements.forEach((p) => {
          const montant = Number(p.montant || p.amount || 0);
          revenusBillets += montant;

          if (p.date_creation || p.created_at) {
            const date = new Date(p.date_creation || p.created_at);
            const idxMois = date.getMonth();
            if (idxMois >= 0 && idxMois < 12) {
              ventesParMois[NOMS_MOIS[idxMois]] += montant;
            }
          }
        });
      }

      const ventesArray = NOMS_MOIS.map((mois) => ({
        mois,
        montant: ventesParMois[mois],
      }));

      // ── 3. Activités Récentes & Historique Complet ──
      const toutesActivites = [];

      // Ventes de billets récentes
      tickets.slice(0, 5).forEach((t) => {
        toutesActivites.push({
          id: `ticket-${t.id}`,
          type: "creation",
          titre: `Vente de billet ${t.type_billet || "Standard"}`,
          detail: `Montant : ${Number(t.prix || 5000).toLocaleString("fr-FR")} FCFA`,
          date: t.date_commande || new Date().toISOString(),
          ilYA: libelleIlYa(t.date_commande || new Date().toISOString()),
        });
      });

      // Tous les événements réels
      [...evenements].reverse().forEach((ev) => {
        toutesActivites.push({
          id: `ev-${ev.id}`,
          type: "creation",
          titre: `Événement : ${ev.titre}`,
          detail: `Site : ${ev.site_nom || "Site principal"}${ev.categorie_nom ? ` • ${ev.categorie_nom}` : ""}`,
          date: ev.date || ev.created_at,
          ilYA: libelleIlYa(ev.date || ev.created_at),
        });
      });

      // Tous les résultats réels
      [...resultats].reverse().forEach((res, i) => {
        const nomComp = res.info_competiteur?.nom_complet || "Athlète";
        toutesActivites.push({
          id: `res-${res.id || i}`,
          type: "publication",
          titre: `Résultat enregistré : ${nomComp}`,
          detail: `Score : ${res.score || "—"} • Épreuve #${res.evenement}`,
          date: res.created_at,
          ilYA: "Résultat validé",
        });
      });

      setData({
        chargement: false,
        source: "backend_reel",
        utilisateur: profil,
        kpi: {
          totalEvenements,
          variationEvenements: totalEvenements > 0 ? `${totalEvenements} en base` : "Aucun",
          revenusBillets,
          variationRevenus: revenusBillets > 0 ? `${revenusBillets.toLocaleString("fr-FR")} FCFA` : "0 FCFA",
          sitesActifs,
          actualitesPubliees,
        },
        ventes: ventesArray,
        activites: toutesActivites.slice(0, 5),
        toutesActivites,
      });
    } catch (err) {
      console.error("Erreur chargement données réelles dashboard:", err);
      setData((prev) => ({ ...prev, chargement: false }));
    }
  }, []);

  useEffect(() => {
    chargerDonnees();
  }, [chargerDonnees]);

  return data;
}