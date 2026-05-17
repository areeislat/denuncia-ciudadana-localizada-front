import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="bg-[#001A33] sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 md:px-6 py-4">
          <Link to="/" className="text-xl font-extrabold text-white tracking-tight font-headline">
            DESIGEO
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-white font-headline font-bold text-sm border-b-2 border-[#D7141A] pb-1">
              Inicio
            </Link>
            <Link to="/ayuda" className="text-slate-300 hover:text-white font-headline font-bold text-sm">
              Ayuda
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="bg-[#0050A5] text-white font-headline font-bold text-sm py-2 px-5 rounded-full hover:bg-[#003A7A] transition-colors"
            >
              Ingresar
            </Link>
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
          <div className="flex justify-between items-center mb-8">
            <span className="text-white font-headline font-bold text-lg">DESIGEO</span>
            <button onClick={() => setMobileMenuOpen(false)} className="text-white">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <nav className="space-y-2">
            <Link
              to="/"
              className="block text-white font-headline font-bold py-3 px-4 rounded-lg bg-white/10"
              onClick={() => setMobileMenuOpen(false)}
            >
              Inicio
            </Link>
            <Link to="/ayuda" onClick={() => setMobileMenuOpen(false)} className="block text-slate-300 font-headline font-bold py-3 px-4 rounded-lg hover:bg-white/5">
              Ayuda
            </Link>
            <div className="border-t border-white/10 my-4"></div>
            <Link
              to="/login"
              className="block bg-[#0050A5] text-white font-headline font-bold py-3 px-4 rounded-lg text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              Ingresar
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}
