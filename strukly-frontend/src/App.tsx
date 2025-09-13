import {Routes, Route, Link} from 'react-router-dom';
import Home from "./pages/Home"
import History from "./pages/History"
import Tracker from "./pages/Tracker"
import ReceiptDetails from "./pages/ReceiptDetails"

// import "./App.css";


const App = () => {

  return (
    <div>
      <nav style={{marginBottom: '1rem'}}>
        <Link to="/">Beranda</Link> |{' '}
        <Link to="/History">Riwayat</Link> |{' '}
        <Link to="/Tracker">Tracker</Link> |{' '}
        <Link to="/ReceiptDetails">Detail Struk</Link> 
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/History" element={<History  />} />
        <Route path="/Tracker" element={<Tracker />} />
        <Route path="/ReceiptDetails" element={<ReceiptDetails />} />
      </Routes>
      {/* When the URL matches a path, it shows the corresponding element. */}
    </div>
  );
};

export default App;
