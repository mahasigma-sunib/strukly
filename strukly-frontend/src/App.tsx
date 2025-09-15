import {Routes, Route, Link} from 'react-router-dom';
import Home from "./pages/Home"
// import UserLogin from './pages/UserLogin';
import TransactionHistory from "./pages/TransactionHistory"
import TransactionDetail from './pages/TransactionDetail';
// import "./App.css";


const App = () => {

  return (
    <div>
      <nav style={{marginBottom: '1rem'}}>
        <Link to="/">Home</Link> |{' '}
        <Link to="/History">History</Link> |{' '}
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/History" element={<TransactionHistory  />} />
        <Route path="/History/:id" element={<TransactionDetail  />} />
      </Routes>
    </div>
  );
};

export default App;
