import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import TransactionHistory from "./pages/TransactionHistory";
import TransactionDetail from "./pages/TransactionDetail";
import UserLogin from "./pages/UserLogin";
import UserRegister from "./pages/UserRegister";
import "./App.css";

const App = () => {
  return (
    <div>
      <nav className='nav-bar'>
        <Link to="/">Home</Link> |{' '}
        <Link to="/History">History</Link> |{' '}
      </nav>
        
      <Routes className='route-container'>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/register" element={<UserRegister />} />
        <Route path="/History" element={<TransactionHistory />} />
        <Route path="/History/:id" element={<TransactionDetail />} />
      </Routes>
    </div>
  );
};

export default App;
