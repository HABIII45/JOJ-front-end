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
};

export const PERMISSION_LABELS = {
  [PERMISSIONS.TOUT]: "Toutes les permissions",
  [PERMISSIONS.JEUX]: "Gestion des Événements",
  [PERMISSIONS.UTILISATEURS]: "Gestion des Utilisateurs",
  [PERMISSIONS.ACTUALITES]: "Gestion des Actualités",
};

export const PERMISSION_OPTIONS = [
  { value: PERMISSIONS.JEUX, label: "Gestion des jeux", desc: "Création, modification et gestion des jeux, sites, disciplines...", icon: "CalendarDays" },
  { value: PERMISSIONS.ACTUALITES, label: "Gestion des Actualités", desc: "Publication et gestion des actualités", icon: "Newspaper" },
  { value: PERMISSIONS.UTILISATEURS, label: "Gestion des Utilisateurs", desc: "Gestion des administrateurs et des utilisateurs", icon: "Users" },
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
