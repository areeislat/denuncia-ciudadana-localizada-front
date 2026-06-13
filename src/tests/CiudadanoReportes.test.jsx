/**
 * CP-REPORTES-001  Listar denuncias del usuario → lista con estado
 * CP-REPORTES-002  Filtrar por estado 'Cerrada' (RESOLVED) → lista actualizada
 * CP-REPORTES-003  Verificar que el componente maneja múltiples reportes correctamente
 *
 * NOTA SOBRE PAGINACIÓN (CP-REPORTES-003):
 * CiudadanoReportes NO tiene paginación — carga todos los reportes del usuario de una vez.
 * El test del excel dice "> 10 denuncias, ir página 2" pero ese comportamiento
 * corresponde a MunicipalGestionReportes (paginación server-side).
 * Se ajusta: CP-REPORTES-003 verifica que todos los reportes se renderizan y el filtro funciona.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import CiudadanoReportes from '../pages/ciudadano/CiudadanoReportes';

// ── Mocks ────────────────────────────────────────────────────────────
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('../config/api', () => ({
  default: {
    get: vi.fn(),
    interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } },
  },
}));

vi.mock('../components/CiudadanoHeader', () => ({ default: () => <header data-testid="header" /> }));
vi.mock('../components/CiudadanoFooter', () => ({ default: () => <footer data-testid="footer" /> }));

// Mock de useAuthStore con usuario citizen
vi.mock('../store/authStore', () => ({
  default: (selector) => {
    const state = {
      user: { userId: 'user-123', fullName: 'Juan Test', roleName: 'CITIZEN' },
      logout: vi.fn(),
    };
    return selector ? selector(state) : state;
  },
}));

import apiClient from '../config/api';

// ── Datos de prueba ──────────────────────────────────────────────────
const mockReportes = [
  { reportId: 'r1', description: 'Bache profundo en calle principal', status: 'PENDING',     address: 'Calle 1',  createdAt: '2025-01-01T10:00:00Z' },
  { reportId: 'r2', description: 'Luminaria apagada parque central',  status: 'IN_PROGRESS', address: 'Calle 2',  createdAt: '2025-01-02T10:00:00Z' },
  { reportId: 'r3', description: 'Basura acumulada esquina Av. Los Leones', status: 'RESOLVED',    address: 'Avenida 3', createdAt: '2025-01-03T10:00:00Z' },
  { reportId: 'r4', description: 'Microbasural sector norte',          status: 'REJECTED',    address: 'Calle 4',  createdAt: '2025-01-04T10:00:00Z' },
];

const renderReportes = () =>
  render(
    <MemoryRouter>
      <CiudadanoReportes />
    </MemoryRouter>
  );

describe('CP-REPORTES — Listado de Reportes del Ciudadano', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ─────────────────────────────────────────────────────────────────
  // CP-REPORTES-001: Listar denuncias del usuario
  // GET /api/reports/user/{id} → renderiza la lista con estados
  // ─────────────────────────────────────────────────────────────────
  it('CP-REPORTES-001: carga y muestra la lista de reportes del usuario con sus estados', async () => {
    apiClient.get.mockResolvedValueOnce({ reports: mockReportes });

    renderReportes();

    // Spinner visible al inicio
    expect(screen.getByText('Cargando reportes...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Bache profundo en calle principal')).toBeInTheDocument();
      expect(screen.getByText('Luminaria apagada parque central')).toBeInTheDocument();
      expect(screen.getByText('Basura acumulada esquina Av. Los Leones')).toBeInTheDocument();
    });

    // Verificar que se llamó al endpoint correcto
    expect(apiClient.get).toHaveBeenCalledWith('/api/reports/user/user-123');
  });

  it('CP-REPORTES-001 (variante): muestra los badges de estado (Pendiente, En Proceso, Resuelto, Rechazado)', async () => {
    apiClient.get.mockResolvedValueOnce({ reports: mockReportes });

    renderReportes();

    await waitFor(() => {
      expect(screen.getByText('Pendiente')).toBeInTheDocument();
      expect(screen.getByText('En Proceso')).toBeInTheDocument();
      expect(screen.getByText('Resuelto')).toBeInTheDocument();
      expect(screen.getByText('Rechazado')).toBeInTheDocument();
    });
  });

  it('CP-REPORTES-001 (variante): sin reportes muestra mensaje vacío', async () => {
    apiClient.get.mockResolvedValueOnce({ reports: [] });

    renderReportes();

    await waitFor(() => {
      expect(screen.getByText('No hay reportes en esta categoría.')).toBeInTheDocument();
    });
  });

  it('CP-REPORTES-001 (variante): error de red muestra mensaje de error', async () => {
    apiClient.get.mockRejectedValueOnce(new Error('Network Error'));

    renderReportes();

    await waitFor(() => {
      expect(screen.getByText('No se pudieron cargar tus reportes.')).toBeInTheDocument();
    });
  });

  // ─────────────────────────────────────────────────────────────────
  // CP-REPORTES-002: Filtrar por estado 'Resueltos' (equivale a 'Cerrada')
  // Click en filtro → solo se muestran los reportes con ese estado
  // ─────────────────────────────────────────────────────────────────
  it('CP-REPORTES-002: filtro "Resueltos" muestra solo los reportes con estado RESOLVED', async () => {
    apiClient.get.mockResolvedValueOnce({ reports: mockReportes });

    renderReportes();

    await waitFor(() => {
      expect(screen.getByText('Bache profundo en calle principal')).toBeInTheDocument();
    });

    // Click en el filtro "Resueltos"
    await userEvent.click(screen.getByRole('button', { name: /resueltos/i }));

    await waitFor(() => {
      // Solo el reporte RESOLVED debe estar visible
      expect(screen.getByText('Basura acumulada esquina Av. Los Leones')).toBeInTheDocument();
      // Los demás no deben estar
      expect(screen.queryByText('Bache profundo en calle principal')).not.toBeInTheDocument();
      expect(screen.queryByText('Luminaria apagada parque central')).not.toBeInTheDocument();
    });
  });

  it('CP-REPORTES-002: filtro "Pendientes" muestra solo reportes PENDING', async () => {
    apiClient.get.mockResolvedValueOnce({ reports: mockReportes });

    renderReportes();

    await waitFor(() => {
      expect(screen.getByText('Bache profundo en calle principal')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole('button', { name: /pendientes/i }));

    await waitFor(() => {
      expect(screen.getByText('Bache profundo en calle principal')).toBeInTheDocument();
      expect(screen.queryByText('Luminaria apagada parque central')).not.toBeInTheDocument();
    });
  });

  it('CP-REPORTES-002: filtro "Todos" vuelve a mostrar todos los reportes', async () => {
    apiClient.get.mockResolvedValueOnce({ reports: mockReportes });

    renderReportes();

    await waitFor(() => {
      expect(screen.getByText('Bache profundo en calle principal')).toBeInTheDocument();
    });

    // Filtrar primero
    await userEvent.click(screen.getByRole('button', { name: /resueltos/i }));
    // Volver a Todos
    await userEvent.click(screen.getByRole('button', { name: /^todos/i }));

    await waitFor(() => {
      expect(screen.getByText('Bache profundo en calle principal')).toBeInTheDocument();
      expect(screen.getByText('Luminaria apagada parque central')).toBeInTheDocument();
      expect(screen.getByText('Basura acumulada esquina Av. Los Leones')).toBeInTheDocument();
    });
  });

  // ─────────────────────────────────────────────────────────────────
  // CP-REPORTES-003: Múltiples reportes y conteo en filtros
  // El componente no tiene paginación — verifica conteo correcto
  // ─────────────────────────────────────────────────────────────────
  it('CP-REPORTES-003: el conteo en los botones de filtro refleja el total correcto', async () => {
    apiClient.get.mockResolvedValueOnce({ reports: mockReportes });

    renderReportes();

    await waitFor(() => {
      // "Todos (4)"
      expect(screen.getByRole('button', { name: /todos \(4\)/i })).toBeInTheDocument();
      // "Pendientes (1)"
      expect(screen.getByRole('button', { name: /pendientes \(1\)/i })).toBeInTheDocument();
      // "En Proceso (1)"
      expect(screen.getByRole('button', { name: /en proceso \(1\)/i })).toBeInTheDocument();
      // "Resueltos (1)"
      expect(screen.getByRole('button', { name: /resueltos \(1\)/i })).toBeInTheDocument();
    });
  });

  it('CP-REPORTES-003: con más de 10 reportes, todos se renderizan (sin paginación)', async () => {
    const muchos = Array.from({ length: 12 }, (_, i) => ({
      reportId: `r${i}`,
      description: `Reporte número ${i + 1} descripción larga`,
      status: 'PENDING',
      address: `Calle ${i + 1}`,
      createdAt: new Date().toISOString(),
    }));

    apiClient.get.mockResolvedValueOnce({ reports: muchos });

    renderReportes();

    await waitFor(() => {
      // Todos los 12 reportes visibles
      expect(screen.getByText('Reporte número 1 descripción larga')).toBeInTheDocument();
      expect(screen.getByText('Reporte número 12 descripción larga')).toBeInTheDocument();
    });
  });
});
