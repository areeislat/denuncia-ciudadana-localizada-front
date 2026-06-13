/**
 * CP-GESTION-001  Cambiar estado → PATCH + mensaje éxito visible
 * CP-GESTION-002  Comentario incluido en el PATCH
 * CP-GESTION-003  Filtrar por estado en tabla
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

// ── Mocks top-level ────────────────────────────────────────────────
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => vi.fn() };
});

const mockGet  = vi.fn();
const mockPatch = vi.fn();
vi.mock('../config/api', () => ({
  default: {
    get:   (...a) => mockGet(...a),
    patch: (...a) => mockPatch(...a),
    interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } },
  },
}));

vi.mock('../components/MunicipalSidebar', () => ({
  default: () => <aside data-testid="sidebar" />,
}));
vi.mock('../components/MapComponent', () => ({
  default: () => <div data-testid="map" />,
}));

vi.mock('../store/authStore', () => ({
  default: (selector) => {
    const state = {
      user: { userId: 'u1', roleName: 'ADMIN_MUNICIPAL', comunaId: 1, fullName: 'Admin Test' },
      logout: vi.fn(),
    };
    return selector ? selector(state) : state;
  },
}));

import MunicipalGestionReportes from '../pages/municipal/shared/MunicipalGestionReportes';
import MunicipalDetalleReporte  from '../pages/municipal/shared/MunicipalDetalleReporte';

// ── Datos ────────────────────────────────────────────────────────────
const reporteBase = {
  reportId: 'rpt-aabbccdd',
  description: 'Bache calle Suecia esquina Suiza',
  status: 'PENDING',
  priority: 'HIGH',
  category: 'Bache / Pavimento',
  address: 'Suecia 123',
  createdAt: '2025-01-01T10:00:00Z',
  history: [],
};

const listaReportes = {
  reportes: [
    { reportId: 'r1', description: 'Bache calle Suecia', status: 'PENDING',     category: 'Bache / Pavimento', priority: 'HIGH',   address: 'Suecia 1',   createdAt: '2025-01-01T10:00:00Z' },
    { reportId: 'r2', description: 'Luminaria apagada',  status: 'IN_PROGRESS', category: 'Luminaria Dañada',  priority: 'MEDIUM', address: 'Plaza 2',    createdAt: '2025-01-02T10:00:00Z' },
    { reportId: 'r3', description: 'Microbasural norte', status: 'RESOLVED',    category: 'Microbasural',      priority: 'LOW',    address: 'Norte 3',    createdAt: '2025-01-03T10:00:00Z' },
  ],
  total: 3,
  totalPages: 1,
};

// ── Helpers ──────────────────────────────────────────────────────────
const renderDetalle = (reporte = reporteBase) => {
  mockGet.mockResolvedValue(reporte);
  return render(
    <MemoryRouter initialEntries={['/municipal/gestion/rpt-aabbccdd']}>
      <Routes>
        <Route path="/municipal/gestion/:id" element={<MunicipalDetalleReporte />} />
      </Routes>
    </MemoryRouter>
  );
};

const renderGestion = () => {
  // Primera llamada: categorías; segunda: lista de reportes
  mockGet
    .mockResolvedValueOnce([])
    .mockResolvedValueOnce(listaReportes);
  return render(
    <MemoryRouter initialEntries={['/municipal/gestion']}>
      <MunicipalGestionReportes />
    </MemoryRouter>
  );
};

describe('CP-GESTION — Gestión de Denuncias (Municipal)', () => {
  beforeEach(() => {
    mockGet.mockReset();
    mockPatch.mockReset();
  });

  // ─────────────────────────────────────────────────────────────────
  // CP-GESTION-001: Cambiar estado de denuncia
  // ─────────────────────────────────────────────────────────────────
  it('CP-GESTION-001: actualizar estado llama PATCH y muestra mensaje de éxito', async () => {
    mockPatch.mockResolvedValueOnce({ ...reporteBase, status: 'RESOLVED' });

    renderDetalle();

    await waitFor(() => {
      expect(screen.getByText('Bache calle Suecia esquina Suiza')).toBeInTheDocument();
    });

    // El select tiene las opciones de ESTADOS
    const selects = screen.getAllByRole('combobox');
    // El primer combobox en la página es el de estado (Asignar Prioridad viene después)
    // Buscamos el que tiene las opciones de estado
    const selectEstado = selects.find(
      (s) => s.querySelector && Array.from(s.options || []).some((o) => o.value === 'RESOLVED')
    ) || selects[1]; // fallback al segundo select (prioridad es el primero)

    await userEvent.selectOptions(selectEstado, 'RESOLVED');

    await userEvent.click(screen.getByRole('button', { name: /guardar cambio/i }));

    await waitFor(() => {
      expect(mockPatch).toHaveBeenCalledWith(
        `/api/reports/${reporteBase.reportId}/status`,
        expect.objectContaining({ status: 'RESOLVED' })
      );
      expect(screen.getByText('Estado actualizado correctamente.')).toBeInTheDocument();
    });
  });

  it('CP-GESTION-001: botón "Guardar cambio" deshabilitado si el estado no cambió', async () => {
    renderDetalle();

    await waitFor(() => {
      expect(screen.getByText('Bache calle Suecia esquina Suiza')).toBeInTheDocument();
    });

    // Estado actual = PENDING, select empieza en PENDING → botón disabled
    expect(screen.getByRole('button', { name: /guardar cambio/i })).toBeDisabled();
  });

  it('CP-GESTION-001: error de API muestra mensaje de error', async () => {
    mockPatch.mockRejectedValueOnce(new Error('Server error'));

    renderDetalle();

    await waitFor(() => {
      expect(screen.getByText('Bache calle Suecia esquina Suiza')).toBeInTheDocument();
    });

    const selects = screen.getAllByRole('combobox');
    const selectEstado = selects.find(
      (s) => Array.from(s.options || []).some((o) => o.value === 'IN_PROGRESS')
    ) || selects[1];

    await userEvent.selectOptions(selectEstado, 'IN_PROGRESS');
    await userEvent.click(screen.getByRole('button', { name: /guardar cambio/i }));

    await waitFor(() => {
      expect(screen.getByText('No se pudo actualizar el estado. Intenta nuevamente.')).toBeInTheDocument();
    });
  });

  // ─────────────────────────────────────────────────────────────────
  // CP-GESTION-002: Comentario incluido en el PATCH
  // ─────────────────────────────────────────────────────────────────
  it('CP-GESTION-002: comentario se incluye en el PATCH al guardar estado', async () => {
    mockPatch.mockResolvedValueOnce({ ...reporteBase, status: 'IN_PROGRESS' });

    renderDetalle();

    await waitFor(() => {
      expect(screen.getByText('Bache calle Suecia esquina Suiza')).toBeInTheDocument();
    });

    const selects = screen.getAllByRole('combobox');
    const selectEstado = selects.find(
      (s) => Array.from(s.options || []).some((o) => o.value === 'IN_PROGRESS')
    ) || selects[1];

    await userEvent.selectOptions(selectEstado, 'IN_PROGRESS');

    const textarea = screen.getByPlaceholderText(/agrega una nota/i);
    await userEvent.type(textarea, 'Equipo en camino para revisión');

    await userEvent.click(screen.getByRole('button', { name: /guardar cambio/i }));

    await waitFor(() => {
      expect(mockPatch).toHaveBeenCalledWith(
        `/api/reports/${reporteBase.reportId}/status`,
        {
          status: 'IN_PROGRESS',
          comment: 'Equipo en camino para revisión',
        }
      );
    });
  });

  it('CP-GESTION-002: sin comentario, el PATCH no incluye campo comment', async () => {
    mockPatch.mockResolvedValueOnce({ ...reporteBase, status: 'REJECTED' });

    renderDetalle();

    await waitFor(() => {
      expect(screen.getByText('Bache calle Suecia esquina Suiza')).toBeInTheDocument();
    });

    const selects = screen.getAllByRole('combobox');
    const selectEstado = selects.find(
      (s) => Array.from(s.options || []).some((o) => o.value === 'REJECTED')
    ) || selects[1];

    await userEvent.selectOptions(selectEstado, 'REJECTED');
    await userEvent.click(screen.getByRole('button', { name: /guardar cambio/i }));

    await waitFor(() => {
      expect(mockPatch).toHaveBeenCalledWith(
        `/api/reports/${reporteBase.reportId}/status`,
        { status: 'REJECTED' }
      );
    });
  });

  // ─────────────────────────────────────────────────────────────────
  // CP-GESTION-003: Filtrar por estado en tabla
  // ─────────────────────────────────────────────────────────────────
  it('CP-GESTION-003: la lista se renderiza con los reportes de la API', async () => {
    renderGestion();

    await waitFor(() => {
      expect(screen.getAllByText('Bache calle Suecia').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Luminaria apagada').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Microbasural norte').length).toBeGreaterThan(0);
    });
  });

  it('CP-GESTION-003: click en filtro "En Proceso" realiza nueva llamada con status=IN_PROGRESS', async () => {
    mockGet
      .mockResolvedValueOnce([]) // categorías
      .mockResolvedValueOnce(listaReportes) // carga inicial
      .mockResolvedValueOnce({ reportes: [listaReportes.reportes[1]], total: 1, totalPages: 1 }); // filtrado

    render(
      <MemoryRouter initialEntries={['/municipal/gestion']}>
        <MunicipalGestionReportes />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getAllByText('Bache calle Suecia').length).toBeGreaterThan(0);
    });

    await userEvent.click(screen.getByRole('button', { name: /en proceso/i }));

    await waitFor(() => {
      const lastCall = mockGet.mock.calls[mockGet.mock.calls.length - 1][0];
      expect(lastCall).toContain('status=IN_PROGRESS');
    });
  });

  it('CP-GESTION-003: búsqueda local filtra por descripción', async () => {
    renderGestion();

    await waitFor(() => {
      expect(screen.getAllByText('Bache calle Suecia').length).toBeGreaterThan(0);
    });

    await userEvent.type(
      screen.getByPlaceholderText(/buscar por id, descripción/i),
      'luminaria'
    );

    await waitFor(() => {
      expect(screen.getAllByText('Luminaria apagada').length).toBeGreaterThan(0);
      expect(screen.queryByText('Bache calle Suecia')).not.toBeInTheDocument();
    });
  });
});
