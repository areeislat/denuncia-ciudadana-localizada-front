import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useAuthStore from '../../../store/authStore';
import MunicipalSidebar from '../../../components/MunicipalSidebar';

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
      <MunicipalSidebar />
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