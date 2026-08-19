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
  EVENEMENTS: "EVENEMENTS",
  ZONES: "ZONES",
  RESULTATS: "RESULTATS",
  BILLETS: "BILLETS",
  PAIEMENTS: "PAIEMENTS",
  ACTUALITES: "ACTUALITES",
  SITES: "SITES",
  NOTIFICATIONS: "NOTIFICATIONS",
  UTILISATEURS: "UTILISATEURS",
  DISCIPLINES: "DISCIPLINES",
  CATEGORIES: "CATEGORIES",
  COMPETITEURS: "COMPETITEURS",
};

export const PERMISSION_LABELS = {
  [PERMISSIONS.TOUT]: "Toutes les permissions",
  [PERMISSIONS.EVENEMENTS]: "Gestion des Événements",
  [PERMISSIONS.UTILISATEURS]: "Gestion des Utilisateurs",
  [PERMISSIONS.RESULTATS]: "Gestion des Résultats",
  [PERMISSIONS.BILLETS]: "Gestion des Billets",
  [PERMISSIONS.SITES]: "Gestion des Sites",
  [PERMISSIONS.DISCIPLINES]: "Gestion des Disciplines",
  [PERMISSIONS.ACTUALITES]: "Gestion des Actualités",
  [PERMISSIONS.CATEGORIES]: "Gestion des Catégories",
  [PERMISSIONS.COMPETITEURS]: "Gestion des Compétiteurs & Équipes",
  [PERMISSIONS.PAIEMENTS]: "Gestion des Paiements",
  [PERMISSIONS.NOTIFICATIONS]: "Gestion des Notifications",
  [PERMISSIONS.ZONES]: "Gestion des Zones",
};

export const PERMISSION_OPTIONS = [
  { value: PERMISSIONS.RESULTATS, label: "Gestion des Résultats", desc: "Saisie et consultation des scores et classements", icon: "Medal" },
  { value: PERMISSIONS.EVENEMENTS, label: "Gestion des Événements", desc: "Création, modification et gestion des événements sportifs", icon: "CalendarDays" },
  { value: PERMISSIONS.BILLETS, label: "Gestion des Billets", desc: "Gestion des ventes et validation des tickets", icon: "Ticket" },
  { value: PERMISSIONS.SITES, label: "Gestion des Sites", desc: "Administration des sites et infrastructures", icon: "MapPin" },
  { value: PERMISSIONS.DISCIPLINES, label: "Gestion des Disciplines", desc: "Gestion des disciplines et épreuves sportives", icon: "Trophy" },
  { value: PERMISSIONS.ACTUALITES, label: "Gestion des Actualités", desc: "Publication et gestion des actualités", icon: "Newspaper" },
  { value: PERMISSIONS.CATEGORIES, label: "Gestion des Catégories", desc: "Gestion des catégories d'épreuves", icon: "Tags" },
  { value: PERMISSIONS.COMPETITEURS, label: "Gestion des Compétiteurs & Équipes", desc: "Gestion des athlètes et équipes", icon: "UserRound" },
  { value: PERMISSIONS.UTILISATEURS, label: "Gestion des Utilisateurs", desc: "Gestion des administrateurs et des utilisateurs", icon: "Users" },
  { value: PERMISSIONS.PAIEMENTS, label: "Gestion des Paiements", desc: "Suivi des transactions et paiements", icon: "CreditCard" },
  { value: PERMISSIONS.NOTIFICATIONS, label: "Gestion des Notifications", desc: "Envoi et gestion des notifications", icon: "Bell" },
  { value: PERMISSIONS.ZONES, label: "Gestion des Zones", desc: "Configuration des zones de compétition", icon: "Grid" },
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

  const roleStr = String(user.role || "").toLowerCase().trim();
  if (
    roleStr === "superadmin" ||
    roleStr === "super_admin" ||
    roleStr === "super-administrateur" ||
    roleStr === "super administrateur" ||
    roleStr === "super admin"
  ) {
    return true;
  }

  // Vérifie si TOUT est présent dans les permissions
  if (Array.isArray(user.permissions_app) && user.permissions_app.includes(PERMISSIONS.TOUT)) {
    return true;
  }
  if (Array.isArray(user.permissions) && user.permissions.includes(PERMISSIONS.TOUT)) {
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
    return [PERMISSIONS.TOUT];
  }

  const perms = new Set();

  // 1. Directement depuis user.permissions_app
  if (Array.isArray(user.permissions_app)) {
    user.permissions_app.forEach((p) => perms.add(String(p).toUpperCase()));
  }

  // 2. Directement depuis user.permissions
  if (Array.isArray(user.permissions)) {
    user.permissions.forEach((p) => perms.add(String(p).toUpperCase()));
  }

  // 3. Registre persistant local via username, email ou id
  const fromUsername = user.username ? getUserPermissions(user.username) : [];
  fromUsername.forEach((p) => perms.add(String(p).toUpperCase()));

  const fromEmail = user.email ? getUserPermissions(user.email) : [];
  fromEmail.forEach((p) => perms.add(String(p).toUpperCase()));

  const fromId = user.id ? getUserPermissions(user.id) : [];
  fromId.forEach((p) => perms.add(String(p).toUpperCase()));

  return Array.from(perms);
}

/**
 * Vérifie si un utilisateur a une permission donnée (stricte et sans confusion entre modules)
 * @param {Object|null} user 
 * @param {string|string[]} permission - Une permission ou un tableau de permissions
 * @returns {boolean}
 */
export function hasPermission(user, permission) {
  if (!user) return false;
  if (isSuperAdmin(user)) return true;

  const userPerms = getPermissionsList(user);
  if (userPerms.includes(PERMISSIONS.TOUT)) return true;

  const verifierUnePermission = (pReq) => {
    const pNorm = String(pReq).toUpperCase().trim();
    return userPerms.includes(pNorm);
  };

  if (Array.isArray(permission)) {
    return permission.some((p) => verifierUnePermission(p));
  }

  return verifierUnePermission(permission);
}
