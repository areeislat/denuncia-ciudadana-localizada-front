import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useAuthStore from '../../../store/authStore';
import MunicipalSidebar from '../../../components/MunicipalSidebar';

// TODO: reemplazar con llamada al backend cuando esté disponible
const mockLogs = [
  { id: '1',  tipo: 'USER_CREATED',      actor: 'admin@providencia.cl', descripcion: 'Usuario carlos@email.com creado con rol MUNICIPAL_OFFICER', municipio: 'Providencia',  nivel: 'INFO',    fecha: '2026-05-12T10:23:00Z' },
  { id: '2',  tipo: 'USER_DELETED',      actor: 'super@desigeo.cl',     descripcion: 'Usuario juan@email.com eliminado del sistema',              municipio: 'Sistema',      nivel: 'WARNING', fecha: '2026-05-12T09:45:00Z' },
  { id: '3',  tipo: 'ROLE_CHANGED',      actor: 'super@desigeo.cl',     descripcion: 'Rol de maria@email.com cambiado de CITIZEN a MUNICIPAL_OFFICER', municipio: 'Ñuñoa',   nivel: 'WARNING', fecha: '2026-05-12T09:12:00Z' },
  { id: '4',  tipo: 'REPORT_REJECTED',   actor: 'officer@nunoa.cl',     descripcion: 'Reporte #DEN-2026-0041 rechazado: fuera de jurisdicción',   municipio: 'Ñuñoa',        nivel: 'INFO',    fecha: '2026-05-11T16:30:00Z' },
  { id: '5',  tipo: 'LOGIN_FAILED',      actor: 'unknown@email.com',    descripcion: 'Intento de login fallido — 3 intentos consecutivos',        municipio: 'Sistema',      nivel: 'ERROR',   fecha: '2026-05-11T15:22:00Z' },
  { id: '6',  tipo: 'MUNICIPIO_CREATED', actor: 'super@desigeo.cl',     descripcion: 'Municipalidad de Macul creada en el sistema',               municipio: 'Sistema',      nivel: 'INFO',    fecha: '2026-05-11T11:05:00Z' },
  { id: '7',  tipo: 'MUNICIPIO_DELETED', actor: 'super@desigeo.cl',     descripcion: 'Municipalidad de Peñalolén eliminada del sistema',          municipio: 'Sistema',      nivel: 'ERROR',   fecha: '2026-05-10T14:18:00Z' },
  { id: '8',  tipo: 'CONFIG_CHANGED',    actor: 'admin@macul.cl',       descripcion: 'Configuración de formulario actualizada',                   municipio: 'Macul',        nivel: 'INFO',    fecha: '2026-05-10T10:33:00Z' },
  { id: '9',  tipo: 'USER_LOCKED',       actor: 'Sistema',              descripcion: 'Usuario pedro@email.com bloqueado por exceso de intentos',  municipio: 'Sistema',      nivel: 'ERROR',   fecha: '2026-05-09T08:47:00Z' },
  { id: '10', tipo: 'REPORT_REOPENED',   actor: 'citizen@email.com',    descripcion: 'Reporte #DEN-2026-0028 reabierto por el ciudadano',         municipio: 'Providencia',  nivel: 'INFO',    fecha: '2026-05-09T07:15:00Z' },
];

const nivelConfig = {
  INFO:    { clase: 'bg-[#c5dcfd] text-[#003a7a]',   icon: 'info'    },
  WARNING: { clase: 'bg-amber-100 text-amber-700',    icon: 'warning' },
  ERROR:   { clase: 'bg-red-100 text-[#ba1a1a]',     icon: 'error'   },
};

const tipoLabel = {
  USER_CREATED:      'Usuario Creado',
  USER_DELETED:      'Usuario Eliminado',
  USER_LOCKED:       'Usuario Bloqueado',
  ROLE_CHANGED:      'Rol Cambiado',
  REPORT_REJECTED:   'Reporte Rechazado',
  REPORT_REOPENED:   'Reporte Reabierto',
  LOGIN_FAILED:      'Login Fallido',
  MUNICIPIO_CREATED: 'Municipio Creado',
  MUNICIPIO_DELETED: 'Municipio Eliminado',
  CONFIG_CHANGED:    'Config. Actualizada',
};

const filtrosNivel = ['Todos', 'INFO', 'WARNING', 'ERROR'];

export default function SuperAuditoriaLogs() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [filtroNivel, setFiltroNivel] = useState('Todos');
  const [filtroTipo, setFiltroTipo] = useState('Todos');
  const [detalle, setDetalle] = useState(null);

  const initials = user?.fullName
    ?.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase() || '?';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const logsFiltrados = mockLogs.filter((l) => {
    const matchBusqueda = busqueda === '' ||
      l.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
      l.actor.toLowerCase().includes(busqueda.toLowerCase()) ||
      l.municipio.toLowerCase().includes(busqueda.toLowerCase());
    const matchNivel = filtroNivel === 'Todos' || l.nivel === filtroNivel;
    const matchTipo  = filtroTipo  === 'Todos' || l.tipo  === filtroTipo;
    return matchBusqueda && matchNivel && matchTipo;
  });

  const conteoNivel = (n) => n === 'Todos'
    ? mockLogs.length
    : mockLogs.filter((l) => l.nivel === n).length;

  const formatFecha = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('es-CL', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  return (
    <div>
      <MunicipalSidebar />

      {/* MAIN */}
      <main className="md:ml-60 p-4 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#1b1c1c] font-headline mb-1">Auditoría</h2>
            <p className="text-[#424752] text-sm">Historial de acciones críticas del sistema.</p>
          </div>
          <button className="flex items-center gap-2 border border-[#003a7a] text-[#003a7a] font-headline font-bold py-2.5 px-5 rounded-full text-sm hover:bg-[#f5f3f3] transition-colors self-start">
            <span className="material-symbols-outlined text-sm">download</span>Exportar CSV
          </button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {filtrosNivel.filter((f) => f !== 'Todos').map((n) => {
            const config = nivelConfig[n];
            return (
              <div key={n} className={`bg-white rounded-xl p-4 shadow-sm border-l-4 ${
                n === 'INFO' ? 'border-[#003a7a]' : n === 'WARNING' ? 'border-amber-400' : 'border-[#ba1a1a]'
              }`}>
                <p className="text-[10px] font-bold text-[#737783] uppercase tracking-wider">{n}</p>
                <p className={`text-2xl font-extrabold font-headline mt-1 ${
                  n === 'INFO' ? 'text-[#003a7a]' : n === 'WARNING' ? 'text-amber-600' : 'text-[#ba1a1a]'
                }`}>{conteoNivel(n)}</p>
              </div>
            );
          })}
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-[#f5f3f3] mb-6 flex flex-col md:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2 border border-[#e4e2e2] rounded-lg px-3 py-2">
            <span className="material-symbols-outlined text-[#737783] text-sm">search</span>
            <input
              type="text"
              placeholder="Buscar por actor, descripción o municipio..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="flex-1 text-sm outline-none bg-transparent text-[#1b1c1c] placeholder:text-[#737783]"
            />
          </div>
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
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
                onClick={() => setFiltroNivel(f)}
                className={`px-3 py-2 rounded-full text-xs font-semibold transition-all ${
                  filtroNivel === f
                    ? 'bg-[#003a7a] text-white'
                    : 'bg-[#eae8e7] text-[#424752] hover:bg-[#dbd9d9]'
                }`}
              >
                {f} ({conteoNivel(f)})
              </button>
            ))}
          </div>
        </div>

        {/* Lista de logs */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 md:p-5 border-b border-[#f5f3f3]">
            <h3 className="font-headline font-bold text-sm">
              {logsFiltrados.length} evento{logsFiltrados.length !== 1 ? 's' : ''}
            </h3>
          </div>

          {/* Desktop tabla */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#f5f3f3]">
                <tr>
                  <th className="text-left px-5 py-3 text-[10px] font-bold text-[#737783] uppercase tracking-wider">Nivel</th>
                  <th className="text-left px-5 py-3 text-[10px] font-bold text-[#737783] uppercase tracking-wider">Tipo</th>
                  <th className="text-left px-5 py-3 text-[10px] font-bold text-[#737783] uppercase tracking-wider">Descripción</th>
                  <th className="text-left px-5 py-3 text-[10px] font-bold text-[#737783] uppercase tracking-wider">Actor</th>
                  <th className="text-left px-5 py-3 text-[10px] font-bold text-[#737783] uppercase tracking-wider">Municipio</th>
                  <th className="text-left px-5 py-3 text-[10px] font-bold text-[#737783] uppercase tracking-wider">Fecha</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f5f3f3]">
                {logsFiltrados.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center text-[#424752] text-sm py-12">No hay eventos que coincidan.</td>
                  </tr>
                )}
                {logsFiltrados.map((log) => {
                  const nivel = nivelConfig[log.nivel];
                  return (
                    <tr key={log.id} className="hover:bg-[#f5f3f3]/50 transition-colors">
                      <td className="px-5 py-3">
                        <span className={`text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 w-fit ${nivel.clase}`}>
                          <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>{nivel.icon}</span>
                          {log.nivel}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-xs font-semibold text-[#1b1c1c]">{tipoLabel[log.tipo]}</td>
                      <td className="px-5 py-3 text-xs text-[#424752] max-w-xs truncate">{log.descripcion}</td>
                      <td className="px-5 py-3 text-xs text-[#424752]">{log.actor}</td>
                      <td className="px-5 py-3 text-xs text-[#424752]">{log.municipio}</td>
                      <td className="px-5 py-3 text-xs text-[#737783] whitespace-nowrap">{formatFecha(log.fecha)}</td>
                      <td className="px-5 py-3">
                        <button
                          onClick={() => setDetalle(log)}
                          className="text-[#003a7a] hover:bg-[#f5f3f3] p-1.5 rounded-lg transition-colors"
                          title="Ver detalle"
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

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-[#f5f3f3]">
            {logsFiltrados.length === 0 && (
              <p className="text-center text-[#424752] text-sm py-12">No hay eventos que coincidan.</p>
            )}
            {logsFiltrados.map((log) => {
              const nivel = nivelConfig[log.nivel];
              return (
                <div key={log.id} className="px-4 py-4" onClick={() => setDetalle(log)}>
                  <div className="flex items-start justify-between mb-2">
                    <span className={`text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 ${nivel.clase}`}>
                      <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>{nivel.icon}</span>
                      {log.nivel}
                    </span>
                    <span className="text-[10px] text-[#737783]">{formatFecha(log.fecha)}</span>
                  </div>
                  <p className="font-semibold text-[#1b1c1c] text-sm mb-1">{tipoLabel[log.tipo]}</p>
                  <p className="text-xs text-[#424752] mb-1 line-clamp-2">{log.descripcion}</p>
                  <p className="text-[10px] text-[#737783]">{log.actor} · {log.municipio}</p>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Modal detalle log */}
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
                { label: 'Nivel',      valor: detalle.nivel,                   badge: true  },
                { label: 'Tipo',       valor: tipoLabel[detalle.tipo],          badge: false },
                { label: 'Descripción',valor: detalle.descripcion,              badge: false },
                { label: 'Actor',      valor: detalle.actor,                    badge: false },
                { label: 'Municipio',  valor: detalle.municipio,                badge: false },
                { label: 'Fecha',      valor: formatFecha(detalle.fecha),       badge: false },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-[10px] font-bold text-[#737783] uppercase tracking-wider mb-1">{item.label}</p>
                  {item.badge ? (
                    <span className={`text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full ${nivelConfig[detalle.nivel].clase}`}>
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