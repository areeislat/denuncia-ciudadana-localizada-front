import { Link, useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import apiClient from '../../config/api';
import useAuthStore from '../../store/authStore';
import CiudadanoFooter from '../../components/CiudadanoFooter';
import CiudadanoHeader from '../../components/CiudadanoHeader';

const prioridadConfig = {
  HIGH:   { label: 'Alta',  clase: 'bg-[#D7141A] text-white' },
  MEDIUM: { label: 'Media', clase: 'bg-amber-100 text-amber-800' },
  LOW:    { label: 'Baja',  clase: 'bg-green-100 text-green-800' },
};

const estadoConfig = {
  PENDING:          { label: 'Pendiente',           clase: 'badge-pendiente' },
  IN_PROGRESS:      { label: 'En Proceso',           clase: 'badge-proceso'   },
  RESOLVED:         { label: 'Resuelto',             clase: 'badge-resuelto'  },
  REJECTED:         { label: 'Rechazado',            clase: 'badge-rechazado' },
  REOPENED:         { label: 'Reabierto',            clase: 'badge-proceso'   },
  REOPEN_REQUESTED: { label: 'Reapertura Solicitada', clase: 'bg-amber-100 text-amber-800 border border-amber-300' },
};

export default function CiudadanoDetalleReporte() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [reporte, setReporte] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [reabriendo, setReabriendo] = useState(false);
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [enviandoComentario, setEnviandoComentario] = useState(false);
  const [errorComentario, setErrorComentario] = useState(null);

  useEffect(() => {
    const fetchReporte = async () => {
      try {
        setCargando(true);
        setError(null);
        const data = await apiClient.get(`/api/reports/${id}`);
        setReporte(data);
        const comentariosData = await apiClient.get(`/api/reports/${id}/comments`);
        setComentarios(comentariosData || []);
      } catch (err) {
        if (err.response?.status === 401) {
          logout();
          navigate('/login');
        } else {
          setError('No se pudo cargar el reporte.');
        }
      } finally {
        setCargando(false);
      }
    };
    fetchReporte();
  }, [id]);

  const handleEnviarComentario = async () => {
    if (!nuevoComentario.trim()) return;
    setEnviandoComentario(true);
    setErrorComentario(null);
    try {
      const nuevo = await apiClient.post(`/api/reports/${id}/comments`, {
        content: nuevoComentario.trim(),
        userName: user?.fullName || 'Usuario',
      });
      setComentarios((prev) => [...prev, nuevo]);
      setNuevoComentario('');
    } catch {
      setErrorComentario('No se pudo enviar el comentario. Intenta nuevamente.');
    } finally {
      setEnviandoComentario(false);
    }
  };

  const handleReabrir = async () => {
    const razon = window.prompt('¿Cuál es la razón para reabrir este reporte?');
    if (!razon?.trim()) return;
    try {
      setReabriendo(true);
      const data = await apiClient.post(`/api/reports/${id}/reopen`, { reason: razon });
      setReporte(data);
    } catch {
      alert('No se pudo reabrir el reporte. Intenta nuevamente.');
    } finally {
      setReabriendo(false);
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
        <Link to="/ciudadano/reportes" className="text-[#003a7a] font-bold text-sm flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">arrow_back</span> Volver a mis reportes
        </Link>
      </div>
    );
  }

  const prioridad = prioridadConfig[reporte.priority] || prioridadConfig['MEDIUM'];
  const estado = estadoConfig[reporte.status] || estadoConfig['PENDING'];

  return (
    <div>
      <CiudadanoHeader activePage="reportes" />

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
            <span className="text-xs font-bold text-[#003a7a] font-headline">#{reporte.reportId?.slice(0, 8).toUpperCase()}</span>
          </div>
          <h1 className="text-2xl font-headline font-extrabold text-[#003a7a] mb-2">{reporte.description}</h1>
          <div className="flex items-center gap-2 text-[#424752] mb-3">
            <span className="material-symbols-outlined text-sm">location_on</span>
            <span className="text-sm">{reporte.address || 'Sin dirección'}</span>
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-[#424752]">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">category</span>{reporte.category}
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">calendar_today</span>
              {reporte.createdAt ? new Date(reporte.createdAt).toLocaleDateString('es-CL', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Historial de estados */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#f5f3f3]">
            <h2 className="font-headline font-extrabold text-lg text-[#003a7a] mb-6">Estado del Trámite</h2>
            <div className="relative space-y-0">
              <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-[#e4e2e2]"></div>
              {(reporte.history || []).map((paso, i) => (
                <div key={i} className="relative flex gap-4 pb-7">
                  <div className="z-10 w-8 h-8 rounded-full flex items-center justify-center ring-4 ring-white shrink-0 bg-[#003a7a] text-white">
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                  </div>
                  <div>
                    <p className="font-bold text-sm text-[#1b1c1c]">{paso.newStatus}</p>
                    <p className="text-xs text-[#424752]">
                      {paso.timestamp ? new Date(paso.timestamp).toLocaleString('es-CL') : '—'}
                    </p>
                    {paso.comment && <p className="text-xs text-[#424752] italic mt-0.5">"{paso.comment}"</p>}
                  </div>
                </div>
              ))}
              {(!reporte.history || reporte.history.length === 0) && (
                <p className="text-sm text-[#424752] py-4">Sin historial.</p>
              )}
            </div>
          </div>

          {/* Comentarios */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#f5f3f3]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-headline font-extrabold text-lg text-[#003a7a]">Comentarios</h2>
              <span className="bg-[#c5dcfd] text-[#003a7a] text-[10px] font-bold px-2 py-0.5 rounded-full">
                {comentarios.length} {comentarios.length === 1 ? 'comentario' : 'comentarios'}
              </span>
            </div>

            {/* Lista de comentarios */}
            {comentarios.length === 0 ? (
              <p className="text-sm text-[#424752] text-center py-6">Sin comentarios aún. ¡Sé el primero!</p>
            ) : (
              <div className="space-y-3 mb-5">
                {comentarios.map((c) => {
                  const nombre = c.userName || c.userId?.split('@')[0] || 'Usuario';
                  const iniciales = nombre.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || 'US';
                  return (
                    <div key={c.commentId} className="bg-[#f5f3f3] rounded-xl p-4 border-l-4 border-[#003a7a]">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-[#0050A5] flex items-center justify-center text-white font-bold text-xs shrink-0">
                          {iniciales}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-[#1b1c1c]">{nombre}</p>
                          <p className="text-[10px] text-[#737783]">
                            {c.createdAt ? new Date(c.createdAt).toLocaleString('es-CL') : '—'}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-[#424752] leading-relaxed">{c.content}</p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Formulario nuevo comentario */}
            <div className="border-t border-[#f5f3f3] pt-4">
              <textarea
                value={nuevoComentario}
                onChange={(e) => setNuevoComentario(e.target.value)}
                rows={3}
                maxLength={500}
                placeholder="Escribe un comentario..."
                className="w-full bg-[#f5f3f3] border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#003a7a] resize-none"
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-[10px] text-[#737783]">{nuevoComentario.length}/500</span>
                {errorComentario && <p className="text-[10px] text-red-600">{errorComentario}</p>}
                <button
                  onClick={handleEnviarComentario}
                  disabled={enviandoComentario || !nuevoComentario.trim()}
                  className="bg-[#0050A5] text-white font-headline font-bold py-2 px-5 rounded-full text-xs hover:bg-[#003A7A] transition-colors disabled:opacity-60 flex items-center gap-1"
                >
                  {enviandoComentario
                    ? <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                    : <><span className="material-symbols-outlined text-sm">send</span> Comentar</>
                  }
                </button>
              </div>
            </div>
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
          {reporte.status === 'RESOLVED' && reporte.userId === user?.userId && (
            <button
              onClick={handleReabrir}
              disabled={reabriendo}
              className="flex-1 bg-amber-500 text-white font-headline font-bold py-3 px-6 rounded-full flex items-center justify-center gap-2 hover:bg-amber-600 transition-colors shadow-lg disabled:opacity-60"
            >
              <span className="material-symbols-outlined">help</span>
              {reabriendo ? 'Enviando solicitud...' : 'Solicitar Reapertura'}
            </button>
          )}
          {reporte.status === 'REOPEN_REQUESTED' && reporte.userId === user?.userId && (
            <div className="flex-1 bg-amber-50 border border-amber-300 text-amber-800 text-sm font-semibold py-3 px-6 rounded-full flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-sm">pending</span>
              Solicitud enviada — esperando respuesta
            </div>
          )}
        </div>
      </main>

      <CiudadanoFooter />
    </div>
  );
}
