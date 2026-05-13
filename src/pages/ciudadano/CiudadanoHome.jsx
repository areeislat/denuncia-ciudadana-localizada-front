import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import MapComponent from '../../components/MapComponent';
import useAuthStore from '../../store/authStore';

const mockMarkers = [
  { lat: -33.423, lng: -70.615, title: 'Bache en cruce peatonal', status: 'Pendiente', color: '#dc2626', n: 12 },
  { lat: -33.428, lng: -70.605, title: 'Luminaria dañada', status: 'En Proceso', color: '#2563eb', n: 5 },
  { lat: -33.431, lng: -70.618, title: 'Microbasural', status: 'Asignado', color: '#f97316', n: 8 },
  { lat: -33.425, lng: -70.602, title: 'Señalética dañada', status: 'Resuelto', color: '#16a34a', n: 3 },
  { lat: -33.42, lng: -70.608, title: 'Bache profundo', status: 'Pendiente', color: '#dc2626', n: 21 },
  { lat: -33.434, lng: -70.612, title: 'Basura ilegal', status: 'En Proceso', color: '#2563eb', n: 7 },
];

// TODO: reemplazar con llamada real al Report Service cuando esté disponible
const mockStats = {
  total: 5,
  pendientes: 2,
  resueltos: 3,
};

export default function CiudadanoHome() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  // Extraer primer nombre desde fullName (ej: "María González" → "María")
  const firstName = user?.fullName?.split(' ')[0] || 'Ciudadano';

  // Iniciales para el avatar (ej: "María González" → "MG")
  const initials = user?.fullName
    ? user.fullName.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
      {/* HEADER */}
      <header className="bg-[#001A33] sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 md:px-6 py-4">
          <Link to="/ciudadano" className="text-xl font-extrabold text-white tracking-tight font-headline">DESIGEO</Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/ciudadano" className="text-white font-headline font-bold text-sm border-b-2 border-[#D7141A] pb-1">Inicio</Link>
            <Link to="/ciudadano/reportes" className="text-slate-300 hover:text-white font-headline font-bold text-sm">Mis Reportes</Link>
            <a href="#" className="text-slate-300 hover:text-white font-headline font-bold text-sm">Ayuda</a>
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
                {initials}
              </button>
              {profileMenuOpen && (
                <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-[#e4e2e2] w-48 overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-[#f5f3f3]">
                    <p className="text-sm font-bold font-headline text-[#1b1c1c]">{user?.fullName}</p>
                    <p className="text-[10px] text-[#424752] capitalize">{user?.roleName?.toLowerCase().replace('_', ' ')}</p>
                  </div>
                  <Link
                    to="/ciudadano/perfil"
                    onClick={() => setProfileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-sm text-[#1b1c1c] hover:bg-[#f5f3f3] transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">person</span>Mi Perfil
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-[#ba1a1a] hover:bg-[#f5f3f3] transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">logout</span>Cerrar sesión
                  </button>
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
              <p className="text-white font-headline font-bold">{user?.fullName}</p>
              <p className="text-slate-400 text-xs capitalize">{user?.roleName?.toLowerCase().replace('_', ' ')}</p>
            </div>
            <button onClick={() => setMobileMenuOpen(false)} className="text-white">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <nav className="space-y-1">
            <Link to="/ciudadano" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-white font-headline font-medium py-3 px-4 rounded-lg bg-white/10">
              <span className="material-symbols-outlined">home</span>Inicio
            </Link>
            <Link to="/ciudadano/crear" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-slate-300 font-headline font-medium py-3 px-4 rounded-lg hover:bg-white/5">
              <span className="material-symbols-outlined">add_circle</span>Reportar
            </Link>
            <Link to="/ciudadano/reportes" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-slate-300 font-headline font-medium py-3 px-4 rounded-lg hover:bg-white/5">
              <span className="material-symbols-outlined">history</span>Mis Reportes
            </Link>
            <Link to="/ciudadano/perfil" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-slate-300 font-headline font-medium py-3 px-4 rounded-lg hover:bg-white/5">
              <span className="material-symbols-outlined">person</span>Mi Perfil
            </Link>
            <a href="#" className="flex items-center gap-3 text-slate-300 font-headline font-medium py-3 px-4 rounded-lg hover:bg-white/5">
              <span className="material-symbols-outlined">help</span>Ayuda
            </a>
            <div className="border-t border-white/10 my-4"></div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 text-red-400 font-headline font-medium py-3 px-4 rounded-lg hover:bg-white/5"
            >
              <span className="material-symbols-outlined">logout</span>Cerrar sesión
            </button>
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* Greeting */}
        <div className="mb-8">
          <h1 className="font-headline font-extrabold text-3xl md:text-4xl text-[#003a7a] mb-2">
            Hola, {firstName} 👋
          </h1>
          <p className="text-[#424752] text-base">¿Encontraste un problema en tu barrio? Repórtalo y ayuda a mejorar tu comunidad.</p>
        </div>

        {/* Stats — TODO: reemplazar mockStats con llamada al Report Service */}
        <div className="flex flex-wrap gap-3 mb-8">
          <div className="bg-white rounded-xl py-3 px-4 shadow-sm flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#c5dcfd] flex items-center justify-center text-[#003a7a] shrink-0">
              <span className="material-symbols-outlined text-base">description</span>
            </div>
            <p className="font-headline font-bold text-sm"><span className="text-lg">{mockStats.total}</span> reportes</p>
          </div>
          <div className="bg-white rounded-xl py-3 px-4 shadow-sm flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#fef3c7] flex items-center justify-center text-[#92400e] shrink-0">
              <span className="material-symbols-outlined text-base">pending</span>
            </div>
            <p className="font-headline font-bold text-sm"><span className="text-lg">{mockStats.pendientes}</span> pendientes</p>
          </div>
          <div className="bg-white rounded-xl py-3 px-4 shadow-sm flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#d1fae5] flex items-center justify-center text-[#065f46] shrink-0">
              <span className="material-symbols-outlined text-base">check_circle</span>
            </div>
            <p className="font-headline font-bold text-sm"><span className="text-lg">{mockStats.resueltos}</span> resueltos</p>
          </div>
        </div>

        {/* Quick action */}
        <div className="mb-8">
          <Link
            to="/ciudadano/crear"
            className="inline-flex items-center gap-2 bg-[#0050A5] text-white font-headline font-bold py-4 px-10 rounded-full shadow-lg hover:bg-[#003A7A] transition-colors text-base"
          >
            <span className="material-symbols-outlined fill-icon">add_circle</span> Reportar un Problema
          </Link>
        </div>

        {/* Map */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-headline font-bold text-xl">Mapa de Incidencias</h2>
            <Link to="/ciudadano/reportes" className="text-[#003a7a] font-bold text-sm flex items-center gap-1">
              Mis reportes <span className="material-symbols-outlined text-sm">chevron_right</span>
            </Link>
          </div>
          <MapComponent markers={mockMarkers} height="450px" />
          <div className="flex flex-wrap gap-4 mt-3 text-xs text-[#424752]">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#dc2626] inline-block"></span> Pendiente</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#2563eb] inline-block"></span> En Proceso</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#f97316] inline-block"></span> Asignado</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#16a34a] inline-block"></span> Resuelto</span>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#001A33] py-8 px-4 mt-12">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-slate-500 text-xs">&copy; 2026 DESIGEO — Plataforma de Denuncia Ciudadana Geolocalizada</p>
        </div>
      </footer>
    </div>
  );
}

