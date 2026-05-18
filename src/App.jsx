import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/public/Home';
import Login from './pages/public/Login';
import Registro from './pages/public/Registro';
import Recuperar from './pages/public/Recuperar';

// Ciudadano
import CiudadanoHome from './pages/ciudadano/CiudadanoHome';
import CiudadanoCrear from './pages/ciudadano/CiudadanoCrear';
import CiudadanoReportes from './pages/ciudadano/CiudadanoReportes';
import CiudadanoDetalleReporte from './pages/ciudadano/CiudadanoDetalleReporte';
import CiudadanoPerfil from './pages/ciudadano/CiudadanoPerfil';

// Municipal shared
import MunicipalDashboard from './pages/municipal/shared/MunicipalDashboard';
import MunicipalGestionReportes from './pages/municipal/shared/MunicipalGestionReportes';
import MunicipalCrearReporte from './pages/municipal/shared/MunicipalCrearReporte';


// Municipal Officer

// Admin Municipal
import AdminGestionUsuarios from './pages/municipal/admin_municipal/AdminGestionUsuarios';
import AdminConfiguracion from './pages/municipal/admin_municipal/AdminConfiguracion';
import AdminEstadisticas from './pages/municipal/admin_municipal/AdminEstadisticas';

// Super Admin
import SuperGestionUsuarios from './pages/municipal/super_admin/SuperGestionUsuarios';
import SuperGestionMunicipalidades from './pages/municipal/super_admin/SuperGestionMunicipalidades';
import SuperAuditoriaLogs from './pages/municipal/super_admin/SuperAuditoriaLogs';

import useAuthStore from './store/authStore';

const ROLES = {
  CITIZEN:         'CITIZEN',
  OFFICER:         'MUNICIPAL_OFFICER',
  ADMIN_MUNICIPAL: 'ADMIN_MUNICIPAL',
  SUPER_ADMIN:     'SUPER_ADMIN',
};

const MUNICIPALES = [ROLES.OFFICER, ROLES.ADMIN_MUNICIPAL, ROLES.SUPER_ADMIN];
const ADMINS      = [ROLES.ADMIN_MUNICIPAL, ROLES.SUPER_ADMIN];

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
        {/* Públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/recuperar" element={<Recuperar />} />

        {/* ── CIUDADANO ── */}
        <Route path="/ciudadano" element={
          <PrivateRoute roles={[ROLES.CITIZEN]}><CiudadanoHome /></PrivateRoute>
        } />
        <Route path="/ciudadano/crear" element={
          <PrivateRoute roles={[ROLES.CITIZEN]}><CiudadanoCrear /></PrivateRoute>
        } />
        <Route path="/ciudadano/reportes" element={
          <PrivateRoute roles={[ROLES.CITIZEN]}><CiudadanoReportes /></PrivateRoute>
        } />
        <Route path="/ciudadano/reportes/:id" element={
          <PrivateRoute roles={[ROLES.CITIZEN]}><CiudadanoDetalleReporte /></PrivateRoute>
        } />
        <Route path="/ciudadano/perfil" element={
          <PrivateRoute roles={[ROLES.CITIZEN]}><CiudadanoPerfil /></PrivateRoute>
        } />

        {/* ── MUNICIPAL SHARED (todos los roles municipales) ── */}
        <Route path="/municipal/dashboard" element={
          <PrivateRoute roles={MUNICIPALES}><MunicipalDashboard /></PrivateRoute>
        } />
        <Route path="/municipal/gestion" element={
          <PrivateRoute roles={MUNICIPALES}><MunicipalGestionReportes /></PrivateRoute>
        } />
        <Route path="/municipal/gestion/crear" element={
        <PrivateRoute roles={MUNICIPALES}><MunicipalCrearReporte /></PrivateRoute>
        } />


        {/* ── ADMIN MUNICIPAL ── */}
        <Route path="/admin/usuarios" element={
          <PrivateRoute roles={[ROLES.ADMIN_MUNICIPAL]}><AdminGestionUsuarios /></PrivateRoute>
        } />
        <Route path="/admin/estadisticas" element={
          <PrivateRoute roles={ADMINS}><AdminEstadisticas /></PrivateRoute>
        } />
        <Route path="/admin/configuracion" element={
          <PrivateRoute roles={ADMINS}><AdminConfiguracion /></PrivateRoute>
        } />

        {/* ── SUPER ADMIN ── */}
        <Route path="/super/usuarios" element={
          <PrivateRoute roles={[ROLES.SUPER_ADMIN]}><SuperGestionUsuarios /></PrivateRoute>
        } />
        <Route path="/super/municipalidades" element={
          <PrivateRoute roles={[ROLES.SUPER_ADMIN]}><SuperGestionMunicipalidades /></PrivateRoute>
        } />
        <Route path="/super/auditoria" element={
          <PrivateRoute roles={[ROLES.SUPER_ADMIN]}><SuperAuditoriaLogs /></PrivateRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;