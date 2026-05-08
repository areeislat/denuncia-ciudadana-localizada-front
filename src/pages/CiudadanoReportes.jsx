import { Link } from 'react-router-dom';

export default function CiudadanoReportes() {
  return (
    <div className="min-h-screen bg-[#fbf9f8]">
      <header className="bg-[#001A33] sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 md:px-6 py-4">
          <div className="flex items-center gap-3">
            <Link to="/ciudadano" className="text-white md:hidden">
              <span className="material-symbols-outlined">arrow_back</span>
            </Link>
            <Link to="/ciudadano" className="text-xl font-extrabold text-white tracking-tight font-headline">
              DESIGEO
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/ciudadano" className="text-slate-300 hover:text-white font-headline font-bold text-sm">
              Inicio
            </Link>
            <Link to="/ciudadano/crear" className="text-slate-300 hover:text-white font-headline font-bold text-sm">
              Reportar
            </Link>
            <Link
              to="/ciudadano/reportes"
              className="text-white font-headline font-bold text-sm border-b-2 border-[#D7141A] pb-1"
            >
              Mis Reportes
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <button className="text-white hover:bg-white/10 rounded-md p-2">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-[#0050A5] flex items-center justify-center text-white text-xs font-bold">
              MG
            </div>
          </div>
        </div>
      </header>

      <main className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-headline font-extrabold text-[#003a7a] mb-2">
              Mis Reportes
            </h1>
            <p className="text-[#424752] text-sm md:text-base">Estado de tus solicitudes ciudadanas.</p>
          </div>
          <Link
            to="/ciudadano/crear"
            className="bg-[#0050A5] text-white font-headline font-bold py-2.5 md:py-3 px-5 md:px-6 rounded-full hover:bg-[#003A7A] transition-colors flex items-center justify-center gap-2 text-sm md:text-base self-start"
          >
            <span className="material-symbols-outlined text-base md:text-lg fill-icon">add_circle</span> 
            <span>Nuevo Reporte</span>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-6 md:mb-8 scrollbar-hide" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
          <button className="flex-shrink-0 bg-[#003a7a] text-white px-4 md:px-5 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-semibold shadow-sm">
            Todos (5)
          </button>
          <button className="flex-shrink-0 bg-[#eae8e7] text-[#424752] px-4 md:px-5 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-semibold hover:bg-[#dbd9d9]">
            Pendientes (1)
          </button>
          <button className="flex-shrink-0 bg-[#eae8e7] text-[#424752] px-4 md:px-5 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-semibold hover:bg-[#dbd9d9]">
            En Proceso (1)
          </button>
          <button className="flex-shrink-0 bg-[#eae8e7] text-[#424752] px-4 md:px-5 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-semibold hover:bg-[#dbd9d9]">
            Resueltos (2)
          </button>
          <button className="flex-shrink-0 bg-[#eae8e7] text-[#424752] px-4 md:px-5 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-semibold hover:bg-[#dbd9d9]">
            Rechazados (1)
          </button>
        </div>

        {/* Reports grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {/* Card 1 */}
          <div className="block bg-white rounded-xl p-5 md:p-6 shadow-sm border border-[#f5f3f3] card-hover">
            <div className="flex justify-between items-start mb-3">
              <span className="badge-pendiente text-[9px] md:text-[10px] font-bold uppercase px-3 py-1 rounded-full flex items-center gap-1">
                <span className="material-symbols-outlined text-xs fill-icon">pending</span>Pendiente
              </span>
              <span className="text-[10px] md:text-xs text-[#737783]">Hace 2 horas</span>
            </div>
            <h3 className="font-headline font-bold text-[#1b1c1c] text-base md:text-lg mb-2 line-clamp-2">
              Bache de gran tamaño en cruce peatonal
            </h3>
            <div className="flex items-center gap-1 text-[#424752] mb-3">
              <span className="material-symbols-outlined text-sm">location_on</span>
              <span className="text-xs md:text-sm truncate">Av. Irarrázaval 3421, Ñuñoa</span>
            </div>
            <div className="flex items-center gap-3 md:gap-4 text-xs md:text-sm text-[#424752]">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">thumb_up</span> 12 apoyos
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">photo_camera</span> 2 fotos
              </span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-xl p-5 md:p-6 shadow-sm border border-[#f5f3f3]">
            <div className="flex justify-between items-start mb-3">
              <span className="badge-proceso text-[9px] md:text-[10px] font-bold uppercase px-3 py-1 rounded-full flex items-center gap-1">
                <span className="material-symbols-outlined text-xs fill-icon">sync</span>En Proceso
              </span>
              <span className="text-[10px] md:text-xs text-[#737783]">Ayer, 14:30</span>
            </div>
            <h3 className="font-headline font-bold text-[#1b1c1c] text-base md:text-lg mb-2 line-clamp-2">
              Microbasural - Av. Providencia
            </h3>
            <div className="flex items-center gap-1 text-[#424752] mb-3">
              <span className="material-symbols-outlined text-sm">location_on</span>
              <span className="text-xs md:text-sm truncate">Av. Providencia 1240</span>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-2.5 md:p-3 flex items-start gap-2">
              <span className="material-symbols-outlined text-[#003a7a] text-base shrink-0">info</span>
              <p className="text-[10px] md:text-xs text-[#003a7a] font-medium leading-relaxed">
                Cuadrilla municipal asignada. Resolución estimada: 24h.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-xl p-5 md:p-6 shadow-sm border border-[#f5f3f3]">
            <div className="flex justify-between items-start mb-3">
              <span className="badge-resuelto text-[9px] md:text-[10px] font-bold uppercase px-3 py-1 rounded-full flex items-center gap-1">
                <span className="material-symbols-outlined text-xs fill-icon">check_circle</span>Resuelto
              </span>
              <span className="text-[10px] md:text-xs text-[#737783]">3 Oct 2024</span>
            </div>
            <h3 className="font-headline font-bold text-[#1b1c1c] text-base md:text-lg mb-2 line-clamp-2">
              Luminaria dañada - Calle Los Leones
            </h3>
            <div className="flex items-center gap-1 text-[#424752] mb-3">
              <span className="material-symbols-outlined text-sm">location_on</span>
              <span className="text-xs md:text-sm truncate">Calle Los Leones 450, Providencia</span>
            </div>
            <div className="flex items-center gap-3 md:gap-4 text-xs md:text-sm text-[#424752]">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">thumb_up</span> 5 apoyos
              </span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-xl p-5 md:p-6 shadow-sm border border-[#f5f3f3]">
            <div className="flex justify-between items-start mb-3">
              <span className="badge-rechazado text-[9px] md:text-[10px] font-bold uppercase px-3 py-1 rounded-full flex items-center gap-1">
                <span className="material-symbols-outlined text-xs fill-icon">cancel</span>Rechazado
              </span>
              <span className="text-[10px] md:text-xs text-[#737783]">28 Sep 2024</span>
            </div>
            <h3 className="font-headline font-bold text-[#1b1c1c] text-base md:text-lg mb-2 line-clamp-2">
              Vehículo mal estacionado
            </h3>
            <div className="flex items-center gap-1 text-[#424752] mb-3">
              <span className="material-symbols-outlined text-sm">location_on</span>
              <span className="text-xs md:text-sm truncate">Pje. Las Orquideas 45</span>
            </div>
            <p className="text-[10px] md:text-xs text-[#ba1a1a] font-medium italic">
              Motivo: Fuera de jurisdicción municipal.
            </p>
          </div>

          {/* Card 5 */}
          <div className="bg-white rounded-xl p-5 md:p-6 shadow-sm border border-[#f5f3f3]">
            <div className="flex justify-between items-start mb-3">
              <span className="badge-resuelto text-[9px] md:text-[10px] font-bold uppercase px-3 py-1 rounded-full flex items-center gap-1">
                <span className="material-symbols-outlined text-xs fill-icon">check_circle</span>Resuelto
              </span>
              <span className="text-[10px] md:text-xs text-[#737783]">20 Sep 2024</span>
            </div>
            <h3 className="font-headline font-bold text-[#1b1c1c] text-base md:text-lg mb-2 line-clamp-2">
              Señalética de Pare dañada
            </h3>
            <div className="flex items-center gap-1 text-[#424752]">
              <span className="material-symbols-outlined text-sm">location_on</span>
              <span className="text-xs md:text-sm truncate">Esquina Eliodoro Yáñez</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
