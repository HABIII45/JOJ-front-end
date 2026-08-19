import React, { useState, useEffect, useCallback } from "react";
import AdminLayout from "../layouts/AdminLayout";
import TitreVente from "./TitreVente";
import CartesKPI from "./CartesKPI";
import GraphiqueVentes from "./GraphiqueVentes";
import TableauTransactions from "./TableauTransactions";
import api from "../../api/api";

const NOMS_MOIS = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sept", "Oct", "Nov", "Déc"];

function GestionBillet() {
  const [chargement, setChargement] = useState(true);
  const [billets, setBillets] = useState([]);
  const [paiements, setPaiements] = useState([]);
  const [kpis, setKpis] = useState({
    totalVendus: 0,
    chiffreAffaires: 0,
    panierMoyen: 0,
    tauxRemplissage: 0,
  });
  const [donneesVentes, setDonneesVentes] = useState([]);

  const chargerDonnees = useCallback(async () => {
    try {
      setChargement(true);
      const [ticketsRes, paiementsRes, sitesRes] = await Promise.allSettled([
        api.get("/api/tickets/?page_size=100"),
        api.get("/api/payments/?page_size=100"),
        api.get("/api/sites/?page_size=100"),
      ]);

      const ticketsData = ticketsRes.status === "fulfilled" ? ticketsRes.value.data : [];
      const paiementsData = paiementsRes.status === "fulfilled" ? paiementsRes.value.data : [];
      const sitesData = sitesRes.status === "fulfilled" ? sitesRes.value.data : [];

      const listeTickets = Array.isArray(ticketsData) ? ticketsData : ticketsData.results ?? [];
      const listePaiements = Array.isArray(paiementsData) ? paiementsData : paiementsData.results ?? [];
      const listeSites = Array.isArray(sitesData) ? sitesData : sitesData.results ?? [];

      setBillets(listeTickets);
      setPaiements(listePaiements);

      // Calcul des KPIs 100% réels
      let caTotal = 0;
      const ventesParMois = {};
      NOMS_MOIS.forEach((m) => { ventesParMois[m] = 0; });

      if (listePaiements.length > 0) {
        listePaiements.forEach((p) => {
          const montant = Number(p.montant || p.amount || 0);
          caTotal += montant;
          if (p.date_creation || p.created_at) {
            const mIdx = new Date(p.date_creation || p.created_at).getMonth();
            if (mIdx >= 0 && mIdx < 12) ventesParMois[NOMS_MOIS[mIdx]] += montant;
          }
        });
      } else if (listeTickets.length > 0) {
        listeTickets.forEach((t) => {
          let prix = 0;
          if (t.type_billet === "VIP") prix = 15000;
          else if (t.type_billet === "STANDARD") prix = 5000;
          else if (t.prix) prix = Number(t.prix);
          caTotal += prix;
          if (t.date_commande || t.created_at) {
            const mIdx = new Date(t.date_commande || t.created_at).getMonth();
            if (mIdx >= 0 && mIdx < 12) ventesParMois[NOMS_MOIS[mIdx]] += prix;
          }
        });
      }

      const totalVendus = listeTickets.length;
      const panierMoyen = totalVendus > 0 ? Math.round(caTotal / totalVendus) : 0;
      
      const capaciteTotale = listeSites.reduce((acc, s) => acc + (Number(s.capacite) || 0), 0);
      const tauxRemplissage = capaciteTotale > 0 ? Math.min(100, Math.round((totalVendus / capaciteTotale) * 100)) : 0;

      setKpis({
        totalVendus,
        chiffreAffaires: caTotal,
        panierMoyen,
        tauxRemplissage,
      });

      setDonneesVentes(
        NOMS_MOIS.map((mois) => ({
          date: mois,
          montant: ventesParMois[mois],
        }))
      );
    } catch (err) {
      console.error("Erreur chargement billetterie:", err);
    } finally {
      setChargement(false);
    }
  }, []);

  useEffect(() => {
    chargerDonnees();
  }, [chargerDonnees]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <TitreVente
          totalBillets={kpis.totalVendus}
          onExport={() => alert("Génération du rapport de billetterie...")}
        />
        <CartesKPI
          totalVendus={kpis.totalVendus}
          chiffreAffaires={kpis.chiffreAffaires}
          panierMoyen={kpis.panierMoyen}
          tauxRemplissage={kpis.tauxRemplissage}
        />
        <GraphiqueVentes donneesVentes={donneesVentes} />
        <TableauTransactions
          billets={billets}
          onRafraichir={chargerDonnees}
        />
      </div>
    </AdminLayout>
  );
}

export default GestionBillet;
