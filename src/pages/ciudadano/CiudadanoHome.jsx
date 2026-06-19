import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import MapComponent from '../../components/MapComponent';
import useAuthStore from '../../store/authStore';
import apiClient from '../../config/api';
import CiudadanoFooter from '../../components/CiudadanoFooter';
import CiudadanoHeader from '../../components/CiudadanoHeader';

const mockMarkers = [
  { lat: -33.423, lng: -70.615, title: 'Bache en cruce peatonal', status: 'Pendiente', color: '#dc2626', n: 12 },
  { lat: -33.428, lng: -70.605, title: 'Luminaria dañada', status: 'En Proceso', color: '#2563eb', n: 5 },
  { lat: -33.431, lng: -70.618, title: 'Microbasural', status: 'Asignado', color: '#f97316', n: 8 },
  { lat: -33.425, lng: -70.602, title: 'Señalética dañada', status: 'Resuelto', color: '#16a34a', n: 3 },
  { lat: -33.42, lng: -70.608, title: 'Bache profundo', status: 'Pendiente', color: '#dc2626', n: 21 },
  { lat: -33.434, lng: -70.612, title: 'Basura ilegal', status: 'En Proceso', color: '#2563eb', n: 7 },
];

const estadoConfig = {
  PENDING:     { label: 'Pendiente',  clase: 'badge-pendiente' },
  IN_PROGRESS: { label: 'En Proceso', clase: 'badge-proceso'   },
  RESOLVED:    { label: 'Resuelto',   clase: 'badge-resuelto'  },
  REJECTED:    { label: 'Rechazado',  clase: 'badge-rechazado' },
};

export default function CiudadanoHome() {
  const [stats, setStats] = useState({ total: 0, pendientes: 0, resueltos: 0 });
  const [reportesRecientes, setReportesRecientes] = useState([]);

  const { user } = useAuthStore();

  const firstName = user?.fullName?.split(' ')[0] || 'Ciudadano';

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (!user?.userId) return;
        const data = await apiClient.get(`/api/reports/user/${user.userId}`);
        const reportes = data.reports || [];
        setStats({
          total: reportes.length,
          pendientes: reportes.filter((r) => r.status === 'PENDING' || r.status === 'IN_PROGRESS').length,
          resueltos: reportes.filter((r) => r.status === 'RESOLVED').length,
        });
      } catch {
        setStats({ total: 0, pendientes: 0, resueltos: 0 });
      }
    };

    const fetchFeed = async () => {
      try {
        const data = await apiClient.get('/api/reports?page=0&size=10');
        setReportesRecientes(data.reports || []);
      } catch {
        // silencioso
      }
    };

    fetchStats();
    fetchFeed();
  }, [user?.userId]);

  return (
    <div>
      <CiudadanoHeader activePage="inicio" />

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* Greeting */}
        <div className="mb-8">
          <h1 className="font-headline font-extrabold text-3xl md:text-4xl text-[#003a7a] mb-2">
            Hola, {firstName} 👋
          </h1>
          <p className="text-[#424752] text-base">¿Encontraste un problema en tu barrio? Repórtalo y ayuda a mejorar tu comunidad.</p>
        </div>

        {/* Stats — datos reales del Report Service */}
        <div className="flex flex-wrap gap-3 mb-8">
          <div className="bg-white rounded-xl py-3 px-4 shadow-sm flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#c5dcfd] flex items-center justify-center text-[#003a7a] shrink-0">
              <span className="material-symbols-outlined text-base">description</span>
            </div>
            <p className="font-headline font-bold text-sm"><span className="text-lg">{stats.total}</span> reportes</p>
          </div>
          <div className="bg-white rounded-xl py-3 px-4 shadow-sm flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#fef3c7] flex items-center justify-center text-[#92400e] shrink-0">
              <span className="material-symbols-outlined text-base">pending</span>
            </div>
            <p className="font-headline font-bold text-sm"><span className="text-lg">{stats.pendientes}</span> pendientes</p>
          </div>
          <div className="bg-white rounded-xl py-3 px-4 shadow-sm flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#d1fae5] flex items-center justify-center text-[#065f46] shrink-0">
              <span className="material-symbols-outlined text-base">check_circle</span>
            </div>
            <p className="font-headline font-bold text-sm"><span className="text-lg">{stats.resueltos}</span> resueltos</p>
          </div>
        </div>

        {/* Quick action */}
        <div className="mb-8">
          <Link
            to="/ciudadano/crear"
            className="inline-flex items-center gap-2 bg-[#0050A5] text-white font-headline font-bold py-4 px-10 rounded-full shadow-lg hover:bg-[#003A7A] transition-colors text-base"
          >
            <span className="material-symbols-outlined fill-icon">add_circle</span> Reportar un Problema
          </Link>
        </div>

        {/* Map */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-headline font-bold text-xl">Mapa de Incidencias</h2>
            <Link to="/ciudadano/reportes" className="text-[#003a7a] font-bold text-sm flex items-center gap-1">
              Mis reportes <span className="material-symbols-outlined text-sm">chevron_right</span>
            </Link>
          </div>
          <MapComponent markers={mockMarkers} height="450px" />
          <div className="flex flex-wrap gap-4 mt-3 text-xs text-[#424752]">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#dc2626] inline-block"></span> Pendiente</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#2563eb] inline-block"></span> En Proceso</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#f97316] inline-block"></span> Asignado</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#16a34a] inline-block"></span> Resuelto</span>
          </div>
        </div>
        {/* Reportes recientes de la comunidad */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-headline font-bold text-xl">Reportes Recientes</h2>
            <span className="text-xs text-[#737783]">Últimos 10 de la comunidad</span>
          </div>
          {reportesRecientes.length === 0 ? (
            <p className="text-sm text-[#424752] text-center py-8">No hay reportes recientes.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {reportesRecientes.map((r) => {
                const est = estadoConfig[r.status] || estadoConfig['PENDING'];
                return (
                  <Link
                    key={r.reportId}
                    to={`/ciudadano/reportes/${r.reportId}`}
                    className="bg-white rounded-xl p-4 shadow-sm border border-[#f5f3f3] hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className={`${est.clase} text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full`}>
                        {est.label}
                      </span>
                      <span className="text-[10px] text-[#737783]">
                        {r.createdAt ? new Date(r.createdAt).toLocaleDateString('es-CL') : '—'}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-[#1b1c1c] mb-1 line-clamp-2">{r.description}</p>
                    <div className="flex items-center gap-1 text-[10px] text-[#737783]">
                      <span className="material-symbols-outlined text-xs">location_on</span>
                      <span className="truncate">{r.address || 'Sin dirección'}</span>
                    </div>
                    {r.category && (
                      <span className="inline-block mt-2 text-[9px] font-bold bg-[#f0f4ff] text-[#003a7a] px-2 py-0.5 rounded-full">
                        {r.category}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <CiudadanoFooter />
    </div>
  );
}
