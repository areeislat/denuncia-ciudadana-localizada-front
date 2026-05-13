import { Link, useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useAuthStore from '../../store/authStore';

// TODO: reemplazar con llamada al Report Service cuando esté disponible
const mockReportes = {
  '1': {
    id: '1',
    folio: '#DEN-2026-0001',
    titulo: 'Bache de gran tamaño en cruce peatonal',
    direccion: 'Av. Irarrázaval 3421, Ñuñoa',
    categoria: 'Vialidad',
    prioridad: 'HIGH',
    estado: 'PENDING',
    fecha: '14 Oct, 09:20',
    apoyos: 12,
    descripcion: 'Bache de aproximadamente 50cm de diámetro en la calzada, representa peligro para vehículos y ciclistas.',
    historial: [
      { estado: 'Reporte Recibido', fecha: '14 Oct, 09:20', actor: 'Sistema central', completo: true },
      { estado: 'En Inspección', fecha: '15 Oct, 14:45', actor: 'Equipo de Terreno', completo: true },
      { estado: 'Programado para Reparación', fecha: 'Pendiente', actor: 'Pendiente de materiales', completo: false },
    ],
    comentarios: [],
  },
  '2': {
    id: '2',
    folio: '#DEN-2026-0002',
    titulo: 'Microbasural - Av. Providencia',
    direccion: 'Av. Providencia 1240',
    categoria: 'Medio Ambiente',
    prioridad: 'MEDIUM',
    estado: 'IN_PROGRESS',
    fecha: 'Ayer, 14:30',
    apoyos: 5,
    descripcion: 'Acumulación de basura en la vereda, lleva varios días sin ser retirada.',
    historial: [
      { estado: 'Reporte Recibido', fecha: 'Ayer, 10:00', actor: 'Sistema central', completo: true },
      { estado: 'Asignado a Cuadrilla', fecha: 'Ayer, 14:30', actor: 'Agente Municipal', completo: true },
    ],
    comentarios: [
      { autor: 'Agente Municipal - Operaciones', iniciales: 'AM', fecha: 'Hace 2 horas', texto: 'Cuadrilla municipal asignada. Tiempo estimado de resolución: 24 horas.' },
    ],
  },
};

const prioridadConfig = {
  HIGH:   { label: 'Alta',  clase: 'bg-[#D7141A] text-white' },
  MEDIUM: { label: 'Media', clase: 'bg-amber-100 text-amber-800' },
  LOW:    { label: 'Baja',  clase: 'bg-green-100 text-green-800' },
};

const estadoConfig = {
  PENDING:     { label: 'Pendiente', clase: 'badge-pendiente' },
  IN_PROGRESS: { label: 'En Proceso', clase: 'badge-proceso' },
  RESOLVED:    { label: 'Resuelto',  clase: 'badge-resuelto' },
  REJECTED:    { label: 'Rechazado', clase: 'badge-rechazado' },
};

export default function CiudadanoDetalleReporte() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const initials = user?.fullName
    ?.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase() || '?';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // TODO: reemplazar con fetch real por id
  const reporte = mockReportes[id];

  if (!reporte) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-[#424752] font-headline font-bold text-lg">Reporte no encontrado.</p>
        <Link to="/ciudadano/reportes" className="text-[#003a7a] font-bold text-sm flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">arrow_back</span> Volver a mis reportes
        </Link>
      </div>
    );
  }

  const prioridad = prioridadConfig[reporte.prioridad];
  const estado = estadoConfig[reporte.estado];

  return (
    <div>
      {/* HEADER */}
      <header className="bg-[#001A33] sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 md:px-6 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="text-white hover:bg-white/10 rounded-md p-1">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <Link to="/ciudadano" className="text-xl font-extrabold text-white tracking-tight font-headline">DESIGEO</Link>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/ciudadano" className="text-slate-300 hover:text-white font-headline font-bold text-sm">Inicio</Link>
            <Link to="/ciudadano/reportes" className="text-white font-headline font-bold text-sm border-b-2 border-[#D7141A] pb-1">Mis Reportes</Link>
          </nav>
          <div className="flex items-center gap-3">
            <button className="text-white hover:bg-white/10 rounded-md p-2">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-[#0050A5] flex items-center justify-center text-white text-xs font-bold">
              {initials}
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
            <Link to="/ciudadano" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-slate-300 font-headline font-medium py-3 px-4 rounded-lg hover:bg-white/5">
              <span className="material-symbols-outlined">home</span>Inicio
            </Link>
            <Link to="/ciudadano/crear" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-slate-300 font-headline font-medium py-3 px-4 rounded-lg hover:bg-white/5">
              <span className="material-symbols-outlined">add_circle</span>Reportar
            </Link>
            <Link to="/ciudadano/reportes" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-white font-headline font-medium py-3 px-4 rounded-lg bg-white/10">
              <span className="material-symbols-outlined">history</span>Mis Reportes
            </Link>
            <div className="border-t border-white/10 my-4"></div>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 text-red-400 font-headline font-medium py-3 px-4 rounded-lg hover:bg-white/5">
              <span className="material-symbols-outlined">logout</span>Cerrar sesión
            </button>
          </nav>
        </div>
      </div>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">

        {/* Encabezado del reporte */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#f5f3f3] mb-6">
          <div className="flex flex-wrap justify-between items-start gap-3 mb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`${estado.clase} text-[9px] font-bold uppercase px-3 py-1 rounded-full flex items-center gap-1`}>
                {estado.label}
              </span>
              <span className={`${prioridad.clase} text-[9px] font-bold uppercase px-3 py-1 rounded-full`}>
                Prioridad {prioridad.label}
              </span>
            </div>
            <span className="text-xs font-bold text-[#003a7a] font-headline">{reporte.folio}</span>
          </div>
          <h1 className="text-2xl font-headline font-extrabold text-[#003a7a] mb-2">{reporte.titulo}</h1>
          <div className="flex items-center gap-2 text-[#424752] mb-3">
            <span className="material-symbols-outlined text-sm">location_on</span>
            <span className="text-sm">{reporte.direccion}</span>
          </div>
          <p className="text-sm text-[#424752] leading-relaxed mb-4">{reporte.descripcion}</p>
          <div className="flex flex-wrap gap-4 text-xs text-[#424752]">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">category</span>{reporte.categoria}
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">calendar_today</span>{reporte.fecha}
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">thumb_up</span>{reporte.apoyos} apoyos
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Historial de estados */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#f5f3f3]">
            <h2 className="font-headline font-extrabold text-lg text-[#003a7a] mb-6">Estado del Trámite</h2>
            <div className="relative space-y-0">
              <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-[#e4e2e2]"></div>
              {reporte.historial.map((paso, i) => (
                <div key={i} className="relative flex gap-4 pb-7">
                  <div className={`z-10 w-8 h-8 rounded-full flex items-center justify-center ring-4 ring-white shrink-0 ${
                    paso.completo ? 'bg-[#003a7a] text-white' : 'bg-[#e4e2e2] text-[#737783]'
                  }`}>
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {paso.completo ? 'check' : 'schedule'}
                    </span>
                  </div>
                  <div>
                    <p className={`font-bold text-sm ${paso.completo ? 'text-[#1b1c1c]' : 'text-[#737783]'}`}>{paso.estado}</p>
                    <p className="text-xs text-[#424752]">{paso.fecha} · {paso.actor}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comentarios */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#f5f3f3]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-headline font-extrabold text-lg text-[#003a7a]">Comentarios</h2>
              <span className="bg-[#c5dcfd] text-[#003a7a] text-[10px] font-bold px-2 py-0.5 rounded-full">
                {reporte.comentarios.length} {reporte.comentarios.length === 1 ? 'respuesta' : 'respuestas'}
              </span>
            </div>
            {reporte.comentarios.length === 0 ? (
              <p className="text-sm text-[#424752] text-center py-8">Sin comentarios aún.</p>
            ) : (
              <div className="space-y-4">
                {reporte.comentarios.map((c, i) => (
                  <div key={i} className="bg-[#f5f3f3] rounded-xl p-4 border-l-4 border-[#003a7a]">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-9 h-9 rounded-full bg-[#0050A5] flex items-center justify-center text-white font-bold text-xs shrink-0">
                        {c.iniciales}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-[#1b1c1c]">{c.autor}</p>
                        <p className="text-[10px] text-[#737783] uppercase font-semibold">{c.fecha}</p>
                      </div>
                    </div>
                    <p className="text-sm text-[#424752] leading-relaxed">{c.texto}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Link
            to="/ciudadano/reportes"
            className="flex-1 border border-[#003a7a] text-[#003a7a] font-headline font-bold py-3 px-6 rounded-full flex items-center justify-center gap-2 hover:bg-[#f5f3f3] transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span> Volver
          </Link>
          {reporte.estado === 'RESOLVED' && (
            <button className="flex-1 bg-[#0050A5] text-white font-headline font-bold py-3 px-6 rounded-full flex items-center justify-center gap-2 hover:bg-[#003A7A] transition-colors shadow-lg">
              <span className="material-symbols-outlined">refresh</span> Reabrir Reporte
            </button>
          )}
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