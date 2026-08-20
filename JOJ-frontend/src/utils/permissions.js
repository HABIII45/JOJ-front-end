/**
 * Utilitaires et constantes de permissions applicatives JOJ 2026.
 * Règles d'accès :
 * - Dashboard : accessible à tous
 * - Jeux : Événements, Disciplines, Sites, Catégories, Équipes/Compétiteurs
 * - Actualités : Actualités, Résultats
 * - Utilisateurs : Gestion des comptes et paramètres (réservé admin/superadmin)
 */

export const ROLES = {
  SUPERADMIN: "SUPERADMIN",
  ADMIN: "ADMIN",
};

export const PERMISSIONS = {
  TOUT: "TOUT",
  JEUX: "JEUX",
  ACTUALITES: "ACTUALITES",
  UTILISATEURS: "UTILISATEURS",

  // Sous-modules rattachés à JEUX
  EVENEMENTS: "EVENEMENTS",
  DISCIPLINES: "DISCIPLINES",
  SITES: "SITES",
  CATEGORIES: "CATEGORIES",
  EQUIPES: "EQUIPES",
  COMPETITEURS: "COMPETITEURS",
  BILLETS: "BILLETS",

  // Sous-modules rattachés à ACTUALITES
  RESULTATS: "RESULTATS",
  PARAMETRES: "PARAMETRES",
};

export const PERMISSION_LABELS = {
  [PERMISSIONS.TOUT]: "Toutes les permissions (Superadmin)",
  [PERMISSIONS.JEUX]: "Jeux (Événements, Disciplines, Sites, Catégories, Équipes)",
  [PERMISSIONS.ACTUALITES]: "Actualités (Actualités, Résultats)",
  [PERMISSIONS.UTILISATEURS]: "Gestion des Utilisateurs",
};

export const PERMISSION_OPTIONS = [
  {
    value: "JEUX",
    label: "Jeux (Événements, Disciplines, Sites, Catégories, Équipes)",
    desc: "Accès complet aux modules Événements, Disciplines, Sites, Catégories et Équipes/Compétiteurs",
    icon: "Trophy",
  },
  {
    value: "ACTUALITES",
    label: "Actualités (Actualités, Résultats)",
    desc: "Accès à la publication des Actualités et à la saisie et gestion des Résultats sportifs",
    icon: "Newspaper",
  },
  {
    value: "UTILISATEURS",
    label: "Gestion des Utilisateurs",
    desc: "Administration des comptes administrateurs et accès aux paramètres avancés",
    icon: "Users",
  },
  {
    value: "TOUT",
    label: "Toutes les permissions (Superadmin)",
    desc: "Accès intégral sans restriction à l'ensemble de la plateforme",
    icon: "ShieldCheck",
  },
];

const PERMISSIONS_STORAGE_KEY = "joj_admin_permissions_registry";

export function saveUserPermissions(identifier, permissions) {
  if (!identifier) return;
  try {
    const raw = localStorage.getItem(PERMISSIONS_STORAGE_KEY);
    const registry = raw ? JSON.parse(raw) : {};
    const key = String(identifier).toLowerCase().trim();
    registry[key] = Array.isArray(permissions) ? permissions : [permissions];
    localStorage.setItem(PERMISSIONS_STORAGE_KEY, JSON.stringify(registry));
  } catch (e) {
    console.error("Erreur de sauvegarde des permissions:", e);
  }
}

export function getUserPermissions(identifier) {
  if (!identifier) return [];
  try {
    const raw = localStorage.getItem(PERMISSIONS_STORAGE_KEY);
    const registry = raw ? JSON.parse(raw) : {};
    const key = String(identifier).toLowerCase().trim();
    return registry[key] || [];
  } catch {
    return [];
  }
}

export function isSuperAdmin(user) {
  if (!user) return false;
  if (user.is_superuser === true) return true;

  const roleStr = String(user.role || "").toUpperCase().trim();
  if (
    roleStr === "SUPERADMIN" ||
    roleStr === "SUPER_ADMIN" ||
    roleStr === "SUPER-ADMINISTRATEUR" ||
    roleStr === "SUPER ADMINISTRATEUR"
  ) {
    return true;
  }

  if (Array.isArray(user.permissions_app) && user.permissions_app.includes("TOUT")) {
    return true;
  }
  if (Array.isArray(user.permissions) && user.permissions.includes("TOUT")) {
    return true;
  }

  return false;
}

export function getPermissionsList(user) {
  if (!user) return [];
  if (isSuperAdmin(user)) {
    return [PERMISSIONS.TOUT, PERMISSIONS.JEUX, PERMISSIONS.ACTUALITES, PERMISSIONS.UTILISATEURS];
  }

  const perms = new Set();

  if (Array.isArray(user.permissions_app)) {
    user.permissions_app.forEach((p) => perms.add(String(p).toUpperCase()));
  }

  if (Array.isArray(user.permissions)) {
    user.permissions.forEach((p) => perms.add(String(p).toUpperCase()));
  }

  const fromUsername = user.username ? getUserPermissions(user.username) : [];
  fromUsername.forEach((p) => perms.add(String(p).toUpperCase()));

  const fromEmail = user.email ? getUserPermissions(user.email) : [];
  fromEmail.forEach((p) => perms.add(String(p).toUpperCase()));

  return Array.from(perms);
}

export function hasPermission(user, permission) {
  if (!user) return false;
  if (isSuperAdmin(user)) return true;

  const userPerms = getPermissionsList(user);
  if (userPerms.includes("TOUT")) return true;

  const verifierUnePermission = (pReq) => {
    const pNorm = String(pReq).toUpperCase().trim();
    if (userPerms.includes(pNorm)) return true;

    // Règle 1: Jeux (Evenement, Discipline, Site, Categorie, Equipe, Competiteurs, Billets)
    if (
      pNorm === "JEUX" ||
      pNorm === "EVENEMENTS" ||
      pNorm === "DISCIPLINES" ||
      pNorm === "SITES" ||
      pNorm === "CATEGORIES" ||
      pNorm === "EQUIPES" ||
      pNorm === "COMPETITEURS" ||
      pNorm === "BILLETS"
    ) {
      return userPerms.includes("JEUX");
    }

    // Règle 2: Actualite (Actualite, Resultat)
    if (pNorm === "ACTUALITES" || pNorm === "RESULTATS") {
      return userPerms.includes("ACTUALITES");
    }

    // Règle 3: Utilisateurs & Paramètres
    if (pNorm === "UTILISATEURS" || pNorm === "PARAMETRES") {
      return userPerms.includes("UTILISATEURS");
    }

    return false;
  };

  if (Array.isArray(permission)) {
    return permission.some((p) => verifierUnePermission(p));
  }

  return verifierUnePermission(permission);
}
