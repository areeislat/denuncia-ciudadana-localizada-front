import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import MapComponent from '../../../components/MapComponent';
import useAuthStore from '../../../store/authStore';

const panelMarkers = [
  { lat: -33.422, lng: -70.615, title: 'Cluster 1', color: '#dc2626', n: 12 },
  { lat: -33.43,  lng: -70.605, title: 'Cluster 2', color: '#2563eb', n: 45 },
  { lat: -33.426, lng: -70.61,  title: 'Cluster 3', color: '#16a34a', n: 8  },
  { lat: -33.434, lng: -70.618, title: 'Cluster 4', color: '#f97316', n: 5  },
];

// TODO: reemplazar con llamada al Report Service cuando esté disponible
const mockTickets = [
  { id: '1', titulo: 'Reparar luminaria Av. Los Leones', asignadoPor: 'Juan Pérez', hace: 'Hace 2h',  estado: 'ASSIGNED', icon: 'light_off',    iconBg: 'bg-amber-100 text-amber-700' },
  { id: '2', titulo: 'Reparar bache calle Suecia',       asignadoPor: 'Juan Pérez', hace: 'Ayer',     estado: 'IN_PROGRESS', icon: 'construction', iconBg: 'bg-blue-100 text-blue-700'   },
];

const mockReportes = [
  { id: '1', titulo: 'Falla Luminaria Pública',  lugar: 'Plaza de Armas',  hace: 'Hace 15 min', estado: 'CRITICAL', iniciales: 'RP', iconBg: 'bg-red-100 text-red-700'     },
  { id: '2', titulo: 'Microbasural en esquina',  lugar: "Av. O'Higgins",   hace: 'Hoy 10:45',   estado: 'IN_PROGRESS', iniciales: 'MS', iconBg: 'bg-amber-100 text-amber-700' },
  { id: '3', titulo: 'Bache Profundo',           lugar: 'Los Leones 230',  hace: 'Hoy 09:12',   estado: 'PENDING',  iniciales: 'JL', iconBg: 'bg-slate-100 text-slate-700'  },
];

const estadoBadge = {
  CRITICAL:    'badge-critico',
  ASSIGNED:    'badge-asignado',
  IN_PROGRESS: 'badge-proceso',
  PENDING:     'badge-pendiente',
};

const estadoLabel = {
  CRITICAL:    'Crítico',
  ASSIGNED:    'Asignado',
  IN_PROGRESS: 'En Proceso',
  PENDING:     'Pendiente',
};

// Navegación según rol
const navItems = (role) => {
  const base = [
    { label: 'Dashboard',        icon: 'dashboard',       to: '/municipal/dashboard', active: true  },
    { label: 'Gestión Reportes', icon: 'assignment',      to: '/municipal/gestion',   badge: '18'   },
    { label: 'Mapa',             icon: 'map',             to: '/municipal/mapa'                     },
    { label: 'Usuarios',         icon: 'group',           to: '/municipal/usuarios'                 },
  ];
  if (role === 'ADMIN_MUNICIPAL' || role === 'SUPER_ADMIN') {
    base.push({ label: 'Estadísticas',   icon: 'bar_chart',  to: '/municipal/estadisticas' });
    base.push({ label: 'Configuración',  icon: 'settings',   to: '/municipal/configuracion' });
  }
  if (role === 'SUPER_ADMIN') {
    base.push({ label: 'Municipalidades', icon: 'location_city', to: '/super/municipalidades' });
    base.push({ label: 'Auditoría',       icon: 'policy',        to: '/super/auditoria'       });
  }
  return base;
};

export default function MunicipalDashboard() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

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

  const items = navItems(role);

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
            <div className="w-9 h-9 rounded-full bg-[#0050A5] flex items-center justify-center text-white text-xs font-bold shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-white text-xs font-bold truncate">{user?.fullName}</p>
              <p className="text-slate-400 text-[10px]">{roleLabel}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-0.5 px-2 overflow-y-auto">
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider px-3 mb-1">General</p>
          <Link to="/municipal/gestion/crear" className="sidebar-link rounded-lg px-3 py-2.5 flex items-center gap-2.5 text-sm text-slate-300 hover:text-white">
            <span className="material-symbols-outlined text-lg">add_circle</span>
            <span className="font-headline font-medium">Crear Ticket</span>
          </Link>
          {!isSuperAdmin && (
            <a href="#" className="sidebar-link rounded-lg px-3 py-2.5 flex items-center gap-2.5 text-sm text-slate-300 hover:text-white">
              <span className="material-symbols-outlined text-lg">assignment_ind</span>
              <span className="font-headline font-medium">Mis Asignaciones</span>
              <span className="ml-auto bg-orange-500/20 text-orange-300 text-[9px] font-bold px-2 py-0.5 rounded-full">3</span>
            </a>
          )}

          <div className="border-t border-white/5 my-2 mx-2"></div>
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider px-3 mb-1">Gestión</p>

          {items.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className={`sidebar-link rounded-lg px-3 py-2.5 flex items-center gap-2.5 text-sm ${
                item.active ? 'sidebar-active text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              <span className={`material-symbols-outlined text-lg ${item.active ? 'fill-icon' : ''}`}>{item.icon}</span>
              <span className="font-headline font-medium">{item.label}</span>
              {item.badge && (
                <span className="ml-auto bg-red-500/20 text-red-300 text-[9px] font-bold px-2 py-0.5 rounded-full">{item.badge}</span>
              )}
            </Link>
          ))}
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
              <p className="text-slate-400 text-[10px]">{roleLabel}</p>
            </div>
          </div>
          <nav className="space-y-1">
            {items.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 font-headline font-medium py-2.5 px-3 rounded-lg text-sm ${
                  item.active ? 'text-white bg-white/10' : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>{item.label}
              </Link>
            ))}
            <div className="border-t border-white/10 my-3"></div>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 text-red-400 font-headline font-medium py-2.5 px-3 rounded-lg hover:bg-white/5 text-sm">
              <span className="material-symbols-outlined">logout</span>Cerrar sesión
            </button>
          </nav>
        </div>
      </div>

      {/* MAIN */}
      <main className="md:ml-60 p-4 md:p-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#1b1c1c] font-headline mb-1">Dashboard</h2>
        <p className="text-[#424752] text-sm mb-6">
          Resumen de reportes ciudadanos —{' '}
          <span className="bg-[#d7e2ff] text-[#003a7a] px-2 py-0.5 rounded-full text-[10px] font-bold">{roleLabel}</span>
        </p>

        {/* KPIs base — todos los roles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
          <div className="bg-white p-4 md:p-5 rounded-xl shadow-sm border-l-4 border-[#003a7a]">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Activos</span>
            <div className="text-2xl md:text-3xl font-extrabold font-headline mt-1">342</div>
            <div className="text-[#003a7a] text-xs font-semibold mt-1 flex items-center gap-0.5">
              <span className="material-symbols-outlined text-xs">trending_up</span>+12% vs ayer
            </div>
          </div>
          <div className="bg-white p-4 md:p-5 rounded-xl shadow-sm border-l-4 border-[#D7141A]">
            <span className="text-[10px] font-bold text-[#D7141A] uppercase tracking-wider">Críticos</span>
            <div className="text-2xl md:text-3xl font-extrabold font-headline mt-1">18</div>
            <div className="text-[#D7141A] text-xs font-semibold mt-1">Atención inmediata</div>
          </div>
          <div className="bg-white p-4 md:p-5 rounded-xl shadow-sm border-l-4 border-[#0050A5]">
            <span className="text-[10px] font-bold text-[#0050A5] uppercase tracking-wider">En Proceso</span>
            <div className="text-2xl md:text-3xl font-extrabold font-headline mt-1">156</div>
            <div className="text-[#0050A5] text-xs font-semibold mt-1">Gestión activa</div>
          </div>
          <div className="bg-white p-4 md:p-5 rounded-xl shadow-sm border-l-4 border-[#059669]">
            <span className="text-[10px] font-bold text-[#059669] uppercase tracking-wider">Resueltos</span>
            <div className="text-2xl md:text-3xl font-extrabold font-headline mt-1">47</div>
            <div className="text-[#059669] text-xs font-semibold mt-1">Meta cumplida 85%</div>
          </div>
        </div>

        {/* KPIs extra — solo ADMIN_MUNICIPAL y SUPER_ADMIN */}
        {(isAdmin || isSuperAdmin) && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-8">
            <div className="bg-white p-4 md:p-5 rounded-xl shadow-sm border-l-4 border-[#7c3aed]">
              <span className="text-[10px] font-bold text-[#7c3aed] uppercase tracking-wider">Tiempo Promedio</span>
              <div className="text-2xl font-extrabold font-headline mt-1">28h</div>
              <div className="text-[#7c3aed] text-xs font-semibold mt-1">Resolución promedio</div>
            </div>
            <div className="bg-white p-4 md:p-5 rounded-xl shadow-sm border-l-4 border-[#0891b2]">
              <span className="text-[10px] font-bold text-[#0891b2] uppercase tracking-wider">Satisfacción</span>
              <div className="text-2xl font-extrabold font-headline mt-1">92%</div>
              <div className="text-[#0891b2] text-xs font-semibold mt-1">Ciudadanos conformes</div>
            </div>
            {isSuperAdmin && (
              <div className="bg-white p-4 md:p-5 rounded-xl shadow-sm border-l-4 border-[#d97706]">
                <span className="text-[10px] font-bold text-[#d97706] uppercase tracking-wider">Municipios Activos</span>
                <div className="text-2xl font-extrabold font-headline mt-1">12</div>
                <div className="text-[#d97706] text-xs font-semibold mt-1">En toda la región</div>
              </div>
            )}
          </div>
        )}

        {/* Mis tickets — solo OFFICER y ADMIN */}
        {!isSuperAdmin && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8">
            <div className="p-4 md:p-5 border-b border-[#f5f3f3] flex justify-between items-center">
              <h3 className="font-headline font-bold text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-[#f97316]">assignment_ind</span>
                Tickets Asignados a Mí
              </h3>
              <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                {mockTickets.length} activos
              </span>
            </div>
            <div className="divide-y divide-[#f5f3f3]">
              {mockTickets.map((t) => (
                <div key={t.id} className="px-4 md:px-5 py-3 flex items-center justify-between hover:bg-[#f5f3f3]/50">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center ${t.iconBg}`}>
                      <span className="material-symbols-outlined text-sm">{t.icon}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{t.titulo}</p>
                      <p className="text-[10px] text-slate-400">Asignado por {t.asignadoPor} · {t.hace}</p>
                    </div>
                  </div>
                  <span className={`${estadoBadge[t.estado]} px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase`}>
                    {estadoLabel[t.estado]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mapa */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8">
          <div className="p-4 md:p-5 border-b border-[#f5f3f3]">
            <h3 className="font-headline font-bold text-sm text-[#003a7a] flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">map</span>
              {isSuperAdmin ? 'Mapa Global de Reportes' : 'Mapa de Reportes'}
            </h3>
          </div>
          <MapComponent markers={panelMarkers} height="350px" />
        </div>

        {/* Últimos reportes */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8">
          <div className="p-4 md:p-5 border-b border-[#f5f3f3] flex justify-between items-center">
            <h3 className="font-headline font-bold text-sm">Últimos Reportes</h3>
            <Link to="/municipal/gestion" className="text-[#003a7a] font-bold text-xs flex items-center gap-1">
              Ver todos <span className="material-symbols-outlined text-sm">chevron_right</span>
            </Link>
          </div>
          <div className="divide-y divide-[#f5f3f3]">
            {mockReportes.map((r) => (
              <div key={r.id} className="px-4 md:px-5 py-3 flex items-center justify-between hover:bg-[#f5f3f3]/50">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center ${r.iconBg} text-[10px] font-bold`}>
                    {r.iniciales}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{r.titulo}</p>
                    <p className="text-[10px] text-slate-400">{r.lugar} · {r.hace}</p>
                  </div>
                </div>
                <span className={`${estadoBadge[r.estado]} px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase`}>
                  {estadoLabel[r.estado]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
