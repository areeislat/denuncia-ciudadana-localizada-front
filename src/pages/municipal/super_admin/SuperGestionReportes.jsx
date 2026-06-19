import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../../config/api';
import MunicipalSidebar from '../../../components/MunicipalSidebar';

const estadoConfig = {
  PENDING:     { label: 'Pendiente',  clase: 'bg-amber-100 text-amber-700'   },
  IN_PROGRESS: { label: 'En Proceso', clase: 'bg-blue-100 text-blue-700'     },
  RESOLVED:    { label: 'Resuelto',   clase: 'bg-green-100 text-green-700'   },
  REJECTED:    { label: 'Rechazado',  clase: 'bg-red-100 text-red-700'       },
  REOPENED:    { label: 'Reabierto',  clase: 'bg-purple-100 text-purple-700' },
};

const prioridadConfig = {
  HIGH:     { label: 'Alta',    clase: 'bg-red-100 text-red-700'       },
  MEDIUM:   { label: 'Media',   clase: 'bg-amber-100 text-amber-700'   },
  LOW:      { label: 'Baja',    clase: 'bg-green-100 text-green-700'   },
  CRITICAL: { label: 'Crítica', clase: 'bg-purple-100 text-purple-700' },
};

const filtrosEstado = [
  { label: 'Todos',       value: ''            },
  { label: 'Pendientes',  value: 'PENDING'      },
  { label: 'En Proceso',  value: 'IN_PROGRESS'  },
  { label: 'Resueltos',   value: 'RESOLVED'     },
  { label: 'Rechazados',  value: 'REJECTED'     },
  { label: 'Reabiertos',  value: 'REOPENED'     },
];

export default function SuperGestionReportes() {
  const [reportes, setReportes]       = useState([]);
  const [comunas, setComunas]         = useState([]);
  const [categorias, setCategorias]   = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [total, setTotal]             = useState(0);
  const [totalPages, setTotalPages]   = useState(0);
  const [page, setPage]               = useState(0);

  const [filtroEstado,    setFiltroEstado]    = useState('');
  const [filtroComuna,    setFiltroComuna]    = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroPrioridad, setFiltroPrioridad] = useState('');
  const [busqueda,        setBusqueda]        = useState('');

  const PAGE_SIZE = 20;

  // ── Cargar comunas y categorías ─────────────────────────────────
  useEffect(() => {
    const fetchFiltros = async () => {
      try {
        const [comunasData, categoriasData] = await Promise.all([
          apiClient.get('/api/comunas'),
          apiClient.get('/api/analytics/categorias'),
        ]);
        setComunas(comunasData);
        setCategorias(categoriasData);
      } catch (err) {
        console.error('Error cargando filtros:', err);
      }
    };
    fetchFiltros();
  }, []);

  // ── Cargar reportes ─────────────────────────────────────────────
  const fetchReportes = useCallback(async (currentPage = 0) => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (filtroComuna)    params.append('comunaId', filtroComuna);
      if (filtroEstado)    params.append('status', filtroEstado);
      if (filtroCategoria) params.append('category', filtroCategoria);
      if (filtroPrioridad) params.append('priority', filtroPrioridad);
      params.append('page', currentPage);
      params.append('size', PAGE_SIZE);

      const data = await apiClient.get(`/api/analytics/reportes?${params.toString()}`);
      setReportes(data.reportes || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 0);
      setPage(currentPage);
    } catch (err) {
      setError('No se pudieron cargar los reportes.');
    } finally {
      setLoading(false);
    }
  }, [filtroComuna, filtroEstado, filtroCategoria, filtroPrioridad]);

  useEffect(() => {
    fetchReportes(0);
  }, [fetchReportes]);

  // ── Filtrado local por búsqueda ─────────────────────────────────
  const reportesFiltrados = reportes.filter((r) => {
    if (busqueda === '') return true;
    const q = busqueda.toLowerCase();
    return (
      r.description?.toLowerCase().includes(q) ||
      r.reportId?.toLowerCase().includes(q) ||
      r.address?.toLowerCase().includes(q)
    );
  });

  const getNombreComuna = (id) => {
    const c = comunas.find((c) => c.comunaId === id || c.comunaId === Number(id));
    return c?.nombre || `Comuna ${id}`;
  };

  const formatFecha = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('es-CL', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  };

  return (
    <div>
      <MunicipalSidebar />
      <main className="md:ml-60 p-4 md:p-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#1b1c1c] font-headline mb-1">Gestión de Reportes</h2>
            <p className="text-[#424752] text-sm">Todos los municipios — {total} reporte{total !== 1 ? 's' : ''} en total.</p>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-[#f5f3f3] mb-4 flex flex-col gap-3">
          {/* Búsqueda */}
          <div className="flex items-center gap-2 border border-[#e4e2e2] rounded-lg px-3 py-2">
            <span className="material-symbols-outlined text-[#737783] text-sm">search</span>
            <input
              type="text"
              placeholder="Buscar por ID, descripción o dirección..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="flex-1 text-sm outline-none bg-transparent text-[#1b1c1c] placeholder:text-[#737783]"
            />
          </div>

          {/* Selectores */}
          <div className="flex flex-wrap gap-3">
            <select
              value={filtroComuna}
              onChange={(e) => setFiltroComuna(e.target.value)}
              className="text-sm border border-[#e4e2e2] rounded-lg px-3 py-2 text-[#1b1c1c] outline-none focus:border-[#003a7a]"
            >
              <option value="">Todas las comunas</option>
              {comunas.map((c) => (
                <option key={c.comunaId} value={c.comunaId}>{c.nombre}</option>
              ))}
            </select>

            <select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="text-sm border border-[#e4e2e2] rounded-lg px-3 py-2 text-[#1b1c1c] outline-none focus:border-[#003a7a]"
            >
              <option value="">Todas las categorías</option>
              {categorias.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select
              value={filtroPrioridad}
              onChange={(e) => setFiltroPrioridad(e.target.value)}
              className="text-sm border border-[#e4e2e2] rounded-lg px-3 py-2 text-[#1b1c1c] outline-none focus:border-[#003a7a]"
            >
              <option value="">Todas las prioridades</option>
              <option value="CRITICAL">Crítica</option>
              <option value="HIGH">Alta</option>
              <option value="MEDIUM">Media</option>
              <option value="LOW">Baja</option>
            </select>
          </div>

          {/* Filtros de estado */}
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {filtrosEstado.map((f) => (
              <button
                key={f.value}
                onClick={() => setFiltroEstado(f.value)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  filtroEstado === f.value
                    ? 'bg-[#003a7a] text-white'
                    : 'bg-[#eae8e7] text-[#424752] hover:bg-[#dbd9d9]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Estado carga / error */}
        {loading && (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-[#003a7a] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        {error && !loading && (
          <div className="text-center py-12 text-[#ba1a1a] text-sm">{error}</div>
        )}

        {/* Tabla */}
        {!loading && !error && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-[#f5f3f3]">
              <h3 className="font-headline font-bold text-sm">{reportesFiltrados.length} resultado{reportesFiltrados.length !== 1 ? 's' : ''}</h3>
            </div>

            {/* Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#f5f3f3]">
                  <tr>
                    {['ID', 'Reporte', 'Comuna', 'Categoría', 'Prioridad', 'Estado', 'Fecha', ''].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-[10px] font-bold text-[#737783] uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f5f3f3]">
                  {reportesFiltrados.length === 0 && (
                    <tr><td colSpan="8" className="text-center text-[#424752] text-sm py-12">No hay reportes que coincidan.</td></tr>
                  )}
                  {reportesFiltrados.map((r) => {
                    const est = estadoConfig[r.status]    || estadoConfig['PENDING'];
                    const pri = prioridadConfig[r.priority] || prioridadConfig['MEDIUM'];
                    return (
                      <tr key={r.reportId} className="hover:bg-[#f5f3f3]/50 transition-colors">
                        <td className="px-5 py-3 text-[#003a7a] font-bold text-xs font-mono">
                          #{(r.reportId || '').slice(0, 8).toUpperCase()}
                        </td>
                        <td className="px-5 py-3 max-w-xs">
                          <p className="font-semibold text-[#1b1c1c] truncate">{r.description}</p>
                          <p className="text-[10px] text-[#737783] truncate">{r.address || '—'}</p>
                        </td>
                        <td className="px-5 py-3 text-xs text-[#424752]">
                          {r.comunaId ? getNombreComuna(r.comunaId) : '—'}
                        </td>
                        <td className="px-5 py-3 text-xs text-[#424752]">{r.category || '—'}</td>
                        <td className="px-5 py-3">
                          <span className={`text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full ${pri.clase}`}>
                            {pri.label}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <span className={`text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full ${est.clase}`}>
                            {est.label}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-xs text-[#737783] whitespace-nowrap">
                          {formatFecha(r.createdAt)}
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

            {/* Mobile */}
            <div className="md:hidden divide-y divide-[#f5f3f3]">
              {reportesFiltrados.length === 0 && (
                <p className="text-center text-[#424752] text-sm py-12">No hay reportes que coincidan.</p>
              )}
              {reportesFiltrados.map((r) => {
                const est = estadoConfig[r.status]    || estadoConfig['PENDING'];
                const pri = prioridadConfig[r.priority] || prioridadConfig['MEDIUM'];
                return (
                  <Link key={r.reportId} to={`/municipal/gestion/${r.reportId}`} className="block px-4 py-4 hover:bg-[#f5f3f3]/50">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[#003a7a] font-bold text-xs font-mono">
                        #{(r.reportId || '').slice(0, 8).toUpperCase()}
                      </span>
                      <span className="text-[10px] text-[#737783]">{formatFecha(r.createdAt)}</span>
                    </div>
                    <p className="font-semibold text-[#1b1c1c] text-sm mb-1">{r.description}</p>
                    <p className="text-[10px] text-[#737783] mb-1">{r.address || '—'}</p>
                    <p className="text-[10px] text-[#737783] mb-3">{r.comunaId ? getNombreComuna(r.comunaId) : '—'}</p>
                    <div className="flex flex-wrap gap-2">
                      <span className={`text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full ${est.clase}`}>{est.label}</span>
                      <span className={`text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full ${pri.clase}`}>{pri.label}</span>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-4 border-t border-[#f5f3f3]">
                <button
                  onClick={() => fetchReportes(page - 1)}
                  disabled={page === 0}
                  className="text-xs font-semibold text-[#003a7a] disabled:text-[#737783] disabled:cursor-not-allowed hover:underline"
                >
                  ← Anterior
                </button>
                <span className="text-xs text-[#737783]">Página {page + 1} de {totalPages}</span>
                <button
                  onClick={() => fetchReportes(page + 1)}
                  disabled={page >= totalPages - 1}
                  className="text-xs font-semibold text-[#003a7a] disabled:text-[#737783] disabled:cursor-not-allowed hover:underline"
                >
                  Siguiente →
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}