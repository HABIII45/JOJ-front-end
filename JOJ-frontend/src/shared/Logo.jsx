/**
 * Logo JOJEvent : typographie mixte orange/noir + pictogramme athlète.
 * Référence maquette : logo en haut à gauche du header.
 * @module Logo
 */
import { Link } from "react-router-dom";

/**
 * Logo "JOJEvent:" cliquable (retour à l'accueil).
 * @param {{ variant?: "dark" | "light" }} props
 */
export function Logo({ variant = "dark" }) {
  const accent = variant === "dark" ? "text-joj-orange" : "text-[#E8742C]";
  const base = variant === "dark" ? "text-joj-black" : "text-white";
  return (
    <Link href="/" className="flex items-center gap-1 select-none">
      <span className="font-display text-2xl italic tracking-tight">
        <span className={accent}>JOJ</span>
        <span className={base}>Event</span>
      </span>
      
    </Link>
  );
}

/**
 * Wordmark "JOJ_Events" (footer).
 * @param {{ variant?: "dark" | "light" }} props
 */
export function LogoWord({ variant = "dark" }) {
  return (
    <span className="font-display text-lg font-bold tracking-tight">
      <span className={variant === "dark" ? "text-joj-orange" : "text-[#E8742C]"}>
        JOJ
      </span>
      <span className={variant === "dark" ? "text-joj-black" : "text-white"}>
        _Events
      </span>
    </span>
  );
}
