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
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* HERO */}
      <section className="px-4 md:px-6 lg:px-8 pt-12 md:pt-20 lg:pt-24 pb-16 md:pb-20 lg:pb-28 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="font-headline font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight md:leading-[1.08] text-[#003a7a] mb-5 md:mb-6 tracking-tight">
            Ciudadanía Activa,
            <br />
            <span className="text-[#1b1c1c]">Ciudad Geolocalizada</span>
          </h1>
          <p className="text-[#424752] text-base md:text-lg lg:text-xl max-w-xl mb-8 md:mb-10 leading-relaxed">
            Transforma tu entorno reportando incidencias urbanas en tiempo real. Tu reporte es el primer paso para una
            ciudad más eficiente.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <Link
              to="/login"
              className="bg-[#0050A5] text-white font-headline font-bold py-3 md:py-4 px-6 md:px-8 rounded-full shadow-lg shadow-blue-900/20 hover:bg-[#003A7A] transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
            >
              <span className="material-symbols-outlined fill-icon">add_circle</span> 
              <span>Reportar un Problema</span>
            </Link>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <div className="px-4 md:px-6 lg:px-8 -mt-8 md:-mt-10 mb-12 md:mb-16 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl p-5 md:p-6 lg:p-8 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#c5dcfd] flex items-center justify-center text-[#003a7a] shrink-0">
              <span className="material-symbols-outlined text-xl md:text-2xl">analytics</span>
            </div>
            <div>
              <p className="text-[#1b1c1c] font-headline font-bold text-lg md:text-xl lg:text-2xl">1,247 reportes</p>
              <p className="text-[#424752] text-xs md:text-sm">Registrados este mes</p>
            </div>
          </div>
          <div className="hidden md:block h-12 w-px bg-[#e4e2e2] mx-auto"></div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#d1fae5] flex items-center justify-center text-[#065f46] shrink-0">
              <span className="material-symbols-outlined text-xl md:text-2xl">check_circle</span>
            </div>
            <div>
              <p className="text-[#1b1c1c] font-headline font-bold text-lg md:text-xl lg:text-2xl">89% resueltos</p>
              <p className="text-[#424752] text-xs md:text-sm">Tasa de resolución</p>
            </div>
          </div>
          <div className="hidden md:block h-12 w-px bg-[#e4e2e2] mx-auto"></div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#fef3c7] flex items-center justify-center text-[#92400e] shrink-0">
              <span className="material-symbols-outlined text-xl md:text-2xl">groups</span>
            </div>
            <div>
              <p className="text-[#1b1c1c] font-headline font-bold text-lg md:text-xl lg:text-2xl">3,891 usuarios</p>
              <p className="text-[#424752] text-xs md:text-sm">Ciudadanos activos</p>
            </div>
          </div>
        </div>
      </div>

      {/* MAPA DE INCIDENCIAS */}
      <section className="px-4 md:px-6 lg:px-8 mb-14 md:mb-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 md:mb-6">
            <h2 className="font-headline font-bold text-xl md:text-2xl lg:text-3xl text-[#1b1c1c]">Mapa de Incidencias</h2>
            <div className="flex flex-wrap gap-3 text-xs md:text-sm text-[#424752]">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#dc2626] inline-block"></span> Pendiente
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#2563eb] inline-block"></span> En Proceso
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#16a34a] inline-block"></span> Resuelto
              </span>
            </div>
          </div>
          <div className="w-full">
            <MapComponent markers={mockMarkers} height="400px" />
          </div>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section id="como-funciona" className="px-4 md:px-6 lg:px-8 mb-14 md:mb-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-headline font-bold text-xl md:text-2xl lg:text-3xl text-[#1b1c1c] mb-8 md:mb-12 text-center">
            ¿Cómo funciona?
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            <div className="text-center p-6 md:p-8">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#d7e2ff] flex items-center justify-center text-[#003a7a] mx-auto mb-4 md:mb-5">
                <span className="material-symbols-outlined text-3xl md:text-4xl">edit_note</span>
              </div>
              <h3 className="font-headline font-bold text-base md:text-lg mb-2 md:mb-3">1. Reporta</h3>
              <p className="text-[#424752] text-sm md:text-base leading-relaxed">
                Describe el problema, adjunta fotos y el GPS captura la ubicación automáticamente.
              </p>
            </div>
            <div className="text-center p-6 md:p-8">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#d7e2ff] flex items-center justify-center text-[#003a7a] mx-auto mb-4 md:mb-5">
                <span className="material-symbols-outlined text-3xl md:text-4xl">smart_toy</span>
              </div>
              <h3 className="font-headline font-bold text-base md:text-lg mb-2 md:mb-3">2. IA Analiza</h3>
              <p className="text-[#424752] text-sm md:text-base leading-relaxed">
                Nuestro agente IA verifica el contenido y detecta reportes similares en tu zona.
              </p>
            </div>
            <div className="text-center p-6 md:p-8 sm:col-span-2 md:col-span-1">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#d7e2ff] flex items-center justify-center text-[#003a7a] mx-auto mb-4 md:mb-5">
                <span className="material-symbols-outlined text-3xl md:text-4xl">engineering</span>
              </div>
              <h3 className="font-headline font-bold text-base md:text-lg mb-2 md:mb-3">3. Municipio Resuelve</h3>
              <p className="text-[#424752] text-sm md:text-base leading-relaxed">
                El equipo municipal gestiona tu reporte y te notifica cada cambio de estado.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
