import { Link } from 'react-router-dom';
import { useState } from 'react';
import MapComponent from '../components/MapComponent';

export default function CiudadanoCrear() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div>
      <header className="bg-[#001A33] sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 md:px-6 py-4">
          <div className="flex items-center gap-3">
            <Link to="/ciudadano" className="text-white"><span className="material-symbols-outlined">arrow_back</span></Link>
            <span className="text-lg font-extrabold text-white font-headline">Nuevo Reporte</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/ciudadano" className="text-slate-300 hover:text-white font-headline font-bold text-sm">Inicio</Link>
            <Link to="/ciudadano/crear" className="text-white font-headline font-bold text-sm border-b-2 border-[#D7141A] pb-1">Reportar</Link>
            <Link to="/ciudadano/reportes" className="text-slate-300 hover:text-white font-headline font-bold text-sm">Mis Reportes</Link>
          </nav>
          <div className="flex items-center gap-3">
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
            <Link to="/ciudadano/crear" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-white font-headline font-medium py-3 px-4 rounded-lg bg-white/10"><span className="material-symbols-outlined">add_circle</span>Reportar</Link>
            <Link to="/ciudadano/reportes" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-slate-300 font-headline font-medium py-3 px-4 rounded-lg hover:bg-white/5"><span className="material-symbols-outlined">history</span>Mis Reportes</Link>
            <a href="#" className="flex items-center gap-3 text-slate-300 font-headline font-medium py-3 px-4 rounded-lg hover:bg-white/5"><span className="material-symbols-outlined">help</span>Ayuda</a>
            <div className="border-t border-white/10 my-4"></div>
            <Link to="/login" className="flex items-center gap-3 text-red-400 font-headline font-medium py-3 px-4 rounded-lg hover:bg-white/5"><span className="material-symbols-outlined">logout</span>Cerrar sesión</Link>
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <h1 className="font-headline text-2xl font-bold mb-1 text-[#003a7a]">Reportar un Problema</h1>
        <p className="text-[#424752] text-sm mb-6">Completa los detalles para que podamos resolverlo.</p>

        {/* Progress */}
        <div className="flex items-center justify-between relative mb-8 max-w-md">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-[#e4e2e2] -translate-y-1/2 z-0"></div>
          <div className="absolute top-1/2 left-0 h-0.5 bg-[#0050A5] -translate-y-1/2 z-0" style={{ width: '50%' }}></div>
          <div className="relative z-10 flex flex-col items-center gap-1">
            <div className="w-8 h-8 rounded-full bg-[#0050A5] text-white flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined text-sm fill-icon">check</span>
            </div>
            <span className="text-[9px] font-bold text-[#003a7a] uppercase">Categoría</span>
          </div>
          <div className="relative z-10 flex flex-col items-center gap-1">
            <div className="w-8 h-8 rounded-full bg-[#0050A5] text-white flex items-center justify-center ring-4 ring-[#d7e2ff] shadow-md">
              <span className="text-xs font-bold">2</span>
            </div>
            <span className="text-[9px] font-bold text-[#003a7a] uppercase">Detalles</span>
          </div>
          <div className="relative z-10 flex flex-col items-center gap-1">
            <div className="w-8 h-8 rounded-full bg-[#e4e2e2] text-[#424752] flex items-center justify-center">
              <span className="text-xs font-bold">3</span>
            </div>
            <span className="text-[9px] font-bold text-[#424752] uppercase">Confirmar</span>
          </div>
        </div>

        {/* Two-column layout on desktop */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Form */}
          <div className="space-y-5">
            <div>
              <label className="block font-headline text-sm font-bold text-[#1b1c1c] mb-1.5">Categoría</label>
              <select className="w-full bg-[#e4e2e2] border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#003a7a]">
                <option>Bache / Pavimento</option>
                <option>Luminaria Dañada</option>
                <option>Basura Ilegal</option>
                <option>Microbasural</option>
                <option>Infraestructura Vial</option>
                <option>Otro</option>
              </select>
            </div>
            <div>
              <label className="block font-headline text-sm font-bold text-[#1b1c1c] mb-1.5">Título del Reporte</label>
              <input
                className="w-full bg-[#e4e2e2] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#003a7a] text-sm"
                placeholder="Ej: Bache de gran tamaño en cruce peatonal"
              />
            </div>
            <div>
              <label className="block font-headline text-sm font-bold text-[#1b1c1c] mb-1.5">Descripción del Problema</label>
              <textarea
                className="w-full bg-[#e4e2e2] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#003a7a] text-sm"
                rows="4"
                placeholder="Describe el problema con al menos 10 caracteres..."
              ></textarea>
              <p className="text-[10px] text-[#737783] mt-1">Mínimo 10 caracteres, máximo 1000.</p>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-headline text-sm font-bold">Fotos de Evidencia</span>
                <span className="text-xs text-[#424752]">0 / 5 fotos</span>
              </div>
              <div className="grid grid-cols-5 gap-3">
                <button
                  type="button"
                  className="aspect-square rounded-xl bg-[#e4e2e2] flex flex-col items-center justify-center border-2 border-dashed border-[#c2c6d4] text-[#737783] hover:bg-[#dbd9d9] transition-colors"
                >
                  <span className="material-symbols-outlined">add_a_photo</span>
                  <span className="text-[8px] font-bold mt-1">Agregar</span>
                </button>
              </div>
              <p className="text-[10px] text-[#737783] mt-1">JPG, PNG o HEIC. Máximo 5 MB cada una.</p>
            </div>

            <div className="flex gap-3 pt-4">
              <Link
                to="/ciudadano/reportes"
                className="flex-1 bg-[#0050A5] text-white font-headline font-bold py-4 rounded-xl shadow-lg hover:bg-[#003A7A] transition-colors flex items-center justify-center gap-2"
              >
                Enviar Reporte <span className="material-symbols-outlined text-sm">send</span>
              </Link>
              <Link
                to="/ciudadano"
                className="px-6 text-[#424752] font-headline font-bold py-4 rounded-xl hover:bg-[#f5f3f3] transition-colors flex items-center justify-center"
              >
                Cancelar
              </Link>
            </div>
          </div>

          {/* Right: Map for location */}
          <div>
            <label className="block font-headline text-sm font-bold text-[#1b1c1c] mb-2">Ubicación del Reporte</label>
            <MapComponent markers={[]} height="340px" draggablePin />
            <div className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm border border-[#efeded] mt-3">
              <div className="w-9 h-9 bg-blue-50 text-[#003a7a] rounded-lg flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-lg">streetview</span>
              </div>
              <div>
                <p className="text-[9px] text-[#424752] font-bold uppercase tracking-wider">Dirección detectada por GPS</p>
                <p className="text-sm font-semibold">Arrastra el pin para ajustar la ubicación</p>
              </div>
            </div>
            <p className="text-[10px] text-[#737783] mt-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">info</span>
              Puedes crear reportes en cualquier comuna. La ubicación del problema se registra automáticamente.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
