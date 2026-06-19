import { useState, useEffect } from 'react';
import useAuthStore from '../../../store/authStore';
import MunicipalSidebar from '../../../components/MunicipalSidebar';
import apiClient from '../../../config/api';

const nivelConfig = {
  INFO:    { clase: 'bg-[#c5dcfd] text-[#003a7a]',  icon: 'info'    },
  WARNING: { clase: 'bg-amber-100 text-amber-700',   icon: 'warning' },
  ERROR:   { clase: 'bg-red-100 text-[#ba1a1a]',    icon: 'error'   },
};

const tipoLabel = {
  USER_CREATED:    'Usuario Creado',
  USER_TOGGLED:    'Usuario Activado/Desactivado',
  ROLE_CHANGED:    'Rol Cambiado',
  LOGIN_FAILED:    'Login Fallido',
  COMUNA_CREATED:  'Municipio Creado',
  COMUNA_TOGGLED:  'Municipio Activado/Desactivado',
};

const filtrosNivel = ['Todos', 'INFO', 'WARNING', 'ERROR'];

export default function SuperAuditoriaLogs() {
  const { user } = useAuthStore();

  const [logs, setLogs]           = useState([]);
  const [kpis, setKpis]           = useState({ INFO: 0, WARNING: 0, ERROR: 0 });
  const [total, setTotal]         = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage]           = useState(0);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [busqueda, setBusqueda]   = useState('');
  const [filtroNivel, setFiltroNivel] = useState('Todos');
  const [filtroTipo, setFiltroTipo]   = useState('Todos');
  const [detalle, setDetalle]     = useState(null);

  const PAGE_SIZE = 20;

  // ── Fetch ───────────────────────────────────────────────────────
  const fetchLogs = async (currentPage = 0, nivel = filtroNivel, tipo = filtroTipo) => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (nivel !== 'Todos') params.append('level', nivel);
      if (tipo  !== 'Todos') params.append('eventType', tipo);
      params.append('page', currentPage);
      params.append('size', PAGE_SIZE);

      const data = await apiClient.get(`/api/audit/logs?${params.toString()}`);
      setLogs(data.logs);
      setKpis(data.kpis);
      setTotal(data.total);
      setTotalPages(data.totalPages);
      setPage(currentPage);
    } catch (err) {
      setError('No se pudieron cargar los logs de auditoría.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(0, filtroNivel, filtroTipo);
  }, [filtroNivel, filtroTipo]);

  // ── Filtrado local por búsqueda ─────────────────────────────────
  const logsFiltrados = logs.filter((l) => {
    if (busqueda === '') return true;
    const q = busqueda.toLowerCase();
    return (
      l.description?.toLowerCase().includes(q) ||
      l.actorEmail?.toLowerCase().includes(q) ||
      l.eventType?.toLowerCase().includes(q)
    );
  });

  // ── Exportar CSV ────────────────────────────────────────────────
  const handleExportCSV = () => {
    const headers = ['ID', 'Nivel', 'Tipo', 'Descripción', 'Actor', 'Fecha'];
    const rows = logs.map((l) => [
      l.id,
      l.level,
      tipoLabel[l.eventType] || l.eventType,
      `"${l.description}"`,
      l.actorEmail,
      new Date(l.createdAt).toLocaleString('es-CL'),
    ]);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `auditoria_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatFecha = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('es-CL', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  // ── Render ──────────────────────────────────────────────────────
  return (
    <div>
      <MunicipalSidebar />
      <main className="md:ml-60 p-4 md:p-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#1b1c1c] font-headline mb-1">Auditoría</h2>
            <p className="text-[#424752] text-sm">Historial de acciones críticas del sistema.</p>
          </div>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 border border-[#003a7a] text-[#003a7a] font-headline font-bold py-2.5 px-5 rounded-full text-sm hover:bg-[#f5f3f3] transition-colors self-start"
          >
            <span className="material-symbols-outlined text-sm">download</span>Exportar CSV
          </button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {['INFO', 'WARNING', 'ERROR'].map((n) => (
            <div key={n} className={`bg-white rounded-xl p-4 shadow-sm border-l-4 ${
              n === 'INFO' ? 'border-[#003a7a]' : n === 'WARNING' ? 'border-amber-400' : 'border-[#ba1a1a]'
            }`}>
              <p className="text-[10px] font-bold text-[#737783] uppercase tracking-wider">{n}</p>
              <p className={`text-2xl font-extrabold font-headline mt-1 ${
                n === 'INFO' ? 'text-[#003a7a]' : n === 'WARNING' ? 'text-amber-600' : 'text-[#ba1a1a]'
              }`}>{kpis[n] ?? 0}</p>
            </div>
          ))}
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-[#f5f3f3] mb-6 flex flex-col md:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2 border border-[#e4e2e2] rounded-lg px-3 py-2">
            <span className="material-symbols-outlined text-[#737783] text-sm">search</span>
            <input
              type="text"
              placeholder="Buscar por actor, descripción o tipo..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="flex-1 text-sm outline-none bg-transparent text-[#1b1c1c] placeholder:text-[#737783]"
            />
          </div>
          <select
            value={filtroTipo}
            onChange={(e) => { setFiltroTipo(e.target.value); setPage(0); }}
            className="text-sm border border-[#e4e2e2] rounded-lg px-3 py-2 text-[#1b1c1c] outline-none focus:border-[#003a7a]"
          >
            <option value="Todos">Todos los tipos</option>
            {Object.entries(tipoLabel).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          <div className="flex gap-2">
            {filtrosNivel.map((f) => (
              <button
                key={f}
                onClick={() => { setFiltroNivel(f); setPage(0); }}
                className={`px-3 py-2 rounded-full text-xs font-semibold transition-all ${
                  filtroNivel === f
                    ? 'bg-[#003a7a] text-white'
                    : 'bg-[#eae8e7] text-[#424752] hover:bg-[#dbd9d9]'
                }`}
              >
                {f}{f !== 'Todos' ? ` (${kpis[f] ?? 0})` : ` (${total})`}
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
            <div className="p-4 md:p-5 border-b border-[#f5f3f3]">
              <h3 className="font-headline font-bold text-sm">{total} evento{total !== 1 ? 's' : ''}</h3>
            </div>

            {/* Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#f5f3f3]">
                  <tr>
                    {['Nivel', 'Tipo', 'Descripción', 'Actor', 'Fecha', ''].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-[10px] font-bold text-[#737783] uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f5f3f3]">
                  {logsFiltrados.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center text-[#424752] text-sm py-12">No hay eventos que coincidan.</td>
                    </tr>
                  )}
                  {logsFiltrados.map((log) => {
                    const nivel = nivelConfig[log.level] || nivelConfig.INFO;
                    return (
                      <tr key={log.id} className="hover:bg-[#f5f3f3]/50 transition-colors">
                        <td className="px-5 py-3">
                          <span className={`text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 w-fit ${nivel.clase}`}>
                            <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>{nivel.icon}</span>
                            {log.level}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-xs font-semibold text-[#1b1c1c]">{tipoLabel[log.eventType] || log.eventType}</td>
                        <td className="px-5 py-3 text-xs text-[#424752] max-w-xs truncate">{log.description}</td>
                        <td className="px-5 py-3 text-xs text-[#424752]">{log.actorEmail}</td>
                        <td className="px-5 py-3 text-xs text-[#737783] whitespace-nowrap">{formatFecha(log.createdAt)}</td>
                        <td className="px-5 py-3">
                          <button
                            onClick={() => setDetalle(log)}
                            className="text-[#003a7a] hover:bg-[#f5f3f3] p-1.5 rounded-lg transition-colors"
                          >
                            <span className="material-symbols-outlined text-sm">open_in_new</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="md:hidden divide-y divide-[#f5f3f3]">
              {logsFiltrados.length === 0 && (
                <p className="text-center text-[#424752] text-sm py-12">No hay eventos que coincidan.</p>
              )}
              {logsFiltrados.map((log) => {
                const nivel = nivelConfig[log.level] || nivelConfig.INFO;
                return (
                  <div key={log.id} className="px-4 py-4" onClick={() => setDetalle(log)}>
                    <div className="flex items-start justify-between mb-2">
                      <span className={`text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 ${nivel.clase}`}>
                        <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>{nivel.icon}</span>
                        {log.level}
                      </span>
                      <span className="text-[10px] text-[#737783]">{formatFecha(log.createdAt)}</span>
                    </div>
                    <p className="font-semibold text-[#1b1c1c] text-sm mb-1">{tipoLabel[log.eventType] || log.eventType}</p>
                    <p className="text-xs text-[#424752] mb-1 line-clamp-2">{log.description}</p>
                    <p className="text-[10px] text-[#737783]">{log.actorEmail}</p>
                  </div>
                );
              })}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-4 border-t border-[#f5f3f3]">
                <button
                  onClick={() => fetchLogs(page - 1)}
                  disabled={page === 0}
                  className="text-xs font-semibold text-[#003a7a] disabled:text-[#737783] disabled:cursor-not-allowed hover:underline"
                >
                  ← Anterior
                </button>
                <span className="text-xs text-[#737783]">Página {page + 1} de {totalPages}</span>
                <button
                  onClick={() => fetchLogs(page + 1)}
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

      {/* Modal detalle */}
      {detalle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDetalle(null)}></div>
          <div className="relative bg-white rounded-2xl p-6 shadow-2xl max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-headline font-extrabold text-[#1b1c1c] text-lg">Detalle del Evento</h3>
              <button onClick={() => setDetalle(null)} className="text-[#737783] hover:bg-[#f5f3f3] p-1.5 rounded-lg">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Nivel',       valor: detalle.level,                          badge: true  },
                { label: 'Tipo',        valor: tipoLabel[detalle.eventType] || detalle.eventType, badge: false },
                { label: 'Descripción', valor: detalle.description,                    badge: false },
                { label: 'Actor',       valor: detalle.actorEmail,                     badge: false },
                { label: 'Valor anterior', valor: detalle.oldValue || '—',             badge: false },
                { label: 'Valor nuevo', valor: detalle.newValue || '—',                badge: false },
                { label: 'Fecha',       valor: formatFecha(detalle.createdAt),         badge: false },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-[10px] font-bold text-[#737783] uppercase tracking-wider mb-1">{item.label}</p>
                  {item.badge ? (
                    <span className={`text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full ${nivelConfig[detalle.level]?.clase}`}>
                      {item.valor}
                    </span>
                  ) : (
                    <p className="text-sm text-[#1b1c1c] font-medium">{item.valor}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}