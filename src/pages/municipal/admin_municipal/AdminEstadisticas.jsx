import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import useAuthStore from '../../../store/authStore';
import MunicipalSidebar from '../../../components/MunicipalSidebar';
import apiClient from '../../../config/api';

const COLORS_PIE = ['#003a7a', '#0050A5', '#3b82f6', '#059669', '#f97316', '#737783'];

const ESTADO_LABEL = {
  PENDING:     'Pendiente',
  IN_PROGRESS: 'En Proceso',
  RESOLVED:    'Resuelto',
  REJECTED:    'Rechazado',
  REOPENED:    'Reabierto',
};

const ESTADO_COLOR = {
  PENDING:     '#f59e0b',
  IN_PROGRESS: '#3b82f6',
  RESOLVED:    '#10b981',
  REJECTED:    '#ef4444',
  REOPENED:    '#8b5cf6',
};

const periodos = ['1m', '3m', '6m', '1a'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-[#f5f3f3] p-3 text-xs">
        <p className="font-bold text-[#1b1c1c] mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }} className="font-semibold">
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AdminEstadisticas() {
  const { user } = useAuthStore();
  const [data, setData]           = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [periodoActivo, setPeriodoActivo] = useState('6m');

  const comunaId = user?.comunaId;

  useEffect(() => {
    if (!comunaId) {
      setError('No tienes una comuna asignada.');
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await apiClient.get(`/api/analytics/dashboard/comuna/${comunaId}`);
        setData(res);
      } catch (err) {
        setError('No se pudieron cargar las estadísticas.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [comunaId]);

  // Filtrar timeline según periodo
  const timelineFiltrado = () => {
    if (!data?.timeline) return [];
    const meses = { '1m': 1, '3m': 3, '6m': 6, '1a': 12 }[periodoActivo] || 6;
    return data.timeline.slice(-meses).map((t) => ({
      ...t,
      mes: formatMes(t.mes),
    }));
  };

  const categoriaData = () => {
    if (!data?.porCategoria) return [];
    return Object.entries(data.porCategoria)
      .filter(([k]) => k !== '')
      .map(([key, value]) => ({ name: key, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  };

  const estadoData = () => {
    if (!data?.porEstado) return [];
    return Object.entries(data.porEstado)
      .filter(([k]) => k !== '')
      .map(([key, value]) => ({
        name: ESTADO_LABEL[key] || key,
        value,
        color: ESTADO_COLOR[key] || '#737783',
      }));
  };

  const formatMes = (mes) => {
    if (!mes) return '';
    const [, month] = mes.split('-');
    const nombres = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    return nombres[parseInt(month) - 1];
  };

  return (
    <div>
      <MunicipalSidebar />
      <main className="md:ml-60 p-4 md:p-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#1b1c1c] font-headline mb-1">Estadísticas</h2>
            <p className="text-[#424752] text-sm">Análisis de reportes de tu municipio.</p>
          </div>
          <div className="flex gap-2">
            {periodos.map((p) => (
              <button
                key={p}
                onClick={() => setPeriodoActivo(p)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  periodoActivo === p
                    ? 'bg-[#003a7a] text-white'
                    : 'bg-[#eae8e7] text-[#424752] hover:bg-[#dbd9d9]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-[#003a7a] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        {error && !loading && (
          <div className="text-center py-12 text-[#ba1a1a] text-sm">{error}</div>
        )}

        {!loading && !error && data && (
          <>
            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              {[
                { label: 'Total Reportes',  valor: data.totalReportes,               color: 'border-[#003a7a]', text: 'text-[#003a7a]' },
                { label: 'Tasa Resolución', valor: `${data.tasaResolucion}%`,         color: 'border-[#059669]', text: 'text-[#059669]' },
                { label: 'En Proceso',      valor: data.porEstado?.IN_PROGRESS ?? 0, color: 'border-[#0050A5]', text: 'text-[#0050A5]' },
                { label: 'Pendientes',      valor: data.porEstado?.PENDING ?? 0,     color: 'border-[#f59e0b]', text: 'text-[#f59e0b]' },
              ].map((kpi) => (
                <div key={kpi.label} className={`bg-white p-4 rounded-xl shadow-sm border-l-4 ${kpi.color}`}>
                  <p className="text-[10px] font-bold text-[#737783] uppercase tracking-wider">{kpi.label}</p>
                  <p className={`text-2xl font-extrabold font-headline mt-1 ${kpi.text}`}>{kpi.valor}</p>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">

              {/* Reportes por mes */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#f5f3f3]">
                <h3 className="font-headline font-extrabold text-[#003a7a] mb-1">Reportes por Mes</h3>
                <p className="text-xs text-[#424752] mb-6">Ingresados vs resueltos.</p>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={timelineFiltrado()} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f5f3f3" />
                    <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#737783' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#737783' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="ingresados" name="Ingresados" fill="#003a7a" radius={[4,4,0,0]} />
                    <Bar dataKey="resueltos"  name="Resueltos"  fill="#059669" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex gap-4 mt-3 justify-center">
                  <span className="flex items-center gap-1.5 text-xs text-[#424752]">
                    <span className="w-3 h-3 rounded-sm bg-[#003a7a] inline-block"></span>Ingresados
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-[#424752]">
                    <span className="w-3 h-3 rounded-sm bg-[#059669] inline-block"></span>Resueltos
                  </span>
                </div>
              </div>

              {/* Por categoría */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#f5f3f3]">
                <h3 className="font-headline font-extrabold text-[#003a7a] mb-1">Por Categoría</h3>
                <p className="text-xs text-[#424752] mb-4">Distribución de reportes.</p>
                {categoriaData().length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={categoriaData()}
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={85}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {categoriaData().map((_, i) => (
                            <Cell key={i} fill={COLORS_PIE[i % COLORS_PIE.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2 justify-center">
                      {categoriaData().map((c, i) => (
                        <span key={c.name} className="flex items-center gap-1.5 text-xs text-[#424752]">
                          <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: COLORS_PIE[i % COLORS_PIE.length] }}></span>
                          {c.name} ({c.value})
                        </span>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-center text-[#737783] text-sm py-8">Sin datos de categorías.</p>
                )}
              </div>
            </div>

            {/* Por estado */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#f5f3f3]">
              <h3 className="font-headline font-extrabold text-[#003a7a] mb-1">Por Estado</h3>
              <p className="text-xs text-[#424752] mb-4">Distribución actual de reportes.</p>
              <div className="grid md:grid-cols-2 gap-4">
                {estadoData().map((item) => (
                  <div key={item.name}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-[#1b1c1c]">{item.name}</span>
                      <span className="text-[#737783]">{item.value}</span>
                    </div>
                    <div className="h-2 bg-[#f5f3f3] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${data.totalReportes > 0 ? (item.value / data.totalReportes) * 100 : 0}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}