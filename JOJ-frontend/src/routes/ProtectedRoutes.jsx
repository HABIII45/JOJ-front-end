import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ permissionRequise }) {
  const { utilisateur, chargement } = useAuth();

  if (chargement) {
    return <div>Chargement...</div>;
  }

  if (!utilisateur) {
    return <Navigate to="/login" replace />;
  }

  // SUPERADMIN A ACCES PARTOUT 
  const estSuperAdmin = utilisateur.role === "superadmin";
  const aLaPermission = utilisateur.permissions?.includes(permissionRequise);

  if (!estSuperAdmin && permissionRequise && !aLaPermission) {
    return <Navigate to="/non-autorise" replace />;
  }

  return <Outlet />;
}
