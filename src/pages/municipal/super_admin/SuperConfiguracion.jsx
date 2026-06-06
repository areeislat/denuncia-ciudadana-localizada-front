import { useState, useEffect } from 'react';
import MunicipalSidebar from '../../../components/MunicipalSidebar';
import apiClient from '../../../config/api';

export default function SuperConfiguracion() {
  const [comunas, setComunas]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [detalle, setDetalle]   = useState(null);

  useEffect(() => {
    const fetchComunas = async () => {
      try {
        setLoading(true);
        const data = await apiClient.get('/api/comunas');
        setComunas(data);
      } catch (err) {
        setError('No se pudieron cargar las configuraciones.');
      } finally {
        setLoading(false);
      }
    };
    fetchComunas();
  }, []);

  const comunasFiltradas = comunas.filter((c) =>
    busqueda === '' ||
    c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.region?.toLowerCase().includes(busqueda.toLowerCase())
  );

  const formatFecha = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('es-CL', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  };

  return (
    <div>
      <MunicipalSidebar />
      <main className="md:ml-60 p-4 md:p-8">

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#1b1c1c] font-headline mb-1">Configuración</h2>
          <p className="text-[#424752] text-sm">Vista general de la configuración de cada municipio.</p>
          <div className="mt-2 flex items-center gap-2 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 w-fit">
            <span className="material-symbols-outlined text-sm">visibility</span>
            Solo lectura — los cambios los realiza cada administrador municipal
          </div>
        </div>

        {/* Búsqueda */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-[#f5f3f3] mb-6">
          <div className="flex items-center gap-2 border border-[#e4e2e2] rounded-lg px-3 py-2">
            <span className="material-symbols-outlined text-[#737783] text-sm">search</span>
            <input
              type="text"
              placeholder="Buscar por nombre o región..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="flex-1 text-sm outline-none bg-transparent text-[#1b1c1c] placeholder:text-[#737783]"
            />
          </div>
        </div>

        {/* Carga / error */}
        {loading && (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-[#003a7a] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        {error && !loading && (
          <div className="text-center py-12 text-[#ba1a1a] text-sm">{error}</div>
        )}

        {/* Grid */}
        {!loading && !error && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {comunasFiltradas.length === 0 && (
              <p className="col-span-3 text-center text-[#424752] text-sm py-12">No hay municipios que coincidan.</p>
            )}
            {comunasFiltradas.map((c) => (
              <div
                key={c.comunaId}
                className="bg-white rounded-2xl p-5 shadow-sm border border-[#f5f3f3] hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setDetalle(c)}
              >
                {/* Header card */}
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
                  <span className={`text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                    c.isActive ? 'bg-green-100 text-green-700' : 'bg-[#eae8e7] text-[#737783]'
                  }`}>
                    {c.isActive ? 'Activa' : 'Inactiva'}
                  </span>
                </div>

                {/* Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs text-[#424752]">
                    <span className="material-symbols-outlined text-sm text-[#003a7a]">person</span>
                    <span className="truncate">{c.adminEmail || 'Sin administrador asignado'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#424752]">
                    <span className="material-symbols-outlined text-sm text-[#003a7a]">tag</span>
                    <span>INE: {c.codigoIne || '—'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#424752]">
                    <span className="material-symbols-outlined text-sm text-[#003a7a]">calendar_today</span>
                    <span>Creada {formatFecha(c.createdAt)}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex gap-3 py-3 border-t border-[#f5f3f3]">
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
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal detalle */}
      {detalle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDetalle(null)}></div>
          <div className="relative bg-white rounded-2xl p-6 shadow-2xl max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#001A33] flex items-center justify-center text-white shrink-0">
                  <span className="material-symbols-outlined text-lg">location_city</span>
                </div>
                <div>
                  <h3 className="font-headline font-extrabold text-[#1b1c1c] text-lg leading-tight">{detalle.nombre}</h3>
                  <p className="text-xs text-[#737783]">{detalle.region || '—'}</p>
                </div>
              </div>
              <button onClick={() => setDetalle(null)} className="text-[#737783] hover:bg-[#f5f3f3] p-1.5 rounded-lg">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <div className="space-y-4">
              {[
                { label: 'Estado',          valor: detalle.isActive ? 'Activa' : 'Inactiva', badge: true },
                { label: 'Código INE',      valor: detalle.codigoIne || '—' },
                { label: 'Administrador',   valor: detalle.adminName || 'Sin asignar' },
                { label: 'Email admin',     valor: detalle.adminEmail || '—' },
                { label: 'Agentes',         valor: detalle.agentCount ?? 0 },
                { label: 'Creada',          valor: formatFecha(detalle.createdAt) },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-[10px] font-bold text-[#737783] uppercase tracking-wider mb-1">{item.label}</p>
                  {item.badge ? (
                    <span className={`text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                      detalle.isActive ? 'bg-green-100 text-green-700' : 'bg-[#eae8e7] text-[#737783]'
                    }`}>
                      {item.valor}
                    </span>
                  ) : (
                    <p className="text-sm text-[#1b1c1c] font-medium">{item.valor}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs text-amber-700 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">info</span>
                La configuración detallada del formulario y departamentos es gestionada por el administrador de cada municipio.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}