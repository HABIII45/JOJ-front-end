/**
 * Utilitaires et constantes de permissions applicatives JOJ 2026.
 * Aligné avec le modèle Django `PermissionApp` et `RolePersonnel` de l'application `utilisateurs`.
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

  // Alias rétrocompatibles pointant vers JEUX
  EVENEMENTS: "JEUX",
  SITES: "JEUX",
  DISCIPLINES: "JEUX",
  CATEGORIES: "JEUX",
  COMPETITEURS: "JEUX",
  RESULTATS: "JEUX",
  BILLETS: "JEUX",
  PAIEMENTS: "JEUX",
  NOTIFICATIONS: "JEUX",
  ZONES: "JEUX",
};

export const PERMISSION_LABELS = {
  [PERMISSIONS.TOUT]: "Toutes les permissions",
  [PERMISSIONS.JEUX]: "Gestion des Jeux & Compétitions",
  [PERMISSIONS.ACTUALITES]: "Gestion des Actualités",
  [PERMISSIONS.UTILISATEURS]: "Gestion des Utilisateurs",
};

export const PERMISSION_OPTIONS = [
  {
    value: "JEUX",
    label: "Gestion des Jeux & Compétitions",
    desc: "Gestion des Événements, Sites, Disciplines, Catégories, Compétiteurs, Billets et Résultats",
    icon: "Trophy",
  },
  {
    value: "ACTUALITES",
    label: "Gestion des Actualités",
    desc: "Création, modification et publication des actualités et communiqués officiels",
    icon: "Newspaper",
  },
  {
    value: "UTILISATEURS",
    label: "Gestion des Utilisateurs",
    desc: "Administration des comptes, création d'administrateurs et gestion des accès",
    icon: "Users",
  },
  {
    value: "TOUT",
    label: "Toutes les permissions (Superadmin)",
    desc: "Accès intégral et sans restriction à tous les modules de la plateforme",
    icon: "ShieldCheck",
  },
];

const PERMISSIONS_STORAGE_KEY = "joj_admin_permissions_registry";

/**
 * Enregistre les permissions d'un utilisateur dans le stockage persistant local
 */
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

/**
 * Récupère les permissions d'un utilisateur depuis le stockage local
 */
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

/**
 * Vérifie si un utilisateur est superadministrateur
 * @param {Object|null} user 
 * @returns {boolean}
 */
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

  // Vérifie si TOUT est présent dans les permissions
  if (Array.isArray(user.permissions_app) && user.permissions_app.includes("TOUT")) {
    return true;
  }
  if (Array.isArray(user.permissions) && user.permissions.includes("TOUT")) {
    return true;
  }

  return false;
}

/**
 * Récupère la liste complète des permissions effectives d'un utilisateur
 * @param {Object|null} user 
 * @returns {string[]}
 */
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

  // Si l'utilisateur a JEUX, lui accorder les sous-modules correspondants
  if (perms.has("JEUX") || perms.has("TOUT")) {
    perms.add("EVENEMENTS");
    perms.add("SITES");
    perms.add("DISCIPLINES");
    perms.add("CATEGORIES");
    perms.add("COMPETITEURS");
    perms.add("RESULTATS");
    perms.add("BILLETS");
    perms.add("PAIEMENTS");
    perms.add("NOTIFICATIONS");
    perms.add("ZONES");
  }

  return Array.from(perms);
}

/**
 * Vérifie si un utilisateur a une permission donnée
 * @param {Object|null} user 
 * @param {string|string[]} permission - Une permission ou un tableau de permissions
 * @returns {boolean}
 */
export function hasPermission(user, permission) {
  if (!user) return false;
  if (isSuperAdmin(user)) return true;

  const userPerms = getPermissionsList(user);
  if (userPerms.includes("TOUT")) return true;

  const verifierUnePermission = (pReq) => {
    const pNorm = String(pReq).toUpperCase().trim();
    if (userPerms.includes(pNorm)) return true;
    if (pNorm === "EVENEMENTS" || pNorm === "SITES" || pNorm === "DISCIPLINES" || pNorm === "CATEGORIES" || pNorm === "COMPETITEURS" || pNorm === "RESULTATS" || pNorm === "BILLETS") {
      return userPerms.includes("JEUX");
    }
    return false;
  };

  if (Array.isArray(permission)) {
    return permission.some((p) => verifierUnePermission(p));
  }

  return verifierUnePermission(permission);
}
