import { Routes, Route, Link, useLocation } from "react-router-dom";
import { ProtectedRoute } from "./route/ProtectedRoute";
import Home from "./pages/Home";
import TransactionHistory from "./pages/TransactionHistory";
import TransactionDetail from "./pages/TransactionDetail";
import UserLogin from "./pages/UserLogin";
import UserRegister from "./pages/UserRegister";
import useUserAuth from "./store/UserAuthStore";
import RegisterCookie from "./pages/RegisterCookie";
import Test from "./pages/Test"

const App = () => {
  const location = useLocation();
  const isProtectedPath =
    location.pathname !== "/login" && location.pathname !== "/register";

  const logout = useUserAuth((s) => s.logout);

  return (
    <div>
      {isProtectedPath && (
        <nav className="nav-bar">
          <Link to="/home">Home</Link> | <Link to="/History">History</Link> |{" "}
          <Link to="" onClick={logout}>
            Log out
          </Link>
        </nav>
      )}

      <div className="route-container">
        <Routes>
          <Route path="/login" element={<UserLogin />} />
          <Route path="/test" element={<Test />} />
          <Route path="/register" element={<UserRegister />} />
          <Route path="/cookie" element={<RegisterCookie />} />
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
