import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/public/Home';
import Login from './pages/public/Login';
import Registro from './pages/public/Registro';
import Recuperar from './pages/public/Recuperar';
import CiudadanoHome from './pages/ciudadano/CiudadanoHome';
import CiudadanoCrear from './pages/ciudadano/CiudadanoCrear';
import CiudadanoReportes from './pages/ciudadano/CiudadanoReportes';
import Panel from './pages/municipal/shared/Panel';
import useAuthStore from './store/authStore';

// Protege rutas que requieren autenticación
function PrivateRoute({ children, roles = [] }) {
  const { token, user } = useAuthStore();

  if (!token) return <Navigate to="/login" replace />;
  if (roles.length > 0 && !roles.includes(user?.roleName)) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/recuperar" element={<Recuperar />} />

        {/* Rutas protegidas - solo CITIZEN */}
        <Route path="/ciudadano" element={
          <PrivateRoute roles={['CITIZEN']}>
            <CiudadanoHome />
          </PrivateRoute>
        } />
        <Route path="/ciudadano/crear" element={
          <PrivateRoute roles={['CITIZEN']}>
            <CiudadanoCrear />
          </PrivateRoute>
        } />
        <Route path="/ciudadano/reportes" element={
          <PrivateRoute roles={['CITIZEN']}>
            <CiudadanoReportes />
          </PrivateRoute>
        } />

        {/* Rutas protegidas - roles municipales */}
        <Route path="/panel" element={
          <PrivateRoute roles={['AGENT', 'ADMIN_COMUNAL', 'ADMIN_MASTER']}>
            <Panel />
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  );
}



export default App;
