import { Navigate, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useUserAuth from "../store/UserAuthStore";

export function PublicRoute() {
    const { t } = useTranslation();
    // Select state just like in ProtectedRoute
    const isAuth = useUserAuth((s) => s.isAuth());
    const authChecked = useUserAuth((s) => s.authChecked);

    // Wait for the initial auth check to complete
    if (!authChecked) {
        return <div>{t("common.loading")}</div>; // Or your loading spinner
    }

    // If the user IS authenticated, redirect them away from the public page
    if (isAuth) {
        return <Navigate to="/home" replace />;
    }

    // If they are NOT authenticated, show the public page (Login, Register)
    return <Outlet />;
}
