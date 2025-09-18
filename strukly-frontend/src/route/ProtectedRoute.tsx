import { Navigate, Outlet } from "react-router-dom";
import useUserAuth from "../store/UserAuthStore";

export function ProtectedRoute(){
    const isAuth = useUserAuth((s) => s.isAuth())
}
