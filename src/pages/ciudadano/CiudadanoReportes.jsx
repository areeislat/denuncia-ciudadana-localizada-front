import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import apiClient from '../../config/api';
import useAuthStore from '../../store/authStore';

const estadoConfig = {
  PENDING:     { label: 'Pendiente', clase: 'badge-pendiente', icon: 'pending',       filtro: 'Pendientes' },
  IN_PROGRESS: { label: 'En Proceso', clase: 'badge-proceso',  icon: 'sync',          filtro: 'En Proceso' },
  RESOLVED:    { label: 'Resuelto',  clase: 'badge-resuelto',  icon: 'check_circle',  filtro: 'Resueltos'  },
  REJECTED:    { label: 'Rechazado', clase: 'badge-rechazado', icon: 'cancel',        filtro: 'Rechazados' },
};

const filtros = ['Todos', 'Pendientes', 'En Proceso', 'Resueltos', 'Rechazados'];

export default function CiudadanoReportes() {
  const [filtroActivo, setFiltroActivo] = useState('Todos');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [reportes, setReportes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const initials = user?.fullName
    ?.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase() || '?';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const fetchReportes = async () => {
      try {
        setCargando(true);
        setError(null);
        const data = await apiClient.get(`/api/reports/user/${user.userId}`);
        setReportes(data.reports || []);
      } catch (err) {
        if (err.response?.status === 401) {
          logout();
          navigate('/login');
        } else {
          setError('No se pudieron cargar tus reportes.');
        }
      } finally {
        setCargando(false);
      }
    };
    if (user?.userId) fetchReportes();
  }, [user?.userId]);

  const conteo = (f) => f === 'Todos'
    ? reportes.length
    : reportes.filter((r) => estadoConfig[r.status]?.filtro === f).length;

  const reportesFiltrados = filtroActivo === 'Todos'
    ? reportes
    : reportes.filter((r) => estadoConfig[r.status]?.filtro === filtroActivo);

  return (
    <div>
      {/* HEADER */}
      <header className="bg-[#001A33] sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 md:px-6 py-4">
          <div className="flex items-center gap-3">
            <Link to="/ciudadano" className="text-white md:hidden">
              <span className="material-symbols-outlined">arrow_back</span>
            </Link>
            <Link to="/ciudadano" className="text-xl font-extrabold text-white tracking-tight font-headline">DESIGEO</Link>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/ciudadano" className="text-slate-300 hover:text-white font-headline font-bold text-sm">Inicio</Link>
            <Link to="/ciudadano/crear" className="text-slate-300 hover:text-white font-headline font-bold text-sm">Reportar</Link>
            <Link to="/ciudadano/reportes" className="text-white font-headline font-bold text-sm border-b-2 border-[#D7141A] pb-1">Mis Reportes</Link>
          </nav>
          <div className="flex items-center gap-3">
            <button className="text-white hover:bg-white/10 rounded-md p-2">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-[#0050A5] flex items-center justify-center text-white text-xs font-bold">
              {initials}
            </div>
            <button onClick={() => setMobileMenuOpen(true)} className="md:hidden text-white">
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-backdrop" onClick={() => setMobileMenuOpen(false)}></div>
        <div className="mobile-menu-panel">
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-white font-headline font-bold">{user?.fullName}</p>
              <p className="text-slate-400 text-xs capitalize">{user?.roleName?.toLowerCase().replace('_', ' ')}</p>
            </div>
            <button onClick={() => setMobileMenuOpen(false)} className="text-white">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <nav className="space-y-1">
            <Link to="/ciudadano" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-slate-300 font-headline font-medium py-3 px-4 rounded-lg hover:bg-white/5">
              <span className="material-symbols-outlined">home</span>Inicio
            </Link>
            <Link to="/ciudadano/crear" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-slate-300 font-headline font-medium py-3 px-4 rounded-lg hover:bg-white/5">
              <span className="material-symbols-outlined">add_circle</span>Reportar
            </Link>
            <Link to="/ciudadano/reportes" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-white font-headline font-medium py-3 px-4 rounded-lg bg-white/10">
              <span className="material-symbols-outlined">history</span>Mis Reportes
            </Link>
            <a href="#" className="flex items-center gap-3 text-slate-300 font-headline font-medium py-3 px-4 rounded-lg hover:bg-white/5">
              <span className="material-symbols-outlined">help</span>Ayuda
            </a>
            <div className="border-t border-white/10 my-4"></div>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 text-red-400 font-headline font-medium py-3 px-4 rounded-lg hover:bg-white/5">
              <span className="material-symbols-outlined">logout</span>Cerrar sesión
            </button>
          </nav>
        </div>
      </div>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-headline font-extrabold text-[#003a7a] mb-1">Mis Reportes</h1>
            <p className="text-[#424752] text-sm">Estado de tus solicitudes ciudadanas.</p>
          </div>
          <Link
            to="/ciudadano/crear"
            className="bg-[#0050A5] text-white font-headline font-bold py-2.5 px-6 rounded-full hover:bg-[#003A7A] transition-colors flex items-center gap-2 text-sm self-start"
          >
            <span className="material-symbols-outlined text-sm fill-icon">add_circle</span> Nuevo Reporte
          </Link>
        </div>

        {/* Filtros funcionales con conteo */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-6" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
          {filtros.map((f) => (
            <button
              key={f}
              onClick={() => setFiltroActivo(f)}
              className={`flex-shrink-0 px-5 py-2 rounded-full text-xs font-semibold transition-all ${
                filtroActivo === f
                  ? 'bg-[#003a7a] text-white shadow-sm'
                  : 'bg-[#eae8e7] text-[#424752] hover:bg-[#dbd9d9]'
              }`}
            >
              {f} ({conteo(f)})
            </button>
          ))}
        </div>

        {/* Grid de reportes */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cargando && (
            <div className="col-span-3 flex items-center justify-center py-16 gap-3 text-[#424752]">
              <span className="material-symbols-outlined animate-spin">progress_activity</span>
              <span className="text-sm">Cargando reportes...</span>
            </div>
          )}
          {error && (
            <div className="col-span-3 bg-red-50 border border-red-100 rounded-xl p-4 flex items-center gap-3">
              <span className="material-symbols-outlined text-[#ba1a1a]">error</span>
              <p className="text-sm text-[#ba1a1a] font-medium">{error}</p>
            </div>
          )}
          {!cargando && !error && reportesFiltrados.length === 0 && (
            <p className="col-span-3 text-center text-[#424752] text-sm py-12">
              No hay reportes en esta categoría.
            </p>
          )}
          {!cargando && !error && reportesFiltrados.map((reporte) => {
            const config = estadoConfig[reporte.status] || estadoConfig['PENDING'];
            const fecha = reporte.createdAt
              ? new Date(reporte.createdAt).toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' })
              : '—';
            return (
              <Link
                key={reporte.reportId}
                to={`/ciudadano/reportes/${reporte.reportId}`}
                className="block bg-white rounded-xl p-5 shadow-sm border border-[#f5f3f3] card-hover"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`${config.clase} text-[9px] font-bold uppercase px-3 py-1 rounded-full flex items-center gap-1`}>
                    <span className="material-symbols-outlined text-xs fill-icon">{config.icon}</span>
                    {config.label}
                  </span>
                  <span className="text-[10px] text-[#737783]">{fecha}</span>
                </div>
                <h3 className="font-headline font-bold text-[#1b1c1c] text-base mb-1 line-clamp-2">{reporte.description}</h3>
                <div className="flex items-center gap-1 text-[#424752] mb-2">
                  <span className="material-symbols-outlined text-xs">location_on</span>
                  <span className="text-xs">{reporte.address || 'Sin dirección'}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}