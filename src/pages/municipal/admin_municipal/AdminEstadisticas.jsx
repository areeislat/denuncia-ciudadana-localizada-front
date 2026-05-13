import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend,
} from 'recharts';
import useAuthStore from '../../../store/authStore';

// TODO: reemplazar con llamada al Analytics Service cuando esté disponible
const mockMensual = [
  { mes: 'Ene', reportes: 45, resueltos: 38 },
  { mes: 'Feb', reportes: 52, resueltos: 41 },
  { mes: 'Mar', reportes: 38, resueltos: 35 },
  { mes: 'Abr', reportes: 61, resueltos: 48 },
  { mes: 'May', reportes: 74, resueltos: 59 },
  { mes: 'Jun', reportes: 58, resueltos: 52 },
];

const mockCategorias = [
  { name: 'Vialidad',       value: 35, color: '#003a7a' },
  { name: 'Luminaria',      value: 25, color: '#0050A5' },
  { name: 'Medio Ambiente', value: 20, color: '#059669' },
  { name: 'Tránsito',       value: 12, color: '#f97316' },
  { name: 'Otros',          value: 8,  color: '#737783' },
];

const mockTiempoResolucion = [
  { mes: 'Ene', horas: 32 },
  { mes: 'Feb', horas: 28 },
  { mes: 'Mar', horas: 35 },
  { mes: 'Abr', horas: 24 },
  { mes: 'May', horas: 22 },
  { mes: 'Jun', horas: 18 },
];

const mockAgentes = [
  { nombre: 'Carlos Fuentes', resueltos: 42, enProceso: 8  },
  { nombre: 'Ana Torres',     resueltos: 38, enProceso: 5  },
  { nombre: 'Pedro Soto',     resueltos: 31, enProceso: 12 },
  { nombre: 'María López',    resueltos: 27, enProceso: 3  },
];

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
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [periodoActivo, setPeriodoActivo] = useState('6m');

  const initials = user?.fullName
    ?.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase() || '?';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
            <div className="w-9 h-9 rounded-full bg-[#0050A5] flex items-center justify-center text-white text-xs font-bold shrink-0">{initials}</div>
            <div className="min-w-0">
              <p className="text-white text-xs font-bold truncate">{user?.fullName}</p>
              <p className="text-slate-400 text-[10px]">Administrador Municipal</p>
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
          <Link to="/admin/usuarios" className="sidebar-link rounded-lg px-3 py-2.5 flex items-center gap-2.5 text-sm text-slate-300 hover:text-white">
            <span className="material-symbols-outlined text-lg">group</span>
            <span className="font-headline font-medium">Usuarios</span>
          </Link>
          <Link to="/municipal/estadisticas" className="sidebar-link sidebar-active rounded-lg px-3 py-2.5 flex items-center gap-2.5 text-sm text-white">
            <span className="material-symbols-outlined text-lg fill-icon">bar_chart</span>
            <span className="font-headline font-medium">Estadísticas</span>
          </Link>
          <Link to="/municipal/configuracion" className="sidebar-link rounded-lg px-3 py-2.5 flex items-center gap-2.5 text-sm text-slate-300 hover:text-white">
            <span className="material-symbols-outlined text-lg">settings</span>
            <span className="font-headline font-medium">Configuración</span>
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
          <div className="w-8 h-8 rounded-full bg-[#0050A5] flex items-center justify-center text-white text-xs font-bold">{initials}</div>
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
            <div className="w-9 h-9 rounded-full bg-[#0050A5] flex items-center justify-center text-white text-xs font-bold">{initials}</div>
            <div>
              <p className="text-white text-xs font-bold">{user?.fullName}</p>
              <p className="text-slate-400 text-[10px]">Administrador Municipal</p>
            </div>
          </div>
          <nav className="space-y-1">
            <Link to="/municipal/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-slate-300 font-headline font-medium py-2.5 px-3 rounded-lg hover:bg-white/5 text-sm">
              <span className="material-symbols-outlined">dashboard</span>Dashboard
            </Link>
            <Link to="/municipal/estadisticas" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-white font-headline font-medium py-2.5 px-3 rounded-lg bg-white/10 text-sm">
              <span className="material-symbols-outlined">bar_chart</span>Estadísticas
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#1b1c1c] font-headline mb-1">Estadísticas</h2>
            <p className="text-[#424752] text-sm">Análisis de reportes de tu municipio.</p>
          </div>
          <div className="flex gap-2">
            {['1m', '3m', '6m', '1a'].map((p) => (
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

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Total Reportes',     valor: '328', cambio: '+8%',  color: 'border-[#003a7a]', textColor: 'text-[#003a7a]', icon: 'trending_up'   },
            { label: 'Tasa Resolución',    valor: '82%', cambio: '+5%',  color: 'border-[#059669]', textColor: 'text-[#059669]', icon: 'trending_up'   },
            { label: 'Tiempo Promedio',    valor: '24h', cambio: '-12%', color: 'border-[#0050A5]', textColor: 'text-[#0050A5]', icon: 'trending_down' },
            { label: 'Reportes Críticos',  valor: '18',  cambio: '-3%',  color: 'border-[#D7141A]', textColor: 'text-[#D7141A]', icon: 'trending_down' },
          ].map((kpi) => (
            <div key={kpi.label} className={`bg-white p-4 rounded-xl shadow-sm border-l-4 ${kpi.color}`}>
              <p className="text-[10px] font-bold text-[#737783] uppercase tracking-wider">{kpi.label}</p>
              <p className="text-2xl font-extrabold font-headline mt-1 text-[#1b1c1c]">{kpi.valor}</p>
              <p className={`text-xs font-semibold mt-1 flex items-center gap-0.5 ${kpi.textColor}`}>
                <span className="material-symbols-outlined text-xs">{kpi.icon}</span>{kpi.cambio} vs mes anterior
              </p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">

          {/* Reportes por mes */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#f5f3f3]">
            <h3 className="font-headline font-extrabold text-[#003a7a] mb-1">Reportes por Mes</h3>
            <p className="text-xs text-[#424752] mb-6">Ingresados vs resueltos.</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={mockMensual} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f3f3" />
                <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#737783' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#737783' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="reportes" name="Ingresados" fill="#003a7a" radius={[4, 4, 0, 0]} />
                <Bar dataKey="resueltos" name="Resueltos"  fill="#059669" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-3 justify-center">
              <span className="flex items-center gap-1.5 text-xs text-[#424752]"><span className="w-3 h-3 rounded-sm bg-[#003a7a] inline-block"></span>Ingresados</span>
              <span className="flex items-center gap-1.5 text-xs text-[#424752]"><span className="w-3 h-3 rounded-sm bg-[#059669] inline-block"></span>Resueltos</span>
            </div>
          </div>

          {/* Distribución por categoría */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#f5f3f3]">
            <h3 className="font-headline font-extrabold text-[#003a7a] mb-1">Por Categoría</h3>
            <p className="text-xs text-[#424752] mb-4">Distribución de reportes.</p>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={mockCategorias}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {mockCategorias.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, '']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2 justify-center">
              {mockCategorias.map((c) => (
                <span key={c.name} className="flex items-center gap-1.5 text-xs text-[#424752]">
                  <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: c.color }}></span>
                  {c.name} {c.value}%
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">

          {/* Tiempo de resolución */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#f5f3f3]">
            <h3 className="font-headline font-extrabold text-[#003a7a] mb-1">Tiempo de Resolución</h3>
            <p className="text-xs text-[#424752] mb-6">Promedio en horas por mes.</p>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={mockTiempoResolucion}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f3f3" />
                <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#737783' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#737783' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="horas"
                  name="Horas"
                  stroke="#0050A5"
                  strokeWidth={2.5}
                  dot={{ fill: '#0050A5', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Rendimiento agentes */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#f5f3f3]">
            <h3 className="font-headline font-extrabold text-[#003a7a] mb-1">Rendimiento por Agente</h3>
            <p className="text-xs text-[#424752] mb-6">Reportes resueltos y en proceso.</p>
            <div className="space-y-4">
              {mockAgentes.map((agente, i) => {
                const total = agente.resueltos + agente.enProceso;
                const pct = Math.round((agente.resueltos / total) * 100);
                return (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#c5dcfd] flex items-center justify-center text-[#003a7a] text-[10px] font-bold shrink-0">
                          {agente.nombre.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <span className="text-sm font-semibold text-[#1b1c1c]">{agente.nombre}</span>
                      </div>
                      <span className="text-xs font-bold text-[#059669]">{pct}%</span>
                    </div>
                    <div className="w-full bg-[#f5f3f3] rounded-full h-2">
                      <div
                        className="bg-[#059669] h-2 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                    <div className="flex gap-3 mt-1 text-[10px] text-[#737783]">
                      <span>{agente.resueltos} resueltos</span>
                      <span>{agente.enProceso} en proceso</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}