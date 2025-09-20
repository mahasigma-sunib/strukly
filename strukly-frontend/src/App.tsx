import axios from "axios";
import { useEffect } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { ProtectedRoute } from "./route/ProtectedRoute";
import Home from "./pages/Home";
import TransactionHistory from "./pages/TransactionHistory";
import TransactionDetail from "./pages/TransactionDetail";
import UserLogin from "./pages/UserLogin";
import UserRegister from "./pages/UserRegister";
import useUserAuth from "./store/UserAuthStore";
import "./App.css";

const App = () => {
  const location = useLocation();
  const isProtectedPath =
    location.pathname !== "/login" && location.pathname !== "/register";

  const logout = useUserAuth((s) => s.logout);
  const token = useUserAuth((s) => s.token);
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  return (
    <div>
      {isProtectedPath && (
        <nav className="nav-bar">
          <Link to="/">Home</Link> | <Link to="/History">History</Link> |{" "}
          <Link to="" onClick={logout}>
            Log out
          </Link>
        </nav>
      )}

      <div className="route-container">
        <Routes>
          <Route path="/login" element={<UserLogin />} />
          <Route path="/register" element={<UserRegister />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/History" element={<TransactionHistory />} />
            <Route path="/History/:id" element={<TransactionDetail />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
};

export default App;

/*
<Routes>
  <Route path="/" element={
    <ProtectedRoute>
      <Home />
    </ProtectedRoute>
  } />
  <Route path="/login" element={<UserLogin />} />
  <Route path="/register" element={<UserRegister />} />
  <Route path="/History" element={
    <ProtectedRoute>
      <TransactionHistory />
    </ProtectedRoute>
  } />
  <Route path="/History/:id" element={
    <ProtectedRoute>
      <TransactionDetail />
    </ProtectedRoute>
  } />
</Routes>
*/
