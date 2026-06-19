/**
 * CP-DASH-001  Admin municipal ve KPIs de su municipalidad
 * CP-DASH-002  Super admin ve KPI de "Municipios Activos" (selector de municipalidad)
 * CP-DASH-003  Secciones del dashboard se renderizan sin error
 *
 * NOTA: El dashboard usa datos mock hardcodeados (TODO pendiente de API real).
 * Los tests validan la lógica de renderizado condicional por rol.
 * El authStore se mockea una sola vez a nivel top-level; el rol se controla
 * con una variable que se cambia en beforeEach.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => vi.fn() };
});

vi.mock('../components/MunicipalSidebar', () => ({
  default: () => <aside data-testid="sidebar" />,
}));

vi.mock('../components/MapComponent', () => ({
  default: () => <div data-testid="map-component">Mapa</div>,
}));

// Estado del rol controlable desde los tests
let currentRole = 'ADMIN_MUNICIPAL';
vi.mock('../store/authStore', () => ({
  default: (selector) => {
    const state = {
      user: {
        userId: 'u1',
        fullName: 'Test User',
        roleName: currentRole,
        comunaId: 1,
      },
      logout: vi.fn(),
    };
    return selector ? selector(state) : state;
  },
}));

// Importar después de los mocks
import MunicipalDashboard from '../pages/municipal/shared/MunicipalDashboard';

const render_ = () =>
  render(
    <MemoryRouter>
      <MunicipalDashboard />
    </MemoryRouter>
  );

describe('CP-DASH — Dashboard Municipal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ─────────────────────────────────────────────────────────────────
  // CP-DASH-001: Admin municipal ve estadísticas de su municipalidad
  // ─────────────────────────────────────────────────────────────────
  it('CP-DASH-001: ADMIN_MUNICIPAL ve los 4 KPIs base', () => {
    currentRole = 'ADMIN_MUNICIPAL';
    render_();

    expect(screen.getByText('Total Activos')).toBeInTheDocument();
    expect(screen.getByText('342')).toBeInTheDocument();
    expect(screen.getByText('Críticos')).toBeInTheDocument();
    expect(screen.getByText('18')).toBeInTheDocument();
    // "En Proceso" puede aparecer en varios lugares (KPI + badge)
    expect(screen.getAllByText('En Proceso').length).toBeGreaterThan(0);
    expect(screen.getByText('Resueltos')).toBeInTheDocument();
  });

  it('CP-DASH-001: ADMIN_MUNICIPAL ve KPIs adicionales (Tiempo Promedio, Satisfacción)', () => {
    currentRole = 'ADMIN_MUNICIPAL';
    render_();

    expect(screen.getByText('Tiempo Promedio')).toBeInTheDocument();
    expect(screen.getByText('28h')).toBeInTheDocument();
    expect(screen.getByText('Satisfacción')).toBeInTheDocument();
    expect(screen.getByText('92%')).toBeInTheDocument();
  });

  it('CP-DASH-001: ADMIN_MUNICIPAL ve su badge de rol en el dashboard', () => {
    currentRole = 'ADMIN_MUNICIPAL';
    render_();

    expect(screen.getByText('Administrador Municipal')).toBeInTheDocument();
  });

  it('CP-DASH-001: MUNICIPAL_OFFICER ve la sección "Tickets Asignados a Mí"', () => {
    currentRole = 'MUNICIPAL_OFFICER';
    render_();

    expect(screen.getByText('Tickets Asignados a Mí')).toBeInTheDocument();
    expect(screen.getByText('Reparar luminaria Av. Los Leones')).toBeInTheDocument();
  });

  // ─────────────────────────────────────────────────────────────────
  // CP-DASH-002: Super admin ve todas las municipalidades
  // ─────────────────────────────────────────────────────────────────
  it('CP-DASH-002: SUPER_ADMIN ve el KPI exclusivo "Municipios Activos"', () => {
    currentRole = 'SUPER_ADMIN';
    render_();

    expect(screen.getByText('Municipios Activos')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
  });

  it('CP-DASH-002: SUPER_ADMIN NO ve la sección de tickets asignados', () => {
    currentRole = 'SUPER_ADMIN';
    render_();

    expect(screen.queryByText('Tickets Asignados a Mí')).not.toBeInTheDocument();
  });

  it('CP-DASH-002: SUPER_ADMIN ve el badge "Super Administrador"', () => {
    currentRole = 'SUPER_ADMIN';
    render_();

    expect(screen.getByText('Super Administrador')).toBeInTheDocument();
  });

  it('CP-DASH-002: SUPER_ADMIN ve el mapa con título "Mapa Global de Reportes"', () => {
    currentRole = 'SUPER_ADMIN';
    render_();

    expect(screen.getByText('Mapa Global de Reportes')).toBeInTheDocument();
  });

  // ─────────────────────────────────────────────────────────────────
  // CP-DASH-003: Secciones críticas se renderizan sin error
  // ─────────────────────────────────────────────────────────────────
  it('CP-DASH-003: el componente MapComponent se renderiza', () => {
    currentRole = 'ADMIN_MUNICIPAL';
    render_();

    expect(screen.getByTestId('map-component')).toBeInTheDocument();
  });

  it('CP-DASH-003: la sección "Últimos Reportes" se renderiza con sus 3 items mock', () => {
    currentRole = 'ADMIN_MUNICIPAL';
    render_();

    expect(screen.getByText('Últimos Reportes')).toBeInTheDocument();
    expect(screen.getByText('Falla Luminaria Pública')).toBeInTheDocument();
    expect(screen.getByText('Bache Profundo')).toBeInTheDocument();
  });

  it('CP-DASH-003: el sidebar se renderiza correctamente', () => {
    currentRole = 'ADMIN_MUNICIPAL';
    render_();

    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
  });

  it('CP-DASH-003: MUNICIPAL_OFFICER no ve KPIs de administración ni "Municipios Activos"', () => {
    currentRole = 'MUNICIPAL_OFFICER';
    render_();

    expect(screen.queryByText('Tiempo Promedio')).not.toBeInTheDocument();
    expect(screen.queryByText('Municipios Activos')).not.toBeInTheDocument();
  });
});
