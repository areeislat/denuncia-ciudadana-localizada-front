import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MapComponent from '../components/MapComponent';

const mockMarkers = [
  { lat: -33.423, lng: -70.615, title: 'Bache en cruce peatonal', color: '#dc2626', n: 12 },
  { lat: -33.428, lng: -70.605, title: 'Luminaria dañada', color: '#2563eb', n: 5 },
  { lat: -33.431, lng: -70.618, title: 'Microbasural', color: '#2563eb', n: 8 },
  { lat: -33.425, lng: -70.602, title: 'Señalética dañada', color: '#16a34a', n: 3 },
  { lat: -33.42, lng: -70.608, title: 'Bache profundo', color: '#dc2626', n: 21 },
  { lat: -33.434, lng: -70.612, title: 'Basura ilegal', color: '#2563eb', n: 7 },
];

export default function Home() {
  return (
    <div>
      <Header />

      {/* HERO */}
      <section className="px-4 md:px-6 pt-10 md:pt-16 pb-16 md:pb-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="font-headline font-extrabold text-4xl md:text-5xl lg:text-6xl leading-[1.08] text-[#003a7a] mb-5 tracking-tight">
            Ciudadanía Activa,<br /><span className="text-[#1b1c1c]">Ciudad Geolocalizada</span>
          </h1>
          <p className="text-[#424752] text-lg md:text-xl max-w-lg mb-8 leading-relaxed">
            Transforma tu entorno reportando incidencias urbanas en tiempo real. Tu reporte es el primer paso para una ciudad más eficiente.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/login"
              className="bg-[#0050A5] text-white font-headline font-bold py-4 px-8 rounded-full shadow-lg shadow-blue-900/20 hover:bg-[#003A7A] transition-colors flex items-center justify-center gap-2 text-base"
            >
              <span className="material-symbols-outlined fill-icon">add_circle</span> Reportar un Problema
            </Link>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <div className="px-4 md:px-6 -mt-8 mb-12 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl p-5 md:p-6 max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-around gap-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#c5dcfd] flex items-center justify-center text-[#003a7a]">
              <span className="material-symbols-outlined">analytics</span>
            </div>
            <div>
              <p className="text-[#1b1c1c] font-headline font-bold text-xl">1,247 reportes</p>
              <p className="text-[#424752] text-sm">Registrados este mes</p>
            </div>
          </div>
          <div className="hidden md:block h-12 w-px bg-[#e4e2e2]"></div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#d1fae5] flex items-center justify-center text-[#065f46]">
              <span className="material-symbols-outlined">check_circle</span>
            </div>
            <div>
              <p className="text-[#1b1c1c] font-headline font-bold text-xl">89% resueltos</p>
              <p className="text-[#424752] text-sm">Tasa de resolución</p>
            </div>
          </div>
          <div className="hidden md:block h-12 w-px bg-[#e4e2e2]"></div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#fef3c7] flex items-center justify-center text-[#92400e]">
              <span className="material-symbols-outlined">groups</span>
            </div>
            <div>
              <p className="text-[#1b1c1c] font-headline font-bold text-xl">3,891 usuarios</p>
              <p className="text-[#424752] text-sm">Ciudadanos activos</p>
            </div>
          </div>
        </div>
      </div>

      {/* MAPA DE INCIDENCIAS */}
      <section className="px-4 md:px-6 mb-14">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-headline font-bold text-2xl text-[#1b1c1c]">Mapa de Incidencias</h2>
            <div className="flex gap-3 text-xs text-[#424752]">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#dc2626] inline-block"></span> Pendiente</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#2563eb] inline-block"></span> En Proceso</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#16a34a] inline-block"></span> Resuelto</span>
            </div>
          </div>
          <MapComponent markers={mockMarkers} height="400px" />
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section id="como-funciona" className="px-4 md:px-6 mb-14">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-headline font-bold text-2xl text-[#1b1c1c] mb-8 text-center">¿Cómo funciona?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-full bg-[#d7e2ff] flex items-center justify-center text-[#003a7a] mx-auto mb-4">
                <span className="material-symbols-outlined text-3xl">edit_note</span>
              </div>
              <h3 className="font-headline font-bold text-lg mb-2">1. Reporta</h3>
              <p className="text-[#424752] text-sm">Describe el problema, adjunta fotos y el GPS captura la ubicación automáticamente.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-full bg-[#d7e2ff] flex items-center justify-center text-[#003a7a] mx-auto mb-4">
                <span className="material-symbols-outlined text-3xl">smart_toy</span>
              </div>
              <h3 className="font-headline font-bold text-lg mb-2">2. IA Analiza</h3>
              <p className="text-[#424752] text-sm">Nuestro agente IA verifica el contenido y detecta reportes similares en tu zona.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-full bg-[#d7e2ff] flex items-center justify-center text-[#003a7a] mx-auto mb-4">
                <span className="material-symbols-outlined text-3xl">engineering</span>
              </div>
              <h3 className="font-headline font-bold text-lg mb-2">3. Municipio Resuelve</h3>
              <p className="text-[#424752] text-sm">El equipo municipal gestiona tu reporte y te notifica cada cambio de estado.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
