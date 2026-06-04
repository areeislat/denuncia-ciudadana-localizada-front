import { useState, useEffect } from 'react';
import MunicipalSidebar from '../../../components/MunicipalSidebar';
import apiClient from '../../../config/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';

const COLORS_ESTADO = {
  PENDING:     '#f59e0b',
  IN_PROGRESS: '#3b82f6',
  RESOLVED:    '#10b981',
  REJECTED:    '#ef4444',
  REOPENED:    '#8b5cf6',
};

const COLORS_PIE = ['#003a7a', '#0050A5', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'];

const ESTADO_LABEL = {
  PENDING:     'Pendiente',
  IN_PROGRESS: 'En Proceso',
  RESOLVED:    'Resuelto',
  REJECTED:    'Rechazado',
  REOPENED:    'Reabierto',
};

const periodos = [
  { label: '1m', meses: 1 },
  { label: '3m', meses: 3 },
  { label: '6m', meses: 6 },
  { label: '1a', meses: 12 },
];

export default function SuperEstadisticas() {
  const [data, setData]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [periodo, setPeriodo]   = useState('6m');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await apiClient.get('/api/analytics/dashboard/global');
        setData(res);
      } catch (err) {
        setError('No se pudieron cargar las estadísticas.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filtrar timeline según periodo
  const timelineFiltrado = () => {
    if (!data?.timeline) return [];
    const meses = periodos.find((p) => p.label === periodo)?.meses || 6;
    return data.timeline.slice(-meses);
  };

  // Convertir porEstado a array para gráficos
  const estadoData = () => {
    if (!data?.porEstado) return [];
    return Object.entries(data.porEstado)
      .filter(([k]) => k !== '')
      .map(([key, value]) => ({
        name: ESTADO_LABEL[key] || key,
        value,
        color: COLORS_ESTADO[key] || '#737783',
      }));
  };

  // Convertir porCategoria a array
  const categoriaData = () => {
    if (!data?.porCategoria) return [];
    return Object.entries(data.porCategoria)
      .filter(([k]) => k !== '')
      .map(([key, value]) => ({ name: key, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  };

  const formatMes = (mes) => {
    if (!mes) return '';
    const [year, month] = mes.split('-');
    const nombres = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    return nombres[parseInt(month) - 1];
  };

  return (
    <div>
      <MunicipalSidebar />
      <main className="md:ml-60 p-4 md:p-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#1b1c1c] font-headline mb-1">Estadísticas</h2>
            <p className="text-[#424752] text-sm">Análisis global de reportes en el sistema.</p>
          </div>
          <div className="flex gap-2">
            {periodos.map((p) => (
              <button
                key={p.label}
                onClick={() => setPeriodo(p.label)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  periodo === p.label
                    ? 'bg-[#003a7a] text-white'
                    : 'bg-[#eae8e7] text-[#424752] hover:bg-[#dbd9d9]'
                }`}
              >
                {p.label}
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {[
                { label: 'Total Reportes',   valor: data.totalReportes,               color: 'border-[#003a7a]', text: 'text-[#003a7a]' },
                { label: 'Tasa Resolución',  valor: `${data.tasaResolucion}%`,         color: 'border-[#059669]', text: 'text-[#059669]' },
                { label: 'En Proceso',       valor: data.porEstado?.IN_PROGRESS ?? 0, color: 'border-[#3b82f6]', text: 'text-[#3b82f6]' },
                { label: 'Críticos',         valor: data.porPrioridad?.CRITICAL ?? 0, color: 'border-[#ba1a1a]', text: 'text-[#ba1a1a]' },
              ].map((item) => (
                <div key={item.label} className={`bg-white rounded-xl p-4 shadow-sm border-l-4 ${item.color}`}>
                  <p className="text-[10px] font-bold text-[#737783] uppercase tracking-wider">{item.label}</p>
                  <p className={`text-2xl font-extrabold font-headline mt-1 ${item.text}`}>{item.valor}</p>
                </div>
              ))}
            </div>

            {/* Gráficos fila 1 */}
            <div className="grid md:grid-cols-2 gap-4 mb-4">

              {/* Timeline */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#f5f3f3]">
                <h3 className="font-headline font-bold text-sm text-[#1b1c1c] mb-1">Reportes por Mes</h3>
                <p className="text-[10px] text-[#737783] mb-4">Ingresados vs resueltos.</p>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={timelineFiltrado()} barGap={2}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f5f3f3" />
                    <XAxis dataKey="mes" tickFormatter={formatMes} tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip formatter={(v, n) => [v, n === 'ingresados' ? 'Ingresados' : 'Resueltos']} />
                    <Legend formatter={(v) => v === 'ingresados' ? 'Ingresados' : 'Resueltos'} />
                    <Bar dataKey="ingresados" fill="#003a7a" radius={[3,3,0,0]} />
                    <Bar dataKey="resueltos"  fill="#10b981" radius={[3,3,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Por categoría */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#f5f3f3]">
                <h3 className="font-headline font-bold text-sm text-[#1b1c1c] mb-1">Por Categoría</h3>
                <p className="text-[10px] text-[#737783] mb-4">Distribución de reportes.</p>
                <ResponsiveContainer width="100%" height={220}>
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
                    <Legend iconSize={8} wrapperStyle={{ fontSize: '10px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Gráficos fila 2 */}
            <div className="grid md:grid-cols-2 gap-4">

              {/* Por estado */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#f5f3f3]">
                <h3 className="font-headline font-bold text-sm text-[#1b1c1c] mb-1">Por Estado</h3>
                <p className="text-[10px] text-[#737783] mb-4">Distribución actual de reportes.</p>
                <div className="space-y-3">
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

              {/* Por prioridad */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#f5f3f3]">
                <h3 className="font-headline font-bold text-sm text-[#1b1c1c] mb-1">Por Prioridad</h3>
                <p className="text-[10px] text-[#737783] mb-4">Distribución por nivel de urgencia.</p>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart
                    data={Object.entries(data.porPrioridad || {})
                      .filter(([k]) => k !== '')
                      .map(([key, value]) => ({ name: key, value }))}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f5f3f3" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 10 }} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={70} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#003a7a" radius={[0,3,3,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}