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

export default function CiudadanoHome() {
  const [stats, setStats] = useState({ total: 0, pendientes: 0, resueltos: 0 });

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
    fetchStats();
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
      </main>

      <CiudadanoFooter />
    </div>
  );
}
