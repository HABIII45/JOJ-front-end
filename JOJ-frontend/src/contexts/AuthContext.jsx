/**
 * Contexte d'authentification global
 * Fournit : utilisateur, setUtilisateur, chargement, connecter(), seDeconnecter()
 *
 * NOTE Vite Fast Refresh : ce fichier n'exporte que AuthProvider (composant).
 * Le hook useAuth est dans ./useAuth.js pour éviter le warning HMR.
 */
import { createContext, useState, useEffect, useCallback } from "react";
import { connexion, deconnexion, fetchProfil, tokenStorage } from "../api/auth";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [utilisateur, setUtilisateur] = useState(null);
  const [chargement,  setChargement]  = useState(true);

  // Vérifie si un token valide existe au montage
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

  const connecter = useCallback(async (username, password) => {
    await connexion(username, password);
    const profil = await fetchProfil();
    console.log(profil)
    setUtilisateur(profil);
    return profil;
  }, []);

  const seDeconnecter = useCallback(async () => {
    await deconnexion();
    setUtilisateur(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ utilisateur, setUtilisateur, chargement, connecter, seDeconnecter }}
    >
      {children}
    </AuthContext.Provider>
  );
}
