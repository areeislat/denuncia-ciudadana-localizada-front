import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useAuthStore from '../../../store/authStore';

const camposIniciales = [
  { id: 'titulo',      label: 'Título del Reporte',      descripcion: 'Texto corto, máx. 100 caracteres.',          requerido: true,  bloqueado: false },
  { id: 'descripcion', label: 'Descripción del Evento',  descripcion: 'Campo de texto enriquecido multi-línea.',     requerido: true,  bloqueado: false },
  { id: 'foto',        label: 'Registro Fotográfico',    descripcion: 'Captura directa desde cámara o galería.',     requerido: true,  bloqueado: false },
  { id: 'ubicacion',   label: 'Ubicación GPS',           descripcion: 'Coordenadas exactas via Geolocalización.',    requerido: true,  bloqueado: true  },
];

const departamentosIniciales = [
  { id: '1', nombre: 'Depto. de Obras',      categoria: 'Vialidad',       color: 'border-[#003a7a]'  },
  { id: '2', nombre: 'Seguridad Ciudadana',  categoria: 'Emergencias',    color: 'border-[#D7141A]'  },
  { id: '3', nombre: 'Dirección de Aseo',    categoria: 'Medio Ambiente', color: 'border-green-600'  },
];

export default function AdminConfiguracion() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [campos, setCampos] = useState(camposIniciales);
  const [guardando, setGuardando] = useState(false);
  const [guardado, setGuardado] = useState(false);

  const initials = user?.fullName
    ?.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase() || '?';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleCampo = (id) => {
    setCampos((prev) => prev.map((c) =>
      c.id === id && !c.bloqueado ? { ...c, requerido: !c.requerido } : c
    ));
  };

  const handleGuardar = async () => {
    setGuardando(true);
    // TODO: llamada al backend cuando esté disponible
    setTimeout(() => {
      setGuardando(false);
      setGuardado(true);
      setTimeout(() => setGuardado(false), 3000);
    }, 800);
  };

  return (
    <div>
      {/* SIDEBAR desktop */}
      <aside className="hidden md:flex flex-col h-screen w-60 fixed left-0 top-0 bg-[#001A33] py-5 z-50">
        <div className="px-5 mb-6">
          <h1 className="text-base font-bold text-white font-headline">DESIGEO</h1>
          <p className="text-slate-400 text-[10px] mt-0.5">Panel de Gestión</p>
        </div>
        <div className="px-4 mb-5">
          <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3">
            <div className="w-9 h-9 rounded-full bg-[#0050A5] flex items-center justify-center text-white text-xs font-bold shrink-0">{initials}</div>
            <div className="min-w-0">
              <p className="text-white text-xs font-bold truncate">{user?.fullName}</p>
              <p className="text-slate-400 text-[10px]">Administrador Municipal</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 space-y-0.5 px-2 overflow-y-auto">
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider px-3 mb-1">Gestión</p>
          <Link to="/municipal/dashboard" className="sidebar-link rounded-lg px-3 py-2.5 flex items-center gap-2.5 text-sm text-slate-300 hover:text-white">
            <span className="material-symbols-outlined text-lg">dashboard</span>
            <span className="font-headline font-medium">Dashboard</span>
          </Link>
          <Link to="/municipal/gestion" className="sidebar-link rounded-lg px-3 py-2.5 flex items-center gap-2.5 text-sm text-slate-300 hover:text-white">
            <span className="material-symbols-outlined text-lg">assignment</span>
            <span className="font-headline font-medium">Gestión Reportes</span>
          </Link>
          <Link to="/admin/usuarios" className="sidebar-link rounded-lg px-3 py-2.5 flex items-center gap-2.5 text-sm text-slate-300 hover:text-white">
            <span className="material-symbols-outlined text-lg">group</span>
            <span className="font-headline font-medium">Usuarios</span>
          </Link>
          <Link to="/municipal/estadisticas" className="sidebar-link rounded-lg px-3 py-2.5 flex items-center gap-2.5 text-sm text-slate-300 hover:text-white">
            <span className="material-symbols-outlined text-lg">bar_chart</span>
            <span className="font-headline font-medium">Estadísticas</span>
          </Link>
          <Link to="/municipal/configuracion" className="sidebar-link sidebar-active rounded-lg px-3 py-2.5 flex items-center gap-2.5 text-sm text-white">
            <span className="material-symbols-outlined text-lg fill-icon">settings</span>
            <span className="font-headline font-medium">Configuración</span>
          </Link>
        </nav>
        <div className="px-3 mt-auto">
          <button onClick={handleLogout} className="text-slate-400 hover:text-white px-2 py-2 flex items-center gap-2 text-sm w-full">
            <span className="material-symbols-outlined text-lg">logout</span>Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* MOBILE HEADER */}
      <header className="md:hidden bg-[#001A33] sticky top-0 z-50 shadow-lg px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <button onClick={() => setMobileMenuOpen(true)} className="text-white">
            <span className="material-symbols-outlined">menu</span>
          </button>
          <span className="text-lg font-extrabold text-white font-headline">DESIGEO</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-white">notifications</span>
          <div className="w-8 h-8 rounded-full bg-[#0050A5] flex items-center justify-center text-white text-xs font-bold">{initials}</div>
        </div>
      </header>

      {/* MOBILE MENU */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-backdrop" onClick={() => setMobileMenuOpen(false)}></div>
        <div className="mobile-menu-panel">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white font-headline font-bold">DESIGEO</span>
            <button onClick={() => setMobileMenuOpen(false)} className="text-white">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-[#0050A5] flex items-center justify-center text-white text-xs font-bold">{initials}</div>
            <div>
              <p className="text-white text-xs font-bold">{user?.fullName}</p>
              <p className="text-slate-400 text-[10px]">Administrador Municipal</p>
            </div>
          </div>
          <nav className="space-y-1">
            <Link to="/municipal/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-slate-300 font-headline font-medium py-2.5 px-3 rounded-lg hover:bg-white/5 text-sm">
              <span className="material-symbols-outlined">dashboard</span>Dashboard
            </Link>
            <Link to="/municipal/gestion" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-slate-300 font-headline font-medium py-2.5 px-3 rounded-lg hover:bg-white/5 text-sm">
              <span className="material-symbols-outlined">assignment</span>Gestión Reportes
            </Link>
            <Link to="/municipal/configuracion" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-white font-headline font-medium py-2.5 px-3 rounded-lg bg-white/10 text-sm">
              <span className="material-symbols-outlined">settings</span>Configuración
            </Link>
            <div className="border-t border-white/10 my-3"></div>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 text-red-400 font-headline font-medium py-2.5 px-3 rounded-lg hover:bg-white/5 text-sm">
              <span className="material-symbols-outlined">logout</span>Cerrar sesión
            </button>
          </nav>
        </div>
      </div>

      {/* MAIN */}
      <main className="md:ml-60 p-4 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#1b1c1c] font-headline mb-1">Configuración</h2>
            <p className="text-[#424752] text-sm">Personaliza cómo opera tu municipio dentro del sistema.</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 border border-[#003a7a] text-[#003a7a] font-headline font-bold py-2.5 px-5 rounded-full text-sm hover:bg-[#f5f3f3] transition-colors">
              <span className="material-symbols-outlined text-sm">preview</span>Previsualizar
            </button>
            <button
              onClick={handleGuardar}
              disabled={guardando}
              className="flex items-center gap-2 bg-[#0050A5] text-white font-headline font-bold py-2.5 px-5 rounded-full text-sm hover:bg-[#003A7A] transition-colors shadow-md disabled:opacity-60"
            >
              <span className="material-symbols-outlined text-sm">save</span>
              {guardando ? 'Guardando...' : guardado ? '¡Guardado!' : 'Guardar Cambios'}
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">

          {/* Campos del formulario */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#f5f3f3]">
            <h3 className="font-headline font-extrabold text-[#003a7a] mb-1">Formulario de Denuncia</h3>
            <p className="text-xs text-[#424752] mb-6">Activa o desactiva los campos que el ciudadano debe completar.</p>

            <p className="text-[9px] font-bold text-[#737783] uppercase tracking-wider mb-3">Campos Activos</p>
            <div className="space-y-3 mb-6">
              {campos.map((campo) => (
                <div key={campo.id} className="flex items-center gap-3 bg-[#f5f3f3] p-4 rounded-xl border-2 border-dashed border-[#c2c6d4]/50">
                  <span className="material-symbols-outlined text-[#737783]">drag_indicator</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-bold text-sm text-[#1b1c1c]">{campo.label}</span>
                      <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                        campo.bloqueado
                          ? 'bg-[#003a7a]/10 text-[#003a7a]'
                          : 'bg-[#c5dcfd] text-[#003a7a]'
                      }`}>
                        {campo.bloqueado ? 'Bloqueado' : 'Requerido'}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#737783]">{campo.descripcion}</p>
                  </div>
                  {campo.bloqueado ? (
                    <span className="material-symbols-outlined text-[#003a7a]">lock</span>
                  ) : (
                    <button onClick={() => toggleCampo(campo.id)}>
                      <span className={`material-symbols-outlined ${campo.requerido ? 'text-[#003a7a]' : 'text-[#737783]'}`}
                        style={{ fontVariationSettings: campo.requerido ? "'FILL' 1" : "'FILL' 0" }}>
                        toggle_on
                      </span>
                    </button>
                  )}
                </div>
              ))}
            </div>

            <p className="text-[9px] font-bold text-[#737783] uppercase tracking-wider mb-3">Añadir Campo</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: 'text_fields',    label: 'Texto Corto'    },
                { icon: 'calendar_month', label: 'Fecha / Hora'   },
                { icon: 'check_box',      label: 'Opción Múltiple'},
                { icon: 'attach_file',    label: 'Archivo PDF'    },
              ].map((item) => (
                <button
                  key={item.label}
                  className="flex flex-col items-center justify-center p-4 bg-[#fbf9f8] rounded-xl border border-[#e4e2e2] hover:border-[#003a7a] hover:text-[#003a7a] transition-all group text-[#424752]"
                >
                  <span className="material-symbols-outlined mb-1 group-hover:scale-110 transition-transform">{item.icon}</span>
                  <span className="text-xs font-bold">{item.label}</span>
                </button>
              ))}
            </div>

            {/* Consejo UX */}
            <div className="mt-6 p-4 bg-[#c5dcfd]/20 rounded-xl border border-[#c5dcfd]">
              <p className="font-bold text-xs text-[#003a7a] flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-base">info</span>Consejo de UX Ciudadana
              </p>
              <p className="text-[10px] text-[#424752] leading-relaxed">
                Mantener el formulario bajo los 4 campos obligatorios incrementa la participación ciudadana en un 40%.
              </p>
            </div>
          </div>

          {/* Departamentos */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#f5f3f3]">
            <h3 className="font-headline font-extrabold text-[#003a7a] mb-1">Departamentos</h3>
            <p className="text-xs text-[#424752] mb-6">Asigna categorías de reportes a departamentos de tu municipio.</p>

            <div className="space-y-3 mb-6">
              {departamentosIniciales.map((depto) => (
                <div key={depto.id} className={`p-4 bg-white rounded-xl border-l-4 ${depto.color} shadow-sm border border-[#f5f3f3]`}>
                  <label className="block text-[10px] font-bold text-[#737783] uppercase tracking-wider mb-1">{depto.categoria}</label>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#1b1c1c]">{depto.nombre}</span>
                    <button className="text-[#003a7a] hover:bg-[#f5f3f3] p-1.5 rounded-lg transition-colors">
                      <span className="material-symbols-outlined text-sm">edit</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-[#c2c6d4] text-[#737783] font-bold py-3 rounded-xl hover:border-[#003a7a] hover:text-[#003a7a] transition-colors text-sm">
              <span className="material-symbols-outlined text-sm">add</span>Agregar Departamento
            </button>

            {/* Info municipio */}
            <div className="mt-6 pt-6 border-t border-[#f5f3f3]">
              <p className="text-[9px] font-bold text-[#737783] uppercase tracking-wider mb-3">Información del Municipio</p>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-[#737783] mb-1">Nombre</label>
                  <input
                    type="text"
                    defaultValue="Municipalidad de Providencia"
                    className="w-full text-sm border border-[#e4e2e2] rounded-lg px-3 py-2 focus:outline-none focus:border-[#003a7a] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#737783] mb-1">Email de contacto</label>
                  <input
                    type="email"
                    defaultValue="contacto@providencia.cl"
                    className="w-full text-sm border border-[#e4e2e2] rounded-lg px-3 py-2 focus:outline-none focus:border-[#003a7a] transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}