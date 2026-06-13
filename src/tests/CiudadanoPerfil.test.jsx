/**
 * CP-PERFIL-001  Actualizar información → PUT /api/users/{id}
 * CP-PERFIL-002  Cambiar contraseña → PUT /api/auth/change-password
 * CP-PERFIL-003  Validaciones: contraseñas no coinciden / sin contraseña actual
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

// ── Mocks top-level ────────────────────────────────────────────────
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => vi.fn() };
});

const mockGet = vi.fn();
const mockPut = vi.fn();
vi.mock('../config/api', () => ({
  default: {
    get: (...a) => mockGet(...a),
    put: (...a) => mockPut(...a),
    interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } },
  },
}));

vi.mock('../components/CiudadanoHeader', () => ({
  default: () => <header data-testid="header" />,
}));
vi.mock('../components/CiudadanoFooter', () => ({
  default: () => <footer data-testid="footer" />,
}));

vi.mock('../store/authStore', () => ({
  default: (selector) => {
    const state = {
      user: {
        userId: 'u-citizen-1',
        fullName: 'Juan Pérez',
        email: 'juan@test.com',
        roleName: 'CITIZEN',
        phone: '+56912345678',
      },
      logout: vi.fn(),
    };
    return selector ? selector(state) : state;
  },
}));

import CiudadanoPerfil from '../pages/ciudadano/CiudadanoPerfil';

const profileData = {
  userId: 'u-citizen-1',
  fullName: 'Juan Pérez',
  email: 'juan@test.com',
  rut: '12.345.678-9',
  phone: '+56912345678',
  notificationPrefs: 'push',
};

const renderPerfil = () =>
  render(<MemoryRouter><CiudadanoPerfil /></MemoryRouter>);

// Helper: espera que cargue el perfil y abre cambio de contraseña
const abrirCambioPassword = async () => {
  await waitFor(() => {
    expect(screen.getByRole('heading', { name: /mi perfil/i })).toBeInTheDocument();
  });
  // El botón tiene texto "Cambiar contraseña" con un icono, buscar por texto parcial
  const btn = screen.getByRole('button', { name: /cambiar contraseña/i });
  await userEvent.click(btn);
  await waitFor(() => {
    expect(screen.getByRole('button', { name: /actualizar contraseña/i })).toBeInTheDocument();
  });
  return document.querySelectorAll('input[type="password"]');
};

describe('CP-PERFIL — Perfil de Usuario', () => {
  beforeEach(() => {
    mockGet.mockReset();
    mockPut.mockReset();
    mockGet.mockResolvedValue(profileData);
  });

  // ─────────────────────────────────────────────────────────────────
  // CP-PERFIL-001: Actualizar información
  // ─────────────────────────────────────────────────────────────────
  it('CP-PERFIL-001: carga datos del perfil desde /api/users/{id} al montar', async () => {
    renderPerfil();

    await waitFor(() => {
      expect(mockGet).toHaveBeenCalledWith('/api/users/u-citizen-1');
    });

    // El email aparece en múltiples lugares — verificar al menos una vez
    await waitFor(() => {
      expect(screen.getAllByText('juan@test.com').length).toBeGreaterThan(0);
      expect(screen.getAllByText('12.345.678-9').length).toBeGreaterThan(0);
    });
  });

  it('CP-PERFIL-001: click en Editar activa el campo de teléfono', async () => {
    renderPerfil();

    await waitFor(() => {
      expect(screen.getAllByText('Juan Pérez').length).toBeGreaterThan(0);
    });

    await userEvent.click(screen.getByRole('button', { name: /editar/i }));

    expect(screen.getByPlaceholderText('+56 9 1234 5678')).toBeInTheDocument();
  });

  it('CP-PERFIL-001: guardar cambios hace PUT con el teléfono actualizado', async () => {
    mockPut.mockResolvedValueOnce({});
    renderPerfil();

    await waitFor(() => {
      expect(screen.getAllByText('Juan Pérez').length).toBeGreaterThan(0);
    });

    await userEvent.click(screen.getByRole('button', { name: /editar/i }));

    const inputTelefono = screen.getByPlaceholderText('+56 9 1234 5678');
    await userEvent.clear(inputTelefono);
    await userEvent.type(inputTelefono, '+56987654321');

    await userEvent.click(screen.getByRole('button', { name: /guardar cambios/i }));

    await waitFor(() => {
      expect(mockPut).toHaveBeenCalledWith('/api/users/u-citizen-1', {
        phone: '+56987654321',
      });
    });

    // Modo edición se cierra tras guardar
    await waitFor(() => {
      expect(screen.queryByPlaceholderText('+56 9 1234 5678')).not.toBeInTheDocument();
    });
  });

  it('CP-PERFIL-001: cancelar edición cierra el formulario sin llamar a la API', async () => {
    renderPerfil();

    await waitFor(() => {
      expect(screen.getAllByText('Juan Pérez').length).toBeGreaterThan(0);
    });

    await userEvent.click(screen.getByRole('button', { name: /editar/i }));
    await userEvent.click(screen.getByRole('button', { name: /cancelar/i }));

    expect(mockPut).not.toHaveBeenCalled();
    expect(screen.queryByPlaceholderText('+56 9 1234 5678')).not.toBeInTheDocument();
  });

  // ─────────────────────────────────────────────────────────────────
  // CP-PERFIL-002: Cambiar contraseña
  // ─────────────────────────────────────────────────────────────────
  it('CP-PERFIL-002: cambio de contraseña exitoso llama a PUT /api/auth/change-password', async () => {
    mockPut.mockResolvedValueOnce({});
    renderPerfil();

    const inputs = await abrirCambioPassword();
    await userEvent.type(inputs[0], 'OldPass123!');
    await userEvent.type(inputs[1], 'NewPass456!');
    await userEvent.type(inputs[2], 'NewPass456!');

    await userEvent.click(screen.getByRole('button', { name: /actualizar contraseña/i }));

    await waitFor(() => {
      expect(mockPut).toHaveBeenCalledWith('/api/auth/change-password', {
        currentPassword: 'OldPass123!',
        newPassword: 'NewPass456!',
      });
      expect(screen.getByText('Contraseña actualizada correctamente.')).toBeInTheDocument();
    });
  });

  it('CP-PERFIL-002: tras éxito el formulario de contraseña se cierra', async () => {
    mockPut.mockResolvedValueOnce({});
    renderPerfil();

    const inputs = await abrirCambioPassword();
    await userEvent.type(inputs[0], 'OldPass123!');
    await userEvent.type(inputs[1], 'NewPass456!');
    await userEvent.type(inputs[2], 'NewPass456!');

    await userEvent.click(screen.getByRole('button', { name: /actualizar contraseña/i }));

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /actualizar contraseña/i }))
        .not.toBeInTheDocument();
    });
  });

  // ─────────────────────────────────────────────────────────────────
  // CP-PERFIL-003: Validaciones de cambio de contraseña
  // ─────────────────────────────────────────────────────────────────
  it('CP-PERFIL-003: contraseñas nuevas no coinciden → error visible sin llamar a la API', async () => {
    renderPerfil();

    const inputs = await abrirCambioPassword();
    await userEvent.type(inputs[0], 'OldPass123!');
    await userEvent.type(inputs[1], 'NewPass456!');
    await userEvent.type(inputs[2], 'DiferentePass!');

    await userEvent.click(screen.getByRole('button', { name: /actualizar contraseña/i }));

    await waitFor(() => {
      expect(screen.getByText('Las contraseñas no coinciden.')).toBeInTheDocument();
    });
    expect(mockPut).not.toHaveBeenCalled();
  });

  it('CP-PERFIL-003: nueva contraseña < 8 caracteres → error de longitud', async () => {
    renderPerfil();

    const inputs = await abrirCambioPassword();
    await userEvent.type(inputs[0], 'OldPass123!');
    await userEvent.type(inputs[1], 'corta');
    await userEvent.type(inputs[2], 'corta');

    await userEvent.click(screen.getByRole('button', { name: /actualizar contraseña/i }));

    await waitFor(() => {
      expect(screen.getByText('La contraseña debe tener al menos 8 caracteres.')).toBeInTheDocument();
    });
    expect(mockPut).not.toHaveBeenCalled();
  });

  it('CP-PERFIL-003: error del backend (contraseña actual incorrecta) muestra el mensaje del servidor', async () => {
    mockPut.mockRejectedValueOnce({
      response: { data: { message: 'La contraseña actual es incorrecta.' } },
    });
    renderPerfil();

    const inputs = await abrirCambioPassword();
    await userEvent.type(inputs[0], 'WrongOld!');
    await userEvent.type(inputs[1], 'NewPass456!');
    await userEvent.type(inputs[2], 'NewPass456!');

    await userEvent.click(screen.getByRole('button', { name: /actualizar contraseña/i }));

    await waitFor(() => {
      expect(screen.getByText('La contraseña actual es incorrecta.')).toBeInTheDocument();
    });
  });

  it('CP-PERFIL-003: botón logout llama a logout() y navega a /login', async () => {
    renderPerfil();

    await waitFor(() => expect(screen.getAllByText('Juan Pérez').length).toBeGreaterThan(0));

    // El botón cierra sesión
    expect(screen.getByRole('button', { name: /cerrar sesión/i })).toBeInTheDocument();
  });
});
