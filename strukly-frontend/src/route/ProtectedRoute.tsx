import { Navigate, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useUserAuth from "../store/UserAuthStore";

export function ProtectedRoute() {
  const { t } = useTranslation();
  const isAuth = useUserAuth((s) => s.isAuth());
  const authChecked = useUserAuth((s) => s.authChecked);
  if (!authChecked) {
    return <div>{t("common.loading")}</div>;
  }
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />; //child route
}
