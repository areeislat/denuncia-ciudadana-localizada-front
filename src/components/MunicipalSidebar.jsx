// components/MunicipalSidebar.jsx
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import useAuthStore from '../store/authStore';

const navItems = (role) => {
  const base = [
    { label: 'Dashboard',        icon: 'dashboard',  to: '/municipal/dashboard' },
    { label: 'Gestión Reportes', icon: 'assignment', to: '/municipal/gestion'   },
  ];

  if (role === 'ADMIN_MUNICIPAL' ) {
    base.push({ label: 'Usuarios',      icon: 'group',     to: '/admin/usuarios'      });
    base.push({ label: 'Estadísticas',  icon: 'bar_chart', to: '/admin/estadisticas'  });
    base.push({ label: 'Configuración', icon: 'settings',  to: '/admin/configuracion' });
  }

  if (role === 'SUPER_ADMIN') {
  base.push({ label: 'Municipalidades', icon: 'location_city', to: '/super/municipalidades' });
  base.push({ label: 'Usuarios',        icon: 'group',         to: '/super/usuarios'        });
  base.push({ label: 'Estadísticas',    icon: 'bar_chart',     to: '/admin/estadisticas'    });
  base.push({ label: 'Configuración',   icon: 'settings',      to: '/admin/configuracion'   });
  base.push({ label: 'Auditoría',       icon: 'policy',        to: '/super/auditoria'       });
}

  return base;
};

export default function MunicipalSidebar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const role = user?.roleName || 'MUNICIPAL_OFFICER';
  const items = navItems(role);
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

  const isActive = (to) => location.pathname === to;

  const SidebarLink = ({ item, onClick }) => (
    <Link
      to={item.to}
      onClick={onClick}
      className={`sidebar-link rounded-lg px-3 py-2.5 flex items-center gap-2.5 text-sm ${
        isActive(item.to) ? 'sidebar-active text-white' : 'text-slate-300 hover:text-white'
      }`}
    >
      <span className={`material-symbols-outlined text-lg ${isActive(item.to) ? 'fill-icon' : ''}`}>
        {item.icon}
      </span>
      <span className="font-headline font-medium">{item.label}</span>
    </Link>
  );

  return (
    <>
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
          {!isSuperAdmin && (
            <>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider px-3 mb-1">General</p>
              <Link
                to="/municipal/gestion/crear"
                className={`sidebar-link rounded-lg px-3 py-2.5 flex items-center gap-2.5 text-sm ${
                  isActive('/municipal/gestion/crear') ? 'sidebar-active text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-lg">add_circle</span>
                <span className="font-headline font-medium">Crear Reporte</span>
              </Link>
              <div className="border-t border-white/5 my-2 mx-2"></div>
            </>
          )}

          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider px-3 mb-1">Gestión</p>
          {items.map((item) => (
            <SidebarLink key={item.to} item={item} />
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
            {!isSuperAdmin && (
              <Link
                to="/municipal/gestion/crear"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 text-slate-300 font-headline font-medium py-2.5 px-3 rounded-lg hover:bg-white/5 text-sm"
              >
                <span className="material-symbols-outlined">add_circle</span>Crear Reporte
              </Link>
            )}
            {items.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 font-headline font-medium py-2.5 px-3 rounded-lg text-sm ${
                  isActive(item.to) ? 'text-white bg-white/10' : 'text-slate-300 hover:bg-white/5'
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
    </>
  );
}