/**
 * Contexte d'authentification global
 * Fournit : utilisateur, chargement, connecter(), seDeconnecter()
 * Utilisation : const { utilisateur, connecter, seDeconnecter } = useAuth();
 */
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { connexion, deconnexion, fetchProfil, tokenStorage } from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [utilisateur, setUtilisateur] = useState(null);
  const [chargement,  setChargement]  = useState(true); // vérifie la session au démarrage

  // ── Vérifie si un token valide existe déjà au montage ───────────────────
  useEffect(() => {
    const verifierSession = async () => {
      const token = tokenStorage.getAccess();
      if (!token) { setChargement(false); return; }
      try {
        const profil = await fetchProfil();
        setUtilisateur(profil);
      } catch {
        tokenStorage.supprimer();
      } finally {
        setChargement(false);
      }
    };
    verifierSession();
  }, []);

  // ── Connexion ────────────────────────────────────────────────────────────
  const connecter = useCallback(async (username, password) => {
    await connexion(username, password);
    const profil = await fetchProfil();
    setUtilisateur(profil);
    return profil;
  }, []);

  // ── Déconnexion ──────────────────────────────────────────────────────────
  const seDeconnecter = useCallback(async () => {
    await deconnexion();
    setUtilisateur(null);
  }, []);

  return (
    <AuthContext.Provider value={{ utilisateur, setUtilisateur, chargement, connecter, seDeconnecter }}>
      {children}
    </AuthContext.Provider>
  );
}

/** Hook raccourci */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit être utilisé dans un AuthProvider");
  return ctx;
}
