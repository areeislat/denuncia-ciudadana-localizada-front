import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import apiClient from '../../../config/api';
import useAuthStore from '../../../store/authStore';

const estadoConfig = {
  PENDING:     { label: 'Pendiente',  clase: 'badge-pendiente', icon: 'pending' },
  IN_PROGRESS: { label: 'En Proceso', clase: 'badge-proceso',   icon: 'sync' },
  RESOLVED:    { label: 'Resuelto',   clase: 'badge-resuelto',  icon: 'check_circle' },
  REJECTED:    { label: 'Rechazado',  clase: 'badge-rechazado', icon: 'cancel' },
};

const prioridadConfig = {
  HIGH:   { label: 'Alta',  clase: 'bg-[#D7141A] text-white' },
  MEDIUM: { label: 'Media', clase: 'bg-amber-100 text-amber-800' },
  LOW:    { label: 'Baja',  clase: 'bg-green-100 text-green-800' },
};

const filtros = ['Todos', 'Pendientes', 'En Proceso', 'Resueltos', 'Rechazados'];
const filtroToStatus = {
  'Todos':      '',
  'Pendientes': 'PENDING',
  'En Proceso': 'IN_PROGRESS',
  'Resueltos':  'RESOLVED',
  'Rechazados': 'REJECTED',
};

const PAGE_SIZE = 20;

export default function MunicipalGestionReportes() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [reportes, setReportes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [filtroActivo, setFiltroActivo] = useState('Todos');
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);

  const initials = user?.fullName
    ?.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase() || '?';

  const handleLogout = () => { logout(); navigate('/login'); };

  useEffect(() => {
    const fetchReportes = async () => {
      try {
        setCargando(true);
        setError(null);
        const statusParam = filtroToStatus[filtroActivo];
        const params = new URLSearchParams({ page, size: PAGE_SIZE });
        if (statusParam) params.append('status', statusParam);
        const data = await apiClient.get(`/api/reports?${params}`);
        setReportes(data.reports || []);
        setTotal(data.total || 0);
      } catch (err) {
        if (err.response?.status === 401) { logout(); navigate('/login'); }
        else setError('No se pudieron cargar los reportes.');
      } finally {
        setCargando(false);
      }
    };
    fetchReportes();
  }, [filtroActivo, page]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const formatFecha = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' });
  };

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
          <span className="text-lg font-extrabold text-white font-headline">DESIGEO</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-white">notifications</span>
          <div className="w-8 h-8 rounded-full bg-[#0050A5] flex items-center justify-center text-white text-xs font-bold">{initials}</div>
        </div>
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
          <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-[#0050A5] flex items-center justify-center text-white text-xs font-bold">{initials}</div>
            <div>
              <p className="text-white text-xs font-bold">{user?.fullName}</p>
              <p className="text-slate-400 text-[10px]">Funcionario Municipal</p>
            </div>
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#1b1c1c] font-headline mb-1">Gestión de Reportes</h2>
            <p className="text-[#424752] text-sm">{cargando ? '...' : `${total} reportes en total`}</p>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-6" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
          {filtros.map((f) => (
            <button
              key={f}
              onClick={() => { setFiltroActivo(f); setPage(0); }}
              className={`flex-shrink-0 px-5 py-2 rounded-full text-xs font-semibold transition-all ${
                filtroActivo === f ? 'bg-[#003a7a] text-white shadow-sm' : 'bg-[#eae8e7] text-[#424752] hover:bg-[#dbd9d9]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6 flex items-center gap-3">
            <span className="material-symbols-outlined text-[#ba1a1a]">error</span>
            <p className="text-sm text-[#ba1a1a] font-medium">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 md:p-5 border-b border-[#f5f3f3]">
            <h3 className="font-headline font-bold text-sm">
              {cargando ? 'Cargando...' : `${reportes.length} resultado${reportes.length !== 1 ? 's' : ''}`}
            </h3>
          </div>

          {cargando && (
            <div className="flex items-center justify-center py-16 gap-3 text-[#424752]">
              <span className="material-symbols-outlined animate-spin">progress_activity</span>
              <span className="text-sm">Cargando reportes...</span>
            </div>
          )}

          {/* Desktop tabla */}
          {!cargando && (
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#f5f3f3]">
                  <tr>
                    <th className="text-left px-5 py-3 text-[10px] font-bold text-[#737783] uppercase tracking-wider">Descripción</th>
                    <th className="text-left px-5 py-3 text-[10px] font-bold text-[#737783] uppercase tracking-wider">Dirección</th>
                    <th className="text-left px-5 py-3 text-[10px] font-bold text-[#737783] uppercase tracking-wider">Estado</th>
                    <th className="text-left px-5 py-3 text-[10px] font-bold text-[#737783] uppercase tracking-wider">Prioridad</th>
                    <th className="text-left px-5 py-3 text-[10px] font-bold text-[#737783] uppercase tracking-wider">Fecha</th>
                    <th className="px-5 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f5f3f3]">
                  {reportes.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center text-[#424752] text-sm py-12">No hay reportes en esta categoría.</td>
                    </tr>
                  )}
                  {reportes.map((r) => {
                    const estado = estadoConfig[r.status] || estadoConfig['PENDING'];
                    const prioridad = prioridadConfig[r.priority] || prioridadConfig['MEDIUM'];
                    return (
                      <tr key={r.reportId} className="hover:bg-[#f5f3f3]/50 transition-colors">
                        <td className="px-5 py-3 max-w-xs">
                          <p className="font-semibold text-[#1b1c1c] truncate">{r.description}</p>
                          <p className="text-[10px] text-[#737783]">#{r.reportId?.slice(0, 8).toUpperCase()}</p>
                        </td>
                        <td className="px-5 py-3 text-xs text-[#424752] max-w-[160px] truncate">{r.address || '—'}</td>
                        <td className="px-5 py-3">
                          <span className={`${estado.clase} text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 w-fit`}>
                            <span className="material-symbols-outlined text-xs fill-icon">{estado.icon}</span>
                            {estado.label}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <span className={`${prioridad.clase} text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full`}>
                            {prioridad.label}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-xs text-[#737783]">{formatFecha(r.createdAt)}</td>
                        <td className="px-5 py-3">
                          <Link
                            to={`/municipal/gestion/${r.reportId}`}
                            className="text-[#003a7a] hover:bg-[#f5f3f3] p-1.5 rounded-lg transition-colors inline-flex"
                            title="Ver detalle"
                          >
                            <span className="material-symbols-outlined text-sm">open_in_new</span>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Mobile cards */}
          {!cargando && (
            <div className="md:hidden divide-y divide-[#f5f3f3]">
              {reportes.length === 0 && (
                <p className="text-center text-[#424752] text-sm py-12">No hay reportes en esta categoría.</p>
              )}
              {reportes.map((r) => {
                const estado = estadoConfig[r.status] || estadoConfig['PENDING'];
                const prioridad = prioridadConfig[r.priority] || prioridadConfig['MEDIUM'];
                return (
                  <Link key={r.reportId} to={`/municipal/gestion/${r.reportId}`} className="block px-4 py-4 hover:bg-[#f5f3f3]/50">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="font-semibold text-[#1b1c1c] text-sm line-clamp-2">{r.description}</p>
                      <span className={`${estado.clase} text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full shrink-0`}>{estado.label}</span>
                    </div>
                    <p className="text-xs text-[#424752] mb-1">{r.address || 'Sin dirección'}</p>
                    <div className="flex items-center gap-2">
                      <span className={`${prioridad.clase} text-[9px] font-bold uppercase px-2 py-0.5 rounded-full`}>{prioridad.label}</span>
                      <span className="text-[10px] text-[#737783]">{formatFecha(r.createdAt)}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Paginación */}
        {!cargando && totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="flex items-center gap-1 text-sm font-bold text-[#003a7a] disabled:text-[#c2c6d4] disabled:cursor-not-allowed px-4 py-2 rounded-full border border-[#003a7a] disabled:border-[#c2c6d4] hover:bg-[#f5f3f3] transition-colors"
            >
              <span className="material-symbols-outlined text-sm">chevron_left</span> Anterior
            </button>
            <span className="text-sm text-[#424752]">Página {page + 1} de {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="flex items-center gap-1 text-sm font-bold text-[#003a7a] disabled:text-[#c2c6d4] disabled:cursor-not-allowed px-4 py-2 rounded-full border border-[#003a7a] disabled:border-[#c2c6d4] hover:bg-[#f5f3f3] transition-colors"
            >
              Siguiente <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
