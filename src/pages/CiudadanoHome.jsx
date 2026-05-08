import { Link } from 'react-router-dom';
import { useState } from 'react';
import MapComponent from '../components/MapComponent';

const mockMarkers = [
  { lat: -33.423, lng: -70.615, title: 'Bache en cruce peatonal', color: '#dc2626', n: 12 },
  { lat: -33.428, lng: -70.605, title: 'Luminaria dañada', color: '#2563eb', n: 5 },
  { lat: -33.431, lng: -70.618, title: 'Microbasural', color: '#f97316', n: 8 },
  { lat: -33.425, lng: -70.602, title: 'Señalética dañada', color: '#16a34a', n: 3 },
];

export default function CiudadanoHome() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* HEADER */}
      <header className="bg-[#001A33] sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 md:px-6 py-4">
          <Link to="/ciudadano" className="text-xl font-extrabold text-white tracking-tight font-headline">
            DESIGEO
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/ciudadano" className="text-white font-headline font-bold text-sm border-b-2 border-[#D7141A] pb-1">
              Inicio
            </Link>
            <Link to="/ciudadano/reportes" className="text-slate-300 hover:text-white font-headline font-bold text-sm">
              Mis Reportes
            </Link>
            <a href="#" className="text-slate-300 hover:text-white font-headline font-bold text-sm">
              Ayuda
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <button className="text-white hover:bg-white/10 rounded-md p-2">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="w-8 h-8 rounded-full bg-[#0050A5] flex items-center justify-center text-white text-xs font-bold hover:ring-2 hover:ring-white/30 transition-all"
              >
                MG
              </button>
              {profileMenuOpen && (
                <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-[#e4e2e2] w-48 overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-[#f5f3f3]">
                    <p className="text-sm font-bold font-headline text-[#1b1c1c]">María González</p>
                    <p className="text-[10px] text-[#424752]">Ciudadano</p>
                  </div>
                  <Link
                    to="/login"
                    className="flex items-center gap-2 px-4 py-3 text-sm text-[#ba1a1a] hover:bg-[#f5f3f3] transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">logout</span>Cerrar sesión
                  </Link>
                </div>
              )}
            </div>
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
            <Link
              to="/ciudadano"
              className="flex items-center gap-3 text-white font-headline font-medium py-3 px-4 rounded-lg bg-white/10"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="material-symbols-outlined">home</span>Inicio
            </Link>
            <Link
              to="/ciudadano/crear"
              className="flex items-center gap-3 text-slate-300 font-headline font-medium py-3 px-4 rounded-lg hover:bg-white/5"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="material-symbols-outlined">add_circle</span>Reportar
            </Link>
            <Link
              to="/ciudadano/reportes"
              className="flex items-center gap-3 text-slate-300 font-headline font-medium py-3 px-4 rounded-lg hover:bg-white/5"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="material-symbols-outlined">history</span>Mis Reportes
            </Link>
            <a href="#" className="flex items-center gap-3 text-slate-300 font-headline font-medium py-3 px-4 rounded-lg hover:bg-white/5">
              <span className="material-symbols-outlined">help</span>Ayuda
            </a>
            <div className="border-t border-white/10 my-4"></div>
            <Link
              to="/login"
              className="flex items-center gap-3 text-red-400 font-headline font-medium py-3 px-4 rounded-lg hover:bg-white/5"
            >
              <span className="material-symbols-outlined">logout</span>Cerrar sesión
            </Link>
          </nav>
        </div>
      </div>

      <main className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-10 lg:py-12 flex-1">
        {/* Greeting */}
        <div className="mb-8 md:mb-10">
          <h1 className="font-headline font-extrabold text-2xl sm:text-3xl md:text-4xl text-[#003a7a] mb-3">
            Hola, María 👋
          </h1>
          <p className="text-[#424752] text-sm md:text-base max-w-2xl">
            ¿Encontraste un problema en tu barrio? Repórtalo y ayuda a mejorar tu comunidad.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-8 md:mb-10">
          <div className="bg-white rounded-xl py-4 px-5 shadow-sm border border-[#f5f3f3] flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#c5dcfd] flex items-center justify-center text-[#003a7a] shrink-0">
              <span className="material-symbols-outlined text-xl">description</span>
            </div>
            <div>
              <p className="text-[#424752] text-xs mb-0.5">Total</p>
              <p className="font-headline font-bold text-2xl text-[#1b1c1c]">5</p>
              <p className="text-[#424752] text-xs">reportes</p>
            </div>
          </div>
          <div className="bg-white rounded-xl py-4 px-5 shadow-sm border border-[#f5f3f3] flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#fef3c7] flex items-center justify-center text-[#92400e] shrink-0">
              <span className="material-symbols-outlined text-xl">pending</span>
            </div>
            <div>
              <p className="text-[#424752] text-xs mb-0.5">Pendientes</p>
              <p className="font-headline font-bold text-2xl text-[#1b1c1c]">2</p>
              <p className="text-[#424752] text-xs">en espera</p>
            </div>
          </div>
          <div className="bg-white rounded-xl py-4 px-5 shadow-sm border border-[#f5f3f3] flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#d1fae5] flex items-center justify-center text-[#065f46] shrink-0">
              <span className="material-symbols-outlined text-xl">check_circle</span>
            </div>
            <div>
              <p className="text-[#424752] text-xs mb-0.5">Resueltos</p>
              <p className="font-headline font-bold text-2xl text-[#1b1c1c]">3</p>
              <p className="text-[#424752] text-xs">completados</p>
            </div>
          </div>
        </div>

        {/* Quick action */}
        <div className="mb-10 md:mb-12">
          <Link
            to="/ciudadano/crear"
            className="inline-flex items-center justify-center gap-2 bg-[#0050A5] text-white font-headline font-bold py-3 md:py-4 px-6 md:px-10 rounded-full shadow-lg hover:bg-[#003A7A] transition-colors text-sm md:text-base w-full sm:w-auto"
          >
            <span className="material-symbols-outlined fill-icon">add_circle</span> 
            <span>Reportar un Problema</span>
          </Link>
        </div>

        {/* Map */}
        <div className="mb-10 md:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <h2 className="font-headline font-bold text-xl md:text-2xl text-[#1b1c1c]">Mapa de Incidencias</h2>
            <Link
              to="/ciudadano/reportes"
              className="text-[#003a7a] font-bold text-sm flex items-center gap-1 hover:underline"
            >
              Ver mis reportes <span className="material-symbols-outlined text-base">chevron_right</span>
            </Link>
          </div>
          <div className="w-full">
            <MapComponent markers={mockMarkers} height="400px" />
          </div>
          <div className="flex flex-wrap gap-3 md:gap-4 mt-4 text-xs md:text-sm text-[#424752]">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#dc2626] inline-block"></span> Pendiente
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#2563eb] inline-block"></span> En Proceso
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#f97316] inline-block"></span> Asignado
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#16a34a] inline-block"></span> Resuelto
            </span>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#001A33] py-10 md:py-12 px-4 mt-auto">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-slate-500 text-xs md:text-sm">
            &copy; 2026 DESIGEO — Plataforma de Denuncia Ciudadana Geolocalizada
          </p>
        </div>
      </footer>
    </div>
  );
}
