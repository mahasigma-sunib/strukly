import { Navigate, Outlet } from "react-router-dom";
import useUserAuth from "../store/UserAuthStore";

export function ProtectedRoute(){
    const isAuth = useUserAuth((s) => s.isAuth);
    if (!isAuth) {
        return <Navigate to='/login' replace/>
    }
    return <Outlet/> //child route
}

// export function ProtectedRoute({ children }: {children: React.ReactNode}){
//     const isAuth = useUserAuth((s) => s.isAuth)

//     if (!isAuth) {
//         return <Navigate to='/login' replace/>
//     }

//     return <>{ children }</>
// }
