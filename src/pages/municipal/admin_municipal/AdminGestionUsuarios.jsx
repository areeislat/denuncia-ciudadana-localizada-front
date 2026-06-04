import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import useAuthStore from '../../../store/authStore';
import MunicipalSidebar from '../../../components/MunicipalSidebar';

const API_URL = 'http://localhost:8080/api/users';

const roleConfig = {
  CITIZEN:           { label: 'Ciudadano',            clase: 'bg-[#c5dcfd] text-[#003a7a]'  },
  MUNICIPAL_OFFICER: { label: 'Funcionario Municipal', clase: 'bg-amber-100 text-amber-700'  },
};

export default function AdminGestionUsuarios() {
  const { token, user, logout} = useAuthStore();
  const navigate = useNavigate();

  const [usuarios, setUsuarios]         = useState([]);
  const [cargando, setCargando]         = useState(true);
  const [error, setError]               = useState(null);
  const [busqueda, setBusqueda]         = useState('');
  const [filtroActivo, setFiltroActivo] = useState('Todos');
  const [filtroRol, setFiltroRol]       = useState('Todos');
  const [modalToggle, setModalToggle]   = useState(null);
  const [toggling, setToggling]         = useState(false);
  const [modalEditar, setModalEditar]   = useState(null);
  const [rolEditado, setRolEditado]     = useState('');
  const [guardando, setGuardando]       = useState(false);
  const [errorEditar, setErrorEditar]   = useState(null);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        setCargando(true);
        setError(null);
        const comunaId = user?.comunaId;
        const url = comunaId ? `${API_URL}?comunaId=${comunaId}` : API_URL;
        const { data } = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const filtered = data.filter((u) =>
          u.roleName === 'CITIZEN' || u.roleName === 'MUNICIPAL_OFFICER'
        );
        setUsuarios(filtered);
      } catch (err) {
        if (err.response?.status === 401) { logout(); navigate('/login'); }
        else setError('No se pudo cargar la lista de usuarios.');
      } finally {
        setCargando(false);
      }
    };
    fetchUsuarios();
  }, [token]);

  const handleGuardarRol = async () => {
    try {
      setGuardando(true);
      setErrorEditar(null);
      const { data } = await axios.put(`${API_URL}/${modalEditar.userId}`,
        { roleName: rolEditado },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsuarios((prev) => prev.map((u) => u.userId === data.userId ? data : u));
      setModalEditar(null);
    } catch (err) {
      if (err.response?.status === 401) { logout(); navigate('/login'); }
      else setErrorEditar('No se pudo actualizar el rol.');
    } finally {
      setGuardando(false);
    }
  };

  const handleToggleActivo = async () => {
    if (!modalToggle) return;
    try {
      setToggling(true);
      const { data } = await axios.put(`${API_URL}/${modalToggle.userId}`,
        { active: !modalToggle.active },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsuarios((prev) => prev.map((u) => u.userId === data.userId ? data : u));
      setModalToggle(null);
    } catch (err) {
      if (err.response?.status === 401) { logout(); navigate('/login'); }
      else setError('No se pudo actualizar el usuario.');
    } finally {
      setToggling(false);
    }
  };

  const usuariosFiltrados = usuarios.filter((u) => {
    const matchBusqueda  = busqueda === '' ||
      u.fullName?.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.email?.toLowerCase().includes(busqueda.toLowerCase());
    const matchActivo    = filtroActivo === 'Todos' ||
      (filtroActivo === 'Activos' && u.active) ||
      (filtroActivo === 'Inactivos' && !u.active);
    const matchRol       = filtroRol === 'Todos' || u.roleName === filtroRol;
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
      <MunicipalSidebar />

      <main className="md:ml-60 p-4 md:p-8">
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#1b1c1c] font-headline mb-1">Gestión de Usuarios</h2>
          <p className="text-[#424752] text-sm">Funcionarios y ciudadanos de tu municipio.</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Total',        value: conteoRol('Todos'),              color: 'border-[#003a7a]', text: 'text-[#003a7a]' },
            { label: 'Ciudadanos',   value: conteoRol('CITIZEN'),            color: 'border-[#0050A5]', text: 'text-[#0050A5]' },
            { label: 'Funcionarios', value: conteoRol('MUNICIPAL_OFFICER'),  color: 'border-amber-400', text: 'text-amber-600' },
          ].map((item) => (
            <div key={item.label} className={`bg-white rounded-xl p-4 shadow-sm border-l-4 ${item.color}`}>
              <p className="text-[10px] font-bold text-[#737783] uppercase tracking-wider">{item.label}</p>
              <p className={`text-2xl font-extrabold font-headline mt-1 ${item.text}`}>{item.value}</p>
            </div>
          ))}
        </div>

        {/* Filtros */}
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
          </select>
          <div className="flex gap-2">
            {['Todos', 'Activos', 'Inactivos'].map((f) => (
              <button
                key={f}
                onClick={() => setFiltroActivo(f)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  filtroActivo === f ? 'bg-[#003a7a] text-white' : 'bg-[#eae8e7] text-[#424752] hover:bg-[#dbd9d9]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

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
                    <tr><td colSpan="6" className="text-center text-[#424752] text-sm py-12">No hay usuarios que coincidan.</td></tr>
                  )}
                  {usuariosFiltrados.map((u) => {
                    const rol = roleConfig[u.roleName];
                    return (
                      <tr key={u.userId} className="hover:bg-[#f5f3f3]/50 transition-colors">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#c5dcfd] flex items-center justify-center text-[#003a7a] text-xs font-bold shrink-0">
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
                            <button
                              onClick={() => { setModalEditar(u); setRolEditado(u.roleName); setErrorEditar(null); }}
                              className="text-[#003a7a] hover:bg-[#f5f3f3] p-1.5 rounded-lg transition-colors"
                              title="Cambiar rol"
                            >
                              <span className="material-symbols-outlined text-sm">edit</span>
                            </button>
                            <button
                              onClick={() => setModalToggle(u)}
                              className={`${u.active ? 'text-[#ba1a1a] hover:bg-red-50' : 'text-green-700 hover:bg-green-50'} p-1.5 rounded-lg transition-colors`}
                              title={u.active ? 'Desactivar' : 'Activar'}
                            >
                              <span className="material-symbols-outlined text-sm">
                                {u.active ? 'block' : 'check_circle'}
                              </span>
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
                        <div className="w-9 h-9 rounded-full bg-[#c5dcfd] flex items-center justify-center text-[#003a7a] text-xs font-bold shrink-0">
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
                      <button
                        onClick={() => { setModalEditar(u); setRolEditado(u.roleName); setErrorEditar(null); }}
                        className="flex items-center gap-1 text-[#003a7a] border border-[#003a7a] font-bold py-1.5 px-3 rounded-full text-xs hover:bg-[#f5f3f3] transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">edit</span>Editar
                      </button>
                      <button
                        onClick={() => setModalToggle(u)}
                        className={`${u.active ? 'text-[#ba1a1a] hover:bg-red-50' : 'text-green-700 hover:bg-green-50'} p-1.5 rounded-lg transition-colors`}
                        title={u.active ? 'Desactivar' : 'Activar'}
                      >
                        <span className="material-symbols-outlined text-sm">
                          {u.active ? 'block' : 'check_circle'}
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Modal editar rol */}
      {modalEditar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => !guardando && setModalEditar(null)}></div>
          <div className="relative bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full">
            <h3 className="font-headline font-extrabold text-[#1b1c1c] text-lg mb-1">Cambiar Rol</h3>
            <p className="text-sm text-[#424752] mb-4">{modalEditar.fullName}</p>
            <div>
              <label className="block text-xs font-bold text-[#424752] mb-1">Rol</label>
              <select
                value={rolEditado}
                onChange={(e) => setRolEditado(e.target.value)}
                className="w-full border border-[#e4e2e2] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#003a7a]"
              >
                <option value="CITIZEN">Ciudadano</option>
                <option value="MUNICIPAL_OFFICER">Funcionario Municipal</option>
              </select>
            </div>
            {errorEditar && <p className="text-xs text-[#ba1a1a] mt-3">{errorEditar}</p>}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setModalEditar(null)}
                disabled={guardando}
                className="flex-1 border border-[#e4e2e2] text-[#424752] font-headline font-bold py-2.5 rounded-full hover:bg-[#f5f3f3] transition-colors text-sm disabled:opacity-60"
              >
                Cancelar
              </button>
              <button
                onClick={handleGuardarRol}
                disabled={guardando}
                className="flex-1 bg-[#003a7a] text-white font-headline font-bold py-2.5 rounded-full hover:bg-[#002a5a] transition-colors text-sm disabled:opacity-60"
              >
                {guardando ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {modalToggle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => !toggling && setModalToggle(null)}></div>
          <div className="relative bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full">
            <h3 className="font-headline font-extrabold text-[#1b1c1c] text-lg mb-2">
              {modalToggle.active ? '¿Desactivar usuario?' : '¿Activar usuario?'}
            </h3>
            <p className="text-sm text-[#424752] mb-6">
              {modalToggle.active
                ? <>El usuario <span className="font-bold">{modalToggle.fullName}</span> no podrá iniciar sesión.</>
                : <>El usuario <span className="font-bold">{modalToggle.fullName}</span> podrá iniciar sesión nuevamente.</>
              }
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setModalToggle(null)}
                disabled={toggling}
                className="flex-1 border border-[#e4e2e2] text-[#424752] font-headline font-bold py-2.5 rounded-full hover:bg-[#f5f3f3] transition-colors text-sm disabled:opacity-60"
              >
                Cancelar
              </button>
              <button
                onClick={handleToggleActivo}
                disabled={toggling}
                className={`flex-1 text-white font-headline font-bold py-2.5 rounded-full transition-colors text-sm disabled:opacity-60 ${
                  modalToggle.active ? 'bg-[#ba1a1a] hover:bg-red-700' : 'bg-green-700 hover:bg-green-800'
                }`}
              >
                {toggling ? (modalToggle.active ? 'Desactivando...' : 'Activando...') : (modalToggle.active ? 'Desactivar' : 'Activar')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}