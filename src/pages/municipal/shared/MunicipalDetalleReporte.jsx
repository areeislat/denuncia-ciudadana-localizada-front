import { Link, useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import apiClient from '../../../config/api';
import useAuthStore from '../../../store/authStore';
import MunicipalSidebar from '../../../components/MunicipalSidebar';

const estadoConfig = {
  PENDING:     { label: 'Pendiente',  clase: 'badge-pendiente' },
  IN_PROGRESS: { label: 'En Proceso', clase: 'badge-proceso' },
  RESOLVED:    { label: 'Resuelto',   clase: 'badge-resuelto' },
  REJECTED:    { label: 'Rechazado',  clase: 'badge-rechazado' },
};

const prioridadConfig = {
  HIGH:     { label: 'Alta',    clase: 'bg-[#D7141A] text-white'        },
  MEDIUM:   { label: 'Media',   clase: 'bg-amber-100 text-amber-800'    },
  LOW:      { label: 'Baja',    clase: 'bg-green-100 text-green-800'    },
  CRITICAL: { label: 'Crítica', clase: 'bg-purple-100 text-purple-800'  },
};

const ESTADOS = ['PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'];

export default function MunicipalDetalleReporte() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [reporte, setReporte] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [nuevoEstado, setNuevoEstado] = useState('');
  const [comentario, setComentario] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [errorGuardar, setErrorGuardar] = useState(null);
  const [exito, setExito] = useState(false);
  const [nuevaPrioridad, setNuevaPrioridad] = useState('');
  const [guardandoPrioridad, setGuardandoPrioridad] = useState(false);
  const [errorPrioridad, setErrorPrioridad] = useState(null);
  const [exitoPrioridad, setExitoPrioridad] = useState(false);

  useEffect(() => {
    const fetchReporte = async () => {
      try {
        setCargando(true);
        setError(null);
        const data = await apiClient.get(`/api/reports/${id}`);
        setReporte(data);
        setNuevoEstado(data.status);
        setNuevaPrioridad(data.priority);
      } catch (err) {
        if (err.response?.status === 401) { logout(); navigate('/login'); }
        else setError('No se pudo cargar el reporte.');
      } finally {
        setCargando(false);
      }
    };
    fetchReporte();
  }, [id]);

  const handleGuardarPrioridad = async () => {
    if (!nuevaPrioridad || nuevaPrioridad === reporte?.priority) return;
    try {
      setGuardandoPrioridad(true);
      setErrorPrioridad(null);
      setExitoPrioridad(false);
      const data = await apiClient.patch(`/api/reports/${id}/priority`, { priority: nuevaPrioridad });
      setReporte(data);
      setExitoPrioridad(true);
    } catch {
      setErrorPrioridad('No se pudo actualizar la prioridad. Intenta nuevamente.');
    } finally {
      setGuardandoPrioridad(false);
    }
  };

  const handleGuardarEstado = async () => {
    if (!nuevoEstado || nuevoEstado === reporte?.status) return;
    try {
      setGuardando(true);
      setErrorGuardar(null);
      setExito(false);
      const data = await apiClient.patch(`/api/reports/${id}/status`, {
        status: nuevoEstado,
        ...(comentario.trim() ? { comment: comentario.trim() } : {}),
      });
      setReporte(data);
      setComentario('');
      setExito(true);
    } catch {
      setErrorGuardar('No se pudo actualizar el estado. Intenta nuevamente.');
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center gap-3 text-[#424752]">
        <span className="material-symbols-outlined animate-spin">progress_activity</span>
        <span className="text-sm">Cargando reporte...</span>
      </div>
    );
  }

  if (error || !reporte) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-[#424752] font-headline font-bold text-lg">{error || 'Reporte no encontrado.'}</p>
        <Link to="/municipal/gestion" className="text-[#003a7a] font-bold text-sm flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">arrow_back</span> Volver a gestión
        </Link>
      </div>
    );
  }

  const estado = estadoConfig[reporte.status] || estadoConfig['PENDING'];
  const prioridad = prioridadConfig[reporte.priority] || prioridadConfig['MEDIUM'];

  return (
    <div>
      <MunicipalSidebar />

      {/* MAIN */}
      <main className="md:ml-60 p-4 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="hidden md:flex text-[#003a7a] hover:bg-[#f5f3f3] p-2 rounded-lg transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h2 className="text-2xl font-extrabold text-[#1b1c1c] font-headline">Detalle del Reporte</h2>
            <p className="text-[#737783] text-xs font-mono">#{reporte.reportId?.slice(0, 8).toUpperCase()}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Columna principal */}
          <div className="md:col-span-2 space-y-6">

            {/* Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#f5f3f3]">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className={`${estado.clase} text-[9px] font-bold uppercase px-3 py-1 rounded-full`}>{estado.label}</span>
                <span className={`${prioridad.clase} text-[9px] font-bold uppercase px-3 py-1 rounded-full`}>Prioridad {prioridad.label}</span>
              </div>
              <h3 className="text-xl font-headline font-extrabold text-[#003a7a] mb-3">{reporte.description}</h3>
              <div className="space-y-2 text-sm text-[#424752]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">location_on</span>
                  <span>{reporte.address || 'Sin dirección'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">category</span>
                  <span>{reporte.category || '—'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">calendar_today</span>
                  <span>{reporte.createdAt ? new Date(reporte.createdAt).toLocaleString('es-CL') : '—'}</span>
                </div>
              </div>
            </div>

            {/* Actualizar prioridad */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#f5f3f3]">
              <h3 className="font-headline font-extrabold text-lg text-[#003a7a] mb-4">Asignar Prioridad</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#424752] uppercase tracking-wider mb-1.5">Prioridad</label>
                  <select
                    value={nuevaPrioridad}
                    onChange={(e) => { setNuevaPrioridad(e.target.value); setExitoPrioridad(false); }}
                    className="w-full bg-[#f5f3f3] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#003a7a] text-sm"
                  >
                    <option value="LOW">Baja</option>
                    <option value="MEDIUM">Media</option>
                    <option value="HIGH">Alta</option>
                    <option value="CRITICAL">Crítica</option>
                  </select>
                </div>

                {errorPrioridad && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl px-4 py-3">{errorPrioridad}</div>
                )}
                {exitoPrioridad && (
                  <div className="bg-green-50 border border-green-200 text-green-700 text-xs rounded-xl px-4 py-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    Prioridad actualizada correctamente.
                  </div>
                )}

                <button
                  onClick={handleGuardarPrioridad}
                  disabled={guardandoPrioridad || nuevaPrioridad === reporte.priority}
                  className="w-full bg-[#0050A5] text-white font-headline font-bold py-3 rounded-xl shadow-sm hover:bg-[#003A7A] transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {guardandoPrioridad ? (
                    <><span className="material-symbols-outlined text-sm animate-spin">progress_activity</span> Guardando...</>
                  ) : (
                    <><span className="material-symbols-outlined text-sm">flag</span> Guardar prioridad</>
                  )}
                </button>
                {nuevaPrioridad === reporte.priority && (
                  <p className="text-[10px] text-[#737783] text-center">Selecciona una prioridad diferente a la actual para habilitar el botón.</p>
                )}
              </div>
            </div>

            {/* Actualizar estado */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#f5f3f3]">
              <h3 className="font-headline font-extrabold text-lg text-[#003a7a] mb-4">Actualizar Estado</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#424752] uppercase tracking-wider mb-1.5">Nuevo estado</label>
                  <select
                    value={nuevoEstado}
                    onChange={(e) => { setNuevoEstado(e.target.value); setExito(false); }}
                    className="w-full bg-[#f5f3f3] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#003a7a] text-sm"
                  >
                    {ESTADOS.map((s) => (
                      <option key={s} value={s}>{estadoConfig[s]?.label || s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#424752] uppercase tracking-wider mb-1.5">Comentario (opcional)</label>
                  <textarea
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    rows="3"
                    placeholder="Agrega una nota sobre este cambio de estado..."
                    className="w-full bg-[#f5f3f3] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#003a7a] text-sm resize-none"
                  />
                </div>

                {errorGuardar && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl px-4 py-3">{errorGuardar}</div>
                )}
                {exito && (
                  <div className="bg-green-50 border border-green-200 text-green-700 text-xs rounded-xl px-4 py-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    Estado actualizado correctamente.
                  </div>
                )}

                <button
                  onClick={handleGuardarEstado}
                  disabled={guardando || nuevoEstado === reporte.status}
                  className="w-full bg-[#0050A5] text-white font-headline font-bold py-3 rounded-xl shadow-sm hover:bg-[#003A7A] transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {guardando ? (
                    <><span className="material-symbols-outlined text-sm animate-spin">progress_activity</span> Guardando...</>
                  ) : (
                    <><span className="material-symbols-outlined text-sm">save</span> Guardar cambio</>
                  )}
                </button>
                {nuevoEstado === reporte.status && (
                  <p className="text-[10px] text-[#737783] text-center">Selecciona un estado diferente al actual para habilitar el botón.</p>
                )}
              </div>
            </div>
          </div>

          {/* Historial */}
          <div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#f5f3f3]">
              <h3 className="font-headline font-extrabold text-lg text-[#003a7a] mb-6">Historial</h3>
              <div className="relative space-y-0">
                <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-[#e4e2e2]"></div>
                {(reporte.history || []).map((paso, i) => (
                  <div key={i} className="relative flex gap-4 pb-6">
                    <div className="z-10 w-8 h-8 rounded-full flex items-center justify-center ring-4 ring-white shrink-0 bg-[#003a7a] text-white">
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                    </div>
                    <div>
                      <p className="font-bold text-sm text-[#1b1c1c]">{estadoConfig[paso.newStatus]?.label || paso.newStatus}</p>
                      <p className="text-[10px] text-[#424752]">
                        {paso.timestamp ? new Date(paso.timestamp).toLocaleString('es-CL') : '—'} · {paso.changedBy}
                      </p>
                      {paso.comment && <p className="text-xs text-[#424752] italic mt-0.5">"{paso.comment}"</p>}
                    </div>
                  </div>
                ))}
                {(!reporte.history || reporte.history.length === 0) && (
                  <p className="text-sm text-[#424752] py-4 pl-12">Sin historial.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Link
            to="/municipal/gestion"
            className="inline-flex items-center gap-2 border border-[#003a7a] text-[#003a7a] font-headline font-bold py-2.5 px-6 rounded-full hover:bg-[#f5f3f3] transition-colors text-sm"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span> Volver a Gestión
          </Link>
        </div>
      </main>
    </div>
  );
}
