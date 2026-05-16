import { Link, useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import apiClient from '../../../config/api';
import useAuthStore from '../../../store/authStore';

const estadoConfig = {
  PENDING:     { label: 'Pendiente',  clase: 'badge-pendiente' },
  IN_PROGRESS: { label: 'En Proceso', clase: 'badge-proceso' },
  RESOLVED:    { label: 'Resuelto',   clase: 'badge-resuelto' },
  REJECTED:    { label: 'Rechazado',  clase: 'badge-rechazado' },
};

const prioridadConfig = {
  HIGH:   { label: 'Alta',  clase: 'bg-[#D7141A] text-white' },
  MEDIUM: { label: 'Media', clase: 'bg-amber-100 text-amber-800' },
  LOW:    { label: 'Baja',  clase: 'bg-green-100 text-green-800' },
};

const ESTADOS = ['PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'];

export default function MunicipalDetalleReporte() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [reporte, setReporte] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [nuevoEstado, setNuevoEstado] = useState('');
  const [comentario, setComentario] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [errorGuardar, setErrorGuardar] = useState(null);
  const [exito, setExito] = useState(false);

  const initials = user?.fullName
    ?.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase() || '?';

  const handleLogout = () => { logout(); navigate('/login'); };

  useEffect(() => {
    const fetchReporte = async () => {
      try {
        setCargando(true);
        setError(null);
        const data = await apiClient.get(`/api/reports/${id}`);
        setReporte(data);
        setNuevoEstado(data.status);
      } catch (err) {
        if (err.response?.status === 401) { logout(); navigate('/login'); }
        else setError('No se pudo cargar el reporte.');
      } finally {
        setCargando(false);
      }
    };
    fetchReporte();
  }, [id]);

  const handleGuardarEstado = async () => {
    if (!nuevoEstado || nuevoEstado === reporte?.status) return;
    try {
      setGuardando(true);
      setErrorGuardar(null);
      setExito(false);
      const data = await apiClient.patch(`/api/reports/${id}/status`, {
        status: nuevoEstado,
        ...(comentario.trim() ? { comment: comentario.trim() } : {}),
      });
      setReporte(data);
      setComentario('');
      setExito(true);
    } catch {
      setErrorGuardar('No se pudo actualizar el estado. Intenta nuevamente.');
    } finally {
      setGuardando(false);
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
        <Link to="/municipal/gestion" className="text-[#003a7a] font-bold text-sm flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">arrow_back</span> Volver a gestión
        </Link>
      </div>
    );
  }

  const estado = estadoConfig[reporte.status] || estadoConfig['PENDING'];
  const prioridad = prioridadConfig[reporte.priority] || prioridadConfig['MEDIUM'];

  return (
    <div>
      {/* SIDEBAR desktop */}
      <aside className="hidden md:flex flex-col h-screen w-60 fixed left-0 top-0 bg-[#001A33] py-5 z-50">
        <div className="px-5 mb-6">
          <h1 className="text-base font-bold text-white font-headline">DESIGEO</h1>
          <p className="text-slate-400 text-[10px] mt-0.5">Panel de Gestión</p>
        </div>
        <div className="px-4 mb-5">
          <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3">
            <div className="w-9 h-9 rounded-full bg-[#0050A5] flex items-center justify-center text-white text-xs font-bold shrink-0">{initials}</div>
            <div className="min-w-0">
              <p className="text-white text-xs font-bold truncate">{user?.fullName}</p>
              <p className="text-slate-400 text-[10px]">Funcionario Municipal</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 space-y-0.5 px-2 overflow-y-auto">
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider px-3 mb-1">Gestión</p>
          <Link to="/municipal/dashboard" className="sidebar-link rounded-lg px-3 py-2.5 flex items-center gap-2.5 text-sm text-slate-300 hover:text-white">
            <span className="material-symbols-outlined text-lg">dashboard</span>
            <span className="font-headline font-medium">Dashboard</span>
          </Link>
          <Link to="/municipal/gestion" className="sidebar-link sidebar-active rounded-lg px-3 py-2.5 flex items-center gap-2.5 text-sm text-white">
            <span className="material-symbols-outlined text-lg fill-icon">assignment</span>
            <span className="font-headline font-medium">Gestión Reportes</span>
          </Link>
          <Link to="/municipal/usuarios" className="sidebar-link rounded-lg px-3 py-2.5 flex items-center gap-2.5 text-sm text-slate-300 hover:text-white">
            <span className="material-symbols-outlined text-lg">group</span>
            <span className="font-headline font-medium">Usuarios</span>
          </Link>
        </nav>
        <div className="px-3 mt-auto">
          <button onClick={handleLogout} className="text-slate-400 hover:text-white px-2 py-2 flex items-center gap-2 text-sm w-full">
            <span className="material-symbols-outlined text-lg">logout</span>Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* MOBILE HEADER */}
      <header className="md:hidden bg-[#001A33] sticky top-0 z-50 shadow-lg px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <button onClick={() => setMobileMenuOpen(true)} className="text-white">
            <span className="material-symbols-outlined">menu</span>
          </button>
          <button onClick={() => navigate(-1)} className="text-white">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <span className="text-lg font-extrabold text-white font-headline">DESIGEO</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-[#0050A5] flex items-center justify-center text-white text-xs font-bold">{initials}</div>
      </header>

      {/* MOBILE MENU */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-backdrop" onClick={() => setMobileMenuOpen(false)}></div>
        <div className="mobile-menu-panel">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white font-headline font-bold">DESIGEO</span>
            <button onClick={() => setMobileMenuOpen(false)} className="text-white">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <nav className="space-y-1">
            <Link to="/municipal/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-slate-300 font-headline font-medium py-2.5 px-3 rounded-lg hover:bg-white/5 text-sm">
              <span className="material-symbols-outlined">dashboard</span>Dashboard
            </Link>
            <Link to="/municipal/gestion" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-white font-headline font-medium py-2.5 px-3 rounded-lg bg-white/10 text-sm">
              <span className="material-symbols-outlined">assignment</span>Gestión Reportes
            </Link>
            <Link to="/municipal/usuarios" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-slate-300 font-headline font-medium py-2.5 px-3 rounded-lg hover:bg-white/5 text-sm">
              <span className="material-symbols-outlined">group</span>Usuarios
            </Link>
            <div className="border-t border-white/10 my-3"></div>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 text-red-400 font-headline font-medium py-2.5 px-3 rounded-lg hover:bg-white/5 text-sm">
              <span className="material-symbols-outlined">logout</span>Cerrar sesión
            </button>
          </nav>
        </div>
      </div>

      {/* MAIN */}
      <main className="md:ml-60 p-4 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="hidden md:flex text-[#003a7a] hover:bg-[#f5f3f3] p-2 rounded-lg transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h2 className="text-2xl font-extrabold text-[#1b1c1c] font-headline">Detalle del Reporte</h2>
            <p className="text-[#737783] text-xs font-mono">#{reporte.reportId?.slice(0, 8).toUpperCase()}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Columna principal */}
          <div className="md:col-span-2 space-y-6">

            {/* Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#f5f3f3]">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className={`${estado.clase} text-[9px] font-bold uppercase px-3 py-1 rounded-full`}>{estado.label}</span>
                <span className={`${prioridad.clase} text-[9px] font-bold uppercase px-3 py-1 rounded-full`}>Prioridad {prioridad.label}</span>
              </div>
              <h3 className="text-xl font-headline font-extrabold text-[#003a7a] mb-3">{reporte.description}</h3>
              <div className="space-y-2 text-sm text-[#424752]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">location_on</span>
                  <span>{reporte.address || 'Sin dirección'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">category</span>
                  <span>{reporte.category || '—'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">calendar_today</span>
                  <span>{reporte.createdAt ? new Date(reporte.createdAt).toLocaleString('es-CL') : '—'}</span>
                </div>
              </div>
            </div>

            {/* Actualizar estado */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#f5f3f3]">
              <h3 className="font-headline font-extrabold text-lg text-[#003a7a] mb-4">Actualizar Estado</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#424752] uppercase tracking-wider mb-1.5">Nuevo estado</label>
                  <select
                    value={nuevoEstado}
                    onChange={(e) => { setNuevoEstado(e.target.value); setExito(false); }}
                    className="w-full bg-[#f5f3f3] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#003a7a] text-sm"
                  >
                    {ESTADOS.map((s) => (
                      <option key={s} value={s}>{estadoConfig[s]?.label || s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#424752] uppercase tracking-wider mb-1.5">Comentario (opcional)</label>
                  <textarea
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    rows="3"
                    placeholder="Agrega una nota sobre este cambio de estado..."
                    className="w-full bg-[#f5f3f3] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#003a7a] text-sm resize-none"
                  />
                </div>

                {errorGuardar && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl px-4 py-3">{errorGuardar}</div>
                )}
                {exito && (
                  <div className="bg-green-50 border border-green-200 text-green-700 text-xs rounded-xl px-4 py-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    Estado actualizado correctamente.
                  </div>
                )}

                <button
                  onClick={handleGuardarEstado}
                  disabled={guardando || nuevoEstado === reporte.status}
                  className="w-full bg-[#0050A5] text-white font-headline font-bold py-3 rounded-xl shadow-sm hover:bg-[#003A7A] transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {guardando ? (
                    <><span className="material-symbols-outlined text-sm animate-spin">progress_activity</span> Guardando...</>
                  ) : (
                    <><span className="material-symbols-outlined text-sm">save</span> Guardar cambio</>
                  )}
                </button>
                {nuevoEstado === reporte.status && (
                  <p className="text-[10px] text-[#737783] text-center">Selecciona un estado diferente al actual para habilitar el botón.</p>
                )}
              </div>
            </div>
          </div>

          {/* Historial */}
          <div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#f5f3f3]">
              <h3 className="font-headline font-extrabold text-lg text-[#003a7a] mb-6">Historial</h3>
              <div className="relative space-y-0">
                <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-[#e4e2e2]"></div>
                {(reporte.history || []).map((paso, i) => (
                  <div key={i} className="relative flex gap-4 pb-6">
                    <div className="z-10 w-8 h-8 rounded-full flex items-center justify-center ring-4 ring-white shrink-0 bg-[#003a7a] text-white">
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                    </div>
                    <div>
                      <p className="font-bold text-sm text-[#1b1c1c]">{estadoConfig[paso.newStatus]?.label || paso.newStatus}</p>
                      <p className="text-[10px] text-[#424752]">
                        {paso.timestamp ? new Date(paso.timestamp).toLocaleString('es-CL') : '—'} · {paso.changedBy}
                      </p>
                      {paso.comment && <p className="text-xs text-[#424752] italic mt-0.5">"{paso.comment}"</p>}
                    </div>
                  </div>
                ))}
                {(!reporte.history || reporte.history.length === 0) && (
                  <p className="text-sm text-[#424752] py-4 pl-12">Sin historial.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Link
            to="/municipal/gestion"
            className="inline-flex items-center gap-2 border border-[#003a7a] text-[#003a7a] font-headline font-bold py-2.5 px-6 rounded-full hover:bg-[#f5f3f3] transition-colors text-sm"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span> Volver a Gestión
          </Link>
        </div>
      </main>
    </div>
  );
}
