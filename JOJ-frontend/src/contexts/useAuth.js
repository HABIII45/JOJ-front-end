/**
 * Hook useAuth — séparé d'AuthContext.jsx pour la compatibilité
 * Vite Fast Refresh (un fichier ne peut pas mélanger composants et hooks).
 *
 * Usage : import { useAuth } from "../contexts/useAuth";
 */
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit être utilisé dans un AuthProvider");
  return ctx;
}
