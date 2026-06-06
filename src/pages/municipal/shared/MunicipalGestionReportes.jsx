import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import apiClient from '../../../config/api';
import useAuthStore from '../../../store/authStore';
import MunicipalSidebar from '../../../components/MunicipalSidebar';

const estadoConfig = {
  PENDING:          { label: 'Pendiente',            clase: 'badge-pendiente' },
  IN_PROGRESS:      { label: 'En Proceso',            clase: 'badge-proceso'   },
  RESOLVED:         { label: 'Resuelto',              clase: 'badge-resuelto'  },
  REJECTED:         { label: 'Rechazado',             clase: 'badge-rechazado' },
  REOPENED:         { label: 'Reabierto',             clase: 'badge-proceso'   },
  REOPEN_REQUESTED: { label: 'Reapertura Solicitada', clase: 'bg-amber-100 text-amber-800' },
};

const prioridadConfig = {
  HIGH:     { label: 'Alta',     clase: 'bg-red-100 text-red-700'       },
  MEDIUM:   { label: 'Media',    clase: 'bg-amber-100 text-amber-700'   },
  LOW:      { label: 'Baja',     clase: 'bg-green-100 text-green-700'   },
  CRITICAL: { label: 'Crítica',  clase: 'bg-purple-100 text-purple-700' },
};

const filtrosEstado = ['Todos', 'Pendientes', 'En Proceso', 'Resueltos', 'Rechazados', 'Reapertura'];
const filtroEstadoMap = {
  'Todos': null, 'Pendientes': 'PENDING', 'En Proceso': 'IN_PROGRESS',
  'Resueltos': 'RESOLVED', 'Rechazados': 'REJECTED', 'Reapertura': 'REOPEN_REQUESTED',
};

export default function MunicipalGestionReportes() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [filtroPrioridad, setFiltroPrioridad] = useState('Todas');
  const [busqueda, setBusqueda] = useState('');
  const [reportes, setReportes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const role = user?.roleName || 'MUNICIPAL_OFFICER';
  const isAdmin      = role === 'ADMIN_MUNICIPAL';
  const isSuperAdmin = role === 'SUPER_ADMIN';

  const roleLabel = {
    MUNICIPAL_OFFICER: 'Funcionario Municipal',
    ADMIN_MUNICIPAL:   'Administrador Municipal',
    SUPER_ADMIN:       'Super Administrador',
  }[role] || role;

  useEffect(() => {
    const fetchReportes = async () => {
      try {
        setCargando(true);
        setError(null);
        const data = await apiClient.get('/api/reports?page=0&size=100');
        setReportes(data.reports || []);
      } catch (err) {
        if (err.response?.status === 401) { logout(); navigate('/login'); }
        else setError('No se pudieron cargar los reportes.');
      } finally {
        setCargando(false);
      }
    };
    fetchReportes();
  }, []);

  const reportesFiltrados = reportes.filter((r) => {
    const matchEstado    = !filtroEstadoMap[filtroEstado] || r.status === filtroEstadoMap[filtroEstado];
    const matchPrioridad = filtroPrioridad === 'Todas' || r.priority === filtroPrioridad;
    const matchBusqueda  = busqueda === '' ||
      (r.description || '').toLowerCase().includes(busqueda.toLowerCase()) ||
      (r.reportId || '').toLowerCase().includes(busqueda.toLowerCase()) ||
      (r.address || '').toLowerCase().includes(busqueda.toLowerCase());
    return matchEstado && matchPrioridad && matchBusqueda;
  });

  const conteo = (f) => f === 'Todos'
    ? reportes.length
    : reportes.filter((r) => r.status === filtroEstadoMap[f]).length;

  return (
    <div>
      <MunicipalSidebar />

      {/* MAIN */}
      <main className="md:ml-60 p-4 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#1b1c1c] font-headline mb-1">Gestión de Reportes</h2>
            <p className="text-[#424752] text-sm">
              {isSuperAdmin ? 'Todos los municipios' : isAdmin ? 'Tu municipio' : 'Reportes asignados a ti'}
            </p>
          </div>
          {(isAdmin || isSuperAdmin) && (
            <div className="flex gap-2">
              <button className="flex items-center gap-2 border border-[#003a7a] text-[#003a7a] font-headline font-bold py-2.5 px-5 rounded-full text-sm hover:bg-[#f5f3f3] transition-colors">
                <span className="material-symbols-outlined text-sm">download</span>Exportar
              </button>
            </div>
          )}
        </div>

        {/* Búsqueda y filtros */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-[#f5f3f3] mb-6 flex flex-col md:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2 border border-[#e4e2e2] rounded-lg px-3 py-2">
            <span className="material-symbols-outlined text-[#737783] text-sm">search</span>
            <input
              type="text"
              placeholder="Buscar por ID, descripción o dirección..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="flex-1 text-sm outline-none bg-transparent text-[#1b1c1c] placeholder:text-[#737783]"
            />
          </div>
          <select
            value={filtroPrioridad}
            onChange={(e) => setFiltroPrioridad(e.target.value)}
            className="text-sm border border-[#e4e2e2] rounded-lg px-3 py-2 text-[#1b1c1c] outline-none focus:border-[#003a7a]"
          >
            <option value="Todas">Todas las prioridades</option>
            <option value="HIGH">Alta</option>
            <option value="MEDIUM">Media</option>
            <option value="LOW">Baja</option>
          </select>
        </div>

        {/* Filtros de estado */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-6" style={{ scrollbarWidth: 'none' }}>
          {filtrosEstado.map((f) => (
            <button
              key={f}
              onClick={() => setFiltroEstado(f)}
              className={`flex-shrink-0 px-5 py-2 rounded-full text-xs font-semibold transition-all ${
                filtroEstado === f
                  ? 'bg-[#003a7a] text-white shadow-sm'
                  : 'bg-[#eae8e7] text-[#424752] hover:bg-[#dbd9d9]'
              }`}
            >
              {f} ({conteo(f)})
            </button>
          ))}
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 md:p-5 border-b border-[#f5f3f3] flex justify-between items-center">
            <h3 className="font-headline font-bold text-sm">
              {cargando ? 'Cargando...' : `${reportesFiltrados.length} reporte${reportesFiltrados.length !== 1 ? 's' : ''}`}
            </h3>
          </div>

          {cargando && (
            <div className="flex items-center justify-center gap-3 py-16 text-[#424752]">
              <span className="material-symbols-outlined animate-spin">progress_activity</span>
              <span className="text-sm">Cargando reportes...</span>
            </div>
          )}

          {error && !cargando && (
            <div className="text-center py-16">
              <p className="text-[#424752] text-sm mb-3">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="text-[#003a7a] font-bold text-sm hover:underline"
              >
                Reintentar
              </button>
            </div>
          )}

          {!cargando && !error && (
            <>
              {/* Desktop tabla */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#f5f3f3]">
                    <tr>
                      <th className="text-left px-5 py-3 text-[10px] font-bold text-[#737783] uppercase tracking-wider">ID</th>
                      <th className="text-left px-5 py-3 text-[10px] font-bold text-[#737783] uppercase tracking-wider">Reporte</th>
                      <th className="text-left px-5 py-3 text-[10px] font-bold text-[#737783] uppercase tracking-wider">Categoría</th>
                      <th className="text-left px-5 py-3 text-[10px] font-bold text-[#737783] uppercase tracking-wider">Prioridad</th>
                      <th className="text-left px-5 py-3 text-[10px] font-bold text-[#737783] uppercase tracking-wider">Estado</th>
                      <th className="text-left px-5 py-3 text-[10px] font-bold text-[#737783] uppercase tracking-wider">Fecha</th>
                      <th className="px-5 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f5f3f3]">
                    {reportesFiltrados.length === 0 && (
                      <tr>
                        <td colSpan="7" className="text-center text-[#424752] text-sm py-12">No hay reportes que coincidan.</td>
                      </tr>
                    )}
                    {reportesFiltrados.map((r) => {
                      const est = estadoConfig[r.status] || estadoConfig['PENDING'];
                      const pri = prioridadConfig[r.priority] || prioridadConfig['MEDIUM'];
                      return (
                        <tr key={r.reportId} className="hover:bg-[#f5f3f3]/50 transition-colors">
                          <td className="px-5 py-3 text-[#003a7a] font-bold text-xs font-mono">
                            #{(r.reportId || '').slice(0, 8).toUpperCase()}
                          </td>
                          <td className="px-5 py-3">
                            <p className="font-semibold text-[#1b1c1c]">{r.description}</p>
                            <p className="text-[10px] text-[#737783]">{r.address || 'Sin dirección'}</p>
                          </td>
                          <td className="px-5 py-3 text-xs text-[#424752]">{r.category || '—'}</td>
                          <td className="px-5 py-3">
                            <span className={`${pri.clase} text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full`}>
                              {pri.label}
                            </span>
                          </td>
                          <td className="px-5 py-3">
                            <span className={`${est.clase} text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full`}>
                              {est.label}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-xs text-[#737783]">
                            {r.createdAt ? new Date(r.createdAt).toLocaleDateString('es-CL') : '—'}
                          </td>
                          <td className="px-5 py-3">
                            <Link
                              to={`/municipal/gestion/${r.reportId}`}
                              className="text-[#003a7a] hover:underline font-bold text-xs flex items-center gap-0.5"
                            >
                              Ver <span className="material-symbols-outlined text-sm">chevron_right</span>
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden divide-y divide-[#f5f3f3]">
                {reportesFiltrados.length === 0 && (
                  <p className="text-center text-[#424752] text-sm py-12">No hay reportes que coincidan.</p>
                )}
                {reportesFiltrados.map((r) => {
                  const est = estadoConfig[r.status] || estadoConfig['PENDING'];
                  const pri = prioridadConfig[r.priority] || prioridadConfig['MEDIUM'];
                  return (
                    <Link
                      key={r.reportId}
                      to={`/municipal/gestion/${r.reportId}`}
                      className="block px-4 py-4 hover:bg-[#f5f3f3]/50"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[#003a7a] font-bold text-xs font-mono">
                          #{(r.reportId || '').slice(0, 8).toUpperCase()}
                        </span>
                        <span className="text-[10px] text-[#737783]">
                          {r.createdAt ? new Date(r.createdAt).toLocaleDateString('es-CL') : '—'}
                        </span>
                      </div>
                      <p className="font-semibold text-[#1b1c1c] text-sm mb-1">{r.description}</p>
                      <p className="text-[10px] text-[#737783] mb-3">{r.address || 'Sin dirección'}</p>
                      <div className="flex flex-wrap gap-2">
                        <span className={`${est.clase} text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full`}>
                          {est.label}
                        </span>
                        <span className={`${pri.clase} text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full`}>
                          {pri.label}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
