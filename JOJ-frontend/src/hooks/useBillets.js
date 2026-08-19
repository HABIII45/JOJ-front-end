/**
 * Hook useBillets
 * Gère le chargement des billets depuis le backend Django.
 * Expose : billets, chargement, erreur, recharger
 */
import { useState, useEffect, useCallback } from "react";
import { fetchBillets } from "../api/billets";

export function useBillets() {
  const [billets,    setBillets]    = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur,     setErreur]     = useState(null);

  const charger = useCallback(async () => {
    setChargement(true);
    setErreur(null);
    try {
      const data = await fetchBillets();
      setBillets(data);
    } catch (err) {
      console.error("[useBillets] Erreur lors du chargement :", err);
      setErreur(
        err.response?.data?.detail ||
        err.message ||
        "Impossible de charger les billets."
      );
    } finally {
      setChargement(false);
    }
  }, []);

  useEffect(() => {
    charger();
  }, [charger]);

  return { billets, chargement, erreur, recharger: charger };
}
