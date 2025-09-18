import { useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { ProtectedRoute } from "./route/ProtectedRoute";
import axios from "axios";
import Home from "./pages/Home";
import TransactionHistory from "./pages/TransactionHistory";
import TransactionDetail from "./pages/TransactionDetail";
import UserLogin from "./pages/UserLogin";
import UserRegister from "./pages/UserRegister";
import useUserAuth from "./store/UserAuthStore";
import "./App.css";

const App = () => {
  const token = useUserAuth((s) => s.token);
  const logout = useUserAuth((s) => s.logout);
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  return (
    <div>
      <nav className="nav-bar">
        <Link to="/">Home</Link> | <Link to="/History">History</Link> |{" "}
      </nav>

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
      <button onClick={logout}>Log Out</button>
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
