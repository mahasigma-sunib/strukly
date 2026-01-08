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
import ExpenseTracker from "./pages/ExpenseTracker";
import ExpenseDetail from "./pages/ExpenseDetail";
import AddExpense from "./pages/AddExpense";
import EditExpense from "./pages/EditExpense";
import ExpenseBudget from "./pages/ExpenseBudget";
import Goals from "./pages/Goals";
import Settings from "./pages/Settings";

import MobileNavBar from "./components/MobileNavBar";
import AddExpenseCamera from "./pages/AddExpenseCamera";

const App = () => {
  const location = useLocation();
  const hideNavbarRoutes = [
    "/login",
    "/register",
    "/expense/add",
    "/expense/camera",
    "/expense/:id",
  ];
  const isProtectedPath = !hideNavbarRoutes.includes(location.pathname);

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
            <Route path="/expense" element={<ExpenseTracker />} />
            <Route path="/expense/add" element={<AddExpense />} />
            <Route path="/expense/camera" element={<AddExpenseCamera />} />
            <Route path="/expense/:id" element={<EditExpense />} />
            <Route path="/expense/:id/view" element={<ExpenseDetail />} />
            <Route path="/budget" element={<ExpenseBudget />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
};

export default App;
