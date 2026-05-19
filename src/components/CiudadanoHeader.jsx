import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useAuthStore from '../store/authStore';

export default function CiudadanoHeader({ activePage = '' }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const initials = user?.fullName
    ? user.fullName.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLink = (to, label, page) => (
    <Link
      to={to}
      className={`font-headline font-bold text-sm ${
        activePage === page
          ? 'text-white border-b-2 border-[#D7141A] pb-1'
          : 'text-slate-300 hover:text-white'
      }`}
    >
      {label}
    </Link>
  );

  return (
    <>
      <header className="bg-[#001A33] sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 md:px-6 py-4">
          <Link to="/ciudadano" className="text-xl font-extrabold text-white tracking-tight font-headline">DESIGEO</Link>
          <nav className="hidden md:flex items-center gap-6">
            {navLink('/ciudadano', 'Inicio', 'inicio')}
            {navLink('/ciudadano/reportes', 'Mis Reportes', 'reportes')}
            <span className="font-headline font-bold text-sm text-slate-500 cursor-not-allowed">Ayuda</span>
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
            <Link to="/ciudadano" onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 font-headline font-medium py-3 px-4 rounded-lg ${activePage === 'inicio' ? 'text-white bg-white/10' : 'text-slate-300 hover:bg-white/5'}`}>
              <span className="material-symbols-outlined">home</span>Inicio
            </Link>
            <Link to="/ciudadano/crear" onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 font-headline font-medium py-3 px-4 rounded-lg ${activePage === 'crear' ? 'text-white bg-white/10' : 'text-slate-300 hover:bg-white/5'}`}>
              <span className="material-symbols-outlined">add_circle</span>Reportar
            </Link>
            <Link to="/ciudadano/reportes" onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 font-headline font-medium py-3 px-4 rounded-lg ${activePage === 'reportes' ? 'text-white bg-white/10' : 'text-slate-300 hover:bg-white/5'}`}>
              <span className="material-symbols-outlined">history</span>Mis Reportes
            </Link>
            <Link to="/ciudadano/perfil" onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 font-headline font-medium py-3 px-4 rounded-lg ${activePage === 'perfil' ? 'text-white bg-white/10' : 'text-slate-300 hover:bg-white/5'}`}>
              <span className="material-symbols-outlined">person</span>Mi Perfil
            </Link>
            <span className="flex items-center gap-3 font-headline font-medium py-3 px-4 rounded-lg text-slate-500 cursor-not-allowed">
              <span className="material-symbols-outlined">help</span>Ayuda
            </span>
            <div className="border-t border-white/10 my-4"></div>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 text-red-400 font-headline font-medium py-3 px-4 rounded-lg hover:bg-white/5">
              <span className="material-symbols-outlined">logout</span>Cerrar sesión
            </button>
          </nav>
        </div>
      </div>
    </>
  );
}
