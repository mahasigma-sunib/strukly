import {Routes, Route, Link} from 'react-router-dom';
import Home from "./pages/Home"
import TransactionHistory from "./pages/TransactionHistory"
import TransactionDetail from './pages/TransactionDetail';
// import UserLogin from './pages/UserLogin';
import "./App.css";


const App = () => {

  return (
    <div>
      <nav className='nav-bar'>
        <Link to="/">Home</Link> |{' '}
        <Link to="/History">History</Link> |{' '}
      </nav>

      <div className='route-container'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/History" element={<TransactionHistory  />} />
          <Route path="/History/:id" element={<TransactionDetail  />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
