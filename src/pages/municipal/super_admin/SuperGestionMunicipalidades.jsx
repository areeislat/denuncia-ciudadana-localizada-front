import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../../store/authStore';
import MunicipalSidebar from '../../../components/MunicipalSidebar';
import apiClient from '../../../config/api';

export default function SuperGestionMunicipalidades() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [comunas, setComunas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [filtroActivo, setFiltroActivo] = useState('Todas');
  const [modalEliminar, setModalEliminar] = useState(null);
  const [modalCrear, setModalCrear] = useState(false);
  const [modalEditar, setModalEditar] = useState(null);
  const [eliminando, setEliminando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [errorModal, setErrorModal] = useState(null);
  const [form, setForm] = useState({ nombre: '', region: '', codigoIne: '' });

  // ── Cargar comunas ──────────────────────────────────────────────
  const fetchComunas = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.get('/api/comunas');
      setComunas(data);
    } catch (err) {
      setError('No se pudieron cargar las municipalidades.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComunas();
  }, []);

  // ── Filtrado ────────────────────────────────────────────────────
  const comunasFiltradas = comunas.filter((c) => {
    const matchBusqueda =
      busqueda === '' ||
      c.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const matchActivo =
      filtroActivo === 'Todas' ||
      (filtroActivo === 'Activas' && c.isActive) ||
      (filtroActivo === 'Inactivas' && !c.isActive);
    return matchBusqueda && matchActivo;
  });

  // ── Crear ───────────────────────────────────────────────────────
  const handleCrear = async () => {
    if (!form.nombre) return;
    setGuardando(true);
    setErrorModal(null);
    try {
      await apiClient.post('/api/comunas', {
        nombre: form.nombre,
        region: form.region,
        codigoIne: form.codigoIne,
      });
      setForm({ nombre: '', region: '', codigoIne: '' });
      setModalCrear(false);
      await fetchComunas();
    } catch (err) {
      setErrorModal(err.response?.data?.message || 'Error al crear la municipalidad.');
    } finally {
      setGuardando(false);
    }
  };

  // ── Editar ──────────────────────────────────────────────────────
  const handleEditar = async () => {
    if (!modalEditar || !form.nombre) return;
    setGuardando(true);
    setErrorModal(null);
    try {
      await apiClient.put(`/api/comunas/${modalEditar.comunaId}`, {
        nombre: form.nombre,
        region: form.region,
        codigoIne: form.codigoIne,
      });
      setModalEditar(null);
      setForm({ nombre: '', region: '', codigoIne: '' });
      await fetchComunas();
    } catch (err) {
      setErrorModal(err.response?.data?.message || 'Error al editar la municipalidad.');
    } finally {
      setGuardando(false);
    }
  };

  const abrirEditar = (comuna) => {
    setForm({ nombre: comuna.nombre, region: comuna.region || '', codigoIne: comuna.codigoIne || '' });
    setErrorModal(null);
    setModalEditar(comuna);
  };

  // ── Toggle activo/inactivo ──────────────────────────────────────
  const handleToggle = async (comuna) => {
    try {
      await apiClient.patch(`/api/comunas/${comuna.comunaId}/toggle`);
      await fetchComunas();
    } catch (err) {
      alert('No se pudo cambiar el estado de la municipalidad.');
    }
  };

  // ── Eliminar ────────────────────────────────────────────────────
  const handleEliminar = async () => {
    if (!modalEliminar) return;
    setEliminando(true);
    setErrorModal(null);
    try {
      await apiClient.delete(`/api/comunas/${modalEliminar.comunaId}`);
      setModalEliminar(null);
      await fetchComunas();
    } catch (err) {
      setErrorModal(err.response?.data?.message || 'No se puede eliminar esta municipalidad.');
    } finally {
      setEliminando(false);
    }
  };

  const formatFecha = (fecha) => {
    if (!fecha) return '—';
    return new Date(fecha).toLocaleDateString('es-CL', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  };

  // ── Render ──────────────────────────────────────────────────────
  return (
    <div>
      <MunicipalSidebar />
      <main className="md:ml-60 p-4 md:p-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#1b1c1c] font-headline mb-1">Municipalidades</h2>
            <p className="text-[#424752] text-sm">Gestión global de municipios en el sistema.</p>
          </div>
          <button
            onClick={() => { setForm({ nombre: '', region: '', codigoIne: '' }); setErrorModal(null); setModalCrear(true); }}
            className="flex items-center gap-2 bg-[#D7141A] text-white font-headline font-bold py-2.5 px-5 rounded-full text-sm hover:bg-red-700 transition-colors shadow-md self-start"
          >
            <span className="material-symbols-outlined text-sm">add_business</span>Nueva Municipalidad
          </button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Total',     valor: comunas.length,                          color: 'border-[#003a7a]', text: 'text-[#003a7a]' },
            { label: 'Activas',   valor: comunas.filter((c) => c.isActive).length,  color: 'border-[#059669]', text: 'text-[#059669]' },
            { label: 'Inactivas', valor: comunas.filter((c) => !c.isActive).length, color: 'border-[#737783]', text: 'text-[#737783]' },
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
                  filtroActivo === f ? 'bg-[#003a7a] text-white' : 'bg-[#eae8e7] text-[#424752] hover:bg-[#dbd9d9]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Estados de carga / error */}
        {loading && (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-[#003a7a] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        {error && !loading && (
          <div className="text-center py-12 text-[#ba1a1a] text-sm">{error}</div>
        )}

        {/* Grid de cards */}
        {!loading && !error && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {comunasFiltradas.length === 0 && (
              <p className="col-span-3 text-center text-[#424752] text-sm py-12">
                No hay municipalidades que coincidan.
              </p>
            )}
            {comunasFiltradas.map((c) => (
              <div key={c.comunaId} className="bg-white rounded-2xl p-5 shadow-sm border border-[#f5f3f3] hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#001A33] flex items-center justify-center text-white shrink-0">
                      <span className="material-symbols-outlined text-lg">location_city</span>
                    </div>
                    <div>
                      <p className="font-headline font-extrabold text-[#1b1c1c] text-sm leading-tight">{c.nombre}</p>
                      <p className="text-[10px] text-[#737783]">{c.region || '—'}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggle(c)}
                    title={c.isActive ? 'Desactivar' : 'Activar'}
                    className={`text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full cursor-pointer transition-colors ${
                      c.isActive ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-[#eae8e7] text-[#737783] hover:bg-[#dbd9d9]'
                    }`}
                  >
                    {c.isActive ? 'Activa' : 'Inactiva'}
                  </button>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs text-[#424752]">
                    <span className="material-symbols-outlined text-sm text-[#003a7a]">tag</span>
                    <span>INE: {c.codigoIne || '—'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#424752]">
                    <span className="material-symbols-outlined text-sm text-[#003a7a]">calendar_today</span>
                    <span>Creada {formatFecha(c.createdAt)}</span>
                  </div>
                </div>

                <div className="flex gap-3 py-3 border-t border-b border-[#f5f3f3] mb-4">
                  <div className="flex-1 text-center">
                    <p className="text-lg font-extrabold font-headline text-[#003a7a]">{c.agentCount ?? 0}</p>
                    <p className="text-[10px] text-[#737783]">Agentes</p>
                  </div>
                  <div className="w-px bg-[#f5f3f3]"></div>
                  <div className="flex-1 text-center">
                    <p className="text-lg font-extrabold font-headline text-[#003a7a]">—</p>
                    <p className="text-[10px] text-[#737783]">Reportes</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => abrirEditar(c)}
                    className="flex-1 flex items-center justify-center gap-1 text-[#003a7a] border border-[#003a7a] font-bold py-2 rounded-full text-xs hover:bg-[#f5f3f3] transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">edit</span>Editar
                  </button>
                  <button
                    onClick={() => { setErrorModal(null); setModalEliminar(c); }}
                    className="flex-1 flex items-center justify-center gap-1 text-[#ba1a1a] border border-[#ba1a1a] font-bold py-2 rounded-full text-xs hover:bg-red-50 transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ── Modal Crear ── */}
      {modalCrear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => !guardando && setModalCrear(false)}></div>
          <div className="relative bg-white rounded-2xl p-6 shadow-2xl max-w-md w-full">
            <h3 className="font-headline font-extrabold text-[#1b1c1c] text-lg mb-6">Nueva Municipalidad</h3>
            <div className="space-y-4">
              {[
                { key: 'nombre',    label: 'Nombre *',     placeholder: 'Ej: Providencia' },
                { key: 'region',    label: 'Región',       placeholder: 'Ej: Metropolitana de Santiago' },
                { key: 'codigoIne', label: 'Código INE',   placeholder: 'Ej: 13120' },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-xs font-bold text-[#737783] uppercase tracking-wider mb-1">{field.label}</label>
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    value={form[field.key]}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    className="w-full text-sm border border-[#e4e2e2] rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#003a7a] transition-colors"
                  />
                </div>
              ))}
            </div>
            {errorModal && <p className="text-xs text-[#ba1a1a] mt-3">{errorModal}</p>}
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
                disabled={guardando || !form.nombre}
                className="flex-1 bg-[#D7141A] text-white font-headline font-bold py-2.5 rounded-full hover:bg-red-700 transition-colors text-sm disabled:opacity-60"
              >
                {guardando ? 'Creando...' : 'Crear'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Editar ── */}
      {modalEditar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => !guardando && setModalEditar(null)}></div>
          <div className="relative bg-white rounded-2xl p-6 shadow-2xl max-w-md w-full">
            <h3 className="font-headline font-extrabold text-[#1b1c1c] text-lg mb-6">Editar Municipalidad</h3>
            <div className="space-y-4">
              {[
                { key: 'nombre',    label: 'Nombre *',     placeholder: 'Ej: Providencia' },
                { key: 'region',    label: 'Región',       placeholder: 'Ej: Metropolitana de Santiago' },
                { key: 'codigoIne', label: 'Código INE',   placeholder: 'Ej: 13120' },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-xs font-bold text-[#737783] uppercase tracking-wider mb-1">{field.label}</label>
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    value={form[field.key]}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    className="w-full text-sm border border-[#e4e2e2] rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#003a7a] transition-colors"
                  />
                </div>
              ))}
            </div>
            {errorModal && <p className="text-xs text-[#ba1a1a] mt-3">{errorModal}</p>}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setModalEditar(null)}
                disabled={guardando}
                className="flex-1 border border-[#e4e2e2] text-[#424752] font-headline font-bold py-2.5 rounded-full hover:bg-[#f5f3f3] transition-colors text-sm disabled:opacity-60"
              >
                Cancelar
              </button>
              <button
                onClick={handleEditar}
                disabled={guardando || !form.nombre}
                className="flex-1 bg-[#003a7a] text-white font-headline font-bold py-2.5 rounded-full hover:bg-blue-900 transition-colors text-sm disabled:opacity-60"
              >
                {guardando ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Eliminar ── */}
      {modalEliminar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => !eliminando && setModalEliminar(null)}></div>
          <div className="relative bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full">
            <h3 className="font-headline font-extrabold text-[#1b1c1c] text-lg mb-2">¿Eliminar municipalidad?</h3>
            <p className="text-sm text-[#424752] mb-2">
              Estás a punto de eliminar <span className="font-bold">{modalEliminar.nombre}</span>.
            </p>
            {modalEliminar.agentCount > 0 && (
              <p className="text-xs text-[#ba1a1a] font-medium mb-2">
                ⚠️ Esta municipalidad tiene {modalEliminar.agentCount} agente(s) asignado(s) y no puede eliminarse.
              </p>
            )}
            {errorModal && <p className="text-xs text-[#ba1a1a] font-medium mb-2">{errorModal}</p>}
            <p className="text-xs text-[#737783] mb-6">Esta acción no se puede deshacer.</p>
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
                disabled={eliminando || modalEliminar.agentCount > 0}
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