import {Routes, Route, Link} from 'react-router-dom';
import Beranda from "./pages/Beranda"
import Riwayat from "./pages/Riwayat"
import Tracker from "./pages/Tracker"
import DetailStruk from "./pages/DetailStruk"

import "./App.css";


const App = () => {

  return (
    <div>
      <nav style={{marginBottom: '1rem'}}>
        <Link to="/">Beranda</Link> |{' '}
        <Link to="/Riwayat">Riwayat</Link> |{' '}
        <Link to="/Tracker">Tracker</Link> |{' '}
        <Link to="/DetailStruk">Detail Struk</Link> 
      </nav>

      <Routes>
        <Route path="/" element={<Beranda />} />
        <Route path="/Riwayat" element={<Riwayat  />} />
        <Route path="/Tracker" element={<Tracker />} />
        <Route path="/DetailStruk" element={<DetailStruk />} />
      </Routes>
      {/* When the URL matches a path, it shows the corresponding element. */}
    </div>
  );
};

export default App;
