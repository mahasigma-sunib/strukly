import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { PublicRoute } from "./route/PublicRoute";
import { ProtectedRoute } from "./route/ProtectedRoute";

import useUserAuth from "./store/UserAuthStore";

import UserLogin from "./pages/auth/UserLogin";
import UserRegister from "./pages/auth/UserRegister";
import RegisterCookie from "./pages/auth/RegisterCookie";

import Home from "./pages/Home";
import TransactionHistory from "./pages/TransactionHistory";
import TransactionDetail from "./pages/TransactionDetail";
import AddTransaction from "./pages/AddTransaction";
import UserProfile from "./pages/UserProfile";
import ExpenseTracker from "./pages/ExpenseTracker";
import ExpenseBudget from "./pages/ExpenseBudget";

import MobileNavBar from "./components/MobileNavBar";

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

          <Route path="/cookie" element={<RegisterCookie />} />

          <Route element={<PublicRoute />}>
            <Route path="/login" element={<UserLogin />} />
            <Route path="/register" element={<UserRegister />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<Home />} />
            <Route path="/history" element={<TransactionHistory />} />
            <Route path="/History/:id" element={<TransactionDetail />} />
            <Route path="/addTransaction" element={<AddTransaction />} />
            <Route path="/tracker" element={<ExpenseTracker />} />
            <Route path="/budget" element={<ExpenseBudget />} />
            <Route path="/profile" element={<UserProfile />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
};

export default App;
