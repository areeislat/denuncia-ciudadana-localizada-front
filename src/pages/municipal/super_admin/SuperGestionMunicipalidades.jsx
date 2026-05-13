import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useAuthStore from '../../../store/authStore';

// TODO: reemplazar con llamada al backend cuando esté disponible
const mockMunicipalidades = [
  { id: '1', nombre: 'Municipalidad de Providencia',  comuna: 'Providencia',  region: 'Metropolitana', email: 'contacto@providencia.cl',  activa: true,  agentes: 8,  reportes: 342, createdAt: '2026-01-10' },
  { id: '2', nombre: 'Municipalidad de Ñuñoa',        comuna: 'Ñuñoa',        region: 'Metropolitana', email: 'contacto@nunoa.cl',         activa: true,  agentes: 5,  reportes: 218, createdAt: '2026-01-15' },
  { id: '3', nombre: 'Municipalidad de Macul',        comuna: 'Macul',        region: 'Metropolitana', email: 'contacto@macul.cl',         activa: true,  agentes: 4,  reportes: 156, createdAt: '2026-02-01' },
  { id: '4', nombre: 'Municipalidad de La Florida',   comuna: 'La Florida',   region: 'Metropolitana', email: 'contacto@laflorida.cl',     activa: false, agentes: 3,  reportes: 89,  createdAt: '2026-02-20' },
  { id: '5', nombre: 'Municipalidad de Santiago',     comuna: 'Santiago',     region: 'Metropolitana', email: 'contacto@santiago.cl',      activa: true,  agentes: 12, reportes: 521, createdAt: '2026-01-05' },
];

export default function SuperGestionMunicipalidades() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [municipalidades, setMunicipalidades] = useState(mockMunicipalidades);
  const [busqueda, setBusqueda] = useState('');
  const [filtroActivo, setFiltroActivo] = useState('Todas');
  const [modalEliminar, setModalEliminar] = useState(null);
  const [modalCrear, setModalCrear] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const [form, setForm] = useState({ nombre: '', comuna: '', region: '', email: '' });
  const [guardando, setGuardando] = useState(false);

  const initials = user?.fullName
    ?.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase() || '?';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const municipalidadesFiltradas = municipalidades.filter((m) => {
    const matchBusqueda = busqueda === '' ||
      m.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      m.comuna.toLowerCase().includes(busqueda.toLowerCase());
    const matchActivo =
      filtroActivo === 'Todas' ||
      (filtroActivo === 'Activas' && m.activa) ||
      (filtroActivo === 'Inactivas' && !m.activa);
    return matchBusqueda && matchActivo;
  });

  const handleEliminar = async () => {
    if (!modalEliminar) return;
    setEliminando(true);
    // TODO: llamada DELETE al backend
    setTimeout(() => {
      setMunicipalidades((prev) => prev.filter((m) => m.id !== modalEliminar.id));
      setModalEliminar(null);
      setEliminando(false);
    }, 800);
  };

  const handleCrear = async () => {
    if (!form.nombre || !form.comuna || !form.email) return;
    setGuardando(true);
    // TODO: llamada POST al backend
    setTimeout(() => {
      setMunicipalidades((prev) => [...prev, {
        id: String(Date.now()),
        ...form,
        activa: true,
        agentes: 0,
        reportes: 0,
        createdAt: new Date().toISOString().split('T')[0],
      }]);
      setForm({ nombre: '', comuna: '', region: '', email: '' });
      setModalCrear(false);
      setGuardando(false);
    }, 800);
  };

  const formatFecha = (fecha) => {
    if (!fecha) return '—';
    return new Date(fecha).toLocaleDateString('es-CL', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
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
            <div className="w-9 h-9 rounded-full bg-[#D7141A] flex items-center justify-center text-white text-xs font-bold shrink-0">{initials}</div>
            <div className="min-w-0">
              <p className="text-white text-xs font-bold truncate">{user?.fullName}</p>
              <p className="text-slate-400 text-[10px]">Super Administrador</p>
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
          <Link to="/super/usuarios" className="sidebar-link rounded-lg px-3 py-2.5 flex items-center gap-2.5 text-sm text-slate-300 hover:text-white">
            <span className="material-symbols-outlined text-lg">group</span>
            <span className="font-headline font-medium">Usuarios</span>
          </Link>
          <div className="border-t border-white/5 my-2 mx-2"></div>
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider px-3 mb-1">Super Admin</p>
          <Link to="/super/municipalidades" className="sidebar-link sidebar-active rounded-lg px-3 py-2.5 flex items-center gap-2.5 text-sm text-white">
            <span className="material-symbols-outlined text-lg fill-icon">location_city</span>
            <span className="font-headline font-medium">Municipalidades</span>
          </Link>
          <Link to="/super/auditoria" className="sidebar-link rounded-lg px-3 py-2.5 flex items-center gap-2.5 text-sm text-slate-300 hover:text-white">
            <span className="material-symbols-outlined text-lg">policy</span>
            <span className="font-headline font-medium">Auditoría</span>
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
          <div className="w-8 h-8 rounded-full bg-[#D7141A] flex items-center justify-center text-white text-xs font-bold">{initials}</div>
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
            <div className="w-9 h-9 rounded-full bg-[#D7141A] flex items-center justify-center text-white text-xs font-bold">{initials}</div>
            <div>
              <p className="text-white text-xs font-bold">{user?.fullName}</p>
              <p className="text-slate-400 text-[10px]">Super Administrador</p>
            </div>
          </div>
          <nav className="space-y-1">
            <Link to="/municipal/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-slate-300 font-headline font-medium py-2.5 px-3 rounded-lg hover:bg-white/5 text-sm">
              <span className="material-symbols-outlined">dashboard</span>Dashboard
            </Link>
            <Link to="/super/municipalidades" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-white font-headline font-medium py-2.5 px-3 rounded-lg bg-white/10 text-sm">
              <span className="material-symbols-outlined">location_city</span>Municipalidades
            </Link>
            <Link to="/super/auditoria" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-slate-300 font-headline font-medium py-2.5 px-3 rounded-lg hover:bg-white/5 text-sm">
              <span className="material-symbols-outlined">policy</span>Auditoría
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#1b1c1c] font-headline mb-1">Municipalidades</h2>
            <p className="text-[#424752] text-sm">Gestión global de municipios en el sistema.</p>
          </div>
          <button
            onClick={() => setModalCrear(true)}
            className="flex items-center gap-2 bg-[#D7141A] text-white font-headline font-bold py-2.5 px-5 rounded-full text-sm hover:bg-red-700 transition-colors shadow-md self-start"
          >
            <span className="material-symbols-outlined text-sm">add_business</span>Nueva Municipalidad
          </button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Total',    valor: municipalidades.length,                       color: 'border-[#003a7a]', text: 'text-[#003a7a]' },
            { label: 'Activas',  valor: municipalidades.filter((m) => m.activa).length,  color: 'border-[#059669]', text: 'text-[#059669]' },
            { label: 'Inactivas',valor: municipalidades.filter((m) => !m.activa).length, color: 'border-[#737783]', text: 'text-[#737783]' },
          ].map((item) => (
            <div key={item.label} className={`bg-white rounded-xl p-4 shadow-sm border-l-4 ${item.color}`}>
              <p className="text-[10px] font-bold text-[#737783] uppercase tracking-wider">{item.label}</p>
              <p className={`text-2xl font-extrabold font-headline mt-1 ${item.text}`}>{item.valor}</p>
            </div>
          ))}
        </div>

        {/* Búsqueda y filtros */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-[#f5f3f3] mb-6 flex flex-col md:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2 border border-[#e4e2e2] rounded-lg px-3 py-2">
            <span className="material-symbols-outlined text-[#737783] text-sm">search</span>
            <input
              type="text"
              placeholder="Buscar por nombre o comuna..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="flex-1 text-sm outline-none bg-transparent text-[#1b1c1c] placeholder:text-[#737783]"
            />
          </div>
          <div className="flex gap-2">
            {['Todas', 'Activas', 'Inactivas'].map((f) => (
              <button
                key={f}
                onClick={() => setFiltroActivo(f)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  filtroActivo === f
                    ? 'bg-[#003a7a] text-white'
                    : 'bg-[#eae8e7] text-[#424752] hover:bg-[#dbd9d9]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {municipalidadesFiltradas.length === 0 && (
            <p className="col-span-3 text-center text-[#424752] text-sm py-12">No hay municipalidades que coincidan.</p>
          )}
          {municipalidadesFiltradas.map((m) => (
            <div key={m.id} className="bg-white rounded-2xl p-5 shadow-sm border border-[#f5f3f3] hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#001A33] flex items-center justify-center text-white shrink-0">
                    <span className="material-symbols-outlined text-lg">location_city</span>
                  </div>
                  <div>
                    <p className="font-headline font-extrabold text-[#1b1c1c] text-sm leading-tight">{m.nombre}</p>
                    <p className="text-[10px] text-[#737783]">{m.region}</p>
                  </div>
                </div>
                <span className={`text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                  m.activa ? 'bg-green-100 text-green-700' : 'bg-[#eae8e7] text-[#737783]'
                }`}>
                  {m.activa ? 'Activa' : 'Inactiva'}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs text-[#424752]">
                  <span className="material-symbols-outlined text-sm text-[#003a7a]">email</span>
                  <span className="truncate">{m.email}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#424752]">
                  <span className="material-symbols-outlined text-sm text-[#003a7a]">calendar_today</span>
                  <span>Creada {formatFecha(m.createdAt)}</span>
                </div>
              </div>

              <div className="flex gap-3 py-3 border-t border-b border-[#f5f3f3] mb-4">
                <div className="flex-1 text-center">
                  <p className="text-lg font-extrabold font-headline text-[#003a7a]">{m.agentes}</p>
                  <p className="text-[10px] text-[#737783]">Agentes</p>
                </div>
                <div className="w-px bg-[#f5f3f3]"></div>
                <div className="flex-1 text-center">
                  <p className="text-lg font-extrabold font-headline text-[#003a7a]">{m.reportes}</p>
                  <p className="text-[10px] text-[#737783]">Reportes</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-1 text-[#003a7a] border border-[#003a7a] font-bold py-2 rounded-full text-xs hover:bg-[#f5f3f3] transition-colors">
                  <span className="material-symbols-outlined text-sm">edit</span>Editar
                </button>
                <button
                  onClick={() => setModalEliminar(m)}
                  className="flex-1 flex items-center justify-center gap-1 text-[#ba1a1a] border border-[#ba1a1a] font-bold py-2 rounded-full text-xs hover:bg-red-50 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Modal crear municipalidad */}
      {modalCrear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => !guardando && setModalCrear(false)}></div>
          <div className="relative bg-white rounded-2xl p-6 shadow-2xl max-w-md w-full">
            <h3 className="font-headline font-extrabold text-[#1b1c1c] text-lg mb-6">Nueva Municipalidad</h3>
            <div className="space-y-4">
              {[
                { key: 'nombre',  label: 'Nombre',   placeholder: 'Municipalidad de ...',    type: 'text'  },
                { key: 'comuna',  label: 'Comuna',   placeholder: 'Nombre de la comuna',     type: 'text'  },
                { key: 'region',  label: 'Región',   placeholder: 'Región Metropolitana',    type: 'text'  },
                { key: 'email',   label: 'Email',    placeholder: 'contacto@municipio.cl',   type: 'email' },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-xs font-bold text-[#737783] uppercase tracking-wider mb-1">{field.label}</label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={form[field.key]}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    className="w-full text-sm border border-[#e4e2e2] rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#003a7a] transition-colors"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setModalCrear(false)}
                disabled={guardando}
                className="flex-1 border border-[#e4e2e2] text-[#424752] font-headline font-bold py-2.5 rounded-full hover:bg-[#f5f3f3] transition-colors text-sm disabled:opacity-60"
              >
                Cancelar
              </button>
              <button
                onClick={handleCrear}
                disabled={guardando || !form.nombre || !form.comuna || !form.email}
                className="flex-1 bg-[#D7141A] text-white font-headline font-bold py-2.5 rounded-full hover:bg-red-700 transition-colors text-sm disabled:opacity-60"
              >
                {guardando ? 'Creando...' : 'Crear'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal eliminar */}
      {modalEliminar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => !eliminando && setModalEliminar(null)}></div>
          <div className="relative bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full">
            <h3 className="font-headline font-extrabold text-[#1b1c1c] text-lg mb-2">¿Eliminar municipalidad?</h3>
            <p className="text-sm text-[#424752] mb-2">
              Estás a punto de eliminar <span className="font-bold">{modalEliminar.nombre}</span>.
            </p>
            <p className="text-xs text-[#ba1a1a] font-medium mb-6">
              ⚠️ Se eliminarán todos los usuarios y reportes asociados. Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setModalEliminar(null)}
                disabled={eliminando}
                className="flex-1 border border-[#e4e2e2] text-[#424752] font-headline font-bold py-2.5 rounded-full hover:bg-[#f5f3f3] transition-colors text-sm disabled:opacity-60"
              >
                Cancelar
              </button>
              <button
                onClick={handleEliminar}
                disabled={eliminando}
                className="flex-1 bg-[#ba1a1a] text-white font-headline font-bold py-2.5 rounded-full hover:bg-red-700 transition-colors text-sm disabled:opacity-60"
              >
                {eliminando ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}