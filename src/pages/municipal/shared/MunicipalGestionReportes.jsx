import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useAuthStore from '../../../store/authStore';
import MunicipalSidebar from '../../../components/MunicipalSidebar';

// TODO: reemplazar con llamada al Report Service cuando esté disponible
const mockReportes = [
  { id: '1', folio: '#DEN-2026-0001', titulo: 'Bache en cruce peatonal',       direccion: 'Av. Irarrázaval 3421, Ñuñoa',     categoria: 'Vialidad',       prioridad: 'HIGH',   estado: 'PENDING',     asignadoA: null,             fecha: 'Hace 2h',    municipio: 'Ñuñoa'      },
  { id: '2', folio: '#DEN-2026-0002', titulo: 'Microbasural Av. Providencia',  direccion: 'Av. Providencia 1240',            categoria: 'Medio Ambiente', prioridad: 'MEDIUM', estado: 'IN_PROGRESS', asignadoA: 'Carlos Fuentes', fecha: 'Ayer 14:30', municipio: 'Providencia' },
  { id: '3', folio: '#DEN-2026-0003', titulo: 'Luminaria dañada Los Leones',   direccion: 'Calle Los Leones 450',            categoria: 'Luminaria',      prioridad: 'MEDIUM', estado: 'RESOLVED',    asignadoA: 'Ana Torres',     fecha: '3 Oct',      municipio: 'Providencia' },
  { id: '4', folio: '#DEN-2026-0004', titulo: 'Vehículo mal estacionado',      direccion: 'Pje. Las Orquideas 45',           categoria: 'Tránsito',       prioridad: 'LOW',    estado: 'REJECTED',    asignadoA: null,             fecha: '28 Sep',     municipio: 'Ñuñoa'      },
  { id: '5', folio: '#DEN-2026-0005', titulo: 'Falla en semáforo',             direccion: 'Av. Grecia con Pedro de Valdivia', categoria: 'Vialidad',       prioridad: 'HIGH',   estado: 'PENDING',     asignadoA: null,             fecha: 'Hace 1h',    municipio: 'Macul'      },
  { id: '6', folio: '#DEN-2026-0006', titulo: 'Árbol caído en vereda',         direccion: 'Calle Ossa 123, Macul',           categoria: 'Medio Ambiente', prioridad: 'HIGH',   estado: 'IN_PROGRESS', asignadoA: 'Carlos Fuentes', fecha: 'Hoy 08:00',  municipio: 'Macul'      },
];

const estadoConfig = {
  PENDING:     { label: 'Pendiente', clase: 'badge-pendiente' },
  IN_PROGRESS: { label: 'En Proceso', clase: 'badge-proceso'  },
  RESOLVED:    { label: 'Resuelto',  clase: 'badge-resuelto'  },
  REJECTED:    { label: 'Rechazado', clase: 'badge-rechazado' },
};

const prioridadConfig = {
  HIGH:   { label: 'Alta',  clase: 'bg-red-100 text-red-700'     },
  MEDIUM: { label: 'Media', clase: 'bg-amber-100 text-amber-700' },
  LOW:    { label: 'Baja',  clase: 'bg-green-100 text-green-700' },
};

const filtrosEstado = ['Todos', 'Pendientes', 'En Proceso', 'Resueltos', 'Rechazados'];
const filtroEstadoMap = {
  'Todos': null, 'Pendientes': 'PENDING', 'En Proceso': 'IN_PROGRESS',
  'Resueltos': 'RESOLVED', 'Rechazados': 'REJECTED',
};

export default function MunicipalGestionReportes() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [filtroPrioridad, setFiltroPrioridad] = useState('Todas');
  const [busqueda, setBusqueda] = useState('');

  const role = user?.roleName || 'MUNICIPAL_OFFICER';
  const isAdmin      = role === 'ADMIN_MUNICIPAL';
  const isSuperAdmin = role === 'SUPER_ADMIN';

  const initials = user?.fullName
    ?.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase() || '?';

  const roleLabel = {
    MUNICIPAL_OFFICER: 'Funcionario Municipal',
    ADMIN_MUNICIPAL:   'Administrador Municipal',
    SUPER_ADMIN:       'Super Administrador',
  }[role] || role;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const reportesFiltrados = mockReportes.filter((r) => {
    const matchEstado    = !filtroEstadoMap[filtroEstado] || r.estado === filtroEstadoMap[filtroEstado];
    const matchPrioridad = filtroPrioridad === 'Todas' || r.prioridad === filtroPrioridad;
    const matchBusqueda  = busqueda === '' ||
      r.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      r.folio.toLowerCase().includes(busqueda.toLowerCase()) ||
      r.direccion.toLowerCase().includes(busqueda.toLowerCase());
    return matchEstado && matchPrioridad && matchBusqueda;
  });

  const conteo = (f) => f === 'Todos'
    ? mockReportes.length
    : mockReportes.filter((r) => estadoConfig[r.estado].label === f ||
        r.estado === filtroEstadoMap[f]).length;

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
              placeholder="Buscar por folio, título o dirección..."
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
              {reportesFiltrados.length} reporte{reportesFiltrados.length !== 1 ? 's' : ''}
            </h3>
          </div>

          {/* Desktop tabla */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#f5f3f3]">
                <tr>
                  <th className="text-left px-5 py-3 text-[10px] font-bold text-[#737783] uppercase tracking-wider">Folio</th>
                  <th className="text-left px-5 py-3 text-[10px] font-bold text-[#737783] uppercase tracking-wider">Reporte</th>
                  <th className="text-left px-5 py-3 text-[10px] font-bold text-[#737783] uppercase tracking-wider">Categoría</th>
                  <th className="text-left px-5 py-3 text-[10px] font-bold text-[#737783] uppercase tracking-wider">Prioridad</th>
                  <th className="text-left px-5 py-3 text-[10px] font-bold text-[#737783] uppercase tracking-wider">Estado</th>
                  {(isAdmin || isSuperAdmin) && (
                    <th className="text-left px-5 py-3 text-[10px] font-bold text-[#737783] uppercase tracking-wider">Asignado a</th>
                  )}
                  {isSuperAdmin && (
                    <th className="text-left px-5 py-3 text-[10px] font-bold text-[#737783] uppercase tracking-wider">Municipio</th>
                  )}
                  <th className="text-left px-5 py-3 text-[10px] font-bold text-[#737783] uppercase tracking-wider">Fecha</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f5f3f3]">
                {reportesFiltrados.length === 0 && (
                  <tr>
                    <td colSpan="9" className="text-center text-[#424752] text-sm py-12">No hay reportes que coincidan.</td>
                  </tr>
                )}
                {reportesFiltrados.map((r) => (
                  <tr key={r.id} className="hover:bg-[#f5f3f3]/50 transition-colors">
                    <td className="px-5 py-3 text-[#003a7a] font-bold text-xs">{r.folio}</td>
                    <td className="px-5 py-3">
                      <p className="font-semibold text-[#1b1c1c]">{r.titulo}</p>
                      <p className="text-[10px] text-[#737783]">{r.direccion}</p>
                    </td>
                    <td className="px-5 py-3 text-xs text-[#424752]">{r.categoria}</td>
                    <td className="px-5 py-3">
                      <span className={`${prioridadConfig[r.prioridad].clase} text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full`}>
                        {prioridadConfig[r.prioridad].label}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`${estadoConfig[r.estado].clase} text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full`}>
                        {estadoConfig[r.estado].label}
                      </span>
                    </td>
                    {(isAdmin || isSuperAdmin) && (
                      <td className="px-5 py-3 text-xs text-[#424752]">{r.asignadoA || '—'}</td>
                    )}
                    {isSuperAdmin && (
                      <td className="px-5 py-3 text-xs text-[#424752]">{r.municipio}</td>
                    )}
                    <td className="px-5 py-3 text-xs text-[#737783]">{r.fecha}</td>
                    <td className="px-5 py-3">
                      <Link
                        to={`/municipal/gestion/${r.id}`}
                        className="text-[#003a7a] hover:underline font-bold text-xs flex items-center gap-0.5"
                      >
                        Ver <span className="material-symbols-outlined text-sm">chevron_right</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-[#f5f3f3]">
            {reportesFiltrados.length === 0 && (
              <p className="text-center text-[#424752] text-sm py-12">No hay reportes que coincidan.</p>
            )}
            {reportesFiltrados.map((r) => (
              <Link
                key={r.id}
                to={`/municipal/gestion/${r.id}`}
                className="block px-4 py-4 hover:bg-[#f5f3f3]/50"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[#003a7a] font-bold text-xs">{r.folio}</span>
                  <span className="text-[10px] text-[#737783]">{r.fecha}</span>
                </div>
                <p className="font-semibold text-[#1b1c1c] text-sm mb-1">{r.titulo}</p>
                <p className="text-[10px] text-[#737783] mb-3">{r.direccion}</p>
                <div className="flex flex-wrap gap-2">
                  <span className={`${estadoConfig[r.estado].clase} text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full`}>
                    {estadoConfig[r.estado].label}
                  </span>
                  <span className={`${prioridadConfig[r.prioridad].clase} text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full`}>
                    {prioridadConfig[r.prioridad].label}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}