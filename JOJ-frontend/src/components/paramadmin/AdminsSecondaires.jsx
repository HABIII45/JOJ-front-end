import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAdminsSecondaires, revoquerAccesAdmin } from "../../api/auth";
import { useAuth } from "../../contexts/useAuth";
import { isSuperAdmin } from "../../utils/permissions";

const IconEditer = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
  </svg>
);

const IconRevoquer = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="9" />
    <path d="m8 8 8 8M16 8l-8 8" />
  </svg>
);

/** Construit le nom affiché depuis les vrais champs Django */
const nomAdmin = (a) => {
  const full = `${a.first_name ?? ""} ${a.last_name ?? ""}`.trim();
  return full || a.username || "—";
};

const initialesAdmin = (a) => {
  const n = nomAdmin(a);
  return n.split(" ").map((m) => m[0]).slice(0, 2).join("").toUpperCase();
};

const connexionAdmin = (a) => {
  if (!a.last_login) return "Jamais connecté";
  return new Date(a.last_login).toLocaleString("fr-FR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
};

function AdminsSecondaires() {
  const navigate = useNavigate();
  const { utilisateur } = useAuth();
  const superAdmin = isSuperAdmin(utilisateur);

  const [admins,      setAdmins]      = useState([]);
  const [chargement,  setChargement]  = useState(true);
  const [erreur,      setErreur]      = useState("");
  const [aRevoquer,   setARevoquer]   = useState(null); // id de l'admin ciblé
  const [enCours,     setEnCours]     = useState(false);

  const chargerAdmins = useCallback(async () => {
    // Si l'utilisateur n'est pas superadmin, on ne lance pas la requête
    if (!superAdmin) return;
    setChargement(true);
    setErreur("");
    try {
      const data = await fetchAdminsSecondaires();
      setAdmins(data);
    } catch (err) {
      setErreur(err?.response?.data?.detail ?? "Impossible de charger les administrateurs.");
    } finally {
      setChargement(false);
    }
  }, [superAdmin]);

  useEffect(() => {
    if (superAdmin) {
      chargerAdmins();
    }
  }, [superAdmin, chargerAdmins]);

  // Si l'utilisateur connecté n'est pas superadministrateur, cette section est masquée
  if (!superAdmin) {
    return null;
  }

  const confirmerRevocation = async () => {
    setEnCours(true);
    try {
      await revoquerAccesAdmin(aRevoquer);
      // Met à jour l'état local : is_active → false
      setAdmins((prev) =>
        prev.map((a) => (a.id === aRevoquer ? { ...a, is_active: false } : a))
      );
    } catch (err) {
      setErreur(err?.response?.data?.erreur ?? "Échec de la révocation. Veuillez réessayer.");
    } finally {
      setEnCours(false);
      setARevoquer(null);
    }
  };

  return (
    <>
      <section className="w-[37rem] mt-[21px] bg-white border border-[#e1e4e8] rounded-[20px] overflow-hidden">

        {/* En-tête */}
        <div className="h-[67px] px-[20px] flex items-center justify-between">
          <div className="flex items-center gap-[9px]">
            <div className="w-[28px] h-[28px] rounded-[8px] bg-[#edf4ff] flex items-center justify-center">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2875db" strokeWidth="2">
                <circle cx="9"  cy="8" r="2.5" />
                <circle cx="17" cy="8" r="2.5" />
                <path d="M4 19c.5-3 2-5 5-5s4.5 2 5 5" />
                <path d="M13 15c2.7-.2 4.7 1.3 5 4" />
              </svg>
            </div>
            <h2 className="m-0 text-lg font-semibold">Administrateurs</h2>
          </div>

          <button
            type="button"
            onClick={() => navigate("/parametres/ajouter-admin")}
            className="flex items-center gap-[6px] text-sm text-[#d96814] font-semibold hover:underline cursor-pointer"
          >
            <span className="w-[14px] h-[14px] rounded-full bg-[#d96814] text-white flex items-center justify-center text-xs font-bold">+</span>
            Ajouter un administrateur
          </button>
        </div>

        {/* En-tête colonnes */}
        <div className="h-[40px] bg-[#fafbfc] border-y border-[#edf0f2] grid grid-cols-[1.6fr_1fr_1fr_.75fr] items-center px-[20px] text-xs tracking-[1.3px] text-[#9199a5] uppercase">
          <span>Utilisateur</span>
          <span>Rôle</span>
          <span>Connexion</span>
          <span>Actions</span>
        </div>

        {/* États */}
        {chargement && (
          <div className="h-[60px] flex items-center justify-center text-sm text-[#9ca3af]">Chargement…</div>
        )}
        {!chargement && erreur && (
          <div className="h-[50px] flex items-center justify-center text-sm text-red-500">{erreur}</div>
        )}
        {!chargement && !erreur && admins.length === 0 && (
          <div className="h-[50px] flex items-center justify-center text-sm text-[#9ca3af]">
            Aucun administrateur enregistré
          </div>
        )}

        {!chargement && !erreur && admins.map((admin, idx) => (
          <div
            key={admin.id}
            className={`h-[54px] grid grid-cols-[1.6fr_1fr_1fr_.75fr] items-center px-[20px] ${
              !admin.is_active ? "opacity-50" : ""
            } ${idx < admins.length - 1 ? "border-b border-[#edf0f2]" : ""}`}
          >
            {/* Utilisateur */}
            <div className="flex items-center gap-[7px]">
              <div className="w-[28px] h-[28px] rounded-full overflow-hidden bg-[#edf4ff] flex items-center justify-center shrink-0">
                {admin.avatar ? (
                  <img src={admin.avatar} className="w-full h-full object-cover" alt={nomAdmin(admin)} />
                ) : (
                  <span className="text-[10px] font-bold text-[#2875db]">{initialesAdmin(admin)}</span>
                )}
              </div>
              <div className="min-w-0">
                <p className="m-0 text-sm font-semibold truncate">{nomAdmin(admin)}</p>
                <p className="m-0 text-xs text-[#7b8490] truncate">{admin.email ?? "—"}</p>
              </div>
            </div>

            {/* Rôle */}
            <span className={`w-fit px-[7px] h-[22px] flex items-center rounded-[5px] text-xs ${
              admin.is_active ? "bg-[#f0f2f5] text-[#4b5563]" : "bg-red-50 text-red-400"
            }`}>
              {admin.is_active ? (admin.role ?? "—") : "Révoqué"}
            </span>

            {/* Dernière connexion */}
            <span className="text-sm text-[#68717e]">{connexionAdmin(admin)}</span>

            {/* Actions */}
            <div className="flex items-center gap-[9px] text-[#9ba3ad]">
              <button type="button" className="hover:text-gray-700 cursor-pointer transition-colors" title="Modifier">
                <IconEditer />
              </button>
              {admin.is_active && (
                <button
                  type="button"
                  onClick={() => setARevoquer(admin.id)}
                  className="hover:text-red-500 cursor-pointer transition-colors"
                  title="Révoquer l'accès"
                >
                  <IconRevoquer />
                </button>
              )}
            </div>
          </div>
        ))}

      </section>

      {/* Modale confirmation révocation */}
      {aRevoquer !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => !enCours && setARevoquer(null)}
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="mt-5 text-xl font-bold text-gray-900">Révoquer l'accès</h3>
              <p className="mt-2 text-sm text-gray-600">
                Êtes-vous sûr de vouloir révoquer l'accès de cet administrateur ?
                Son compte sera désactivé. Vous pourrez le réactiver ultérieurement.
              </p>
            </div>
            <div className="flex gap-4 bg-gray-50 px-8 py-4 rounded-b-2xl">
              <button
                type="button"
                onClick={() => setARevoquer(null)}
                disabled={enCours}
                className="w-full cursor-pointer py-2.5 rounded-lg border border-gray-300 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-60"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={confirmerRevocation}
                disabled={enCours}
                className="w-full py-2.5 cursor-pointer rounded-lg bg-red-600 text-sm font-semibold text-white hover:bg-red-700 transition-colors disabled:opacity-60"
              >
                {enCours ? "Révocation…" : "Révoquer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminsSecondaires;
