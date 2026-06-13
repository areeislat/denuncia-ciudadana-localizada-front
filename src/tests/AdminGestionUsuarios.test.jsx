/**
 * CP-ADMIN-001  Crear nuevo usuario (SuperGestionUsuarios → POST)
 * CP-ADMIN-002  Editar role (AdminGestionUsuarios → PUT)
 * CP-ADMIN-003  Eliminar usuario (SuperGestionUsuarios → DELETE)
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => vi.fn() };
});

const mockAxiosGet    = vi.fn();
const mockAxiosPost   = vi.fn();
const mockAxiosPut    = vi.fn();
const mockAxiosDelete = vi.fn();
vi.mock('axios', () => ({
  default: {
    get:    (...a) => mockAxiosGet(...a),
    post:   (...a) => mockAxiosPost(...a),
    put:    (...a) => mockAxiosPut(...a),
    delete: (...a) => mockAxiosDelete(...a),
  },
}));

const mockApiGet = vi.fn();
vi.mock('../config/api', () => ({
  default: {
    get: (...a) => mockApiGet(...a),
    interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } },
  },
}));

vi.mock('../components/MunicipalSidebar', () => ({
  default: () => <aside data-testid="sidebar" />,
}));

let currentRole = 'SUPER_ADMIN';
vi.mock('../store/authStore', () => ({
  default: (selector) => {
    const state = {
      user: { userId: 'a1', roleName: currentRole, comunaId: 1, fullName: 'Admin' },
      token: 'tok',
      logout: vi.fn(),
    };
    return selector ? selector(state) : state;
  },
}));

import AdminGestionUsuarios from '../pages/municipal/admin_municipal/AdminGestionUsuarios';
import SuperGestionUsuarios from '../pages/municipal/super_admin/SuperGestionUsuarios';

const USUARIOS = [
  { userId: 'u1', fullName: 'Juan Ciudadano',    email: 'juan@t.com',  roleName: 'CITIZEN',           active: true,  createdAt: '2025-01-01T00:00:00Z' },
  { userId: 'u2', fullName: 'María Funcionaria', email: 'maria@t.com', roleName: 'MUNICIPAL_OFFICER', active: true,  createdAt: '2025-01-02T00:00:00Z' },
  { userId: 'u3', fullName: 'Pedro Inactivo',    email: 'pedro@t.com', roleName: 'CITIZEN',           active: false, createdAt: '2025-01-03T00:00:00Z' },
];
const COMUNAS = [{ comunaId: 1, nombre: 'Santiago' }];

const setupSuper = () => {
  currentRole = 'SUPER_ADMIN';
  mockAxiosGet.mockResolvedValue({ data: USUARIOS });
  mockApiGet.mockResolvedValue(COMUNAS);
};
const setupAdmin = () => {
  currentRole = 'ADMIN_MUNICIPAL';
  mockAxiosGet.mockResolvedValue({ data: USUARIOS });
};

const renderSuper = () => render(<MemoryRouter><SuperGestionUsuarios /></MemoryRouter>);
const renderAdmin = () => render(<MemoryRouter><AdminGestionUsuarios /></MemoryRouter>);

// Esperar a que el texto aparezca al menos una vez (componentes Desktop+Mobile duplican)
const waitText = (t) => waitFor(() => expect(screen.getAllByText(t).length).toBeGreaterThan(0));

describe('CP-ADMIN — Gestión de Usuarios', () => {
  beforeEach(() => {
    mockAxiosGet.mockReset();
    mockAxiosPost.mockReset();
    mockAxiosPut.mockReset();
    mockAxiosDelete.mockReset();
    mockApiGet.mockReset();
  });

  // ── CP-ADMIN-001 ──────────────────────────────────────────────────
  it('CP-ADMIN-001: botón "Nuevo Usuario" abre modal de creación', async () => {
    setupSuper();
    renderSuper();
    await waitText('Juan Ciudadano');

    await userEvent.click(screen.getByRole('button', { name: /nuevo usuario/i }));
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Nuevo Usuario' })).toBeInTheDocument());
  });

  it('CP-ADMIN-001: crear usuario hace POST con los datos del formulario', async () => {
    setupSuper();
    mockAxiosPost.mockResolvedValueOnce({ data: { userId: 'nx', fullName: 'Ana Nueva', email: 'ana@t.cl', roleName: 'ADMIN_MUNICIPAL', active: true } });
    renderSuper();
    await waitText('Juan Ciudadano');

    await userEvent.click(screen.getByRole('button', { name: /nuevo usuario/i }));
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Nuevo Usuario' })).toBeInTheDocument());

    await userEvent.type(screen.getByPlaceholderText('Juan Pérez González'), 'Ana Nueva');
    await userEvent.type(screen.getByPlaceholderText('correo@ejemplo.cl'), 'ana@t.cl');
    await userEvent.type(screen.getByPlaceholderText('Mínimo 8 caracteres'), 'SecureP1!');
    await userEvent.type(screen.getByPlaceholderText('123456789 o 12345678K'), '12345678K');
    await userEvent.click(screen.getByRole('button', { name: /^crear usuario$/i }));

    await waitFor(() => {
      expect(mockAxiosPost).toHaveBeenCalledWith(
        'http://localhost:8080/api/users',
        expect.objectContaining({ fullName: 'Ana Nueva', email: 'ana@t.cl' }),
        expect.any(Object)
      );
    });
  });

  it('CP-ADMIN-001 (variante): error del servidor se muestra en el modal', async () => {
    setupSuper();
    mockAxiosPost.mockRejectedValueOnce({ response: { data: { message: 'El email ya está registrado.' } } });
    renderSuper();
    await waitText('Juan Ciudadano');

    await userEvent.click(screen.getByRole('button', { name: /nuevo usuario/i }));
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Nuevo Usuario' })).toBeInTheDocument());

    await userEvent.type(screen.getByPlaceholderText('Juan Pérez González'), 'Test');
    await userEvent.type(screen.getByPlaceholderText('correo@ejemplo.cl'), 'dup@t.com');
    await userEvent.type(screen.getByPlaceholderText('Mínimo 8 caracteres'), 'Pass1234!');
    await userEvent.type(screen.getByPlaceholderText('123456789 o 12345678K'), '11111111K');
    await userEvent.click(screen.getByRole('button', { name: /^crear usuario$/i }));

    await waitFor(() => expect(screen.getByText('El email ya está registrado.')).toBeInTheDocument());
  });

  // ── CP-ADMIN-002 ──────────────────────────────────────────────────
  it('CP-ADMIN-002: botón editar abre modal de cambio de rol', async () => {
    setupAdmin();
    renderAdmin();
    await waitText('Juan Ciudadano');

    await userEvent.click(screen.getAllByTitle('Cambiar rol')[0]);
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Cambiar Rol' })).toBeInTheDocument());
  });

  it('CP-ADMIN-002: guardar hace PUT con el nuevo rol', async () => {
    setupAdmin();
    mockAxiosPut.mockResolvedValueOnce({ data: { ...USUARIOS[0], roleName: 'MUNICIPAL_OFFICER' } });
    renderAdmin();
    await waitText('Juan Ciudadano');

    await userEvent.click(screen.getAllByTitle('Cambiar rol')[0]);
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Cambiar Rol' })).toBeInTheDocument());

    // El combobox dentro del modal (último en el DOM es el del filtro, el modal aparece encima)
    const combos = screen.getAllByRole('combobox');
    await userEvent.selectOptions(combos[combos.length - 1], 'MUNICIPAL_OFFICER');
    await userEvent.click(screen.getByRole('button', { name: /^guardar$/i }));

    await waitFor(() => {
      expect(mockAxiosPut).toHaveBeenCalledWith(
        'http://localhost:8080/api/users/u1',
        { roleName: 'MUNICIPAL_OFFICER' },
        expect.any(Object)
      );
    });
  });

  it('CP-ADMIN-002 (variante): tabla muestra badges de rol', async () => {
    setupAdmin();
    renderAdmin();
    await waitText('Juan Ciudadano');

    expect(screen.getAllByText('Ciudadano').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Funcionario Municipal').length).toBeGreaterThanOrEqual(1);
  });

  // ── CP-ADMIN-003 ──────────────────────────────────────────────────
  it('CP-ADMIN-003: botón eliminar abre modal de confirmación', async () => {
    setupSuper();
    renderSuper();
    await waitText('Juan Ciudadano');

    await userEvent.click(screen.getAllByTitle('Eliminar')[0]);
    await waitFor(() => {
      expect(screen.getByText('¿Eliminar usuario?')).toBeInTheDocument();
      expect(screen.getByText(/estás a punto de eliminar/i)).toBeInTheDocument();
    });
  });

  it('CP-ADMIN-003: confirmar hace DELETE y quita al usuario del listado', async () => {
    setupSuper();
    mockAxiosDelete.mockResolvedValueOnce({});
    renderSuper();
    await waitText('Juan Ciudadano');

    await userEvent.click(screen.getAllByTitle('Eliminar')[0]);
    await waitFor(() => expect(screen.getByText('¿Eliminar usuario?')).toBeInTheDocument());

    // Último botón "Eliminar" (el del modal, no el de la tabla)
    const btns = screen.getAllByRole('button', { name: /^eliminar$/i });
    await userEvent.click(btns[btns.length - 1]);

    await waitFor(() => {
      expect(mockAxiosDelete).toHaveBeenCalledWith(
        'http://localhost:8080/api/users/u1',
        expect.any(Object)
      );
      expect(screen.queryByText('Juan Ciudadano')).not.toBeInTheDocument();
    });
  });

  it('CP-ADMIN-003 (variante): cancelar no elimina al usuario', async () => {
    setupSuper();
    renderSuper();
    await waitText('Juan Ciudadano');

    await userEvent.click(screen.getAllByTitle('Eliminar')[0]);
    await waitFor(() => expect(screen.getByText('¿Eliminar usuario?')).toBeInTheDocument());

    await userEvent.click(screen.getByRole('button', { name: /cancelar/i }));

    expect(screen.getAllByText('Juan Ciudadano').length).toBeGreaterThan(0);
    expect(mockAxiosDelete).not.toHaveBeenCalled();
  });

  // ── Filtros bonus ─────────────────────────────────────────────────
  it('filtro "Inactivos" muestra solo usuarios inactivos', async () => {
    setupAdmin();
    renderAdmin();
    await waitText('Juan Ciudadano');

    await userEvent.click(screen.getByRole('button', { name: /inactivos/i }));

    await waitFor(() => {
      expect(screen.getAllByText('Pedro Inactivo').length).toBeGreaterThan(0);
      expect(screen.queryByText('Juan Ciudadano')).not.toBeInTheDocument();
    });
  });
});
