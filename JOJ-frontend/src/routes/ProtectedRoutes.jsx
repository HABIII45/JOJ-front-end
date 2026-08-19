import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";
import { hasPermission, isSuperAdmin } from "../utils/permissions";

export default function ProtectedRoute({ permissionRequise }) {
  const { utilisateur, chargement } = useAuth();

  if (chargement) {
    return <div className="p-8 text-center text-sm text-gray-500">Chargement...</div>;
  }

  if (!utilisateur) {
    return <Navigate to="/login" replace />;
  }

  // Superadmin a tous les droits
  if (isSuperAdmin(utilisateur)) {
    return <Outlet />;
  }

  // Si une permission est requise, vérifie que l'admin la possède
  if (permissionRequise && !hasPermission(utilisateur, permissionRequise)) {
    return <Navigate to="/parametres" replace />;
  }

  return <Outlet />;
}
