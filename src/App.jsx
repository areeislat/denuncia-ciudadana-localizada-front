import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Recuperar from './pages/Recuperar';
import CiudadanoHome from './pages/CiudadanoHome';
import CiudadanoCrear from './pages/CiudadanoCrear';
import CiudadanoReportes from './pages/CiudadanoReportes';
import Panel from './pages/Panel';
import TerminosYPrivacidad from './pages/TerminosYPrivacidad';
import Transparencia from './pages/Transparencia';
import Ayuda from './pages/Ayuda';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/recuperar" element={<Recuperar />} />
        <Route path="/ciudadano" element={<CiudadanoHome />} />
        <Route path="/ciudadano/crear" element={<CiudadanoCrear />} />
        <Route path="/ciudadano/reportes" element={<CiudadanoReportes />} />
        <Route path="/panel" element={<Panel />} />
        <Route path="/terminos" element={<TerminosYPrivacidad />} />
        <Route path="/transparencia" element={<Transparencia />} />
        <Route path="/ayuda" element={<Ayuda />} />
      </Routes>
    </Router>
  );
}

export default App;
