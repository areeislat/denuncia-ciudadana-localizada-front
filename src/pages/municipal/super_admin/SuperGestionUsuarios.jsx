import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import useAuthStore from '../../../store/authStore';

const API_URL_PUBLIC = 'http://localhost:8087/api/users'; // POST crear ciudadano sin token
const API_URL = 'http://localhost:8080/api/users';   

const roleConfig = {
  CITIZEN:           { label: 'Ciudadano',            clase: 'bg-[#c5dcfd] text-[#003a7a]'       },
  MUNICIPAL_OFFICER: { label: 'Funcionario Municipal', clase: 'bg-amber-100 text-amber-700'       },
  ADMIN_MUNICIPAL:   { label: 'Admin Municipal',       clase: 'bg-purple-100 text-purple-700'     },
  SUPER_ADMIN:       { label: 'Super Admin',           clase: 'bg-[#D7141A]/10 text-[#D7141A]'   },
};

export default function SuperGestionUsuarios() {
  const { user, token, logout } = useAuthStore();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [filtroActivo, setFiltroActivo] = useState('Todos');
  const [filtroRol, setFiltroRol] = useState('Todos');
  const [modalEliminar, setModalEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  const initials = user?.fullName
    ?.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase() || '?';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Cargar TODOS los usuarios
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        setCargando(true);
        setError(null);
        const { data } = await axios.get(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsuarios(data);
      } catch (err) {
        if (err.response?.status === 401) {
          logout();
          navigate('/login');
        } else {
          setError('No se pudo cargar la lista de usuarios.');
        }
      } finally {
        setCargando(false);
      }
    };
    fetchUsuarios();
  }, [token]);

  const handleEliminar = async () => {
    if (!modalEliminar) return;
    try {
      setEliminando(true);
      await axios.delete(`${API_URL}/${modalEliminar.userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsuarios((prev) => prev.filter((u) => u.userId !== modalEliminar.userId));
      setModalEliminar(null);
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
        navigate('/login');
      } else {
        setError('No se pudo eliminar el usuario.');
      }
    } finally {
      setEliminando(false);
    }
  };

  const usuariosFiltrados = usuarios.filter((u) => {
    const matchBusqueda = busqueda === '' ||
      u.fullName?.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.email?.toLowerCase().includes(busqueda.toLowerCase());
    const matchActivo =
      filtroActivo === 'Todos' ||
      (filtroActivo === 'Activos' && u.active) ||
      (filtroActivo === 'Inactivos' && !u.active);
    const matchRol = filtroRol === 'Todos' || u.roleName === filtroRol;
    return matchBusqueda && matchActivo && matchRol;
  });

  const formatFecha = (instant) => {
    if (!instant) return '—';
    return new Date(instant).toLocaleDateString('es-CL', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  };

  const conteoRol = (rol) => rol === 'Todos'
    ? usuarios.length
    : usuarios.filter((u) => u.roleName === rol).length;

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
          <Link to="/super/usuarios" className="sidebar-link sidebar-active rounded-lg px-3 py-2.5 flex items-center gap-2.5 text-sm text-white">
            <span className="material-symbols-outlined text-lg fill-icon">group</span>
            <span className="font-headline font-medium">Usuarios</span>
          </Link>
          <div className="border-t border-white/5 my-2 mx-2"></div>
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider px-3 mb-1">Super Admin</p>
          <Link to="/super/municipalidades" className="sidebar-link rounded-lg px-3 py-2.5 flex items-center gap-2.5 text-sm text-slate-300 hover:text-white">
            <span className="material-symbols-outlined text-lg">location_city</span>
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
            <Link to="/super/usuarios" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-white font-headline font-medium py-2.5 px-3 rounded-lg bg-white/10 text-sm">
              <span className="material-symbols-outlined">group</span>Usuarios
            </Link>
            <Link to="/super/municipalidades" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-slate-300 font-headline font-medium py-2.5 px-3 rounded-lg hover:bg-white/5 text-sm">
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
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#1b1c1c] font-headline mb-1">Gestión Global de Usuarios</h2>
            <p className="text-[#424752] text-sm">Todos los usuarios del sistema.</p>
          </div>
          <Link
            to="/super/usuarios/crear"
            className="flex items-center gap-2 bg-[#D7141A] text-white font-headline font-bold py-2.5 px-5 rounded-full text-sm hover:bg-red-700 transition-colors shadow-md self-start"
          >
            <span className="material-symbols-outlined text-sm">person_add</span>Nuevo Usuario
          </Link>
        </div>

        {/* Resumen por rol */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total',        rol: 'Todos',            color: 'border-[#003a7a]',  text: 'text-[#003a7a]'  },
            { label: 'Ciudadanos',   rol: 'CITIZEN',          color: 'border-[#0050A5]',  text: 'text-[#0050A5]'  },
            { label: 'Funcionarios', rol: 'MUNICIPAL_OFFICER',color: 'border-amber-400',  text: 'text-amber-600'  },
            { label: 'Admins',       rol: 'ADMIN_MUNICIPAL',  color: 'border-purple-400', text: 'text-purple-600' },
          ].map((item) => (
            <div key={item.label} className={`bg-white rounded-xl p-4 shadow-sm border-l-4 ${item.color}`}>
              <p className="text-[10px] font-bold text-[#737783] uppercase tracking-wider">{item.label}</p>
              <p className={`text-2xl font-extrabold font-headline mt-1 ${item.text}`}>{conteoRol(item.rol)}</p>
            </div>
          ))}
        </div>

        {/* Búsqueda y filtros */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-[#f5f3f3] mb-6 flex flex-col md:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2 border border-[#e4e2e2] rounded-lg px-3 py-2">
            <span className="material-symbols-outlined text-[#737783] text-sm">search</span>
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="flex-1 text-sm outline-none bg-transparent text-[#1b1c1c] placeholder:text-[#737783]"
            />
          </div>
          <select
            value={filtroRol}
            onChange={(e) => setFiltroRol(e.target.value)}
            className="text-sm border border-[#e4e2e2] rounded-lg px-3 py-2 text-[#1b1c1c] outline-none focus:border-[#003a7a]"
          >
            <option value="Todos">Todos los roles</option>
            <option value="CITIZEN">Ciudadanos</option>
            <option value="MUNICIPAL_OFFICER">Funcionarios</option>
            <option value="ADMIN_MUNICIPAL">Admins Municipales</option>
            <option value="SUPER_ADMIN">Super Admins</option>
          </select>
          <div className="flex gap-2">
            {['Todos', 'Activos', 'Inactivos'].map((f) => (
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

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6 flex items-center gap-3">
            <span className="material-symbols-outlined text-[#ba1a1a]">error</span>
            <p className="text-sm text-[#ba1a1a] font-medium">{error}</p>
          </div>
        )}

        {/* Tabla */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 md:p-5 border-b border-[#f5f3f3]">
            <h3 className="font-headline font-bold text-sm">
              {cargando ? 'Cargando...' : `${usuariosFiltrados.length} usuario${usuariosFiltrados.length !== 1 ? 's' : ''}`}
            </h3>
          </div>

          {cargando && (
            <div className="flex items-center justify-center py-16 gap-3 text-[#424752]">
              <span className="material-symbols-outlined animate-spin">progress_activity</span>
              <span className="text-sm">Cargando usuarios...</span>
            </div>
          )}

          {/* Desktop */}
          {!cargando && (
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#f5f3f3]">
                  <tr>
                    <th className="text-left px-5 py-3 text-[10px] font-bold text-[#737783] uppercase tracking-wider">Nombre</th>
                    <th className="text-left px-5 py-3 text-[10px] font-bold text-[#737783] uppercase tracking-wider">Email</th>
                    <th className="text-left px-5 py-3 text-[10px] font-bold text-[#737783] uppercase tracking-wider">Rol</th>
                    <th className="text-left px-5 py-3 text-[10px] font-bold text-[#737783] uppercase tracking-wider">Estado</th>
                    <th className="text-left px-5 py-3 text-[10px] font-bold text-[#737783] uppercase tracking-wider">Creado</th>
                    <th className="px-5 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f5f3f3]">
                  {usuariosFiltrados.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center text-[#424752] text-sm py-12">No hay usuarios que coincidan.</td>
                    </tr>
                  )}
                  {usuariosFiltrados.map((u) => {
                    const rol = roleConfig[u.roleName];
                    return (
                      <tr key={u.userId} className="hover:bg-[#f5f3f3]/50 transition-colors">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                              u.roleName === 'SUPER_ADMIN' ? 'bg-[#D7141A]/10 text-[#D7141A]' : 'bg-[#c5dcfd] text-[#003a7a]'
                            }`}>
                              {u.fullName?.split(' ').map((n) => n[0]).slice(0, 2).join('') || '?'}
                            </div>
                            <span className="font-semibold text-[#1b1c1c]">{u.fullName}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-xs text-[#424752]">{u.email}</td>
                        <td className="px-5 py-3">
                          <span className={`text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full ${rol?.clase}`}>
                            {rol?.label}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          <span className={`text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                            u.active ? 'bg-green-100 text-green-700' : 'bg-[#eae8e7] text-[#737783]'
                          }`}>
                            {u.active ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-xs text-[#737783]">{formatFecha(u.createdAt)}</td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <Link
                              to={`/super/usuarios/${u.userId}/editar`}
                              className="text-[#003a7a] hover:bg-[#f5f3f3] p-1.5 rounded-lg transition-colors"
                              title="Editar"
                            >
                              <span className="material-symbols-outlined text-sm">edit</span>
                            </Link>
                            <button
                              onClick={() => setModalEliminar(u)}
                              className="text-[#ba1a1a] hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                              title="Eliminar"
                              disabled={u.roleName === 'SUPER_ADMIN' && u.userId === user?.userId}
                            >
                              <span className="material-symbols-outlined text-sm">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Mobile */}
          {!cargando && (
            <div className="md:hidden divide-y divide-[#f5f3f3]">
              {usuariosFiltrados.length === 0 && (
                <p className="text-center text-[#424752] text-sm py-12">No hay usuarios que coincidan.</p>
              )}
              {usuariosFiltrados.map((u) => {
                const rol = roleConfig[u.roleName];
                return (
                  <div key={u.userId} className="px-4 py-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          u.roleName === 'SUPER_ADMIN' ? 'bg-[#D7141A]/10 text-[#D7141A]' : 'bg-[#c5dcfd] text-[#003a7a]'
                        }`}>
                          {u.fullName?.split(' ').map((n) => n[0]).slice(0, 2).join('') || '?'}
                        </div>
                        <div>
                          <p className="font-semibold text-[#1b1c1c] text-sm">{u.fullName}</p>
                          <p className="text-[10px] text-[#737783]">{u.email}</p>
                        </div>
                      </div>
                      <span className={`text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full ${rol?.clase}`}>
                        {rol?.label}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Link
                        to={`/super/usuarios/${u.userId}/editar`}
                        className="flex items-center gap-1 text-[#003a7a] border border-[#003a7a] font-bold py-1.5 px-3 rounded-full text-xs hover:bg-[#f5f3f3] transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">edit</span>Editar
                      </Link>
                      {!(u.roleName === 'SUPER_ADMIN' && u.userId === user?.userId) && (
                        <button
                          onClick={() => setModalEliminar(u)}
                          className="flex items-center gap-1 text-[#ba1a1a] border border-[#ba1a1a] font-bold py-1.5 px-3 rounded-full text-xs hover:bg-red-50 transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>Eliminar
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Modal eliminar */}
      {modalEliminar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => !eliminando && setModalEliminar(null)}></div>
          <div className="relative bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full">
            <h3 className="font-headline font-extrabold text-[#1b1c1c] text-lg mb-2">¿Eliminar usuario?</h3>
            <p className="text-sm text-[#424752] mb-2">
              Estás a punto de eliminar a <span className="font-bold">{modalEliminar.fullName}</span>.
            </p>
            {(modalEliminar.roleName === 'ADMIN_MUNICIPAL' || modalEliminar.roleName === 'SUPER_ADMIN') && (
              <p className="text-xs text-[#ba1a1a] font-medium mb-4">
                ⚠️ Este usuario tiene un rol privilegiado. Esta acción no se puede deshacer.
              </p>
            )}
            <p className="text-sm text-[#424752] mb-6">Esta acción no se puede deshacer.</p>
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