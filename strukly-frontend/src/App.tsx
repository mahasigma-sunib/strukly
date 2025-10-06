import { Routes, Route, useLocation } from "react-router-dom";
import { ProtectedRoute } from "./route/ProtectedRoute";
import { useEffect } from "react";
import useUserAuth from "./store/UserAuthStore";
import Home from "./pages/Home";
import TransactionHistory from "./pages/TransactionHistory";
import TransactionDetail from "./pages/TransactionDetail";
import UserLogin from "./pages/UserLogin";
import UserRegister from "./pages/UserRegister";
import RegisterCookie from "./pages/RegisterCookie";
import Test from "./pages/Test";
import MobileNavBar from "./components/MobileNavBar";
import { Navigate } from "react-router-dom";
import { PublicRoute } from "./route/PublicRoute";

const App = () => {
  const location = useLocation();
  const isProtectedPath =
    location.pathname !== "/login" && location.pathname !== "/register";

  const fetchProfile = useUserAuth((s) => s.fetchProfile);
  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div>
      {isProtectedPath && <MobileNavBar />}

      <div className="route-container">
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />

          <Route path="/test" element={<Test />} />
          <Route path="/cookie" element={<RegisterCookie />} />

          <Route element={<PublicRoute />}>
            <Route path="/login" element={<UserLogin />} />
            <Route path="/register" element={<UserRegister />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<Home />} />
            <Route path="/History" element={<TransactionHistory />} />
            <Route path="/History/:id" element={<TransactionDetail />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
};

export default App;
