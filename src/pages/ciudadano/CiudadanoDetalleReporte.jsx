import { Link, useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import apiClient from '../../config/api';
import useAuthStore from '../../store/authStore';
import CiudadanoFooter from '../../components/CiudadanoFooter';

const prioridadConfig = {
  HIGH:   { label: 'Alta',  clase: 'bg-[#D7141A] text-white' },
  MEDIUM: { label: 'Media', clase: 'bg-amber-100 text-amber-800' },
  LOW:    { label: 'Baja',  clase: 'bg-green-100 text-green-800' },
};

const estadoConfig = {
  PENDING:     { label: 'Pendiente', clase: 'badge-pendiente' },
  IN_PROGRESS: { label: 'En Proceso', clase: 'badge-proceso' },
  RESOLVED:    { label: 'Resuelto',  clase: 'badge-resuelto' },
  REJECTED:    { label: 'Rechazado', clase: 'badge-rechazado' },
};

export default function CiudadanoDetalleReporte() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [reporte, setReporte] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [reabriendo, setReabriendo] = useState(false);

  const initials = user?.fullName
    ?.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase() || '?';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const fetchReporte = async () => {
      try {
        setCargando(true);
        setError(null);
        const data = await apiClient.get(`/api/reports/${id}`);
        setReporte(data);
      } catch (err) {
        if (err.response?.status === 401) {
          logout();
          navigate('/login');
        } else {
          setError('No se pudo cargar el reporte.');
        }
      } finally {
        setCargando(false);
      }
    };
    fetchReporte();
  }, [id]);

  const handleReabrir = async () => {
    const razon = window.prompt('¿Cuál es la razón para reabrir este reporte?');
    if (!razon?.trim()) return;
    try {
      setReabriendo(true);
      const data = await apiClient.post(`/api/reports/${id}/reopen`, { reason: razon });
      setReporte(data);
    } catch {
      alert('No se pudo reabrir el reporte. Intenta nuevamente.');
    } finally {
      setReabriendo(false);
    }
  };

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center gap-3 text-[#424752]">
        <span className="material-symbols-outlined animate-spin">progress_activity</span>
        <span className="text-sm">Cargando reporte...</span>
      </div>
    );
  }

  if (error || !reporte) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-[#424752] font-headline font-bold text-lg">{error || 'Reporte no encontrado.'}</p>
        <Link to="/ciudadano/reportes" className="text-[#003a7a] font-bold text-sm flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">arrow_back</span> Volver a mis reportes
        </Link>
      </div>
    );
  }

  const prioridad = prioridadConfig[reporte.priority] || prioridadConfig['MEDIUM'];
  const estado = estadoConfig[reporte.status] || estadoConfig['PENDING'];

  return (
    <div>
      {/* HEADER */}
      <header className="bg-[#001A33] sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 md:px-6 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="text-white hover:bg-white/10 rounded-md p-1">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <Link to="/ciudadano" className="text-xl font-extrabold text-white tracking-tight font-headline">DESIGEO</Link>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/ciudadano" className="text-slate-300 hover:text-white font-headline font-bold text-sm">Inicio</Link>
            <Link to="/ciudadano/reportes" className="text-white font-headline font-bold text-sm border-b-2 border-[#D7141A] pb-1">Mis Reportes</Link>
            <Link to="/ayuda" className="text-slate-300 hover:text-white font-headline font-bold text-sm">Ayuda</Link>
          </nav>
          <div className="flex items-center gap-3">
            <button className="text-white hover:bg-white/10 rounded-md p-2">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="w-8 h-8 rounded-full bg-[#0050A5] flex items-center justify-center text-white text-xs font-bold hover:ring-2 hover:ring-white/30 transition-all"
              >
                {initials}
              </button>
              {profileMenuOpen && (
                <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-[#e4e2e2] w-48 overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-[#f5f3f3]">
                    <p className="text-sm font-bold font-headline text-[#1b1c1c]">{user?.fullName}</p>
                    <p className="text-[10px] text-[#424752] capitalize">{user?.roleName?.toLowerCase().replace('_', ' ')}</p>
                  </div>
                  <Link
                    to="/ciudadano/perfil"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-sm text-[#1b1c1c] hover:bg-[#f5f3f3] transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">person</span>Mi Perfil
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-[#ba1a1a] hover:bg-[#f5f3f3] transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">logout</span>Cerrar sesión
                  </button>
                </div>
              )}
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
            <Link to="/ciudadano/perfil" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-slate-300 font-headline font-medium py-3 px-4 rounded-lg hover:bg-white/5">
              <span className="material-symbols-outlined">person</span>Mi Perfil
            </Link>
            <Link to="/ayuda" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-slate-300 font-headline font-medium py-3 px-4 rounded-lg hover:bg-white/5">
              <span className="material-symbols-outlined">help</span>Ayuda
            </Link>
            <div className="border-t border-white/10 my-4"></div>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 text-red-400 font-headline font-medium py-3 px-4 rounded-lg hover:bg-white/5">
              <span className="material-symbols-outlined">logout</span>Cerrar sesión
            </button>
          </nav>
        </div>
      </div>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">

        {/* Encabezado del reporte */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#f5f3f3] mb-6">
          <div className="flex flex-wrap justify-between items-start gap-3 mb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`${estado.clase} text-[9px] font-bold uppercase px-3 py-1 rounded-full flex items-center gap-1`}>
                {estado.label}
              </span>
              <span className={`${prioridad.clase} text-[9px] font-bold uppercase px-3 py-1 rounded-full`}>
                Prioridad {prioridad.label}
              </span>
            </div>
            <span className="text-xs font-bold text-[#003a7a] font-headline">#{reporte.reportId?.slice(0, 8).toUpperCase()}</span>
          </div>
          <h1 className="text-2xl font-headline font-extrabold text-[#003a7a] mb-2">{reporte.description}</h1>
          <div className="flex items-center gap-2 text-[#424752] mb-3">
            <span className="material-symbols-outlined text-sm">location_on</span>
            <span className="text-sm">{reporte.address || 'Sin dirección'}</span>
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-[#424752]">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">category</span>{reporte.category}
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">calendar_today</span>
              {reporte.createdAt ? new Date(reporte.createdAt).toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Historial de estados */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#f5f3f3]">
            <h2 className="font-headline font-extrabold text-lg text-[#003a7a] mb-6">Estado del Trámite</h2>
            <div className="relative space-y-0">
              <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-[#e4e2e2]"></div>
              {(reporte.history || []).map((paso, i) => (
                <div key={i} className="relative flex gap-4 pb-7">
                  <div className="z-10 w-8 h-8 rounded-full flex items-center justify-center ring-4 ring-white shrink-0 bg-[#003a7a] text-white">
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-[#1b1c1c]">{paso.newStatus}</p>
                    <p className="text-xs text-[#424752]">
                      {paso.timestamp ? new Date(paso.timestamp).toLocaleString('es-CL') : '—'} · {paso.changedBy}
                    </p>
                    {paso.comment && <p className="text-xs text-[#424752] italic mt-0.5">"{paso.comment}"</p>}
                  </div>
                </div>
              ))}
              {(!reporte.history || reporte.history.length === 0) && (
                <p className="text-sm text-[#424752] py-4">Sin historial.</p>
              )}
            </div>
          </div>

          {/* Comentarios */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#f5f3f3]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-headline font-extrabold text-lg text-[#003a7a]">Comentarios</h2>
              <span className="bg-[#c5dcfd] text-[#003a7a] text-[10px] font-bold px-2 py-0.5 rounded-full">
                {(reporte.comentarios || []).length} {(reporte.comentarios || []).length === 1 ? 'respuesta' : 'respuestas'}
              </span>
            </div>
            {(reporte.comentarios || []).length === 0 ? (
              <p className="text-sm text-[#424752] text-center py-8">Sin comentarios aún.</p>
            ) : (
              <div className="space-y-4">
                {(reporte.comentarios || []).map((c, i) => (
                  <div key={i} className="bg-[#f5f3f3] rounded-xl p-4 border-l-4 border-[#003a7a]">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-9 h-9 rounded-full bg-[#0050A5] flex items-center justify-center text-white font-bold text-xs shrink-0">
                        {c.iniciales}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-[#1b1c1c]">{c.autor}</p>
                        <p className="text-[10px] text-[#737783] uppercase font-semibold">{c.fecha}</p>
                      </div>
                    </div>
                    <p className="text-sm text-[#424752] leading-relaxed">{c.texto}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Link
            to="/ciudadano/reportes"
            className="flex-1 border border-[#003a7a] text-[#003a7a] font-headline font-bold py-3 px-6 rounded-full flex items-center justify-center gap-2 hover:bg-[#f5f3f3] transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span> Volver
          </Link>
          {reporte.status === 'RESOLVED' && (
            <button
              onClick={handleReabrir}
              disabled={reabriendo}
              className="flex-1 bg-[#0050A5] text-white font-headline font-bold py-3 px-6 rounded-full flex items-center justify-center gap-2 hover:bg-[#003A7A] transition-colors shadow-lg disabled:opacity-60"
            >
              <span className="material-symbols-outlined">refresh</span>
              {reabriendo ? 'Reabriendo...' : 'Reabrir Reporte'}
            </button>
          )}
        </div>
      </main>

      {/* FOOTER */}
      <CiudadanoFooter />
    </div>
  );
}