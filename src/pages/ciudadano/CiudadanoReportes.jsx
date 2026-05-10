import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function CiudadanoReportes() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div>
      <header className="bg-[#001A33] sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 md:px-6 py-4">
          <div className="flex items-center gap-3">
            <Link to="/ciudadano" className="text-white md:hidden"><span className="material-symbols-outlined">arrow_back</span></Link>
            <Link to="/ciudadano" className="text-xl font-extrabold text-white tracking-tight font-headline">DESIGEO</Link>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/ciudadano" className="text-slate-300 hover:text-white font-headline font-bold text-sm">Inicio</Link>
            <Link to="/ciudadano/crear" className="text-slate-300 hover:text-white font-headline font-bold text-sm">Reportar</Link>
            <Link to="/ciudadano/reportes" className="text-white font-headline font-bold text-sm border-b-2 border-[#D7141A] pb-1">Mis Reportes</Link>
          </nav>
          <div className="flex items-center gap-3">
            <button className="text-white hover:bg-white/10 rounded-md p-2">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-[#0050A5] flex items-center justify-center text-white text-xs font-bold">MG</div>
            <button onClick={() => setMobileMenuOpen(true)} className="md:hidden text-white">
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-backdrop" onClick={() => setMobileMenuOpen(false)}></div>
        <div className="mobile-menu-panel">
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-white font-headline font-bold">María González</p>
              <p className="text-slate-400 text-xs">Ciudadano</p>
            </div>
            <button onClick={() => setMobileMenuOpen(false)} className="text-white">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <nav className="space-y-1">
            <Link to="/ciudadano" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-slate-300 font-headline font-medium py-3 px-4 rounded-lg hover:bg-white/5"><span className="material-symbols-outlined">home</span>Inicio</Link>
            <Link to="/ciudadano/crear" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-slate-300 font-headline font-medium py-3 px-4 rounded-lg hover:bg-white/5"><span className="material-symbols-outlined">add_circle</span>Reportar</Link>
            <Link to="/ciudadano/reportes" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-white font-headline font-medium py-3 px-4 rounded-lg bg-white/10"><span className="material-symbols-outlined">history</span>Mis Reportes</Link>
            <a href="#" className="flex items-center gap-3 text-slate-300 font-headline font-medium py-3 px-4 rounded-lg hover:bg-white/5"><span className="material-symbols-outlined">help</span>Ayuda</a>
            <div className="border-t border-white/10 my-4"></div>
            <Link to="/login" className="flex items-center gap-3 text-red-400 font-headline font-medium py-3 px-4 rounded-lg hover:bg-white/5"><span className="material-symbols-outlined">logout</span>Cerrar sesión</Link>
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-headline font-extrabold text-[#003a7a] mb-1">Mis Reportes</h1>
            <p className="text-[#424752] text-sm">Estado de tus solicitudes ciudadanas.</p>
          </div>
          <Link
            to="/ciudadano/crear"
            className="bg-[#0050A5] text-white font-headline font-bold py-2.5 px-6 rounded-full hover:bg-[#003A7A] transition-colors flex items-center gap-2 text-sm self-start"
          >
            <span className="material-symbols-outlined text-sm fill-icon">add_circle</span> Nuevo Reporte
          </Link>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-6" style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
          <button className="flex-shrink-0 bg-[#003a7a] text-white px-5 py-2 rounded-full text-xs font-semibold shadow-sm">Todos (5)</button>
          <button className="flex-shrink-0 bg-[#eae8e7] text-[#424752] px-5 py-2 rounded-full text-xs font-semibold hover:bg-[#dbd9d9]">Pendientes (1)</button>
          <button className="flex-shrink-0 bg-[#eae8e7] text-[#424752] px-5 py-2 rounded-full text-xs font-semibold hover:bg-[#dbd9d9]">En Proceso (1)</button>
          <button className="flex-shrink-0 bg-[#eae8e7] text-[#424752] px-5 py-2 rounded-full text-xs font-semibold hover:bg-[#dbd9d9]">Resueltos (2)</button>
          <button className="flex-shrink-0 bg-[#eae8e7] text-[#424752] px-5 py-2 rounded-full text-xs font-semibold hover:bg-[#dbd9d9]">Rechazados (1)</button>
        </div>

        {/* Reports grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="block bg-white rounded-xl p-5 shadow-sm border border-[#f5f3f3] card-hover">
            <div className="flex justify-between items-start mb-2">
              <span className="badge-pendiente text-[9px] font-bold uppercase px-3 py-1 rounded-full flex items-center gap-1"><span className="material-symbols-outlined text-xs fill-icon">pending</span>Pendiente</span>
              <span className="text-[10px] text-[#737783]">Hace 2 horas</span>
            </div>
            <h3 className="font-headline font-bold text-[#1b1c1c] text-base mb-1">Bache de gran tamaño en cruce peatonal</h3>
            <div className="flex items-center gap-1 text-[#424752] mb-2"><span className="material-symbols-outlined text-xs">location_on</span><span className="text-xs">Av. Irarrázaval 3421, Ñuñoa</span></div>
            <div className="flex items-center gap-3 text-xs text-[#424752]">
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-xs">thumb_up</span> 12 apoyos</span>
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-xs">photo_camera</span> 2 fotos</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-[#f5f3f3]">
            <div className="flex justify-between items-start mb-2">
              <span className="badge-proceso text-[9px] font-bold uppercase px-3 py-1 rounded-full flex items-center gap-1"><span className="material-symbols-outlined text-xs fill-icon">sync</span>En Proceso</span>
              <span className="text-[10px] text-[#737783]">Ayer, 14:30</span>
            </div>
            <h3 className="font-headline font-bold text-[#1b1c1c] text-base mb-1">Microbasural - Av. Providencia</h3>
            <div className="flex items-center gap-1 text-[#424752] mb-2"><span className="material-symbols-outlined text-xs">location_on</span><span className="text-xs">Av. Providencia 1240</span></div>
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-2.5 flex items-start gap-2">
              <span className="material-symbols-outlined text-[#003a7a] text-sm">info</span>
              <p className="text-[10px] text-[#003a7a] font-medium">Cuadrilla municipal asignada. Resolución estimada: 24h.</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-[#f5f3f3]">
            <div className="flex justify-between items-start mb-2">
              <span className="badge-resuelto text-[9px] font-bold uppercase px-3 py-1 rounded-full flex items-center gap-1"><span className="material-symbols-outlined text-xs fill-icon">check_circle</span>Resuelto</span>
              <span className="text-[10px] text-[#737783]">3 Oct 2024</span>
            </div>
            <h3 className="font-headline font-bold text-[#1b1c1c] text-base mb-1">Luminaria dañada - Calle Los Leones</h3>
            <div className="flex items-center gap-1 text-[#424752] mb-2"><span className="material-symbols-outlined text-xs">location_on</span><span className="text-xs">Calle Los Leones 450, Providencia</span></div>
            <div className="flex items-center gap-3 text-xs text-[#424752]">
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-xs">thumb_up</span> 5 apoyos</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-[#f5f3f3]">
            <div className="flex justify-between items-start mb-2">
              <span className="badge-rechazado text-[9px] font-bold uppercase px-3 py-1 rounded-full flex items-center gap-1"><span className="material-symbols-outlined text-xs fill-icon">cancel</span>Rechazado</span>
              <span className="text-[10px] text-[#737783]">28 Sep 2024</span>
            </div>
            <h3 className="font-headline font-bold text-[#1b1c1c] text-base mb-1">Vehículo mal estacionado</h3>
            <div className="flex items-center gap-1 text-[#424752] mb-2"><span className="material-symbols-outlined text-xs">location_on</span><span className="text-xs">Pje. Las Orquideas 45</span></div>
            <p className="text-[10px] text-[#ba1a1a] font-medium italic">Motivo: Fuera de jurisdicción municipal.</p>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-[#f5f3f3]">
            <div className="flex justify-between items-start mb-2">
              <span className="badge-resuelto text-[9px] font-bold uppercase px-3 py-1 rounded-full flex items-center gap-1"><span className="material-symbols-outlined text-xs fill-icon">check_circle</span>Resuelto</span>
              <span className="text-[10px] text-[#737783]">20 Sep 2024</span>
            </div>
            <h3 className="font-headline font-bold text-[#1b1c1c] text-base mb-1">Señalética de Pare dañada</h3>
            <div className="flex items-center gap-1 text-[#424752]"><span className="material-symbols-outlined text-xs">location_on</span><span className="text-xs">Esquina Eliodoro Yáñez</span></div>
          </div>
        </div>
      </main>
    </div>
  );
}
