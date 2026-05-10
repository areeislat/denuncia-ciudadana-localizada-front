import { Link } from 'react-router-dom';
import { useState } from 'react';
import MapComponent from '../../../components/MapComponent';

const panelMarkers = [
  { lat: -33.422, lng: -70.615, title: 'Cluster 1', color: '#dc2626', n: 12 },
  { lat: -33.43, lng: -70.605, title: 'Cluster 2', color: '#2563eb', n: 45 },
  { lat: -33.426, lng: -70.61, title: 'Cluster 3', color: '#16a34a', n: 8 },
  { lat: -33.434, lng: -70.618, title: 'Cluster 4', color: '#f97316', n: 5 },
];

export default function Panel() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div>
      {/* SIDEBAR (Desktop) */}
      <aside className="hidden md:flex flex-col h-screen w-60 fixed left-0 top-0 bg-[#001A33] py-5 z-50">
        <div className="px-5 mb-6">
          <h1 className="text-base font-bold text-white font-headline">DESIGEO</h1>
          <p className="text-slate-400 text-[10px] mt-0.5">Panel de Gestión</p>
        </div>

        <div className="px-4 mb-5">
          <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3">
            <div className="w-9 h-9 rounded-full bg-[#0050A5] flex items-center justify-center text-white text-xs font-bold shrink-0">MG</div>
            <div className="min-w-0">
              <p className="text-white text-xs font-bold truncate">María González</p>
              <p className="text-slate-400 text-[10px]">Funcionario Municipal</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-0.5 px-2 overflow-y-auto">
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider px-3 mb-1">General</p>
          <Link to="/ciudadano/crear" className="sidebar-link rounded-lg px-3 py-2.5 flex items-center gap-2.5 text-sm text-slate-300 hover:text-white">
            <span className="material-symbols-outlined text-lg">add_circle</span><span className="font-headline font-medium">Crear Ticket</span>
          </Link>
          <a href="#" className="sidebar-link rounded-lg px-3 py-2.5 flex items-center gap-2.5 text-sm text-slate-300 hover:text-white">
            <span className="material-symbols-outlined text-lg">assignment_ind</span><span className="font-headline font-medium">Mis Asignaciones</span>
            <span className="ml-auto bg-orange-500/20 text-orange-300 text-[9px] font-bold px-2 py-0.5 rounded-full">3</span>
          </a>

          <div className="border-t border-white/5 my-2 mx-2"></div>
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider px-3 mb-1">Gestión</p>
          <a href="#" className="sidebar-link sidebar-active rounded-lg px-3 py-2.5 flex items-center gap-2.5 text-sm text-white">
            <span className="material-symbols-outlined text-lg fill-icon">dashboard</span><span className="font-headline font-medium">Dashboard</span>
          </a>
          <a href="#" className="sidebar-link rounded-lg px-3 py-2.5 flex items-center gap-2.5 text-sm text-slate-300 hover:text-white">
            <span className="material-symbols-outlined text-lg">assignment</span><span className="font-headline font-medium">Gestión Reportes</span>
            <span className="ml-auto bg-red-500/20 text-red-300 text-[9px] font-bold px-2 py-0.5 rounded-full">18</span>
          </a>
          <a href="#" className="sidebar-link rounded-lg px-3 py-2.5 flex items-center gap-2.5 text-sm text-slate-300 hover:text-white">
            <span className="material-symbols-outlined text-lg">map</span><span className="font-headline font-medium">Mapa</span>
          </a>
          <a href="#" className="sidebar-link rounded-lg px-3 py-2.5 flex items-center gap-2.5 text-sm text-slate-300 hover:text-white">
            <span className="material-symbols-outlined text-lg">bar_chart</span><span className="font-headline font-medium">Estadísticas</span>
          </a>

          <div className="border-t border-white/5 my-2 mx-2"></div>
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider px-3 mb-1">Administración</p>
          <a href="#" className="sidebar-link rounded-lg px-3 py-2.5 flex items-center gap-2.5 text-sm text-slate-300 hover:text-white">
            <span className="material-symbols-outlined text-lg">group</span><span className="font-headline font-medium">Usuarios</span>
          </a>
          <a href="#" className="sidebar-link rounded-lg px-3 py-2.5 flex items-center gap-2.5 text-sm text-slate-300 hover:text-white">
            <span className="material-symbols-outlined text-lg">category</span><span className="font-headline font-medium">Categorías</span>
          </a>
          <a href="#" className="sidebar-link rounded-lg px-3 py-2.5 flex items-center gap-2.5 text-sm text-slate-300 hover:text-white">
            <span className="material-symbols-outlined text-lg">download</span><span className="font-headline font-medium">Exportar Datos</span>
          </a>
        </nav>

        <div className="px-3 mt-auto">
          <Link to="/login" className="text-slate-400 hover:text-white px-2 py-2 flex items-center gap-2 text-sm">
            <span className="material-symbols-outlined text-lg">logout</span>Cerrar Sesión
          </Link>
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
          <div className="w-8 h-8 rounded-full bg-[#0050A5] flex items-center justify-center text-white text-xs font-bold">MG</div>
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
            <div className="w-9 h-9 rounded-full bg-[#0050A5] flex items-center justify-center text-white text-xs font-bold">MG</div>
            <div>
              <p className="text-white text-xs font-bold">María González</p>
              <p className="text-slate-400 text-[10px]">Funcionario Municipal</p>
            </div>
          </div>
          <nav className="space-y-1">
            <Link to="/ciudadano/crear" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-slate-300 font-headline font-medium py-2.5 px-3 rounded-lg hover:bg-white/5 text-sm"><span className="material-symbols-outlined">add_circle</span>Crear Ticket</Link>
            <a href="#" className="flex items-center gap-3 text-slate-300 font-headline font-medium py-2.5 px-3 rounded-lg hover:bg-white/5 text-sm"><span className="material-symbols-outlined">assignment_ind</span>Mis Asignaciones</a>
            <a href="#" className="flex items-center gap-3 text-white font-headline font-medium py-2.5 px-3 rounded-lg bg-white/10 text-sm"><span className="material-symbols-outlined">dashboard</span>Dashboard</a>
            <a href="#" className="flex items-center gap-3 text-slate-300 font-headline font-medium py-2.5 px-3 rounded-lg hover:bg-white/5 text-sm"><span className="material-symbols-outlined">assignment</span>Gestión</a>
            <a href="#" className="flex items-center gap-3 text-slate-300 font-headline font-medium py-2.5 px-3 rounded-lg hover:bg-white/5 text-sm"><span className="material-symbols-outlined">map</span>Mapa</a>
            <a href="#" className="flex items-center gap-3 text-slate-300 font-headline font-medium py-2.5 px-3 rounded-lg hover:bg-white/5 text-sm"><span className="material-symbols-outlined">group</span>Usuarios</a>
            <a href="#" className="flex items-center gap-3 text-slate-300 font-headline font-medium py-2.5 px-3 rounded-lg hover:bg-white/5 text-sm"><span className="material-symbols-outlined">category</span>Categorías</a>
            <div className="border-t border-white/10 my-3"></div>
            <Link to="/login" className="flex items-center gap-3 text-red-400 font-headline font-medium py-2.5 px-3 rounded-lg hover:bg-white/5 text-sm"><span className="material-symbols-outlined">logout</span>Cerrar sesión</Link>
          </nav>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="md:ml-60 p-4 md:p-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#1b1c1c] font-headline mb-1">Dashboard</h2>
        <p className="text-[#424752] text-sm mb-6">
          Resumen de reportes ciudadanos —{' '}
          <span className="bg-[#d7e2ff] text-[#003a7a] px-2 py-0.5 rounded-full text-[10px] font-bold">Nivel 3</span>
        </p>

        {/* KPIs */}
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

        {/* Tickets asignados */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8">
          <div className="p-4 md:p-5 border-b border-[#f5f3f3] flex justify-between items-center">
            <h3 className="font-headline font-bold text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[#f97316]">assignment_ind</span>Tickets Asignados a Mí
            </h3>
            <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full">3 activos</span>
          </div>
          <div className="divide-y divide-[#f5f3f3]">
            <div className="px-4 md:px-5 py-3 flex items-center justify-between hover:bg-[#f5f3f3]/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
                  <span className="material-symbols-outlined text-sm">light_off</span>
                </div>
                <div>
                  <p className="text-sm font-semibold">Reparar luminaria Av. Los Leones</p>
                  <p className="text-[10px] text-slate-400">Asignado por Juan Pérez · Hace 2h</p>
                </div>
              </div>
              <span className="badge-asignado px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase">Asignado</span>
            </div>
            <div className="px-4 md:px-5 py-3 flex items-center justify-between hover:bg-[#f5f3f3]/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                  <span className="material-symbols-outlined text-sm">construction</span>
                </div>
                <div>
                  <p className="text-sm font-semibold">Reparar bache calle Suecia</p>
                  <p className="text-[10px] text-slate-400">Asignado por Juan Pérez · Ayer</p>
                </div>
              </div>
              <span className="badge-proceso px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase">En Proceso</span>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8">
          <div className="p-4 md:p-5 border-b border-[#f5f3f3]">
            <h3 className="font-headline font-bold text-sm text-[#003a7a] flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">map</span>Mapa de Reportes
            </h3>
          </div>
          <MapComponent markers={panelMarkers} height="350px" />
        </div>

        {/* Recent reports */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8">
          <div className="p-4 md:p-5 border-b border-[#f5f3f3]">
            <h3 className="font-headline font-bold text-sm">Últimos Reportes</h3>
          </div>
          <div className="divide-y divide-[#f5f3f3]">
            <div className="px-4 md:px-5 py-3 flex items-center justify-between hover:bg-[#f5f3f3]/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center text-red-700 text-[10px] font-bold">RP</div>
                <div>
                  <p className="text-sm font-semibold">Falla Luminaria Pública</p>
                  <p className="text-[10px] text-slate-400">Plaza de Armas · Hace 15 min</p>
                </div>
              </div>
              <span className="badge-critico px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase">Crítico</span>
            </div>
            <div className="px-4 md:px-5 py-3 flex items-center justify-between hover:bg-[#f5f3f3]/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 text-[10px] font-bold">MS</div>
                <div>
                  <p className="text-sm font-semibold">Microbasural en esquina</p>
                  <p className="text-[10px] text-slate-400">Av. O'Higgins · Hoy 10:45</p>
                </div>
              </div>
              <span className="badge-proceso px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase">En Proceso</span>
            </div>
            <div className="px-4 md:px-5 py-3 flex items-center justify-between hover:bg-[#f5f3f3]/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 text-[10px] font-bold">JL</div>
                <div>
                  <p className="text-sm font-semibold">Bache Profundo</p>
                  <p className="text-[10px] text-slate-400">Los Leones 230 · Hoy 09:12</p>
                </div>
              </div>
              <span className="badge-pendiente px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase">Pendiente</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
